-- Location: supabase/migrations/20250910190606_schoolsync_auth_schema.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete initial schema with authentication
-- Module: Authentication + Core School Management System

-- 1. Extensions & Types
CREATE TYPE public.user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE public.grade_status AS ENUM ('draft', 'published', 'finalized');
CREATE TYPE public.assignment_type AS ENUM ('homework', 'quiz', 'exam', 'project', 'other');

-- 2. Core Tables (no foreign keys)

-- Critical intermediary table for PostgREST compatibility
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- School structure tables
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    principal_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    head_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    grade_level INTEGER,
    academic_year TEXT NOT NULL,
    teacher_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dependent tables (with foreign keys)

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    description TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    credits INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    UNIQUE(student_id, class_id)
);

CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    assignment_type public.assignment_type DEFAULT 'homework'::public.assignment_type,
    max_score DECIMAL(5,2) DEFAULT 100.00,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    score DECIMAL(5,2),
    feedback TEXT,
    status public.grade_status DEFAULT 'draft'::public.grade_status,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status public.attendance_status DEFAULT 'present'::public.attendance_status,
    notes TEXT,
    marked_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id, attendance_date)
);

-- 4. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_schools_principal_id ON public.schools(principal_id);
CREATE INDEX idx_departments_school_id ON public.departments(school_id);
CREATE INDEX idx_classes_school_id ON public.classes(school_id);
CREATE INDEX idx_classes_teacher_id ON public.classes(teacher_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_class_id ON public.enrollments(class_id);
CREATE INDEX idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX idx_assignments_subject_id ON public.assignments(subject_id);
CREATE INDEX idx_grades_student_id ON public.grades(student_id);
CREATE INDEX idx_grades_assignment_id ON public.grades(assignment_id);
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_date ON public.attendance(attendance_date);

-- 5. Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('teacher', 'admin')
)
$$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 6: Admin access using auth metadata for all tables
CREATE POLICY "admin_full_access_schools"
ON public.schools
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "admin_full_access_departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "admin_full_access_classes"
ON public.classes
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "admin_full_access_subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 4: Public read for general school data
CREATE POLICY "authenticated_can_read_schools"
ON public.schools
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_can_read_departments"
ON public.departments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_can_read_classes"
ON public.classes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_can_read_subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (true);

-- Pattern 2: Simple user ownership for student-specific data
CREATE POLICY "students_manage_own_enrollments"
ON public.enrollments
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

CREATE POLICY "students_view_own_grades"
ON public.grades
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "students_view_own_attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Teachers can manage assignments and grade students
CREATE POLICY "teachers_manage_assignments"
ON public.assignments
FOR ALL
TO authenticated
USING (public.is_teacher())
WITH CHECK (public.is_teacher());

CREATE POLICY "teachers_manage_grades"
ON public.grades
FOR ALL
TO authenticated
USING (public.is_teacher())
WITH CHECK (public.is_teacher());

CREATE POLICY "teachers_manage_attendance"
ON public.attendance
FOR ALL
TO authenticated
USING (public.is_teacher())
WITH CHECK (public.is_teacher());

-- 8. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Mock Data with Complete Auth Users
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    teacher1_uuid UUID := gen_random_uuid();
    teacher2_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    school_uuid UUID := gen_random_uuid();
    department_uuid UUID := gen_random_uuid();
    class1_uuid UUID := gen_random_uuid();
    class2_uuid UUID := gen_random_uuid();
    subject1_uuid UUID := gen_random_uuid();
    subject2_uuid UUID := gen_random_uuid();
    assignment1_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@schoolsync.edu', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Michael Rodriguez", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (teacher1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'sarah.johnson@schoolsync.edu', crypt('teacher123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "teacher"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (teacher2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'david.chen@schoolsync.edu', crypt('teacher123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "David Chen", "role": "teacher"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'emma.wilson@student.schoolsync.edu', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emma Wilson", "role": "student"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'james.taylor@student.schoolsync.edu', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "James Taylor", "role": "student"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create school structure
    INSERT INTO public.schools (id, name, address, phone, email, principal_id) VALUES
        (school_uuid, 'SchoolSync Pro Academy', '123 Education Blvd, Learning City, LC 12345', 
         '(555) 123-4567', 'info@schoolsync.edu', admin_uuid);

    INSERT INTO public.departments (id, school_id, name, description, head_id) VALUES
        (department_uuid, school_uuid, 'Mathematics & Science', 'Core academic subjects focusing on STEM education', teacher1_uuid);

    INSERT INTO public.classes (id, school_id, department_id, name, grade_level, academic_year, teacher_id, capacity) VALUES
        (class1_uuid, school_uuid, department_uuid, 'Mathematics Grade 10A', 10, '2024-2025', teacher1_uuid, 25),
        (class2_uuid, school_uuid, department_uuid, 'Physics Grade 11B', 11, '2024-2025', teacher2_uuid, 20);

    -- Create subjects and assignments
    INSERT INTO public.subjects (id, name, code, description, department_id, credits) VALUES
        (subject1_uuid, 'Advanced Mathematics', 'MATH-301', 'Advanced mathematics including calculus and statistics', department_uuid, 4),
        (subject2_uuid, 'Physics', 'PHYS-201', 'Introduction to classical and modern physics', department_uuid, 3);

    -- Create enrollments
    INSERT INTO public.enrollments (student_id, class_id, status) VALUES
        (student1_uuid, class1_uuid, 'active'),
        (student2_uuid, class1_uuid, 'active'),
        (student1_uuid, class2_uuid, 'active'),
        (student2_uuid, class2_uuid, 'active');

    -- Create sample assignment
    INSERT INTO public.assignments (id, title, description, subject_id, teacher_id, class_id, assignment_type, max_score, due_date) VALUES
        (assignment1_uuid, 'Quadratic Equations Problem Set', 'Complete problems 1-20 from Chapter 5', subject1_uuid, teacher1_uuid, class1_uuid, 'homework', 100.00, now() + interval '1 week');

    -- Create sample grades
    INSERT INTO public.grades (assignment_id, student_id, teacher_id, score, feedback, status, graded_at) VALUES
        (assignment1_uuid, student1_uuid, teacher1_uuid, 92.50, 'Excellent work! Pay attention to showing all steps in problem 15.', 'published', now()),
        (assignment1_uuid, student2_uuid, teacher1_uuid, 88.00, 'Good understanding. Review the quadratic formula applications.', 'published', now());

    -- Create sample attendance
    INSERT INTO public.attendance (student_id, class_id, attendance_date, status, marked_by) VALUES
        (student1_uuid, class1_uuid, current_date, 'present', teacher1_uuid),
        (student2_uuid, class1_uuid, current_date, 'present', teacher1_uuid),
        (student1_uuid, class2_uuid, current_date, 'present', teacher2_uuid),
        (student2_uuid, class2_uuid, current_date - interval '1 day', 'absent', teacher2_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;
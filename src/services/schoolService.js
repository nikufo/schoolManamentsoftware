import { supabase } from '../lib/supabase';

export const schoolService = {
  // School Management
  async getSchools() {
    try {
      const { data, error } = await supabase
        ?.from('schools')
        ?.select(`
          *,
          principal:user_profiles!schools_principal_id_fkey(
            id, full_name, email, role
          )
        `)
        ?.order('name');

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Department Management
  async getDepartments(schoolId = null) {
    try {
      let query = supabase
        ?.from('departments')
        ?.select(`
          *,
          school:schools(id, name),
          head:user_profiles!departments_head_id_fkey(
            id, full_name, email, role
          )
        `);

      if (schoolId) {
        query = query?.eq('school_id', schoolId);
      }

      const { data, error } = await query?.order('name');

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Class Management
  async getClasses(schoolId = null, teacherId = null) {
    try {
      let query = supabase
        ?.from('classes')
        ?.select(`
          *,
          school:schools(id, name),
          department:departments(id, name),
          teacher:user_profiles!classes_teacher_id_fkey(
            id, full_name, email, role
          ),
          enrollments(
            id,
            student:user_profiles!enrollments_student_id_fkey(
              id, full_name, email
            )
          )
        `);

      if (schoolId) {
        query = query?.eq('school_id', schoolId);
      }

      if (teacherId) {
        query = query?.eq('teacher_id', teacherId);
      }

      const { data, error } = await query?.order('name');

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Subject Management
  async getSubjects(departmentId = null) {
    try {
      let query = supabase
        ?.from('subjects')
        ?.select(`
          *,
          department:departments(
            id, name,
            school:schools(id, name)
          )
        `);

      if (departmentId) {
        query = query?.eq('department_id', departmentId);
      }

      const { data, error } = await query?.order('name');

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Student Management
  async getStudents(classId = null) {
    try {
      let query = supabase
        ?.from('user_profiles')
        ?.select(`
          *,
          enrollments!enrollments_student_id_fkey(
            id, status, enrolled_at,
            class:classes(
              id, name, grade_level, academic_year,
              school:schools(id, name)
            )
          )
        `)
        ?.eq('role', 'student');

      if (classId) {
        query = query?.eq('enrollments.class_id', classId);
      }

      const { data, error } = await query?.order('full_name');

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Assignment Management
  async getAssignments(teacherId = null, classId = null, subjectId = null) {
    try {
      let query = supabase
        ?.from('assignments')
        ?.select(`
          *,
          teacher:user_profiles!assignments_teacher_id_fkey(
            id, full_name, email
          ),
          subject:subjects(
            id, name, code,
            department:departments(id, name)
          ),
          class:classes(
            id, name, grade_level
          ),
          grades(
            id, score, status,
            student:user_profiles!grades_student_id_fkey(
              id, full_name, email
            )
          )
        `);

      if (teacherId) {
        query = query?.eq('teacher_id', teacherId);
      }

      if (classId) {
        query = query?.eq('class_id', classId);
      }

      if (subjectId) {
        query = query?.eq('subject_id', subjectId);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Grade Management
  async getGrades(studentId = null, assignmentId = null, teacherId = null) {
    try {
      let query = supabase
        ?.from('grades')
        ?.select(`
          *,
          student:user_profiles!grades_student_id_fkey(
            id, full_name, email
          ),
          teacher:user_profiles!grades_teacher_id_fkey(
            id, full_name, email
          ),
          assignment:assignments(
            id, title, max_score, due_date,
            subject:subjects(id, name, code),
            class:classes(id, name)
          )
        `);

      if (studentId) {
        query = query?.eq('student_id', studentId);
      }

      if (assignmentId) {
        query = query?.eq('assignment_id', assignmentId);
      }

      if (teacherId) {
        query = query?.eq('teacher_id', teacherId);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Attendance Management
  async getAttendance(studentId = null, classId = null, date = null) {
    try {
      let query = supabase
        ?.from('attendance')
        ?.select(`
          *,
          student:user_profiles!attendance_student_id_fkey(
            id, full_name, email
          ),
          class:classes(
            id, name, grade_level,
            teacher:user_profiles!classes_teacher_id_fkey(
              id, full_name, email
            )
          ),
          marked_by_user:user_profiles!attendance_marked_by_fkey(
            id, full_name, email
          )
        `);

      if (studentId) {
        query = query?.eq('student_id', studentId);
      }

      if (classId) {
        query = query?.eq('class_id', classId);
      }

      if (date) {
        query = query?.eq('attendance_date', date);
      }

      const { data, error } = await query?.order('attendance_date', { ascending: false });

      if (error) {
        return { success: false, error: error?.message, data: [] };
      }

      return { success: true, error: null, data: data || [] };
    } catch (error) {
      return { success: false, error: error?.message, data: [] };
    }
  },

  // Dashboard Statistics
  async getDashboardStats() {
    try {
      // Get student count
      const { data: studentData, error: studentError } = await supabase
        ?.from('user_profiles')
        ?.select('id', { count: 'exact' })
        ?.eq('role', 'student')
        ?.eq('is_active', true);

      if (studentError) {
        throw new Error(`Student count error: ${studentError.message}`);
      }

      // Get teacher count
      const { data: teacherData, error: teacherError } = await supabase
        ?.from('user_profiles')
        ?.select('id', { count: 'exact' })
        ?.eq('role', 'teacher')
        ?.eq('is_active', true);

      if (teacherError) {
        throw new Error(`Teacher count error: ${teacherError.message}`);
      }

      // Get today's attendance rate
      const today = new Date()?.toISOString()?.split('T')?.[0];
      const { data: attendanceData, error: attendanceError } = await supabase
        ?.from('attendance')
        ?.select('status')
        ?.eq('attendance_date', today);

      if (attendanceError) {
        throw new Error(`Attendance error: ${attendanceError.message}`);
      }

      const totalAttendance = attendanceData?.length || 0;
      const presentCount = attendanceData?.filter(a => a?.status === 'present')?.length || 0;
      const attendanceRate = totalAttendance > 0 ? ((presentCount / totalAttendance) * 100)?.toFixed(1) : '0.0';

      // Get average grade
      const { data: gradeData, error: gradeError } = await supabase
        ?.from('grades')
        ?.select('score')
        ?.eq('status', 'published')
        ?.not('score', 'is', null);

      if (gradeError) {
        throw new Error(`Grade error: ${gradeError.message}`);
      }

      const averageGrade = gradeData?.length > 0 
        ? (gradeData?.reduce((sum, grade) => sum + (grade?.score || 0), 0) / gradeData?.length)?.toFixed(1)
        : '0.0';

      return {
        success: true,
        error: null,
        data: {
          totalStudents: studentData?.length || 0,
          totalTeachers: teacherData?.length || 0,
          attendanceRate: `${attendanceRate}%`,
          academicPerformance: `${averageGrade}%`
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error?.message, 
        data: {
          totalStudents: 0,
          totalTeachers: 0,
          attendanceRate: '0.0%',
          academicPerformance: '0.0%'
        }
      };
    }
  }
};

export default schoolService;
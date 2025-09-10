import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

// Import components
import GradeBookGrid from './components/GradeBookGrid';
import AssignmentManager from './components/AssignmentManager';
import GradeAnalytics from './components/GradeAnalytics';
import GradingScaleManager from './components/GradingScaleManager';
import StudentGradeCard from './components/StudentGradeCard';

const GradeManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole] = useState('teacher'); // Mock user role
  const [activeView, setActiveView] = useState('gradebook');
  const [selectedClass, setSelectedClass] = useState('math-101');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data
  const [classes] = useState([
    { id: 'math-101', name: 'Mathematics 101', subject: 'Mathematics', grade: '10th Grade', students: 28 },
    { id: 'eng-201', name: 'English Literature 201', subject: 'English', grade: '11th Grade', students: 24 },
    { id: 'sci-301', name: 'Physics 301', subject: 'Science', grade: '12th Grade', students: 22 },
    { id: 'hist-101', name: 'World History 101', subject: 'History', grade: '9th Grade', students: 30 }
  ]);

  const [students] = useState([
    { id: 'stu-001', name: 'Emma Johnson', studentId: 'STU001', email: 'emma.johnson@school.edu', grade: '10th' },
    { id: 'stu-002', name: 'Michael Chen', studentId: 'STU002', email: 'michael.chen@school.edu', grade: '10th' },
    { id: 'stu-003', name: 'Sarah Williams', studentId: 'STU003', email: 'sarah.williams@school.edu', grade: '10th' },
    { id: 'stu-004', name: 'David Rodriguez', studentId: 'STU004', email: 'david.rodriguez@school.edu', grade: '10th' },
    { id: 'stu-005', name: 'Ashley Brown', studentId: 'STU005', email: 'ashley.brown@school.edu', grade: '10th' },
    { id: 'stu-006', name: 'James Wilson', studentId: 'STU006', email: 'james.wilson@school.edu', grade: '10th' },
    { id: 'stu-007', name: 'Jessica Davis', studentId: 'STU007', email: 'jessica.davis@school.edu', grade: '10th' },
    { id: 'stu-008', name: 'Christopher Lee', studentId: 'STU008', email: 'christopher.lee@school.edu', grade: '10th' },
    { id: 'stu-009', name: 'Amanda Taylor', studentId: 'STU009', email: 'amanda.taylor@school.edu', grade: '10th' },
    { id: 'stu-010', name: 'Ryan Martinez', studentId: 'STU010', email: 'ryan.martinez@school.edu', grade: '10th' }
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 'assign-001',
      name: 'Algebra Quiz 1',
      category: 'quiz',
      totalPoints: 50,
      dueDate: '2025-01-15T23:59:00',
      description: 'Basic algebra concepts and equations',
      createdAt: '2025-01-01T10:00:00',
      updatedAt: '2025-01-01T10:00:00'
    },
    {
      id: 'assign-002',
      name: 'Geometry Homework',
      category: 'homework',
      totalPoints: 25,
      dueDate: '2025-01-20T23:59:00',
      description: 'Practice problems on triangles and angles',
      createdAt: '2025-01-05T14:30:00',
      updatedAt: '2025-01-05T14:30:00'
    },
    {
      id: 'assign-003',
      name: 'Midterm Exam',
      category: 'test',
      totalPoints: 100,
      dueDate: '2025-02-01T14:00:00',
      description: 'Comprehensive exam covering all topics',
      createdAt: '2025-01-10T09:00:00',
      updatedAt: '2025-01-10T09:00:00'
    },
    {
      id: 'assign-004',
      name: 'Math Project',
      category: 'project',
      totalPoints: 75,
      dueDate: '2025-02-15T23:59:00',
      description: 'Real-world application of mathematical concepts',
      createdAt: '2025-01-12T11:00:00',
      updatedAt: '2025-01-12T11:00:00'
    }
  ]);

  const [grades, setGrades] = useState({
    'stu-001-assign-001': { points: 45, percentage: 90, letterGrade: 'A', lastUpdated: '2025-01-16T10:30:00' },
    'stu-001-assign-002': { points: 23, percentage: 92, letterGrade: 'A', lastUpdated: '2025-01-21T15:45:00' },
    'stu-002-assign-001': { points: 42, percentage: 84, letterGrade: 'B', lastUpdated: '2025-01-16T11:00:00' },
    'stu-002-assign-002': { points: 20, percentage: 80, letterGrade: 'B', lastUpdated: '2025-01-21T16:00:00' },
    'stu-003-assign-001': { points: 48, percentage: 96, letterGrade: 'A', lastUpdated: '2025-01-16T09:15:00' },
    'stu-004-assign-001': { points: 35, percentage: 70, letterGrade: 'C', lastUpdated: '2025-01-16T14:20:00' },
    'stu-004-assign-002': { points: 18, percentage: 72, letterGrade: 'C', lastUpdated: '2025-01-21T17:30:00' },
    'stu-005-assign-001': { points: 47, percentage: 94, letterGrade: 'A', lastUpdated: '2025-01-16T13:45:00' },
    'stu-006-assign-001': { points: 38, percentage: 76, letterGrade: 'C', lastUpdated: '2025-01-16T12:10:00' },
    'stu-007-assign-001': { points: 44, percentage: 88, letterGrade: 'B', lastUpdated: '2025-01-16T16:25:00' },
    'stu-007-assign-002': { points: 22, percentage: 88, letterGrade: 'B', lastUpdated: '2025-01-21T14:15:00' },
    'stu-008-assign-001': { points: 41, percentage: 82, letterGrade: 'B', lastUpdated: '2025-01-16T10:50:00' },
    'stu-009-assign-001': { points: 46, percentage: 92, letterGrade: 'A', lastUpdated: '2025-01-16T15:30:00' },
    'stu-010-assign-001': { points: 33, percentage: 66, letterGrade: 'D', lastUpdated: '2025-01-16T11:40:00' }
  });

  const viewOptions = [
    { value: 'gradebook', label: 'Grade Book', icon: 'Grid3x3' },
    { value: 'assignments', label: 'Assignments', icon: 'BookOpen' },
    { value: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { value: 'students', label: 'Student Cards', icon: 'Users' },
    { value: 'settings', label: 'Grading Scale', icon: 'Settings' }
  ];

  const classOptions = classes?.map(cls => ({
    value: cls?.id,
    label: cls?.name,
    description: `${cls?.subject} • ${cls?.students} students`
  }));

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'test', label: 'Tests' },
    { value: 'project', label: 'Projects' }
  ];

  const getCurrentClass = () => {
    return classes?.find(cls => cls?.id === selectedClass) || classes?.[0];
  };

  const getFilteredStudents = () => {
    let filtered = students;
    
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(student =>
        student?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        student?.studentId?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleGradeUpdate = (studentId, assignmentId, gradeData) => {
    const gradeKey = `${studentId}-${assignmentId}`;
    setGrades(prev => ({
      ...prev,
      [gradeKey]: gradeData
    }));
  };

  const handleAssignmentCreate = (assignmentData) => {
    setAssignments(prev => [...prev, assignmentData]);
  };

  const handleAssignmentUpdate = (assignmentData) => {
    setAssignments(prev => prev?.map(assignment =>
      assignment?.id === assignmentData?.id ? assignmentData : assignment
    ));
  };

  const handleAssignmentDelete = (assignmentId) => {
    setAssignments(prev => prev?.filter(assignment => assignment?.id !== assignmentId));
    
    // Remove associated grades
    const updatedGrades = { ...grades };
    Object.keys(updatedGrades)?.forEach(key => {
      if (key?.includes(assignmentId)) {
        delete updatedGrades?.[key];
      }
    });
    setGrades(updatedGrades);
  };

  const handleQuickAction = (actionId, data) => {
    switch (actionId) {
      case 'search':
        setSearchQuery(data);
        setActiveView('students');
        break;
      case 'grade-entry': setActiveView('gradebook');
        break;
      case 'new-assignment': setActiveView('assignments');
        break;
      default:
        break;
    }
  };

  const renderViewContent = () => {
    const currentClass = getCurrentClass();
    const filteredStudents = getFilteredStudents();

    switch (activeView) {
      case 'gradebook':
        return (
          <GradeBookGrid
            students={filteredStudents}
            assignments={assignments}
            grades={grades}
            onGradeUpdate={handleGradeUpdate}
            userRole={userRole}
            selectedClass={currentClass}
          />
        );

      case 'assignments':
        return (
          <AssignmentManager
            assignments={assignments}
            onAssignmentCreate={handleAssignmentCreate}
            onAssignmentUpdate={handleAssignmentUpdate}
            onAssignmentDelete={handleAssignmentDelete}
            userRole={userRole}
          />
        );

      case 'analytics':
        return (
          <GradeAnalytics
            students={filteredStudents}
            assignments={assignments}
            grades={grades}
            selectedClass={currentClass}
          />
        );

      case 'students':
        return (
          <div className="space-y-4">
            {filteredStudents?.map(student => (
              <StudentGradeCard
                key={student?.id}
                student={student}
                assignments={assignments}
                grades={grades}
                onGradeUpdate={handleGradeUpdate}
                userRole={userRole}
              />
            ))}
          </div>
        );

      case 'settings':
        return (
          <GradingScaleManager
            currentScale="standard"
            userRole={userRole}
            onScaleUpdate={() => {}} // Add missing required prop
          />
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const action = searchParams?.get('action');
    if (action === 'entry') {
      setActiveView('gradebook');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        userName="Sarah Mitchell"
        onLogout={() => navigate('/login')}
      />
      <RoleSidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-72'
      } pt-16 pb-20 md:pb-6`}>
        <div className="p-6 max-w-7xl mx-auto">
          <NavigationBreadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Grade Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage student grades, assignments, and academic performance
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select
                options={classOptions}
                value={selectedClass}
                onChange={setSelectedClass}
                className="w-64"
              />
              
              {userRole === 'teacher' && (
                <Button
                  variant="default"
                  iconName="Plus"
                  onClick={() => setActiveView('assignments')}
                >
                  New Assignment
                </Button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActionPanel
            userRole={userRole}
            onQuickAction={handleQuickAction}
            className="mb-6"
          />

          {/* View Controls */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto">
                {viewOptions?.map((option) => (
                  <Button
                    key={option?.value}
                    variant={activeView === option?.value ? "default" : "outline"}
                    size="sm"
                    iconName={option?.icon}
                    onClick={() => setActiveView(option?.value)}
                    className="whitespace-nowrap"
                  >
                    {option?.label}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center space-x-3">
                <Input
                  type="search"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-64"
                />
                
                <Select
                  options={categoryOptions}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          {/* Class Overview */}
          {getCurrentClass() && (
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon name="BookOpen" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{getCurrentClass()?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getCurrentClass()?.subject} • {getCurrentClass()?.grade} • {getCurrentClass()?.students} students
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-foreground">{assignments?.length}</p>
                    <p className="text-muted-foreground">Assignments</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">85%</p>
                    <p className="text-muted-foreground">Avg Grade</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">92%</p>
                    <p className="text-muted-foreground">Completion</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {renderViewContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GradeManagement;
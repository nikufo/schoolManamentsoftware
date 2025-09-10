import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import AttendanceHeader from './components/AttendanceHeader';
import AttendanceStats from './components/AttendanceStats';
import StudentAttendanceCard from './components/StudentAttendanceCard';
import AttendanceChart from './components/AttendanceChart';
import BulkActionsModal from './components/BulkActionsModal';
import AttendanceFilters from './components/AttendanceFilters';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const AttendanceTracking = () => {
  const [searchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole] = useState('admin'); // Mock user role
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [attendanceRateFilter, setAttendanceRateFilter] = useState('');

  // Mock data
  const classes = [
    { id: 'class-1', name: 'Grade 10A - Mathematics' },
    { id: 'class-2', name: 'Grade 10B - Science' },
    { id: 'class-3', name: 'Grade 9A - English' },
    { id: 'class-4', name: 'Grade 9B - History' },
    { id: 'class-5', name: 'Grade 11A - Physics' }
  ];

  const mockStudents = [
    {
      id: 'stu-001',
      name: 'Emma Johnson',
      studentId: 'STU001',
      grade: '10',
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      status: 'present',
      attendanceRate: 95,
      recentAttendance: [
        { date: '2025-01-09', status: 'present' },
        { date: '2025-01-08', status: 'present' },
        { date: '2025-01-07', status: 'late' },
        { date: '2025-01-06', status: 'present' },
        { date: '2025-01-05', status: 'present' },
        { date: '2025-01-04', status: 'absent' },
        { date: '2025-01-03', status: 'present' }
      ]
    },
    {
      id: 'stu-002',
      name: 'Michael Chen',
      studentId: 'STU002',
      grade: '10',
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      status: 'absent',
      attendanceRate: 72,
      recentAttendance: [
        { date: '2025-01-09', status: 'absent' },
        { date: '2025-01-08', status: 'present' },
        { date: '2025-01-07', status: 'absent' },
        { date: '2025-01-06', status: 'present' },
        { date: '2025-01-05', status: 'late' },
        { date: '2025-01-04', status: 'absent' },
        { date: '2025-01-03', status: 'present' }
      ]
    },
    {
      id: 'stu-003',
      name: 'Sarah Williams',
      studentId: 'STU003',
      grade: '9',
      photo: 'https://randomuser.me/api/portraits/women/3.jpg',
      status: 'late',
      attendanceRate: 88,
      recentAttendance: [
        { date: '2025-01-09', status: 'late' },
        { date: '2025-01-08', status: 'present' },
        { date: '2025-01-07', status: 'present' },
        { date: '2025-01-06', status: 'present' },
        { date: '2025-01-05', status: 'absent' },
        { date: '2025-01-04', status: 'present' },
        { date: '2025-01-03', status: 'late' }
      ]
    },
    {
      id: 'stu-004',
      name: 'David Rodriguez',
      studentId: 'STU004',
      grade: '11',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      status: 'excused',
      attendanceRate: 91,
      recentAttendance: [
        { date: '2025-01-09', status: 'excused' },
        { date: '2025-01-08', status: 'present' },
        { date: '2025-01-07', status: 'present' },
        { date: '2025-01-06', status: 'present' },
        { date: '2025-01-05', status: 'present' },
        { date: '2025-01-04', status: 'present' },
        { date: '2025-01-03', status: 'absent' }
      ]
    },
    {
      id: 'stu-005',
      name: 'Jessica Brown',
      studentId: 'STU005',
      grade: '10',
      photo: 'https://randomuser.me/api/portraits/women/5.jpg',
      status: 'present',
      attendanceRate: 97,
      recentAttendance: [
        { date: '2025-01-09', status: 'present' },
        { date: '2025-01-08', status: 'present' },
        { date: '2025-01-07', status: 'present' },
        { date: '2025-01-06', status: 'present' },
        { date: '2025-01-05', status: 'present' },
        { date: '2025-01-04', status: 'present' },
        { date: '2025-01-03', status: 'late' }
      ]
    },
    {
      id: 'stu-006',
      name: 'Alex Thompson',
      studentId: 'STU006',
      grade: '9',
      photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      status: 'present',
      attendanceRate: 85,
      recentAttendance: [
        { date: '2025-01-09', status: 'present' },
        { date: '2025-01-08', status: 'late' },
        { date: '2025-01-07', status: 'present' },
        { date: '2025-01-06', status: 'absent' },
        { date: '2025-01-05', status: 'present' },
        { date: '2025-01-04', status: 'present' },
        { date: '2025-01-03', status: 'present' }
      ]
    }
  ];

  const [students, setStudents] = useState(mockStudents);

  // Mock attendance trend data
  const attendanceTrendData = [
    { date: '01/03', attendanceRate: 92 },
    { date: '01/04', attendanceRate: 88 },
    { date: '01/05', attendanceRate: 94 },
    { date: '01/06', attendanceRate: 90 },
    { date: '01/07', attendanceRate: 96 },
    { date: '01/08', attendanceRate: 89 },
    { date: '01/09', attendanceRate: 91 }
  ];

  // Calculate attendance statistics
  const calculateStats = (studentList) => {
    const total = studentList?.length;
    const present = studentList?.filter(s => s?.status === 'present')?.length;
    const absent = studentList?.filter(s => s?.status === 'absent')?.length;
    const late = studentList?.filter(s => s?.status === 'late')?.length;
    const excused = studentList?.filter(s => s?.status === 'excused')?.length;
    const chronicAbsences = studentList?.filter(s => s?.attendanceRate < 75)?.length;

    return { total, present, absent, late, excused, chronicAbsences };
  };

  // Filter students based on search and filters
  const getFilteredStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered?.filter(student =>
        student?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        student?.studentId?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered?.filter(student => student?.status === statusFilter);
    }

    if (gradeFilter) {
      filtered = filtered?.filter(student => student?.grade === gradeFilter);
    }

    if (attendanceRateFilter) {
      filtered = filtered?.filter(student => {
        switch (attendanceRateFilter) {
          case 'excellent': return student?.attendanceRate >= 95;
          case 'good': return student?.attendanceRate >= 85 && student?.attendanceRate < 95;
          case 'fair': return student?.attendanceRate >= 75 && student?.attendanceRate < 85;
          case 'poor': return student?.attendanceRate < 75;
          default: return true;
        }
      });
    }

    return filtered;
  };

  const filteredStudents = getFilteredStudents();
  const stats = calculateStats(filteredStudents);

  // Handle attendance change
  const handleAttendanceChange = (studentId, newStatus) => {
    setStudents(prev => prev?.map(student =>
      student?.id === studentId
        ? { ...student, status: newStatus }
        : student
    ));
  };

  // Handle bulk attendance update
  const handleBulkUpdate = (studentIds, status, customUpdates = null) => {
    setStudents(prev => prev?.map(student => {
      if (studentIds?.includes(student?.id)) {
        if (customUpdates) {
          const customUpdate = customUpdates?.find(update => update?.id === student?.id);
          return { ...student, status: customUpdate?.status || student?.status };
        }
        return { ...student, status };
      }
      return student;
    }));
  };

  // Handle export report
  const handleExportReport = () => {
    // Mock export functionality
    const csvContent = [
      ['Student ID', 'Name', 'Grade', 'Status', 'Attendance Rate'],
      ...filteredStudents?.map(student => [
        student?.studentId,
        student?.name,
        student?.grade,
        student?.status,
        `${student?.attendanceRate}%`
      ])
    ]?.map(row => row?.join(','))?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedDate}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setGradeFilter('');
    setAttendanceRateFilter('');
  };

  // Handle URL parameters
  useEffect(() => {
    const action = searchParams?.get('action');
    if (action === 'take') {
      // Auto-focus on attendance taking mode
      setSelectedClass('class-1');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        userName="John Doe"
        onLogout={() => console.log('Logout')}
      />
      <RoleSidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-72'
      } pb-20 md:pb-6`}>
        <div className="p-6">
          <NavigationBreadcrumb />
          
          <AttendanceHeader
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedClass={selectedClass}
            onClassChange={setSelectedClass}
            classes={classes}
            userRole={userRole}
            onExportReport={handleExportReport}
            onBulkAction={() => setIsBulkModalOpen(true)}
          />

          <AttendanceStats 
            stats={stats} 
            selectedClass={selectedClass}
            userRole={userRole}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <AttendanceChart
                data={attendanceTrendData}
                chartType="line"
                title="Attendance Trend (Last 7 Days)"
              />
            </div>
            <div>
              <AttendanceChart
                data={attendanceTrendData?.slice(-5)}
                chartType="bar"
                title="Weekly Overview"
              />
            </div>
          </div>

          <AttendanceFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            gradeFilter={gradeFilter}
            onGradeFilterChange={setGradeFilter}
            attendanceRateFilter={attendanceRateFilter}
            onAttendanceRateFilterChange={setAttendanceRateFilter}
            onClearFilters={handleClearFilters}
            userRole={userRole}
          />

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Student Attendance
                {filteredStudents?.length !== students?.length && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({filteredStudents?.length} of {students?.length} students)
                  </span>
                )}
              </h2>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date()?.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredStudents?.map((student) => (
                <StudentAttendanceCard
                  key={student?.id}
                  student={student}
                  onAttendanceChange={handleAttendanceChange}
                  isEditable={true}
                  showHistory={userRole === 'admin'}
                />
              ))}
            </div>

            {filteredStudents?.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <BulkActionsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        students={filteredStudents}
        onBulkUpdate={handleBulkUpdate}
        selectedClass={selectedClass}
      />
    </div>
  );
};

export default AttendanceTracking;
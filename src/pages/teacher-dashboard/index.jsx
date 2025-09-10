import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import ClassOverviewCard from './components/ClassOverviewCard';
import TodaySchedulePanel from './components/TodaySchedulePanel';
import NotificationCenter from './components/NotificationCenter';
import GradeBookQuickAccess from './components/GradeBookQuickAccess';
import RecentActivityPanel from './components/RecentActivityPanel';
import QuickStatsOverview from './components/QuickStatsOverview';

import Button from '../../components/ui/Button';

const TeacherDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mock data for teacher dashboard
  const teacherInfo = {
    name: "Sarah Johnson",
    role: "teacher",
    employeeId: "TCH001",
    department: "Mathematics",
    subjects: ["Algebra", "Geometry", "Calculus"]
  };

  const classesData = [
    {
      id: "class-001",
      subject: "Algebra I",
      grade: "9",
      section: "A",
      studentCount: 28,
      attendanceRate: 92,
      pendingGrades: 3,
      nextClass: {
        time: "10:30 AM",
        room: "Room 205"
      }
    },
    {
      id: "class-002",
      subject: "Geometry",
      grade: "10",
      section: "B",
      studentCount: 25,
      attendanceRate: 88,
      pendingGrades: 7,
      nextClass: {
        time: "2:15 PM",
        room: "Room 203"
      }
    },
    {
      id: "class-003",
      subject: "Calculus",
      grade: "12",
      section: "A",
      studentCount: 22,
      attendanceRate: 95,
      pendingGrades: 0,
      nextClass: null
    }
  ];

  const todaySchedule = [
    {
      subject: "Algebra I",
      grade: "9",
      startTime: "08:00",
      endTime: "08:45",
      room: "Room 205"
    },
    {
      subject: "Geometry",
      grade: "10",
      startTime: "09:00",
      endTime: "09:45",
      room: "Room 203"
    },
    {
      subject: "Free Period",
      grade: "",
      startTime: "10:00",
      endTime: "10:45",
      room: "Staff Room"
    },
    {
      subject: "Calculus",
      grade: "12",
      startTime: "11:00",
      endTime: "11:45",
      room: "Room 201"
    },
    {
      subject: "Algebra I",
      grade: "9",
      startTime: "14:00",
      endTime: "14:45",
      room: "Room 205"
    }
  ];

  const notifications = [
    {
      id: "notif-001",
      type: "messages",
      title: "Parent Meeting Request",
      message: "Mrs. Anderson has requested a meeting regarding her son\'s progress in Algebra I.",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      read: false,
      priority: "medium",
      actionRequired: true,
      actionText: "Schedule Meeting"
    },
    {
      id: "notif-002",
      type: "alerts",
      title: "Assignment Due Tomorrow",
      message: "Geometry Quiz #3 submissions are due tomorrow. 5 students haven\'t submitted yet.",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      priority: "high",
      actionRequired: true,
      actionText: "Send Reminder"
    },
    {
      id: "notif-003",
      type: "announcements",
      title: "Staff Meeting Reminder",
      message: "Monthly staff meeting scheduled for Friday at 3:30 PM in the conference room.",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      priority: "low"
    },
    {
      id: "notif-004",
      type: "attendance",
      title: "Attendance Alert",
      message: "3 students were absent in today\'s first period Algebra I class.",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      read: false,
      priority: "medium"
    }
  ];

  const gradeBookData = {
    totalAssignments: 24,
    pendingGrades: 10,
    averageGrade: 87,
    recentAssignments: [
      {
        id: "assign-001",
        title: "Quadratic Equations Test",
        subject: "Algebra I",
        dueDate: "Dec 15, 2024",
        gradedCount: 25,
        totalSubmissions: 28,
        classId: "class-001"
      },
      {
        id: "assign-002",
        title: "Geometry Proofs Quiz",
        subject: "Geometry",
        dueDate: "Dec 12, 2024",
        gradedCount: 20,
        totalSubmissions: 25,
        classId: "class-002"
      },
      {
        id: "assign-003",
        title: "Calculus Integration Homework",
        subject: "Calculus",
        dueDate: "Dec 10, 2024",
        gradedCount: 22,
        totalSubmissions: 22,
        classId: "class-003"
      }
    ],
    gradeDistribution: [
      { range: "A (90-100%)", count: 45, percentage: 35 },
      { range: "B (80-89%)", count: 38, percentage: 30 },
      { range: "C (70-79%)", count: 28, percentage: 22 },
      { range: "D (60-69%)", count: 12, percentage: 9 },
      { range: "F (Below 60%)", count: 5, percentage: 4 }
    ],
    missingAssignments: 8
  };

  const recentActivities = [
    {
      id: "activity-001",
      type: "submissions",
      title: "New Assignment Submission",
      description: "Emma Wilson submitted Algebra I Homework #12",
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      studentName: "Emma Wilson",
      assignmentId: "assign-001",
      requiresAction: false
    },
    {
      id: "activity-002",
      type: "communications",
      title: "Parent Message",
      description: "Message from Mr. Davis about his daughter\'s performance",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      studentName: "Lisa Davis",
      requiresAction: true
    },
    {
      id: "activity-003",
      type: "attendance",
      title: "Attendance Updated",
      description: "Marked attendance for Period 2 Geometry class",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      requiresAction: false
    },
    {
      id: "activity-004",
      type: "grades",
      title: "Grades Entered",
      description: "Entered grades for Calculus Quiz #5",
      timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
      requiresAction: false
    }
  ];

  const quickStats = {
    totalStudents: 75,
    classesToday: 5,
    pendingGrades: 10,
    attendanceRate: 92,
    studentChange: 2,
    gradeChange: -3,
    attendanceChange: 1
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleQuickAction = (actionId, actionData) => {
    console.log(`Quick action: ${actionId}`, actionData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={teacherInfo?.role}
        userName={teacherInfo?.name}
        onLogout={handleLogout}
      />
      <RoleSidebar
        userRole={teacherInfo?.role}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-72'
      } pb-16 md:pb-0`}>
        <div className="p-6">
          <NavigationBreadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome back, {teacherInfo?.name}
                </h1>
                <p className="text-muted-foreground">
                  {teacherInfo?.department} Department • Employee ID: {teacherInfo?.employeeId}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {currentTime?.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentTime?.toLocaleTimeString('en-US', { 
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  iconName="Calendar"
                  onClick={() => navigate('/class-schedule-management')}
                >
                  View Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <QuickStatsOverview statsData={quickStats} />

          {/* Quick Actions Panel */}
          <div className="mb-6">
            <QuickActionPanel
              userRole={teacherInfo?.role}
              onQuickAction={handleQuickAction}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Classes and Schedule */}
            <div className="lg:col-span-2 space-y-6">
              {/* Class Overview Cards */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">My Classes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classesData?.map((classData) => (
                    <ClassOverviewCard key={classData?.id} classData={classData} />
                  ))}
                </div>
              </div>

              {/* Today's Schedule */}
              <TodaySchedulePanel scheduleData={todaySchedule} />
            </div>

            {/* Right Column - Notifications and Quick Access */}
            <div className="space-y-6">
              <NotificationCenter notifications={notifications} />
              <GradeBookQuickAccess gradeBookData={gradeBookData} />
            </div>
          </div>

          {/* Recent Activity Panel */}
          <div className="mb-6">
            <RecentActivityPanel activities={recentActivities} />
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
              <div>
                <p>SchoolSync Pro Teacher Portal</p>
                <p>Last login: {new Date()?.toLocaleDateString()} at {new Date()?.toLocaleTimeString()}</p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <Button variant="ghost" size="sm" iconName="HelpCircle">
                  Help
                </Button>
                <Button variant="ghost" size="sm" iconName="Settings">
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
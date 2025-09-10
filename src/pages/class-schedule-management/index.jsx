import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import ScheduleCalendar from './components/ScheduleCalendar';
import ScheduleFilters from './components/ScheduleFilters';
import ResourcePanel from './components/ResourcePanel';
import ScheduleModal from './components/ScheduleModal';
import ScheduleStats from './components/ScheduleStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ClassScheduleManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [userRole] = useState('admin');
  const [userName] = useState('John Doe');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResourcePanelCollapsed, setIsResourcePanelCollapsed] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [filters, setFilters] = useState({
    grade: 'all',
    teacher: 'all',
    subject: 'all',
    room: 'all',
    search: ''
  });
  
  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  // Mock schedule data
  const [scheduleData, setScheduleData] = useState([
    {
      id: '1',
      subject: 'Mathematics',
      teacher: 'Sarah Johnson',
      grade: 'Grade 5',
      room: 'Room 101',
      day: 'Monday',
      time: '09:00',
      endTime: '10:00',
      studentCount: 28,
      hasConflict: false,
      notes: 'Advanced algebra concepts'
    },
    {
      id: '2',
      subject: 'English',
      teacher: 'Michael Brown',
      grade: 'Grade 3',
      room: 'Room 102',
      day: 'Monday',
      time: '10:00',
      endTime: '11:00',
      studentCount: 25,
      hasConflict: false,
      notes: 'Reading comprehension'
    },
    {
      id: '3',
      subject: 'Science',
      teacher: 'Emily Davis',
      grade: 'Grade 6',
      room: 'Lab 1',
      day: 'Tuesday',
      time: '14:00',
      endTime: '15:00',
      studentCount: 22,
      hasConflict: false,
      notes: 'Chemistry experiments'
    },
    {
      id: '4',
      subject: 'History',
      teacher: 'David Wilson',
      grade: 'Grade 7',
      room: 'Room 201',
      day: 'Wednesday',
      time: '11:00',
      endTime: '12:00',
      studentCount: 30,
      hasConflict: true,
      notes: 'World War II study'
    },
    {
      id: '5',
      subject: 'Physical Education',
      teacher: 'Lisa Anderson',
      grade: 'Grade 4',
      room: 'Gymnasium',
      day: 'Thursday',
      time: '15:00',
      endTime: '16:00',
      studentCount: 35,
      hasConflict: false,
      notes: 'Basketball fundamentals'
    },
    {
      id: '6',
      subject: 'Art',
      teacher: 'James Taylor',
      grade: 'Grade 2',
      room: 'Art Room',
      day: 'Friday',
      time: '13:00',
      endTime: '14:00',
      studentCount: 20,
      hasConflict: false,
      notes: 'Watercolor painting'
    }
  ]);

  // Statistics
  const stats = {
    totalClasses: scheduleData?.length,
    activeTeachers: new Set(scheduleData.map(s => s.teacher))?.size,
    roomUtilization: 78,
    conflicts: scheduleData?.filter(s => s?.hasConflict)?.length
  };

  // Handle URL parameters
  useEffect(() => {
    const action = searchParams?.get('action');
    const view = searchParams?.get('view');
    
    if (action === 'add') {
      setModalMode('create');
      setSelectedSchedule(null);
      setIsScheduleModalOpen(true);
    }
    
    if (view === 'teacher') {
      setFilters(prev => ({ ...prev, teacher: userRole === 'teacher' ? 'current-user' : 'all' }));
    }
  }, [searchParams, userRole]);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      grade: 'all',
      teacher: 'all',
      subject: 'all',
      room: 'all',
      search: ''
    });
  };

  // Schedule handlers
  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setModalMode('view');
    setIsScheduleModalOpen(true);
  };

  const handleTimeSlotClick = (day, time, draggedItem = null) => {
    if (draggedItem) {
      // Handle drag and drop
      const updatedSchedule = scheduleData?.map(item => 
        item?.id === draggedItem?.id 
          ? { ...item, day, time }
          : item
      );
      setScheduleData(updatedSchedule);
    } else {
      // Create new schedule
      setSelectedSchedule({ day, time });
      setModalMode('create');
      setIsScheduleModalOpen(true);
    }
  };

  const handleScheduleSave = (scheduleItem) => {
    if (modalMode === 'create') {
      setScheduleData(prev => [...prev, scheduleItem]);
    } else if (modalMode === 'edit') {
      setScheduleData(prev => 
        prev?.map(item => 
          item?.id === scheduleItem?.id ? scheduleItem : item
        )
      );
    }
  };

  const handleResourceSelect = (type, resource) => {
    // Handle resource selection for scheduling
    console.log('Resource selected:', type, resource);
  };

  const handleQuickAction = (actionId, data) => {
    switch (actionId) {
      case 'add-class': setModalMode('create');
        setSelectedSchedule(null);
        setIsScheduleModalOpen(true);
        break;
      case 'view-conflicts':
        setFilters(prev => ({ ...prev, conflicts: true }));
        break;
      default:
        console.log('Quick action:', actionId, data);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Filter schedule data based on current filters
  const filteredScheduleData = scheduleData?.filter(schedule => {
    if (filters?.grade !== 'all' && !schedule?.grade?.toLowerCase()?.includes(filters?.grade?.replace('grade-', ''))) {
      return false;
    }
    if (filters?.teacher !== 'all' && !schedule?.teacher?.toLowerCase()?.includes(filters?.teacher?.replace('-', ' '))) {
      return false;
    }
    if (filters?.subject !== 'all' && schedule?.subject?.toLowerCase() !== filters?.subject?.replace('-', ' ')) {
      return false;
    }
    if (filters?.room !== 'all' && !schedule?.room?.toLowerCase()?.includes(filters?.room?.replace('-', ' '))) {
      return false;
    }
    if (filters?.search && !schedule?.subject?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !schedule?.teacher?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !schedule?.grade?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
      return false;
    }
    if (filters?.conflicts && !schedule?.hasConflict) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
      />
      {/* Sidebar */}
      <RoleSidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      {/* Resource Panel */}
      <ResourcePanel
        isCollapsed={isResourcePanelCollapsed}
        onToggle={() => setIsResourcePanelCollapsed(!isResourcePanelCollapsed)}
        selectedDate={selectedWeek}
        onResourceSelect={handleResourceSelect}
      />
      {/* Main Content */}
      <main 
        className={`transition-all duration-300 pt-16 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-72'
        } ${
          isResourcePanelCollapsed ? 'mr-12' : 'mr-80'
        }`}
      >
        <div className="p-6">
          {/* Breadcrumb */}
          <NavigationBreadcrumb />

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Class Schedule Management</h1>
              <p className="text-muted-foreground mt-1">
                Create, modify, and oversee academic timetables and classroom assignments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                onClick={() => console.log('Export schedule')}
              >
                Export Schedule
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                onClick={() => {
                  setModalMode('create');
                  setSelectedSchedule(null);
                  setIsScheduleModalOpen(true);
                }}
              >
                Add Class
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <ScheduleStats stats={stats} />

          {/* Quick Actions */}
          <QuickActionPanel
            userRole={userRole}
            onQuickAction={handleQuickAction}
            className="mb-6"
          />

          {/* Filters */}
          <ScheduleFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onViewModeChange={setViewMode}
            viewMode={viewMode}
          />

          {/* Schedule Calendar */}
          <ScheduleCalendar
            scheduleData={filteredScheduleData}
            selectedWeek={selectedWeek}
            onScheduleClick={handleScheduleClick}
            onTimeSlotClick={handleTimeSlotClick}
            viewMode={viewMode}
            userRole={userRole}
          />

          {/* Additional Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span>Showing {filteredScheduleData?.length} classes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>Last updated: {new Date()?.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={() => window.location?.reload()}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                onClick={() => navigate('/settings')}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleScheduleSave}
        scheduleData={selectedSchedule}
        mode={modalMode}
      />
    </div>
  );
};

export default ClassScheduleManagement;
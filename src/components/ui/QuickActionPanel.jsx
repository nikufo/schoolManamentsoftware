import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const QuickActionPanel = ({ 
  userRole = 'admin', 
  className = '',
  onQuickAction 
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const quickActions = {
    admin: [
      {
        id: 'student-lookup',
        label: 'Find Student',
        icon: 'Search',
        description: 'Quick student search',
        action: () => setIsSearchOpen(true)
      },
      {
        id: 'add-student',
        label: 'Add Student',
        icon: 'UserPlus',
        description: 'Register new student',
        action: () => navigate('/student-management?action=add')
      },
      {
        id: 'attendance-overview',
        label: 'Attendance',
        icon: 'CheckSquare',
        description: 'View today\'s attendance',
        action: () => navigate('/attendance-tracking')
      },
      {
        id: 'schedule-view',
        label: 'Schedule',
        icon: 'Calendar',
        description: 'View class schedules',
        action: () => navigate('/class-schedule-management')
      }
    ],
    teacher: [
      {
        id: 'take-attendance',
        label: 'Take Attendance',
        icon: 'CheckSquare',
        description: 'Mark student attendance',
        action: () => navigate('/attendance-tracking?action=take')
      },
      {
        id: 'grade-entry',
        label: 'Enter Grades',
        icon: 'BookOpen',
        description: 'Add or update grades',
        action: () => navigate('/grade-management?action=entry')
      },
      {
        id: 'student-lookup',
        label: 'Find Student',
        icon: 'Search',
        description: 'Quick student search',
        action: () => setIsSearchOpen(true)
      },
      {
        id: 'my-schedule',
        label: 'My Schedule',
        icon: 'Calendar',
        description: 'View teaching schedule',
        action: () => navigate('/class-schedule-management?view=teacher')
      }
    ]
  };

  const actions = quickActions?.[userRole] || quickActions?.admin;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/student-management?search=${encodeURIComponent(searchQuery?.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      if (onQuickAction) {
        onQuickAction('search', searchQuery?.trim());
      }
    }
  };

  const handleActionClick = (action) => {
    action?.action();
    if (onQuickAction) {
      onQuickAction(action?.id, action?.label);
    }
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant="outline"
            onClick={() => handleActionClick(action)}
            className="flex flex-col items-center justify-center h-20 p-3 hover-lift group"
          >
            <Icon 
              name={action?.icon} 
              size={20} 
              className="mb-2 text-primary group-hover:text-primary/80 transition-colors duration-200" 
            />
            <span className="text-xs font-medium text-center leading-tight">
              {action?.label}
            </span>
          </Button>
        ))}
      </div>
      {/* Quick Search */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search students by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                variant="default"
                iconName="Search"
                disabled={!searchQuery?.trim()}
              >
                Search
              </Button>
            </form>
          </div>
        </div>
        
        {/* Search suggestions or recent searches could go here */}
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Recent: </span>
          <button 
            onClick={() => setSearchQuery('John Doe')}
            className="text-primary hover:text-primary/80 transition-colors duration-200 mr-2"
          >
            John Doe
          </button>
          <button 
            onClick={() => setSearchQuery('Grade 10')}
            className="text-primary hover:text-primary/80 transition-colors duration-200 mr-2"
          >
            Grade 10
          </button>
          <button 
            onClick={() => setSearchQuery('STU001')}
            className="text-primary hover:text-primary/80 transition-colors duration-200"
          >
            STU001
          </button>
        </div>
      </div>
      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="status-indicator bg-success"></div>
            <span className="text-muted-foreground">System Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="status-indicator bg-accent"></div>
            <span className="text-muted-foreground">3 Pending</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date()?.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActionPanel;
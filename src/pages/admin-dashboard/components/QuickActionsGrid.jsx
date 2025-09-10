import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActionsGrid = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'student-registration',
      label: 'Add Student',
      description: 'Register new student',
      icon: 'UserPlus',
      color: 'primary',
      path: '/student-management?action=add'
    },
    {
      id: 'staff-management',
      label: 'Manage Staff',
      description: 'View and edit staff',
      icon: 'Users',
      color: 'success',
      path: '/staff-management'
    },
    {
      id: 'attendance-overview',
      label: 'Attendance',
      description: 'View attendance reports',
      icon: 'CheckSquare',
      color: 'warning',
      path: '/attendance-tracking'
    },
    {
      id: 'generate-reports',
      label: 'Reports',
      description: 'Generate analytics',
      icon: 'BarChart3',
      color: 'accent',
      path: '/reports'
    },
    {
      id: 'schedule-management',
      label: 'Schedules',
      description: 'Manage class schedules',
      icon: 'Calendar',
      color: 'primary',
      path: '/class-schedule-management'
    },
    {
      id: 'grade-overview',
      label: 'Grades',
      description: 'Academic performance',
      icon: 'GraduationCap',
      color: 'success',
      path: '/grade-management'
    }
  ];

  const handleActionClick = (action) => {
    navigate(action?.path);
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant="outline"
            onClick={() => handleActionClick(action)}
            className="flex flex-col items-center justify-center h-24 p-4 hover-lift group"
          >
            <div className="mb-3">
              <Icon 
                name={action?.icon} 
                size={24} 
                className="text-primary group-hover:text-primary/80 transition-colors duration-200" 
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-1">{action?.label}</p>
              <p className="text-xs text-muted-foreground leading-tight">{action?.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
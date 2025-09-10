import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ className = '' }) => {
  const recentActivities = [
    {
      id: 1,
      type: 'enrollment',
      title: 'New Student Enrollment',
      description: 'Sarah Johnson enrolled in Grade 10-A',
      timestamp: new Date(Date.now() - 300000),
      priority: 'normal',
      icon: 'UserPlus',
      color: 'success'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Attendance Alert',
      description: 'Grade 9-B has 15% absence rate today',
      timestamp: new Date(Date.now() - 600000),
      priority: 'high',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Notification',
      description: 'Monthly report generation completed',
      timestamp: new Date(Date.now() - 900000),
      priority: 'normal',
      icon: 'Bell',
      color: 'primary'
    },
    {
      id: 4,
      type: 'staff',
      title: 'Staff Update',
      description: 'Mr. David Wilson updated his profile',
      timestamp: new Date(Date.now() - 1200000),
      priority: 'low',
      icon: 'User',
      color: 'accent'
    },
    {
      id: 5,
      type: 'grade',
      title: 'Grade Submission',
      description: 'Mathematics grades submitted for Grade 8-C',
      timestamp: new Date(Date.now() - 1800000),
      priority: 'normal',
      icon: 'BookOpen',
      color: 'success'
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-error/10 text-error border-error/20',
      normal: 'bg-primary/10 text-primary border-primary/20',
      low: 'bg-muted text-muted-foreground border-border'
    };
    return colors?.[priority] || colors?.normal;
  };

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      accent: 'text-accent'
    };
    return colors?.[color] || colors?.primary;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp?.toLocaleDateString();
    }
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Live</span>
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentActivities?.map((activity) => (
          <div 
            key={activity?.id}
            className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted`}>
              <Icon 
                name={activity?.icon} 
                size={18} 
                className={getIconColor(activity?.color)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {activity?.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity?.priority)}`}>
                  {activity?.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {activity?.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>{formatTimestamp(activity?.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;
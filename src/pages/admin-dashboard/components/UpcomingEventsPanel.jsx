import React from 'react';
import Icon from '../../../components/AppIcon';

const UpcomingEventsPanel = ({ className = '' }) => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      date: new Date(Date.now() + 86400000 * 2),
      time: '09:00 AM',
      type: 'meeting',
      location: 'Main Auditorium',
      attendees: 45,
      icon: 'Users',
      color: 'primary'
    },
    {
      id: 2,
      title: 'Grade 12 Final Exams',
      date: new Date(Date.now() + 86400000 * 5),
      time: '10:00 AM',
      type: 'exam',
      location: 'Exam Hall A & B',
      attendees: 120,
      icon: 'FileText',
      color: 'warning'
    },
    {
      id: 3,
      title: 'Staff Development Workshop',
      date: new Date(Date.now() + 86400000 * 7),
      time: '02:00 PM',
      type: 'training',
      location: 'Conference Room',
      attendees: 25,
      icon: 'BookOpen',
      color: 'success'
    },
    {
      id: 4,
      title: 'Science Fair Preparation',
      date: new Date(Date.now() + 86400000 * 10),
      time: '11:00 AM',
      type: 'event',
      location: 'Science Laboratory',
      attendees: 60,
      icon: 'Beaker',
      color: 'accent'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      title: 'Leave Request - Ms. Anderson',
      type: 'leave',
      priority: 'normal',
      submittedBy: 'Jennifer Anderson',
      department: 'Mathematics',
      icon: 'Calendar'
    },
    {
      id: 2,
      title: 'Budget Approval - Lab Equipment',
      type: 'budget',
      priority: 'high',
      submittedBy: 'Science Department',
      amount: '$2,500',
      icon: 'DollarSign'
    },
    {
      id: 3,
      title: 'Field Trip Permission - Grade 7',
      type: 'permission',
      priority: 'normal',
      submittedBy: 'Mr. Thompson',
      destination: 'Natural History Museum',
      icon: 'MapPin'
    }
  ];

  const getEventColor = (color) => {
    const colors = {
      primary: 'text-primary bg-primary/10',
      success: 'text-success bg-success/10',
      warning: 'text-warning bg-warning/10',
      accent: 'text-accent bg-accent/10'
    };
    return colors?.[color] || colors?.primary;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-error text-error-foreground',
      normal: 'bg-primary text-primary-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return colors?.[priority] || colors?.normal;
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    
    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === tomorrow?.toDateString()) {
      return 'Tomorrow';
    } else {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upcoming Events */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
          <Icon name="Calendar" size={20} className="text-primary" />
        </div>

        <div className="space-y-4">
          {upcomingEvents?.map((event) => (
            <div 
              key={event?.id}
              className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getEventColor(event?.color)}`}>
                <Icon name={event?.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {event?.title}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{formatDate(event?.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{event?.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={12} />
                    <span>{event?.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Users" size={12} />
                  <span>{event?.attendees}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pending Approvals */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-warning text-warning-foreground text-xs rounded-full font-medium">
              {pendingApprovals?.length}
            </span>
            <Icon name="Clock" size={20} className="text-warning" />
          </div>
        </div>

        <div className="space-y-3">
          {pendingApprovals?.map((approval) => (
            <div 
              key={approval?.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Icon name={approval?.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {approval?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    by {approval?.submittedBy}
                    {approval?.department && ` • ${approval?.department}`}
                    {approval?.amount && ` • ${approval?.amount}`}
                    {approval?.destination && ` • ${approval?.destination}`}
                  </p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval?.priority)}`}>
                {approval?.priority}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium">
            View All Pending Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsPanel;
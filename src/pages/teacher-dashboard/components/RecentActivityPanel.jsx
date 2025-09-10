import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivityPanel = ({ activities }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const filters = [
    { id: 'all', label: 'All', icon: 'Activity' },
    { id: 'submissions', label: 'Submissions', icon: 'FileText' },
    { id: 'communications', label: 'Messages', icon: 'MessageSquare' },
    { id: 'attendance', label: 'Attendance', icon: 'CheckSquare' }
  ];

  const filteredActivities = activities?.filter(activity => {
    if (activeFilter === 'all') return true;
    return activity?.type === activeFilter;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'submissions': return 'FileText';
      case 'communications': return 'MessageSquare';
      case 'attendance': return 'CheckSquare';
      case 'grades': return 'BookOpen';
      case 'announcement': return 'Megaphone';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'submissions': return 'text-primary';
      case 'communications': return 'text-accent';
      case 'attendance': return 'text-success';
      case 'grades': return 'text-warning';
      case 'announcement': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const handleActivityClick = (activity) => {
    switch (activity?.type) {
      case 'submissions':
        navigate(`/grade-management?assignment=${activity?.assignmentId}`);
        break;
      case 'communications':
        // Navigate to parent communication
        break;
      case 'attendance': navigate('/attendance-tracking');
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button variant="ghost" size="sm" iconName="RefreshCw">
          Refresh
        </Button>
      </div>
      {/* Activity Filters */}
      <div className="flex space-x-1 mb-4 bg-muted rounded-lg p-1 overflow-x-auto">
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => setActiveFilter(filter?.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              activeFilter === filter?.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={filter?.icon} size={14} />
            <span>{filter?.label}</span>
          </button>
        ))}
      </div>
      {/* Activity List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredActivities?.map((activity) => (
          <div
            key={activity?.id}
            onClick={() => handleActivityClick(activity)}
            className="flex items-start space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-muted"
          >
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Icon
                  name={getActivityIcon(activity?.type)}
                  size={14}
                  className={getActivityColor(activity?.type)}
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {activity?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {activity?.description}
                  </p>
                  
                  {activity?.studentName && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={10} color="white" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity?.studentName}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end ml-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                  
                  {activity?.requiresAction && (
                    <div className="mt-1">
                      <div className="status-indicator bg-warning"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredActivities?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      )}
      {/* View All Activities */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full">
          View All Activities
        </Button>
      </div>
    </div>
  );
};

export default RecentActivityPanel;
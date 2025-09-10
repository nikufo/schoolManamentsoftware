import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ notifications }) => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const tabs = [
    { id: 'all', label: 'All', icon: 'Bell' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' },
    { id: 'announcements', label: 'Announcements', icon: 'Megaphone' },
    { id: 'alerts', label: 'Alerts', icon: 'AlertTriangle' }
  ];

  const filteredNotifications = notifications?.filter(notification => {
    if (activeTab === 'all') return true;
    return notification?.type === activeTab;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'messages': return 'MessageSquare';
      case 'announcements': return 'Megaphone';
      case 'alerts': return 'AlertTriangle';
      case 'attendance': return 'CheckSquare';
      case 'grades': return 'BookOpen';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    if (priority === 'medium') return 'text-warning';
    
    switch (type) {
      case 'messages': return 'text-primary';
      case 'announcements': return 'text-accent';
      case 'alerts': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const handleNotificationClick = (notification) => {
    switch (notification?.type) {
      case 'messages':
        // Navigate to parent communication
        break;
      case 'attendance': navigate('/attendance-tracking');
        break;
      case 'grades': navigate('/grade-management');
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {notifications?.filter(n => !n?.read)?.length} unread
          </span>
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
      </div>
      {/* Notification Tabs */}
      <div className="flex space-x-1 mb-4 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-1 justify-center ${
              activeTab === tab?.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={14} />
            <span className="hidden sm:inline">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications?.map((notification) => (
          <div
            key={notification?.id}
            onClick={() => handleNotificationClick(notification)}
            className={`flex items-start space-x-3 p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-muted ${
              !notification?.read ? 'bg-primary/5 border border-primary/10' : ''
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              <Icon
                name={getNotificationIcon(notification?.type)}
                size={16}
                className={getNotificationColor(notification?.type, notification?.priority)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h4 className={`text-sm font-medium ${!notification?.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {notification?.title}
                </h4>
                <div className="flex items-center space-x-2 ml-2">
                  {notification?.priority === 'high' && (
                    <div className="status-indicator bg-error"></div>
                  )}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(notification?.timestamp)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notification?.message}
              </p>
              
              {notification?.actionRequired && (
                <div className="mt-2">
                  <Button variant="outline" size="xs">
                    {notification?.actionText || 'Take Action'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredNotifications?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No notifications</p>
        </div>
      )}
      {/* Mark All as Read */}
      {notifications?.some(n => !n?.read) && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full">
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
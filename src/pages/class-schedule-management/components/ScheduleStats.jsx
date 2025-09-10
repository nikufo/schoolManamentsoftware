import React from 'react';
import Icon from '../../../components/AppIcon';

const ScheduleStats = ({ 
  stats = {
    totalClasses: 0,
    activeTeachers: 0,
    roomUtilization: 0,
    conflicts: 0
  },
  className = '' 
}) => {
  const statCards = [
    {
      id: 'total-classes',
      label: 'Total Classes',
      value: stats?.totalClasses,
      icon: 'BookOpen',
      color: 'text-primary bg-primary/10 border-primary/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      id: 'active-teachers',
      label: 'Active Teachers',
      value: stats?.activeTeachers,
      icon: 'Users',
      color: 'text-success bg-success/10 border-success/20',
      change: '+3',
      changeType: 'positive'
    },
    {
      id: 'room-utilization',
      label: 'Room Utilization',
      value: `${stats?.roomUtilization}%`,
      icon: 'Building',
      color: 'text-accent bg-accent/10 border-accent/20',
      change: '+5%',
      changeType: 'positive'
    },
    {
      id: 'conflicts',
      label: 'Schedule Conflicts',
      value: stats?.conflicts,
      icon: 'AlertTriangle',
      color: stats?.conflicts > 0 ? 'text-error bg-error/10 border-error/20' : 'text-success bg-success/10 border-success/20',
      change: stats?.conflicts > 0 ? `${stats?.conflicts} active` : 'None',
      changeType: stats?.conflicts > 0 ? 'negative' : 'neutral'
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${className}`}>
      {statCards?.map(stat => (
        <div
          key={stat?.id}
          className="bg-card rounded-lg border border-border p-6 hover-lift transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat?.label}
              </p>
              <p className="text-2xl font-bold text-foreground mb-2">
                {stat?.value}
              </p>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getChangeIcon(stat?.changeType)} 
                  size={12} 
                  className={getChangeColor(stat?.changeType)} 
                />
                <span className={`text-xs font-medium ${getChangeColor(stat?.changeType)}`}>
                  {stat?.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last week
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${stat?.color}`}>
              <Icon name={stat?.icon} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleStats;
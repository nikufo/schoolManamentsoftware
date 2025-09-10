import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceStats = ({ stats, selectedClass, userRole }) => {
  const statCards = [
    {
      title: 'Present',
      value: stats?.present,
      total: stats?.total,
      percentage: stats?.total > 0 ? Math.round((stats?.present / stats?.total) * 100) : 0,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Absent',
      value: stats?.absent,
      total: stats?.total,
      percentage: stats?.total > 0 ? Math.round((stats?.absent / stats?.total) * 100) : 0,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20'
    },
    {
      title: 'Late',
      value: stats?.late,
      total: stats?.total,
      percentage: stats?.total > 0 ? Math.round((stats?.late / stats?.total) * 100) : 0,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Excused',
      value: stats?.excused,
      total: stats?.total,
      percentage: stats?.total > 0 ? Math.round((stats?.excused / stats?.total) * 100) : 0,
      icon: 'Shield',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    }
  ];

  if (userRole === 'admin') {
    statCards?.push({
      title: 'Chronic Absences',
      value: stats?.chronicAbsences || 0,
      total: stats?.total,
      percentage: stats?.total > 0 ? Math.round(((stats?.chronicAbsences || 0) / stats?.total) * 100) : 0,
      icon: 'AlertTriangle',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20'
    });
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className={`bg-card rounded-lg border ${stat?.borderColor} p-4 hover-lift transition-all duration-200`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={16} className={stat?.color} />
            </div>
            <span className="text-xs text-muted-foreground">
              {stat?.percentage}%
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {stat?.value}
            </p>
            <p className="text-xs text-muted-foreground">
              {stat?.title}
            </p>
            {stat?.total > 0 && (
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${stat?.color?.replace('text-', 'bg-')}`}
                  style={{ width: `${stat?.percentage}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceStats;
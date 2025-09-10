import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickStatsOverview = ({ statsData }) => {
  const navigate = useNavigate();

  const stats = [
    {
      id: 'total-students',
      label: 'Total Students',
      value: statsData?.totalStudents,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: statsData?.studentChange,
      onClick: () => navigate('/student-management')
    },
    {
      id: 'classes-today',
      label: 'Classes Today',
      value: statsData?.classesToday,
      icon: 'Calendar',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: null,
      onClick: () => navigate('/class-schedule-management')
    },
    {
      id: 'pending-grades',
      label: 'Pending Grades',
      value: statsData?.pendingGrades,
      icon: 'BookOpen',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: statsData?.gradeChange,
      onClick: () => navigate('/grade-management')
    },
    {
      id: 'attendance-rate',
      label: 'Attendance Rate',
      value: `${statsData?.attendanceRate}%`,
      icon: 'CheckSquare',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: statsData?.attendanceChange,
      onClick: () => navigate('/attendance-tracking')
    }
  ];

  const getChangeColor = (change) => {
    if (!change) return '';
    return change > 0 ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (change) => {
    if (!change) return null;
    return change > 0 ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          onClick={stat?.onClick}
          className="bg-card rounded-lg border border-border p-6 cursor-pointer hover-lift transition-all duration-200 hover:shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
            
            {stat?.change !== null && (
              <div className={`flex items-center space-x-1 ${getChangeColor(stat?.change)}`}>
                {getChangeIcon(stat?.change) && (
                  <Icon name={getChangeIcon(stat?.change)} size={14} />
                )}
                <span className="text-xs font-medium">
                  {Math.abs(stat?.change)}%
                </span>
              </div>
            )}
          </div>
          
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat?.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat?.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsOverview;
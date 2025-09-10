import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const StudentAttendanceCard = ({ 
  student, 
  onAttendanceChange, 
  isEditable = true,
  showHistory = false 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const attendanceOptions = [
    { value: 'present', label: 'Present', icon: 'CheckCircle', color: 'text-success' },
    { value: 'absent', label: 'Absent', icon: 'XCircle', color: 'text-error' },
    { value: 'late', label: 'Late', icon: 'Clock', color: 'text-warning' },
    { value: 'excused', label: 'Excused', icon: 'Shield', color: 'text-accent' }
  ];

  const getAttendanceColor = (status) => {
    const option = attendanceOptions?.find(opt => opt?.value === status);
    return option ? option?.color : 'text-muted-foreground';
  };

  const getAttendanceIcon = (status) => {
    const option = attendanceOptions?.find(opt => opt?.value === status);
    return option ? option?.icon : 'Circle';
  };

  const handleStatusChange = (newStatus) => {
    if (isEditable && onAttendanceChange) {
      onAttendanceChange(student?.id, newStatus);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover-lift transition-all duration-200">
      <div className="flex items-center space-x-4">
        {/* Student Photo */}
        <div className="flex-shrink-0">
          <Image
            src={student?.photo}
            alt={student?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-border"
          />
        </div>

        {/* Student Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground truncate">
                {student?.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                ID: {student?.studentId} • Grade {student?.grade}
              </p>
            </div>
            
            {showHistory && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDetails(!showDetails)}
                className="flex-shrink-0"
              >
                <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={16} />
              </Button>
            )}
          </div>

          {/* Attendance Rate */}
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <div
                className="h-1.5 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${student?.attendanceRate}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {student?.attendanceRate}%
            </span>
          </div>
        </div>

        {/* Attendance Status */}
        <div className="flex-shrink-0">
          {isEditable ? (
            <div className="flex space-x-1">
              {attendanceOptions?.map((option) => (
                <Button
                  key={option?.value}
                  variant={student?.status === option?.value ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleStatusChange(option?.value)}
                  className={`w-8 h-8 ${
                    student?.status === option?.value 
                      ? '' 
                      : `hover:${option?.color?.replace('text-', 'text-')}`
                  }`}
                  title={option?.label}
                >
                  <Icon 
                    name={option?.icon} 
                    size={14} 
                    className={student?.status === option?.value ? 'text-primary-foreground' : option?.color}
                  />
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Icon 
                name={getAttendanceIcon(student?.status)} 
                size={16} 
                className={getAttendanceColor(student?.status)}
              />
              <span className={`text-sm font-medium ${getAttendanceColor(student?.status)}`}>
                {student?.status?.charAt(0)?.toUpperCase() + student?.status?.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Attendance History */}
      {showDetails && showHistory && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">
            Recent Attendance (Last 7 days)
          </h4>
          <div className="flex space-x-1">
            {student?.recentAttendance?.map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-1"
                title={`${day?.date}: ${day?.status}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  day?.status === 'present' ? 'bg-success/20' :
                  day?.status === 'absent' ? 'bg-error/20' :
                  day?.status === 'late'? 'bg-warning/20' : 'bg-accent/20'
                }`}>
                  <Icon 
                    name={getAttendanceIcon(day?.status)} 
                    size={10} 
                    className={getAttendanceColor(day?.status)}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(day.date)?.getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Warning Indicators */}
      {student?.attendanceRate < 75 && (
        <div className="mt-3 flex items-center space-x-2 p-2 bg-warning/10 border border-warning/20 rounded-md">
          <Icon name="AlertTriangle" size={14} className="text-warning" />
          <span className="text-xs text-warning">
            Low attendance rate - Parent notification sent
          </span>
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceCard;
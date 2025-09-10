import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleCalendar = ({ 
  scheduleData, 
  selectedWeek, 
  onScheduleClick, 
  onTimeSlotClick,
  viewMode = 'week',
  userRole = 'admin'
}) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  const subjectColors = {
    'Mathematics': 'bg-blue-100 border-blue-300 text-blue-800',
    'English': 'bg-green-100 border-green-300 text-green-800',
    'Science': 'bg-purple-100 border-purple-300 text-purple-800',
    'History': 'bg-orange-100 border-orange-300 text-orange-800',
    'Physical Education': 'bg-red-100 border-red-300 text-red-800',
    'Art': 'bg-pink-100 border-pink-300 text-pink-800',
    'Music': 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'Computer Science': 'bg-indigo-100 border-indigo-300 text-indigo-800'
  };

  const getScheduleForSlot = (day, time) => {
    return scheduleData?.find(item => 
      item?.day === day && item?.time === time
    );
  };

  const handleDragStart = (e, scheduleItem) => {
    if (userRole !== 'admin') return;
    setDraggedItem(scheduleItem);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, day, time) => {
    e?.preventDefault();
    if (draggedItem && userRole === 'admin') {
      onTimeSlotClick(day, time, draggedItem);
      setDraggedItem(null);
    }
  };

  const formatTime = (time) => {
    const [hour] = time?.split(':');
    const hourNum = parseInt(hour);
    if (hourNum === 12) return '12:00 PM';
    if (hourNum > 12) return `${hourNum - 12}:00 PM`;
    return `${hourNum}:00 AM`;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-muted/50 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Weekly Schedule
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            {userRole === 'admin' && (
              <Button variant="default" size="sm">
                <Icon name="Plus" size={16} className="mr-2" />
                Add Class
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-6 border-b border-border">
            <div className="p-3 bg-muted/30 border-r border-border">
              <span className="text-sm font-medium text-muted-foreground">Time</span>
            </div>
            {weekDays?.map(day => (
              <div key={day} className="p-3 bg-muted/30 border-r border-border last:border-r-0">
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">{day}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(2025, 0, weekDays.indexOf(day) + 6)?.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots?.map(time => (
            <div key={time} className="grid grid-cols-6 border-b border-border last:border-b-0">
              {/* Time Column */}
              <div className="p-3 bg-muted/20 border-r border-border flex items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {formatTime(time)}
                </span>
              </div>

              {/* Day Columns */}
              {weekDays?.map(day => {
                const scheduleItem = getScheduleForSlot(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className="min-h-[80px] p-2 border-r border-border last:border-r-0 relative hover:bg-muted/20 transition-colors duration-200"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, time)}
                    onClick={() => onTimeSlotClick(day, time)}
                  >
                    {scheduleItem ? (
                      <div
                        className={`w-full h-full rounded-md border-2 p-2 cursor-pointer hover-lift transition-all duration-200 ${
                          subjectColors?.[scheduleItem?.subject] || 'bg-gray-100 border-gray-300 text-gray-800'
                        }`}
                        draggable={userRole === 'admin'}
                        onDragStart={(e) => handleDragStart(e, scheduleItem)}
                        onClick={(e) => {
                          e?.stopPropagation();
                          onScheduleClick(scheduleItem);
                        }}
                      >
                        <div className="text-xs font-semibold truncate">
                          {scheduleItem?.subject}
                        </div>
                        <div className="text-xs opacity-80 truncate mt-1">
                          {scheduleItem?.teacher}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {scheduleItem?.room}
                          </span>
                          <span className="text-xs opacity-70">
                            {scheduleItem?.studentCount}
                          </span>
                        </div>
                        {scheduleItem?.hasConflict && (
                          <div className="absolute top-1 right-1">
                            <Icon name="AlertTriangle" size={12} className="text-warning" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <Icon name="Plus" size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground">Subjects:</span>
            <div className="flex items-center space-x-3">
              {Object.entries(subjectColors)?.slice(0, 4)?.map(([subject, colorClass]) => (
                <div key={subject} className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded border-2 ${colorClass}`}></div>
                  <span className="text-xs text-muted-foreground">{subject}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="AlertTriangle" size={12} className="text-warning" />
              <span>Conflict</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={12} />
              <span>Student Count</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
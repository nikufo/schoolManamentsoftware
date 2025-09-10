import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodaySchedulePanel = ({ scheduleData }) => {
  const navigate = useNavigate();

  const handleViewFullSchedule = () => {
    navigate('/class-schedule-management?view=teacher');
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now?.getHours() * 60 + now?.getMinutes();
    
    return scheduleData?.find(slot => {
      const [startHour, startMin] = slot?.startTime?.split(':')?.map(Number);
      const [endHour, endMin] = slot?.endTime?.split(':')?.map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      return currentTime >= startMinutes && currentTime <= endMinutes;
    });
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTime = now?.getHours() * 60 + now?.getMinutes();
    
    return scheduleData?.find(slot => {
      const [startHour, startMin] = slot?.startTime?.split(':')?.map(Number);
      const startMinutes = startHour * 60 + startMin;
      
      return currentTime < startMinutes;
    });
  };

  const currentClass = getCurrentTimeSlot();
  const nextClass = getNextClass();

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-success text-success-foreground';
      case 'upcoming': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTimeStatus = (slot) => {
    const now = new Date();
    const currentTime = now?.getHours() * 60 + now?.getMinutes();
    const [startHour, startMin] = slot?.startTime?.split(':')?.map(Number);
    const [endHour, endMin] = slot?.endTime?.split(':')?.map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (currentTime >= startMinutes && currentTime <= endMinutes) return 'current';
    if (currentTime < startMinutes) return 'upcoming';
    return 'completed';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="Calendar"
          onClick={handleViewFullSchedule}
        >
          View Full
        </Button>
      </div>
      {/* Current/Next Class Highlight */}
      {(currentClass || nextClass) && (
        <div className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
          {currentClass ? (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="status-indicator bg-success"></div>
                <span className="text-sm font-medium text-success">Currently Teaching</span>
              </div>
              <h4 className="font-semibold text-foreground">{currentClass?.subject}</h4>
              <p className="text-sm text-muted-foreground">
                {currentClass?.startTime} - {currentClass?.endTime} • {currentClass?.room}
              </p>
            </div>
          ) : nextClass ? (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="status-indicator bg-warning"></div>
                <span className="text-sm font-medium text-warning">Next Class</span>
              </div>
              <h4 className="font-semibold text-foreground">{nextClass?.subject}</h4>
              <p className="text-sm text-muted-foreground">
                {nextClass?.startTime} - {nextClass?.endTime} • {nextClass?.room}
              </p>
            </div>
          ) : null}
        </div>
      )}
      {/* Schedule Timeline */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {scheduleData?.map((slot, index) => {
          const status = getTimeStatus(slot);
          return (
            <div
              key={index}
              className={`flex items-center space-x-4 p-3 rounded-md transition-colors duration-200 ${
                status === 'current' ? 'bg-success/10 border border-success/20' :
                status === 'upcoming'? 'bg-muted hover:bg-muted/80' : 'bg-muted/50 opacity-75'
              }`}
            >
              <div className="flex-shrink-0 text-center min-w-0">
                <div className="text-sm font-medium text-foreground">
                  {slot?.startTime}
                </div>
                <div className="text-xs text-muted-foreground">
                  {slot?.endTime}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {slot?.subject}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Grade {slot?.grade} • {slot?.room}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                  {status === 'current' ? 'Now' : 
                   status === 'upcoming' ? 'Upcoming' : 'Done'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {scheduleData?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No classes scheduled for today</p>
        </div>
      )}
    </div>
  );
};

export default TodaySchedulePanel;
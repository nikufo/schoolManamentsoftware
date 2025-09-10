import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ClassOverviewCard = ({ classData }) => {
  const navigate = useNavigate();

  const handleTakeAttendance = () => {
    navigate(`/attendance-tracking?class=${classData?.id}&action=take`);
  };

  const handleEnterGrades = () => {
    navigate(`/grade-management?class=${classData?.id}&action=entry`);
  };

  const handleViewRoster = () => {
    navigate(`/student-management?class=${classData?.id}`);
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'text-success';
    if (rate >= 75) return 'text-warning';
    return 'text-error';
  };

  const getPendingGradesColor = (count) => {
    if (count === 0) return 'text-success';
    if (count <= 5) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {classData?.subject}
          </h3>
          <p className="text-sm text-muted-foreground">
            Grade {classData?.grade} • {classData?.section}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {classData?.studentCount}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted rounded-md">
          <div className={`text-2xl font-bold ${getAttendanceColor(classData?.attendanceRate)}`}>
            {classData?.attendanceRate}%
          </div>
          <div className="text-xs text-muted-foreground">Attendance</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-md">
          <div className={`text-2xl font-bold ${getPendingGradesColor(classData?.pendingGrades)}`}>
            {classData?.pendingGrades}
          </div>
          <div className="text-xs text-muted-foreground">Pending Grades</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="default"
          size="sm"
          iconName="CheckSquare"
          iconPosition="left"
          onClick={handleTakeAttendance}
          className="flex-1"
        >
          Take Attendance
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="BookOpen"
          iconPosition="left"
          onClick={handleEnterGrades}
          className="flex-1"
        >
          Enter Grades
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Users"
          onClick={handleViewRoster}
          className="sm:w-auto"
        >
          Roster
        </Button>
      </div>
      {classData?.nextClass && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Next: {classData?.nextClass?.time} - {classData?.nextClass?.room}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassOverviewCard;
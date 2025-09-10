import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceHeader = ({ 
  selectedDate, 
  onDateChange, 
  selectedClass, 
  onClassChange, 
  classes, 
  userRole,
  onExportReport,
  onBulkAction 
}) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="CheckSquare" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attendance Tracking</h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Class Selector */}
          <select
            value={selectedClass}
            onChange={(e) => onClassChange(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-32"
          >
            <option value="">All Classes</option>
            {classes?.map(cls => (
              <option key={cls?.id} value={cls?.id}>{cls?.name}</option>
            ))}
          </select>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {userRole === 'admin' && (
              <Button
                variant="outline"
                iconName="Download"
                onClick={onExportReport}
                className="text-sm"
              >
                Export
              </Button>
            )}
            
            <Button
              variant="outline"
              iconName="Users"
              onClick={onBulkAction}
              className="text-sm"
            >
              Bulk Actions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeader;
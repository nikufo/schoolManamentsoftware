import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActionsModal = ({ 
  isOpen, 
  onClose, 
  students, 
  onBulkUpdate,
  selectedClass 
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('present');
  const [selectAll, setSelectAll] = useState(false);

  const attendanceOptions = [
    { value: 'present', label: 'Mark as Present', icon: 'CheckCircle', color: 'text-success' },
    { value: 'absent', label: 'Mark as Absent', icon: 'XCircle', color: 'text-error' },
    { value: 'late', label: 'Mark as Late', icon: 'Clock', color: 'text-warning' },
    { value: 'excused', label: 'Mark as Excused', icon: 'Shield', color: 'text-accent' }
  ];

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedStudents(students?.map(student => student?.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId, checked) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev?.filter(id => id !== studentId));
      setSelectAll(false);
    }
  };

  const handleBulkUpdate = () => {
    if (selectedStudents?.length > 0) {
      onBulkUpdate(selectedStudents, bulkStatus);
      onClose();
      setSelectedStudents([]);
      setSelectAll(false);
    }
  };

  const copyPreviousDay = () => {
    // Mock implementation - would copy attendance from previous school day
    const previousDayAttendance = students?.map(student => ({
      id: student?.id,
      status: student?.recentAttendance?.[0]?.status || 'present'
    }));
    
    onBulkUpdate(
      previousDayAttendance?.map(item => item?.id),
      null,
      previousDayAttendance
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card rounded-lg border border-border shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Bulk Attendance Actions</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={copyPreviousDay}
                className="justify-start"
                iconName="Copy"
              >
                Copy Previous Day
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedStudents(students?.map(s => s?.id));
                  setBulkStatus('present');
                }}
                className="justify-start"
                iconName="CheckCircle"
              >
                Mark All Present
              </Button>
            </div>
          </div>

          {/* Attendance Status Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Select Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {attendanceOptions?.map((option) => (
                <Button
                  key={option?.value}
                  variant={bulkStatus === option?.value ? "default" : "outline"}
                  onClick={() => setBulkStatus(option?.value)}
                  className="justify-start"
                  iconName={option?.icon}
                >
                  {option?.label?.replace('Mark as ', '')}
                </Button>
              ))}
            </div>
          </div>

          {/* Student Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Select Students</h3>
              <Checkbox
                label="Select All"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e?.target?.checked)}
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-md p-3">
              {students?.map((student) => (
                <div key={student?.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md">
                  <Checkbox
                    checked={selectedStudents?.includes(student?.id)}
                    onChange={(e) => handleStudentSelect(student?.id, e?.target?.checked)}
                  />
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {student?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{student?.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {student?.studentId}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current: {student?.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            {selectedStudents?.length} of {students?.length} students selected
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkUpdate}
            disabled={selectedStudents?.length === 0}
            iconName="Check"
          >
            Update Attendance ({selectedStudents?.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsModal;
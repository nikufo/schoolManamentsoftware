import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  scheduleData = null,
  mode = 'create' // 'create', 'edit', 'view'
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    grade: '',
    room: '',
    day: '',
    startTime: '',
    endTime: '',
    studentCount: '',
    notes: ''
  });

  const [conflicts, setConflicts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scheduleData && mode !== 'create') {
      setFormData({
        subject: scheduleData?.subject || '',
        teacher: scheduleData?.teacher || '',
        grade: scheduleData?.grade || '',
        room: scheduleData?.room || '',
        day: scheduleData?.day || '',
        startTime: scheduleData?.time || '',
        endTime: scheduleData?.endTime || '',
        studentCount: scheduleData?.studentCount?.toString() || '',
        notes: scheduleData?.notes || ''
      });
    } else {
      setFormData({
        subject: '',
        teacher: '',
        grade: '',
        room: '',
        day: '',
        startTime: '',
        endTime: '',
        studentCount: '',
        notes: ''
      });
    }
  }, [scheduleData, mode, isOpen]);

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'physical-education', label: 'Physical Education' },
    { value: 'art', label: 'Art' },
    { value: 'music', label: 'Music' },
    { value: 'computer-science', label: 'Computer Science' }
  ];

  const teacherOptions = [
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'michael-brown', label: 'Michael Brown' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'david-wilson', label: 'David Wilson' },
    { value: 'lisa-anderson', label: 'Lisa Anderson' },
    { value: 'james-taylor', label: 'James Taylor' },
    { value: 'maria-garcia', label: 'Maria Garcia' },
    { value: 'robert-martinez', label: 'Robert Martinez' }
  ];

  const gradeOptions = [
    { value: 'grade-1', label: 'Grade 1' },
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-3', label: 'Grade 3' },
    { value: 'grade-4', label: 'Grade 4' },
    { value: 'grade-5', label: 'Grade 5' },
    { value: 'grade-6', label: 'Grade 6' },
    { value: 'grade-7', label: 'Grade 7' },
    { value: 'grade-8', label: 'Grade 8' },
    { value: 'grade-9', label: 'Grade 9' },
    { value: 'grade-10', label: 'Grade 10' }
  ];

  const roomOptions = [
    { value: 'room-101', label: 'Room 101' },
    { value: 'room-102', label: 'Room 102' },
    { value: 'room-103', label: 'Room 103' },
    { value: 'room-201', label: 'Room 201' },
    { value: 'room-202', label: 'Room 202' },
    { value: 'lab-1', label: 'Science Lab 1' },
    { value: 'lab-2', label: 'Computer Lab' },
    { value: 'gym', label: 'Gymnasium' },
    { value: 'auditorium', label: 'Auditorium' }
  ];

  const dayOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' }
  ];

  const timeOptions = [
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Check for conflicts when key fields change
    if (['teacher', 'room', 'day', 'startTime', 'endTime']?.includes(field)) {
      checkConflicts({ ...formData, [field]: value });
    }
  };

  const checkConflicts = (data) => {
    // Mock conflict detection
    const mockConflicts = [];
    
    if (data?.teacher === 'sarah-johnson' && data?.day === 'Monday' && data?.startTime === '09:00') {
      mockConflicts?.push({
        type: 'teacher',
        message: 'Sarah Johnson is already scheduled for Grade 3 Math at this time'
      });
    }
    
    if (data?.room === 'room-101' && data?.day === 'Tuesday' && data?.startTime === '10:00') {
      mockConflicts?.push({
        type: 'room',
        message: 'Room 101 is already booked for Grade 5 English at this time'
      });
    }

    setConflicts(mockConflicts);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const scheduleItem = {
        id: scheduleData?.id || Date.now()?.toString(),
        subject: formData?.subject,
        teacher: teacherOptions?.find(t => t?.value === formData?.teacher)?.label || formData?.teacher,
        grade: gradeOptions?.find(g => g?.value === formData?.grade)?.label || formData?.grade,
        room: roomOptions?.find(r => r?.value === formData?.room)?.label || formData?.room,
        day: formData?.day,
        time: formData?.startTime,
        endTime: formData?.endTime,
        studentCount: parseInt(formData?.studentCount) || 0,
        notes: formData?.notes,
        hasConflict: conflicts?.length > 0
      };

      onSave(scheduleItem);
      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Class Schedule';
      case 'edit':
        return 'Edit Class Schedule';
      case 'view':
        return 'Class Schedule Details';
      default:
        return 'Class Schedule';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-card shadow-modal rounded-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {getModalTitle()}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Conflicts Alert */}
          {conflicts?.length > 0 && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-warning mb-2">Scheduling Conflicts Detected</h4>
                  <ul className="space-y-1">
                    {conflicts?.map((conflict, index) => (
                      <li key={index} className="text-sm text-warning">
                        • {conflict?.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Subject"
                options={subjectOptions}
                value={formData?.subject}
                onChange={(value) => handleInputChange('subject', value)}
                required
                disabled={mode === 'view'}
              />

              <Select
                label="Teacher"
                options={teacherOptions}
                value={formData?.teacher}
                onChange={(value) => handleInputChange('teacher', value)}
                required
                searchable
                disabled={mode === 'view'}
              />

              <Select
                label="Grade"
                options={gradeOptions}
                value={formData?.grade}
                onChange={(value) => handleInputChange('grade', value)}
                required
                disabled={mode === 'view'}
              />

              <Select
                label="Room"
                options={roomOptions}
                value={formData?.room}
                onChange={(value) => handleInputChange('room', value)}
                required
                searchable
                disabled={mode === 'view'}
              />

              <Select
                label="Day"
                options={dayOptions}
                value={formData?.day}
                onChange={(value) => handleInputChange('day', value)}
                required
                disabled={mode === 'view'}
              />

              <Input
                label="Student Count"
                type="number"
                value={formData?.studentCount}
                onChange={(e) => handleInputChange('studentCount', e?.target?.value)}
                placeholder="Enter number of students"
                min="1"
                max="50"
                disabled={mode === 'view'}
              />

              <Select
                label="Start Time"
                options={timeOptions}
                value={formData?.startTime}
                onChange={(value) => handleInputChange('startTime', value)}
                required
                disabled={mode === 'view'}
              />

              <Select
                label="End Time"
                options={timeOptions}
                value={formData?.endTime}
                onChange={(value) => handleInputChange('endTime', value)}
                required
                disabled={mode === 'view'}
              />
            </div>

            <Input
              label="Notes"
              type="text"
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Additional notes or requirements..."
              disabled={mode === 'view'}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            
            {mode !== 'view' && (
              <>
                {conflicts?.length > 0 && (
                  <Button
                    variant="warning"
                    onClick={handleSave}
                    loading={isLoading}
                    iconName="AlertTriangle"
                  >
                    Save with Conflicts
                  </Button>
                )}
                <Button
                  variant="default"
                  onClick={handleSave}
                  loading={isLoading}
                  disabled={conflicts?.length > 0}
                  iconName="Save"
                >
                  {mode === 'create' ? 'Create Schedule' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
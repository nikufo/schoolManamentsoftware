import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ScheduleFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  onViewModeChange,
  viewMode = 'week'
}) => {
  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
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

  const teacherOptions = [
    { value: 'all', label: 'All Teachers' },
    { value: 'sarah-johnson', label: 'Sarah Johnson' },
    { value: 'michael-brown', label: 'Michael Brown' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'david-wilson', label: 'David Wilson' },
    { value: 'lisa-anderson', label: 'Lisa Anderson' },
    { value: 'james-taylor', label: 'James Taylor' },
    { value: 'maria-garcia', label: 'Maria Garcia' },
    { value: 'robert-martinez', label: 'Robert Martinez' }
  ];

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'physical-education', label: 'Physical Education' },
    { value: 'art', label: 'Art' },
    { value: 'music', label: 'Music' },
    { value: 'computer-science', label: 'Computer Science' }
  ];

  const roomOptions = [
    { value: 'all', label: 'All Rooms' },
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

  const viewModeOptions = [
    { value: 'week', label: 'Week View' },
    { value: 'day', label: 'Day View' },
    { value: 'month', label: 'Month View' }
  ];

  const hasActiveFilters = () => {
    return Object.values(filters)?.some(value => value && value !== 'all');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Schedule Filters</h3>
        <div className="flex items-center space-x-2">
          <Select
            options={viewModeOptions}
            value={viewMode}
            onChange={onViewModeChange}
            className="w-32"
          />
          {hasActiveFilters() && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Grade Filter */}
        <Select
          label="Grade Level"
          options={gradeOptions}
          value={filters?.grade || 'all'}
          onChange={(value) => onFilterChange('grade', value)}
          searchable
        />

        {/* Teacher Filter */}
        <Select
          label="Teacher"
          options={teacherOptions}
          value={filters?.teacher || 'all'}
          onChange={(value) => onFilterChange('teacher', value)}
          searchable
        />

        {/* Subject Filter */}
        <Select
          label="Subject"
          options={subjectOptions}
          value={filters?.subject || 'all'}
          onChange={(value) => onFilterChange('subject', value)}
          searchable
        />

        {/* Room Filter */}
        <Select
          label="Room"
          options={roomOptions}
          value={filters?.room || 'all'}
          onChange={(value) => onFilterChange('room', value)}
          searchable
        />

        {/* Search Filter */}
        <Input
          label="Search"
          type="search"
          placeholder="Search schedules..."
          value={filters?.search || ''}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />
      </div>
      {/* Quick Filter Buttons */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
        <span className="text-sm font-medium text-muted-foreground mr-2">Quick Filters:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange('conflicts', true)}
          iconName="AlertTriangle"
          className="text-warning border-warning hover:bg-warning/10"
        >
          Show Conflicts
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange('today', true)}
          iconName="Calendar"
        >
          Today's Classes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFilterChange('available', true)}
          iconName="Clock"
        >
          Available Slots
        </Button>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
            {Object.entries(filters)?.map(([key, value]) => {
              if (!value || value === 'all') return null;
              
              const getFilterLabel = (key, value) => {
                switch (key) {
                  case 'grade':
                    return gradeOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'teacher':
                    return teacherOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'subject':
                    return subjectOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'room':
                    return roomOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'search':
                    return `"${value}"`;
                  default:
                    return value;
                }
              };

              return (
                <div
                  key={key}
                  className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                >
                  <span>{getFilterLabel(key, value)}</span>
                  <button
                    onClick={() => onFilterChange(key, key === 'search' ? '' : 'all')}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleFilters;
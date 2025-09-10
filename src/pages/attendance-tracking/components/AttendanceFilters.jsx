import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AttendanceFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  gradeFilter,
  onGradeFilterChange,
  attendanceRateFilter,
  onAttendanceRateFilterChange,
  onClearFilters,
  userRole 
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];

  const gradeOptions = [
    { value: '', label: 'All Grades' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  const attendanceRateOptions = [
    { value: '', label: 'All Rates' },
    { value: 'excellent', label: '95%+ (Excellent)' },
    { value: 'good', label: '85-94% (Good)' },
    { value: 'fair', label: '75-84% (Fair)' },
    { value: 'poor', label: 'Below 75% (Poor)' }
  ];

  const hasActiveFilters = searchTerm || statusFilter || gradeFilter || attendanceRateFilter;

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Input
            type="search"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grade Filter */}
        {userRole === 'admin' && (
          <div className="space-y-2">
            <select
              value={gradeFilter}
              onChange={(e) => onGradeFilterChange(e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {gradeOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Attendance Rate Filter */}
        <div className="space-y-2">
          <select
            value={attendanceRateFilter}
            onChange={(e) => onAttendanceRateFilterChange(e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {attendanceRateOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                <Icon name="Search" size={12} />
                <span>Search: {searchTerm}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchChange('')}
                  className="w-4 h-4 p-0 hover:bg-primary/20"
                >
                  <Icon name="X" size={10} />
                </Button>
              </div>
            )}

            {statusFilter && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                <Icon name="Filter" size={12} />
                <span>Status: {statusOptions?.find(opt => opt?.value === statusFilter)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStatusFilterChange('')}
                  className="w-4 h-4 p-0 hover:bg-accent/20"
                >
                  <Icon name="X" size={10} />
                </Button>
              </div>
            )}

            {gradeFilter && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
                <Icon name="GraduationCap" size={12} />
                <span>Grade: {gradeFilter}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onGradeFilterChange('')}
                  className="w-4 h-4 p-0 hover:bg-success/20"
                >
                  <Icon name="X" size={10} />
                </Button>
              </div>
            )}

            {attendanceRateFilter && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
                <Icon name="TrendingUp" size={12} />
                <span>Rate: {attendanceRateOptions?.find(opt => opt?.value === attendanceRateFilter)?.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAttendanceRateFilterChange('')}
                  className="w-4 h-4 p-0 hover:bg-warning/20"
                >
                  <Icon name="X" size={10} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceFilters;
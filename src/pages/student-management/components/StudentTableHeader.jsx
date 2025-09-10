import React from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StudentTableHeader = ({ 
  searchQuery, 
  onSearchChange, 
  selectedGrade, 
  onGradeChange, 
  selectedStatus, 
  onStatusChange, 
  selectedClass, 
  onClassChange,
  onAddStudent,
  onBulkAction,
  selectedCount,
  totalCount,
  showAdvancedSearch,
  onToggleAdvancedSearch
}) => {
  const gradeOptions = [
    { value: 'all', label: 'All Grades' },
    { value: 'kindergarten', label: 'Kindergarten' },
    { value: 'grade-1', label: 'Grade 1' },
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-3', label: 'Grade 3' },
    { value: 'grade-4', label: 'Grade 4' },
    { value: 'grade-5', label: 'Grade 5' },
    { value: 'grade-6', label: 'Grade 6' },
    { value: 'grade-7', label: 'Grade 7' },
    { value: 'grade-8', label: 'Grade 8' },
    { value: 'grade-9', label: 'Grade 9' },
    { value: 'grade-10', label: 'Grade 10' },
    { value: 'grade-11', label: 'Grade 11' },
    { value: 'grade-12', label: 'Grade 12' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'graduated', label: 'Graduated' }
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    { value: 'section-a', label: 'Section A' },
    { value: 'section-b', label: 'Section B' },
    { value: 'section-c', label: 'Section C' },
    { value: 'section-d', label: 'Section D' }
  ];

  const bulkActions = [
    { value: 'activate', label: 'Activate Students' },
    { value: 'deactivate', label: 'Deactivate Students' },
    { value: 'export', label: 'Export Selected' },
    { value: 'send-notification', label: 'Send Notification' },
    { value: 'update-grade', label: 'Update Grade Level' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">Student Management</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Total: {totalCount}</span>
            {selectedCount > 0 && (
              <span className="text-primary">• {selectedCount} selected</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            iconName="Filter"
            onClick={onToggleAdvancedSearch}
            className={showAdvancedSearch ? 'bg-primary/10 text-primary' : ''}
          >
            Filters
          </Button>
          
          {selectedCount > 0 && (
            <Select
              placeholder="Bulk Actions"
              options={bulkActions}
              value=""
              onChange={(value) => onBulkAction(value)}
              className="w-40"
            />
          )}
          
          <Button
            variant="default"
            iconName="UserPlus"
            onClick={onAddStudent}
          >
            Add Student
          </Button>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Primary Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by name, student ID, or parent contact..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-3">
            <Select
              placeholder="Grade Level"
              options={gradeOptions}
              value={selectedGrade}
              onChange={onGradeChange}
              className="w-36"
            />
            
            <Select
              placeholder="Status"
              options={statusOptions}
              value={selectedStatus}
              onChange={onStatusChange}
              className="w-32"
            />
            
            <Select
              placeholder="Class"
              options={classOptions}
              value={selectedClass}
              onChange={onClassChange}
              className="w-32"
            />
          </div>
        </div>

        {/* Advanced Search */}
        {showAdvancedSearch && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Student ID"
                placeholder="Enter student ID"
                className="w-full"
              />
              
              <Input
                label="Parent Name"
                placeholder="Enter parent name"
                className="w-full"
              />
              
              <Input
                label="Date of Birth"
                type="date"
                className="w-full"
              />
              
              <Select
                label="Gender"
                placeholder="Select gender"
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' }
                ]}
                value=""
                onChange={() => {}}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button variant="outline" size="sm">
                Clear Filters
              </Button>
              <Button variant="default" size="sm">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTableHeader;
import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GradeBookGrid = ({ 
  students = [], 
  assignments = [], 
  grades = {}, 
  onGradeUpdate,
  userRole = 'teacher',
  selectedClass = null 
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [tempGrade, setTempGrade] = useState('');
  const [viewMode, setViewMode] = useState('percentage');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const viewModeOptions = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'points', label: 'Points' },
    { value: 'letter', label: 'Letter Grade' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'homework', label: 'Homework' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'test', label: 'Tests' },
    { value: 'project', label: 'Projects' }
  ];

  const filteredAssignments = selectedCategory === 'all' 
    ? assignments 
    : assignments?.filter(assignment => assignment?.category === selectedCategory);

  const calculateGrade = (studentId, assignmentId) => {
    const gradeKey = `${studentId}-${assignmentId}`;
    const gradeData = grades?.[gradeKey];
    
    if (!gradeData) return null;
    
    const assignment = assignments?.find(a => a?.id === assignmentId);
    if (!assignment) return null;

    switch (viewMode) {
      case 'percentage':
        return `${Math.round((gradeData?.points / assignment?.totalPoints) * 100)}%`;
      case 'points':
        return `${gradeData?.points}/${assignment?.totalPoints}`;
      case 'letter':
        const percentage = (gradeData?.points / assignment?.totalPoints) * 100;
        return getLetterGrade(percentage);
      default:
        return gradeData?.points;
    }
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = assignments?.map(assignment => {
      const gradeKey = `${studentId}-${assignment?.id}`;
      const gradeData = grades?.[gradeKey];
      return gradeData ? (gradeData?.points / assignment?.totalPoints) * 100 : null;
    })?.filter(grade => grade !== null);

    if (studentGrades?.length === 0) return 'N/A';
    
    const average = studentGrades?.reduce((sum, grade) => sum + grade, 0) / studentGrades?.length;
    return `${Math.round(average)}%`;
  };

  const handleCellClick = (studentId, assignmentId) => {
    if (userRole !== 'teacher') return;
    
    setEditingCell(`${studentId}-${assignmentId}`);
    const gradeKey = `${studentId}-${assignmentId}`;
    const currentGrade = grades?.[gradeKey];
    setTempGrade(currentGrade ? currentGrade?.points?.toString() : '');
  };

  const handleGradeSave = () => {
    if (!editingCell || !tempGrade?.trim()) return;
    
    const [studentId, assignmentId] = editingCell?.split('-');
    const assignment = assignments?.find(a => a?.id === assignmentId);
    const points = parseFloat(tempGrade);
    
    if (isNaN(points) || points < 0 || points > assignment?.totalPoints) {
      alert(`Grade must be between 0 and ${assignment?.totalPoints}`);
      return;
    }

    if (onGradeUpdate) {
      onGradeUpdate(studentId, assignmentId, {
        points,
        percentage: (points / assignment?.totalPoints) * 100,
        letterGrade: getLetterGrade((points / assignment?.totalPoints) * 100),
        lastUpdated: new Date()?.toISOString()
      });
    }

    setEditingCell(null);
    setTempGrade('');
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleGradeSave();
    } else if (e?.key === 'Escape') {
      setEditingCell(null);
      setTempGrade('');
    }
  };

  const getCellClassName = (studentId, assignmentId) => {
    const gradeKey = `${studentId}-${assignmentId}`;
    const gradeData = grades?.[gradeKey];
    const isEditing = editingCell === gradeKey;
    
    let baseClass = "min-w-20 h-10 text-center text-sm border border-border cursor-pointer hover:bg-muted transition-colors duration-200";
    
    if (isEditing) {
      baseClass += " bg-primary/10 border-primary";
    } else if (!gradeData) {
      baseClass += " bg-muted/50 text-muted-foreground";
    } else {
      const percentage = (gradeData?.points / assignments?.find(a => a?.id === assignmentId)?.totalPoints) * 100;
      if (percentage >= 90) baseClass += " bg-success/10 text-success";
      else if (percentage >= 80) baseClass += " bg-accent/10 text-accent";
      else if (percentage >= 70) baseClass += " bg-warning/10 text-warning";
      else if (percentage >= 60) baseClass += " bg-orange-100 text-orange-700";
      else baseClass += " bg-error/10 text-error";
    }
    
    return baseClass;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header Controls */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">Grade Book</h3>
            {selectedClass && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {selectedClass?.name}
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="w-full sm:w-48"
            />
            <Select
              options={viewModeOptions}
              value={viewMode}
              onChange={setViewMode}
              className="w-full sm:w-40"
            />
          </div>
        </div>
      </div>
      {/* Grade Book Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="flex bg-muted/50 border-b border-border sticky top-0 z-10">
            <div className="min-w-48 p-3 font-semibold text-foreground border-r border-border">
              Student Name
            </div>
            {filteredAssignments?.map((assignment) => (
              <div
                key={assignment?.id}
                className="min-w-20 p-2 text-center border-r border-border"
              >
                <div className="font-medium text-xs text-foreground truncate" title={assignment?.name}>
                  {assignment?.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {assignment?.totalPoints}pts
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(assignment.dueDate)?.toLocaleDateString()}
                </div>
              </div>
            ))}
            <div className="min-w-24 p-3 font-semibold text-center text-foreground">
              Average
            </div>
          </div>

          {/* Student Rows */}
          {students?.map((student) => (
            <div key={student?.id} className="flex border-b border-border hover:bg-muted/30 transition-colors duration-200">
              <div className="min-w-48 p-3 border-r border-border">
                <div className="font-medium text-foreground">{student?.name}</div>
                <div className="text-sm text-muted-foreground">{student?.studentId}</div>
              </div>
              
              {filteredAssignments?.map((assignment) => {
                const cellKey = `${student?.id}-${assignment?.id}`;
                const isEditing = editingCell === cellKey;
                
                return (
                  <div
                    key={assignment?.id}
                    className={getCellClassName(student?.id, assignment?.id)}
                    onClick={() => handleCellClick(student?.id, assignment?.id)}
                  >
                    {isEditing ? (
                      <Input
                        type="number"
                        value={tempGrade}
                        onChange={(e) => setTempGrade(e?.target?.value)}
                        onKeyDown={handleKeyPress}
                        onBlur={handleGradeSave}
                        className="w-full h-full text-center border-0 bg-transparent p-1"
                        autoFocus
                        min="0"
                        max={assignment?.totalPoints}
                        step="0.1"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        {calculateGrade(student?.id, assignment?.id) || '-'}
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="min-w-24 p-3 text-center font-medium border-l border-border">
                <span className="text-foreground">
                  {calculateStudentAverage(student?.id)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer Stats */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>Total Students: {students?.length}</span>
            <span>Assignments: {filteredAssignments?.length}</span>
            <span>Completion Rate: 85%</span>
          </div>
          
          {userRole === 'teacher' && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="Download">
                Export
              </Button>
              <Button variant="outline" size="sm" iconName="Upload">
                Import
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeBookGrid;
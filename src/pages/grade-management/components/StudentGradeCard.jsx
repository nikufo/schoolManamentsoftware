import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudentGradeCard = ({ 
  student, 
  assignments = [], 
  grades = {},
  onGradeUpdate,
  userRole = 'teacher' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const calculateStudentStats = () => {
    const studentGrades = assignments?.map(assignment => {
      const gradeKey = `${student?.id}-${assignment?.id}`;
      const gradeData = grades?.[gradeKey];
      return gradeData ? (gradeData?.points / assignment?.totalPoints) * 100 : null;
    })?.filter(grade => grade !== null);

    if (studentGrades?.length === 0) {
      return {
        average: 0,
        letterGrade: 'N/A',
        completed: 0,
        total: assignments?.length,
        trend: 'neutral'
      };
    }

    const average = studentGrades?.reduce((sum, grade) => sum + grade, 0) / studentGrades?.length;
    const letterGrade = getLetterGrade(average);
    
    // Calculate trend (mock calculation)
    const recentGrades = studentGrades?.slice(-3);
    const olderGrades = studentGrades?.slice(0, -3);
    const recentAvg = recentGrades?.length > 0 ? recentGrades?.reduce((sum, grade) => sum + grade, 0) / recentGrades?.length : average;
    const olderAvg = olderGrades?.length > 0 ? olderGrades?.reduce((sum, grade) => sum + grade, 0) / olderGrades?.length : average;
    
    let trend = 'neutral';
    if (recentAvg > olderAvg + 2) trend = 'up';
    else if (recentAvg < olderAvg - 2) trend = 'down';

    return {
      average: Math.round(average),
      letterGrade,
      completed: studentGrades?.length,
      total: assignments?.length,
      trend
    };
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    if (grade === 'A') return 'text-success';
    if (grade === 'B') return 'text-accent';
    if (grade === 'C') return 'text-warning';
    if (grade === 'D') return 'text-orange-600';
    if (grade === 'F') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return { name: 'TrendingUp', color: 'text-success' };
    if (trend === 'down') return { name: 'TrendingDown', color: 'text-error' };
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const getAssignmentGrade = (assignmentId) => {
    const gradeKey = `${student?.id}-${assignmentId}`;
    const gradeData = grades?.[gradeKey];
    const assignment = assignments?.find(a => a?.id === assignmentId);
    
    if (!gradeData || !assignment) return null;
    
    return {
      points: gradeData?.points,
      total: assignment?.totalPoints,
      percentage: Math.round((gradeData?.points / assignment?.totalPoints) * 100),
      letterGrade: getLetterGrade((gradeData?.points / assignment?.totalPoints) * 100)
    };
  };

  const getMissingAssignments = () => {
    return assignments?.filter(assignment => {
      const gradeKey = `${student?.id}-${assignment?.id}`;
      return !grades?.[gradeKey];
    });
  };

  const stats = calculateStudentStats();
  const trendIcon = getTrendIcon(stats?.trend);
  const missingAssignments = getMissingAssignments();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-card transition-shadow duration-200">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{student?.name}</h4>
              <p className="text-sm text-muted-foreground">{student?.studentId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${getGradeColor(stats?.letterGrade)}`}>
                  {stats?.letterGrade}
                </span>
                <Icon 
                  name={trendIcon?.name} 
                  size={16} 
                  className={trendIcon?.color} 
                />
              </div>
              <p className="text-sm text-muted-foreground">{stats?.average}%</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="p-4 bg-muted/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="font-medium text-foreground">
              {stats?.completed}/{stats?.total}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Missing</p>
            <p className={`font-medium ${missingAssignments?.length > 0 ? 'text-error' : 'text-success'}`}>
              {missingAssignments?.length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trend</p>
            <div className="flex items-center justify-center">
              <Icon 
                name={trendIcon?.name} 
                size={16} 
                className={trendIcon?.color} 
              />
            </div>
          </div>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Assignment Grades */}
          <div className="p-4">
            <h5 className="font-medium text-foreground mb-3">Assignment Grades</h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {assignments?.map((assignment) => {
                const grade = getAssignmentGrade(assignment?.id);
                const isMissing = !grade;
                
                return (
                  <div
                    key={assignment?.id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      isMissing ? 'bg-error/10' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {assignment?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {assignment?.category} • {assignment?.totalPoints} pts
                      </p>
                    </div>
                    <div className="text-right">
                      {isMissing ? (
                        <span className="text-sm font-medium text-error">Missing</span>
                      ) : (
                        <div>
                          <span className={`text-sm font-medium ${getGradeColor(grade?.letterGrade)}`}>
                            {grade?.letterGrade}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {grade?.points}/{grade?.total}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Assignments Alert */}
          {missingAssignments?.length > 0 && (
            <div className="p-4 bg-error/10 border-t border-border">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-error">
                    {missingAssignments?.length} Missing Assignment{missingAssignments?.length > 1 ? 's' : ''}
                  </p>
                  <div className="mt-1 space-y-1">
                    {missingAssignments?.slice(0, 3)?.map((assignment) => (
                      <p key={assignment?.id} className="text-xs text-error/80">
                        • {assignment?.name} (Due: {new Date(assignment.dueDate)?.toLocaleDateString()})
                      </p>
                    ))}
                    {missingAssignments?.length > 3 && (
                      <p className="text-xs text-error/80">
                        • And {missingAssignments?.length - 3} more...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageSquare"
                  onClick={() => navigate(`/student-management?student=${student?.id}`)}
                >
                  Contact Parent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  onClick={() => navigate(`/reports?student=${student?.id}`)}
                >
                  Progress Report
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                onClick={() => navigate(`/student-management?student=${student?.id}`)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGradeCard;
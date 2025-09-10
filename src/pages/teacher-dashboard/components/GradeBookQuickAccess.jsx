import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GradeBookQuickAccess = ({ gradeBookData }) => {
  const navigate = useNavigate();

  const handleViewGradeBook = () => {
    navigate('/grade-management');
  };

  const handleQuickGradeEntry = (classId) => {
    navigate(`/grade-management?class=${classId}&action=entry`);
  };

  const getGradeDistributionColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const calculateAverageGrade = (grades) => {
    if (!grades || grades?.length === 0) return 0;
    const sum = grades?.reduce((acc, grade) => acc + grade?.score, 0);
    return Math.round(sum / grades?.length);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Grade Book</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="BookOpen"
          onClick={handleViewGradeBook}
        >
          View All
        </Button>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted rounded-md">
          <div className="text-2xl font-bold text-foreground">
            {gradeBookData?.totalAssignments}
          </div>
          <div className="text-xs text-muted-foreground">Total Assignments</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-md">
          <div className="text-2xl font-bold text-warning">
            {gradeBookData?.pendingGrades}
          </div>
          <div className="text-xs text-muted-foreground">Pending Grades</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-md">
          <div className="text-2xl font-bold text-success">
            {gradeBookData?.averageGrade}%
          </div>
          <div className="text-xs text-muted-foreground">Class Average</div>
        </div>
      </div>
      {/* Recent Assignments */}
      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-semibold text-foreground">Recent Assignments</h4>
        {gradeBookData?.recentAssignments?.map((assignment) => (
          <div
            key={assignment?.id}
            className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors duration-200"
          >
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-foreground truncate">
                {assignment?.title}
              </h5>
              <p className="text-sm text-muted-foreground">
                {assignment?.subject} • Due: {assignment?.dueDate}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 ml-4">
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">
                  {assignment?.gradedCount}/{assignment?.totalSubmissions}
                </div>
                <div className="text-xs text-muted-foreground">Graded</div>
              </div>
              
              {assignment?.gradedCount < assignment?.totalSubmissions && (
                <Button
                  variant="outline"
                  size="xs"
                  iconName="Edit"
                  onClick={() => handleQuickGradeEntry(assignment?.classId)}
                >
                  Grade
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Grade Distribution */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Grade Distribution</h4>
        {gradeBookData?.gradeDistribution?.map((grade) => (
          <div key={grade?.range} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">{grade?.range}</span>
              <span className="text-muted-foreground">{grade?.count} students</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getGradeDistributionColor(grade?.percentage)}`}
                style={{ width: `${grade?.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      {/* Missing Assignments Alert */}
      {gradeBookData?.missingAssignments > 0 && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">
              {gradeBookData?.missingAssignments} assignments need attention
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Some students have missing or late submissions
          </p>
        </div>
      )}
    </div>
  );
};

export default GradeBookQuickAccess;
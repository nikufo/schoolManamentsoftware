import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';

const GradeAnalytics = ({ 
  students = [], 
  assignments = [], 
  grades = {},
  selectedClass = null 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const periodOptions = [
    { value: 'current', label: 'Current Semester' },
    { value: 'quarter1', label: 'Quarter 1' },
    { value: 'quarter2', label: 'Quarter 2' },
    { value: 'quarter3', label: 'Quarter 3' },
    { value: 'quarter4', label: 'Quarter 4' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'distribution', label: 'Grade Distribution', icon: 'PieChart' },
    { id: 'trends', label: 'Trends', icon: 'TrendingUp' },
    { id: 'performance', label: 'Performance', icon: 'Target' }
  ];

  // Calculate analytics data
  const calculateClassStats = () => {
    const allGrades = Object.values(grades)?.map(grade => grade?.percentage)?.filter(Boolean);
    
    if (allGrades?.length === 0) {
      return {
        average: 0,
        median: 0,
        highest: 0,
        lowest: 0,
        totalAssignments: assignments?.length,
        completionRate: 0
      };
    }

    const sorted = [...allGrades]?.sort((a, b) => a - b);
    const average = allGrades?.reduce((sum, grade) => sum + grade, 0) / allGrades?.length;
    const median = sorted?.length % 2 === 0 
      ? (sorted?.[sorted?.length / 2 - 1] + sorted?.[sorted?.length / 2]) / 2
      : sorted?.[Math.floor(sorted?.length / 2)];

    return {
      average: Math.round(average),
      median: Math.round(median),
      highest: Math.round(Math.max(...allGrades)),
      lowest: Math.round(Math.min(...allGrades)),
      totalAssignments: assignments?.length,
      completionRate: Math.round((Object.keys(grades)?.length / (students?.length * assignments?.length)) * 100)
    };
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    Object.values(grades)?.forEach(grade => {
      if (grade?.percentage >= 90) distribution.A++;
      else if (grade?.percentage >= 80) distribution.B++;
      else if (grade?.percentage >= 70) distribution.C++;
      else if (grade?.percentage >= 60) distribution.D++;
      else distribution.F++;
    });

    return [
      { name: 'A (90-100%)', value: distribution?.A, color: '#059669' },
      { name: 'B (80-89%)', value: distribution?.B, color: '#F59E0B' },
      { name: 'C (70-79%)', value: distribution?.C, color: '#3B82F6' },
      { name: 'D (60-69%)', value: distribution?.D, color: '#F97316' },
      { name: 'F (0-59%)', value: distribution?.F, color: '#DC2626' }
    ];
  };

  const getAssignmentPerformance = () => {
    return assignments?.map(assignment => {
      const assignmentGrades = students?.map(student => {
        const gradeKey = `${student?.id}-${assignment?.id}`;
        return grades?.[gradeKey]?.percentage || 0;
      })?.filter(grade => grade > 0);

      const average = assignmentGrades?.length > 0 
        ? assignmentGrades?.reduce((sum, grade) => sum + grade, 0) / assignmentGrades?.length
        : 0;

      return {
        name: assignment?.name?.length > 15 ? assignment?.name?.substring(0, 15) + '...' : assignment?.name,
        fullName: assignment?.name,
        average: Math.round(average),
        category: assignment?.category,
        totalPoints: assignment?.totalPoints,
        submissions: assignmentGrades?.length
      };
    });
  };

  const getTrendData = () => {
    // Mock trend data - in real app, calculate from historical grades
    return [
      { week: 'Week 1', average: 78, submissions: 42 },
      { week: 'Week 2', average: 82, submissions: 44 },
      { week: 'Week 3', average: 79, submissions: 43 },
      { week: 'Week 4', average: 85, submissions: 45 },
      { week: 'Week 5', average: 83, submissions: 44 },
      { week: 'Week 6', average: 87, submissions: 45 }
    ];
  };

  const stats = calculateClassStats();
  const distributionData = getGradeDistribution();
  const performanceData = getAssignmentPerformance();
  const trendData = getTrendData();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Class Average</p>
              <p className="text-2xl font-bold text-foreground">{stats?.average}%</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold text-foreground">{stats?.completionRate}%</p>
            </div>
            <div className="p-2 bg-success/10 rounded-lg">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalAssignments}</p>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg">
              <Icon name="BookOpen" size={20} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Students</p>
              <p className="text-2xl font-bold text-foreground">{students?.length}</p>
            </div>
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Icon name="Users" size={20} className="text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Performance Chart */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4">Assignment Performance</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `${value}%`,
                  name === 'average' ? 'Class Average' : name
                ]}
                labelFormatter={(label) => {
                  const assignment = performanceData?.find(a => a?.name === label);
                  return assignment ? assignment?.fullName : label;
                }}
              />
              <Bar 
                dataKey="average" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDistribution = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Grade Distribution</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value, percent }) => 
                    value > 0 ? `${name?.split(' ')?.[0]}: ${(percent * 100)?.toFixed(0)}%` : ''
                  }
                >
                  {distributionData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Stats */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Distribution Details</h4>
          <div className="space-y-4">
            {distributionData?.map((item) => (
              <div key={item?.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-foreground">{item?.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-foreground">{item?.value}</span>
                  <span className="text-muted-foreground ml-1">students</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Median Grade:</span>
                <span className="font-medium text-foreground ml-2">{stats?.median}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Range:</span>
                <span className="font-medium text-foreground ml-2">
                  {stats?.lowest}% - {stats?.highest}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h4 className="text-lg font-semibold text-foreground mb-4">Performance Trends</h4>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="week" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              name="Class Average"
            />
            <Line 
              type="monotone" 
              dataKey="submissions" 
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 3 }}
              name="Submissions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Top Performers</h4>
          <div className="space-y-3">
            {students?.slice(0, 5)?.map((student, index) => (
              <div key={student?.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">#{index + 1}</span>
                  </div>
                  <span className="text-foreground">{student?.name}</span>
                </div>
                <span className="font-medium text-success">
                  {Math.floor(Math.random() * 10) + 90}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Needs Attention</h4>
          <div className="space-y-3">
            {students?.slice(5, 10)?.map((student, index) => (
              <div key={student?.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                    <Icon name="AlertTriangle" size={16} className="text-warning" />
                  </div>
                  <span className="text-foreground">{student?.name}</span>
                </div>
                <span className="font-medium text-warning">
                  {Math.floor(Math.random() * 20) + 60}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'distribution':
        return renderDistribution();
      case 'trends':
        return renderTrends();
      case 'performance':
        return renderPerformance();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Grade Analytics</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive analysis of class performance and trends
            </p>
          </div>
          
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            className="w-full sm:w-48"
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6" aria-label="Analytics tabs">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GradeAnalytics;
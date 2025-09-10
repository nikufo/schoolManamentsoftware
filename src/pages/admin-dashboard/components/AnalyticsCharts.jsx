import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsCharts = ({ className = '' }) => {
  const enrollmentData = [
    { month: 'Jan', students: 1200, staff: 85 },
    { month: 'Feb', students: 1250, staff: 87 },
    { month: 'Mar', students: 1280, staff: 89 },
    { month: 'Apr', students: 1320, staff: 92 },
    { month: 'May', students: 1350, staff: 94 },
    { month: 'Jun', students: 1380, staff: 96 }
  ];

  const attendanceData = [
    { day: 'Mon', rate: 95 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 88 },
    { day: 'Thu', rate: 94 },
    { day: 'Fri', rate: 89 },
    { day: 'Sat', rate: 85 }
  ];

  const gradeDistribution = [
    { grade: 'A+', count: 180, color: '#059669' },
    { grade: 'A', count: 220, color: '#10B981' },
    { grade: 'B+', count: 280, color: '#F59E0B' },
    { grade: 'B', count: 190, color: '#EF4444' },
    { grade: 'C+', count: 120, color: '#8B5CF6' },
    { grade: 'C', count: 80, color: '#6B7280' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span style={{ color: entry?.color }}>{entry?.dataKey}: </span>
              {entry?.value}
              {entry?.dataKey === 'rate' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enrollment Trends */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Enrollment Trends</h3>
            <p className="text-sm text-muted-foreground">Student and staff growth over time</p>
          </div>
          <Icon name="TrendingUp" size={20} className="text-success" />
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrollmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="staff" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Students</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-sm text-muted-foreground">Staff</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Patterns */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Weekly Attendance</h3>
              <p className="text-sm text-muted-foreground">Average attendance rates</p>
            </div>
            <Icon name="CheckSquare" size={20} className="text-warning" />
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  domain={[80, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="var(--color-warning)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-warning)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Grade Distribution</h3>
              <p className="text-sm text-muted-foreground">Current semester performance</p>
            </div>
            <Icon name="PieChart" size={20} className="text-success" />
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {gradeDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [value, props?.payload?.grade]}
                  labelFormatter={() => 'Grade'}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {gradeDistribution?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {item?.grade}: {item?.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
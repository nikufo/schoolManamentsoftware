import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const AttendanceChart = ({ data, chartType = 'line', title, className = '' }) => {
  const formatTooltip = (value, name) => {
    if (name === 'attendanceRate') {
      return [`${value}%`, 'Attendance Rate'];
    }
    return [value, name];
  };

  const formatYAxisTick = (value) => {
    return `${value}%`;
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatYAxisTick}
            />
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Bar 
              dataKey="attendanceRate" 
              fill="var(--color-primary)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            tickFormatter={formatYAxisTick}
          />
          <Tooltip 
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-popover-foreground)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="attendanceRate" 
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Icon name="TrendingUp" size={20} className="text-primary" />
      </div>
      
      <div className="w-full h-64" aria-label={`${title} Chart`}>
        {renderChart()}
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span>Attendance Rate</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
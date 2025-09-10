import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { schoolService } from '../../services/schoolService';
import Header from '../../components/ui/Header';
import RoleSidebar from '../../components/ui/RoleSidebar';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import MetricCard from './components/MetricCard';
import QuickActionsGrid from './components/QuickActionsGrid';
import RecentActivityFeed from './components/RecentActivityFeed';
import UpcomingEventsPanel from './components/UpcomingEventsPanel';
import AnalyticsCharts from './components/AnalyticsCharts';
import Icon from '../../components/AppIcon';

const AdminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    attendanceRate: '0.0%',
    academicPerformance: '0.0%'
  });
  const [loading, setLoading] = useState(true);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const { success, data, error } = await schoolService?.getDashboardStats();
      
      if (success && data) {
        setDashboardStats(data);
      } else if (error) {
        console.log('Dashboard stats error:', error);
      }
    } catch (error) {
      console.log('Dashboard stats exception:', error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.log('Logout error:', error);
      navigate('/login');
    }
  };

  const handleMetricClick = (metric) => {
    switch (metric) {
      case 'students': navigate('/student-management');
        break;
      case 'attendance': navigate('/attendance-tracking');
        break;
      case 'grades': navigate('/grade-management');
        break;
      default:
        break;
    }
  };

  // Preview mode fallback for unauthenticated users
  const displayName = userProfile?.full_name || user?.email || 'Preview User';
  const userRole = userProfile?.role || 'admin';

  const dashboardMetrics = [
    {
      title: 'Total Students',
      value: loading ? '...' : dashboardStats?.totalStudents?.toString() || '0',
      change: '+12',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary',
      description: 'Active enrollments',
      onClick: () => handleMetricClick('students')
    },
    {
      title: 'Staff Members',
      value: loading ? '...' : dashboardStats?.totalTeachers?.toString() || '0',
      change: '+3',
      changeType: 'positive',
      icon: 'UserCheck',
      color: 'success',
      description: 'Teaching & non-teaching'
    },
    {
      title: 'Attendance Rate',
      value: loading ? '...' : dashboardStats?.attendanceRate || '0.0%',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'CheckSquare',
      color: 'warning',
      description: 'This week average',
      onClick: () => handleMetricClick('attendance')
    },
    {
      title: 'Academic Performance',
      value: loading ? '...' : dashboardStats?.academicPerformance || '0.0%',
      change: '+4.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'accent',
      description: 'Overall GPA average',
      onClick: () => handleMetricClick('grades')
    }
  ];

  // Show preview mode banner for non-authenticated users
  const showPreviewBanner = !user;

  return (
    <div className="min-h-screen bg-background">
      {showPreviewBanner && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <Icon name="Eye" size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">
                Preview Mode - Sign in to access full functionality
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      <Header 
        userRole={userRole} 
        userName={displayName}
        onLogout={handleLogout}
      />
      <RoleSidebar 
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-72'
      } pb-20 md:pb-6`}>
        <div className="p-6 max-w-7xl mx-auto">
          <NavigationBreadcrumb />
          
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {displayName}. Here&rsquo;s what&rsquo;s happening at SchoolSync Pro today.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>
                    {currentTime?.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success font-medium">System Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardMetrics?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
                description={metric?.description}
                onClick={metric?.onClick}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActionsGrid />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentActivityFeed />
            </div>

            {/* Upcoming Events & Pending Approvals - Takes 1 column */}
            <div className="lg:col-span-1">
              <UpcomingEventsPanel />
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="mb-8">
            <AnalyticsCharts />
          </div>

          {/* Footer Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon name="Shield" size={24} className="text-success" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Secure Platform</h4>
                <p className="text-xs text-muted-foreground">
                  SSL encrypted with regular security audits
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon name="Database" size={24} className="text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Data Backup</h4>
                <p className="text-xs text-muted-foreground">
                  Automated daily backups with 99.9% uptime
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon name="Headphones" size={24} className="text-accent" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">24/7 Support</h4>
                <p className="text-xs text-muted-foreground">
                  Dedicated support team available round the clock
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} SchoolSync Pro. All rights reserved. | Version 2.1.0
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleSidebar = ({ 
  userRole = 'admin', 
  isCollapsed = false, 
  onToggleCollapse,
  className = '' 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationSections = [
    {
      title: 'Dashboard',
      items: [
        {
          label: 'Admin Dashboard',
          path: '/admin-dashboard',
          icon: 'LayoutDashboard',
          roles: ['admin'],
          badge: null
        },
        {
          label: 'Teacher Dashboard',
          path: '/teacher-dashboard',
          icon: 'BookOpen',
          roles: ['teacher'],
          badge: null
        }
      ]
    },
    {
      title: 'Students',
      items: [
        {
          label: 'Student Management',
          path: '/student-management',
          icon: 'Users',
          roles: ['admin', 'teacher'],
          badge: null
        }
      ]
    },
    {
      title: 'Academics',
      items: [
        {
          label: 'Class Schedule',
          path: '/class-schedule-management',
          icon: 'Calendar',
          roles: ['admin', 'teacher'],
          badge: null
        },
        {
          label: 'Attendance Tracking',
          path: '/attendance-tracking',
          icon: 'CheckSquare',
          roles: ['admin', 'teacher'],
          badge: 3
        },
        {
          label: 'Grade Management',
          path: '/grade-management',
          icon: 'GraduationCap',
          roles: ['admin', 'teacher'],
          badge: null
        }
      ]
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const getVisibleSections = () => {
    return navigationSections?.map(section => ({
      ...section,
      items: section?.items?.filter(item => 
        !item?.roles || item?.roles?.includes(userRole)
      )
    }))?.filter(section => section?.items?.length > 0);
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-90 bg-card border-t border-border">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {getVisibleSections()?.flatMap(section => section?.items)?.slice(0, 5)?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 rounded-md transition-colors duration-200 ${
                isActivePath(item?.path)
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <div className="relative">
                <Icon name={item?.icon} size={20} />
                {item?.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    {item?.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 truncate max-w-full">{item?.label?.split(' ')?.[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 z-100 bg-card border-r border-border nav-transition ${
        isCollapsed ? 'w-16' : 'w-72'
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Navigation
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {getVisibleSections()?.map((section, sectionIndex) => (
              <div key={section?.title}>
                {!isCollapsed && (
                  <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {section?.title}
                  </h3>
                )}
                <div className="space-y-1 px-2">
                  {section?.items?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover-lift group ${
                        isActivePath(item?.path)
                          ? 'bg-primary text-primary-foreground shadow-card'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      title={isCollapsed ? item?.label : undefined}
                    >
                      <div className="relative flex-shrink-0">
                        <Icon 
                          name={item?.icon} 
                          size={18} 
                          className={`transition-colors duration-200 ${
                            isActivePath(item?.path) ? 'text-primary-foreground' : ''
                          }`}
                        />
                        {item?.badge && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                            {item?.badge}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item?.label}</span>
                          {item?.badge && (
                            <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                              {item?.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User Role Indicator */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon 
                  name={userRole === 'admin' ? 'Shield' : 'User'} 
                  size={16} 
                  color="white" 
                />
              </div>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground capitalize">
                  {userRole} Portal
                </p>
                <p className="text-xs text-muted-foreground">
                  SchoolSync Pro
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RoleSidebar;
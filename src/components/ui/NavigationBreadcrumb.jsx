import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumb = ({ customBreadcrumbs = null, className = '' }) => {
  const location = useLocation();

  const routeLabels = {
    '/admin-dashboard': 'Admin Dashboard',
    '/teacher-dashboard': 'Teacher Dashboard',
    '/student-management': 'Student Management',
    '/class-schedule-management': 'Class Schedule Management',
    '/attendance-tracking': 'Attendance Tracking',
    '/grade-management': 'Grade Management',
    '/settings': 'Settings',
    '/profile': 'Profile',
    '/help': 'Help',
    '/reports': 'Reports'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-muted-foreground mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground/60" 
              />
            )}
            
            {crumb?.isLast ? (
              <span className="text-foreground font-medium truncate max-w-xs sm:max-w-none">
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="hover:text-foreground transition-colors duration-200 truncate max-w-xs sm:max-w-none"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      {/* Mobile back button */}
      <div className="ml-auto sm:hidden">
        {breadcrumbs?.length > 1 && (
          <Link
            to={breadcrumbs?.[breadcrumbs?.length - 2]?.path}
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <Icon name="ArrowLeft" size={16} />
            <span className="text-sm">Back</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavigationBreadcrumb;
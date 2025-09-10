import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from './pages/admin-dashboard';
import GradeManagement from './pages/grade-management';
import AttendanceTracking from './pages/attendance-tracking';
import StudentManagement from './pages/student-management';
import ClassScheduleManagement from './pages/class-schedule-management';
import TeacherDashboard from './pages/teacher-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboard Routes - Accessible for development preview */}
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/grade-management" element={<GradeManagement />} />
        <Route path="/attendance-tracking" element={<AttendanceTracking />} />
        <Route path="/student-management" element={<StudentManagement />} />
        <Route path="/class-schedule-management" element={<ClassScheduleManagement />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        
        {/* TODO: Before production deployment */}
        {/* 1. Wrap protected routes with <ProtectedRoute> component */}
        {/* 2. Remove preview mode fallbacks */}
        {/* 3. Test all authentication flows */}
        {/* 4. Verify role-based access controls */}
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
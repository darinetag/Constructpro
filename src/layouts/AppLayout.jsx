import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import WorkerDashboardLayout from '@/layouts/WorkerDashboardLayout';
import LaboratoryDashboardLayout from '@/layouts/LaboratoryDashboardLayout';
import { useAppContext } from '@/context/AppContext';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { userProfile, handleLogout } = useAppContext();

  const isLoginPath = location.pathname === '/login';

  if (isLoginPath) {
    return <>{children}</>;
  }

  if (userProfile) {
    const isAdmin = userProfile.role === 'admin';
    const isProjectOwner = userProfile.role === 'project_owner';
    const isSiteManager = userProfile.role === 'site_manager';

    if (isAdmin || isProjectOwner || isSiteManager) {
      const commonAdminPaths = [
        '/',
        '/dashboard',
        '/projects',
        '/personnel',
        '/materials',
        '/marketplace',
        '/settings'
      ];
      
      let allowedPaths = [...commonAdminPaths];
      if (isAdmin || isProjectOwner) {
        allowedPaths.push('/finance', '/laboratory');
      }
      if (isAdmin || isSiteManager) {
         allowedPaths.push('/site-management');
      }


      if (allowedPaths.some(p => location.pathname === p || (p !== '/' && location.pathname.startsWith(p + '/')))) {
        return <DashboardLayout userProfile={userProfile} onLogout={handleLogout}>{children}</DashboardLayout>;
      }
    } else if (userProfile.role === 'worker') {
      if (location.pathname.startsWith('/worker')) {
        return <WorkerDashboardLayout userProfile={userProfile} onLogout={handleLogout}>{children}</WorkerDashboardLayout>;
      }
    } else if (userProfile.role === 'laboratory') {
      if (location.pathname.startsWith('/lab')) {
        return <LaboratoryDashboardLayout userProfile={userProfile} onLogout={handleLogout}>{children}</LaboratoryDashboardLayout>;
      }
    }
  }
  
  return <>{children}</>;
};

export default AppLayout;
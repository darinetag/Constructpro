import React from 'react';
import AdminTopNavbar from '@/components/layout/admin/AdminTopNavbar';
import AdminDesktopSidebar from '@/components/layout/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/components/layout/admin/AdminMobileSidebar';
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper';
import { useAppContext } from '@/context/AppContext';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';


const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const { userProfile, handleLogout } = useAppContext(); 
  const location = useLocation();

  // Determine if the current page is SiteManagement to apply specific light theme
  const isSiteManagementPage = location.pathname === '/site-management';
  
  return (
    <div className={cn(
      "flex h-screen text-foreground",
      isSiteManagementPage ? "bg-white" : "bg-background" // Apply white background for site management
    )}>
      <AdminDesktopSidebar onLogout={handleLogout} />
      <AdminMobileSidebar 
        isOpen={isMobileSidebarOpen} 
        setIsOpen={setIsMobileSidebarOpen} 
        onLogout={handleLogout} 
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopNavbar 
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          onLogout={handleLogout} 
          userProfile={userProfile}
        />
        <main className={cn(
          "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
          isSiteManagementPage ? "bg-white" : "bg-transparent" // Ensure main content area also respects theme
        )}>
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
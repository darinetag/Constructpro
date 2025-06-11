import React from 'react';
import LabTopNavbar from '@/components/layout/lab/LabTopNavbar';
import LabDesktopSidebar from '@/components/layout/lab/LabDesktopSidebar';
import LabMobileSidebar from '@/components/layout/lab/LabMobileSidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const LaboratoryDashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const { userProfile, handleLogout } = useAppContext();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      <LabDesktopSidebar onLogout={handleLogout} />
      <LabMobileSidebar 
        isOpen={isMobileSidebarOpen} 
        setIsOpen={setIsMobileSidebarOpen} 
        onLogout={handleLogout} 
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <LabTopNavbar 
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          onLogout={handleLogout} 
          userProfile={userProfile}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default LaboratoryDashboardLayout;
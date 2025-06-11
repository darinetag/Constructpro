import React from 'react';
import WorkerTopNavbar from '@/components/layout/worker/WorkerTopNavbar';
import WorkerMobileSidebar from '@/components/layout/worker/WorkerMobileSidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const WorkerDashboardLayout = ({ children, userProfile, onLogout }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      <WorkerMobileSidebar 
        isOpen={isMobileSidebarOpen} 
        setIsOpen={setIsMobileSidebarOpen} 
        onLogout={onLogout}
      />
      <WorkerTopNavbar 
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onLogout={onLogout} 
        userProfile={userProfile}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={useLocation().pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default WorkerDashboardLayout;
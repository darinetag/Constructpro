import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { useI18n } from '@/context/I18nContext';

import Dashboard from '@/pages/Dashboard';
import Personnel from '@/pages/Personnel';
import Finance from '@/pages/Finance';
import Materials from '@/pages/Materials';
import Laboratory from '@/pages/Laboratory';
import Marketplace from '@/pages/Marketplace';
import SettingsPage from '@/pages/SettingsPage';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import ProjectsPage from '@/pages/ProjectsPage';
import SiteManagement from '@/pages/SiteManagement';

import WorkerDashboard from '@/pages/worker/WorkerDashboard';
import WorkerTasks from '@/pages/worker/WorkerTasks';
import WorkerTimeLog from '@/pages/worker/WorkerTimeLog';
import WorkerPayments from '@/pages/worker/WorkerPayments';
import WorkerMarketplace from '@/pages/worker/WorkerMarketplace';

import LaboratoryPersonnelDashboard from '@/pages/laboratory_personnel/LaboratoryPersonnelDashboard';
import LabTestManagement from '@/pages/laboratory_personnel/LabTestManagement';
import LabAppointments from '@/pages/laboratory_personnel/LabAppointments';
import LabProjects from '@/pages/laboratory_personnel/LabProjects';
import LabServices from '@/pages/laboratory_personnel/LabServices';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { userProfile, isAuthenticated } = useAppContext();
  const location = useLocation();

  const motionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  const settingsPageElement = <SettingsPage />;

  if (isAuthenticated === undefined) {
    // Optional: Show a loading spinner or a blank page while auth state is being determined
    return null; 
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            isAuthenticated && userProfile ? (
              <Navigate to={ProtectedRoute.getRedirectPath(userProfile.role)} replace />
            ) : (
              <motion.div key="login" {...motionProps}>
                <Login />
              </motion.div>
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated && userProfile ? (
              <Navigate to={ProtectedRoute.getRedirectPath(userProfile.role)} replace />
            ) : (
              <motion.div key="signup" {...motionProps}>
                <SignUp />
              </motion.div>
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated && userProfile ? (
              <Navigate to={ProtectedRoute.getRedirectPath(userProfile.role)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Common Admin, Project Owner & Site Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'project_owner', 'site_manager']} />}>
          <Route path="/dashboard" element={<motion.div key="dashboard" {...motionProps}><Dashboard /></motion.div>} />
          <Route path="/projects" element={<motion.div key="projects" {...motionProps}><ProjectsPage /></motion.div>} />
          <Route path="/personnel" element={<motion.div key="personnel" {...motionProps}><Personnel /></motion.div>} />
          <Route path="/finance" element={<motion.div key="finance" {...motionProps}><Finance /></motion.div>} />
          <Route path="/materials" element={<motion.div key="materials" {...motionProps}><Materials /></motion.div>} />
          <Route path="/laboratory" element={<motion.div key="laboratory" {...motionProps}><Laboratory /></motion.div>} />
          <Route path="/marketplace" element={<motion.div key="marketplace" {...motionProps}><Marketplace /></motion.div>} />
          <Route path="/settings" element={<motion.div key="settings" {...motionProps}>{settingsPageElement}</motion.div>} />
        </Route>
        
        {/* Admin Only Routes (Site Management) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/site-management" element={<motion.div key="site-management" {...motionProps}><SiteManagement /></motion.div>} />
        </Route>
        
        {/* Site Manager only Routes (Site Management, if different from Admin's view or specific functionality) */}
        {/* Currently, Site Management is Admin only. If Site Managers need access to a version of it, a new route/component might be needed. */}
        {/* For now, Site Managers get their specific dashboard view via the /dashboard route and shared pages. */}


        {/* Worker Routes */}
        <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
          <Route path="/worker/dashboard" element={<motion.div key="worker-dashboard" {...motionProps}><WorkerDashboard /></motion.div>} />
          <Route path="/worker/tasks" element={<motion.div key="worker-tasks" {...motionProps}><WorkerTasks /></motion.div>} />
          <Route path="/worker/time-log" element={<motion.div key="worker-time-log" {...motionProps}><WorkerTimeLog /></motion.div>} />
          <Route path="/worker/payments" element={<motion.div key="worker-payments" {...motionProps}><WorkerPayments /></motion.div>} />
          <Route path="/worker/marketplace" element={<motion.div key="worker-marketplace" {...motionProps}><WorkerMarketplace /></motion.div>} />
          <Route path="/worker/settings" element={<motion.div key="worker-settings" {...motionProps}>{settingsPageElement}</motion.div>} />
        </Route>

        {/* Laboratory Routes */}
        <Route element={<ProtectedRoute allowedRoles={['laboratory']} />}>
          <Route path="/lab/dashboard" element={<motion.div key="lab-dashboard" {...motionProps}><LaboratoryPersonnelDashboard /></motion.div>} />
          <Route path="/lab/tests" element={<motion.div key="lab-tests" {...motionProps}><LabTestManagement /></motion.div>} />
          <Route path="/lab/appointments" element={<motion.div key="lab-appointments" {...motionProps}><LabAppointments /></motion.div>} />
          <Route path="/lab/projects" element={<motion.div key="lab-projects" {...motionProps}><LabProjects /></motion.div>} />
          <Route path="/lab/services" element={<motion.div key="lab-services" {...motionProps}><LabServices /></motion.div>} />
          <Route path="/lab/settings" element={<motion.div key="lab-settings" {...motionProps}>{settingsPageElement}</motion.div>} />
        </Route>
        
        <Route path="*" element={<motion.div key="notfound" {...motionProps}><NotFound /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
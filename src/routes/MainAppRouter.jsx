import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import AuthManager from '@/components/auth/AuthManager';
import AppLayout from '@/layouts/AppLayout';

const MainAppRouter = () => {
  return (
    <Router>
      <AuthManager>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </AuthManager>
    </Router>
  );
};

export default MainAppRouter;
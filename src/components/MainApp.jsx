import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import AuthManager from '@/components/auth/AuthManager';
import { useI18n } from '@/context/I18nContext';
import AppLayout from '@/layouts/AppLayout';
import { initDateFnsLocale } from '@/lib/dateFnsAdapter';

const MainApp = () => {
  const { locale } = useI18n();

  useEffect(() => {
    if (locale === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', locale);
    }
    initDateFnsLocale(locale);
  }, [locale]);

  return (
    <AuthManager>
      <Router>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </AuthManager>
  );
};

export default MainApp;
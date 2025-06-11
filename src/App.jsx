import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { I18nProvider } from '@/context/I18nContext';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import MainAppRouter from '@/routes/MainAppRouter';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <I18nProvider>
          <MainAppRouter />
          <Toaster />
        </I18nProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
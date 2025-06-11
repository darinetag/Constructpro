import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { useAppContext } from '@/context/AppContext';

const DashboardHeader = () => {
  const { t } = useI18n();
  const { userProfile } = useAppContext();

  let titleKey = 'dashboard.admin.title';
  if (userProfile?.role === 'site_manager') {
    titleKey = 'dashboard.siteManager.title';
  }

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">{t(titleKey)}</h1>
      <div className="text-sm text-muted-foreground">
        {t('dashboard.admin.lastUpdated')}: {new Date().toLocaleDateString(t('localeCode'))}
      </div>
    </div>
  );
};

export default DashboardHeader;
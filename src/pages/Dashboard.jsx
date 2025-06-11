import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useI18n } from '@/context/I18nContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import OverviewTabContent from '@/components/dashboard/OverviewTabContent';
import ProjectsTabContent from '@/components/dashboard/ProjectsTabContent';
import FinancesTabContent from '@/components/dashboard/FinancesTabContent';
import SiteManagerDashboardContent from '@/components/dashboard/SiteManagerDashboardContent';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { projects, personnel, materials, finances, siteTasks, userProfile, loading } = useAppContext();
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ width: 50, height: 50, border: '4px solid transparent', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%' }}
          />
          <p className="mt-4 text-lg text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const isAdminOrProjectOwner = userProfile?.role === 'admin' || userProfile?.role === 'project_owner';

  if (userProfile?.role === 'site_manager') {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DashboardHeader />
        <SiteManagerDashboardContent 
          projects={projects} 
          personnel={personnel} 
          siteTasks={siteTasks} 
          containerVariants={containerVariants}
        />
      </motion.div>
    );
  }

  // Default dashboard for Admin and Project Owner
  const tabContents = {
    overview: (
      <OverviewTabContent
        projects={projects}
        personnel={personnel}
        materials={materials}
        finances={finances}
        containerVariants={containerVariants}
        currency={t('currency.dZD')}
      />
    ),
    projects: <ProjectsTabContent projects={projects} currency={t('currency.dZD')} />,
    finances: <FinancesTabContent finances={finances} projects={projects} currency={t('currency.dZD')} />,
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardHeader />
      {isAdminOrProjectOwner && <DashboardTabs tabContents={tabContents} />}
    </motion.div>
  );
};

export default Dashboard;
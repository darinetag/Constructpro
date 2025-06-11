import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskRound, ListChecks, CalendarClock, Briefcase, Microscope, LogOut, Building, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/I18nContext';

const NavItem = ({ path, labelKey, icon: Icon, currentPath, onClick }) => {
  const { t } = useI18n();
  return (
    <Button 
      variant={currentPath.startsWith(path) && (path !== '/lab/dashboard' || currentPath === '/lab/dashboard') ? "secondary" : "ghost"} 
      asChild 
      size="sm"
      className="w-full justify-start font-medium text-sm px-3 py-2"
      onClick={onClick}
    >
      <Link to={path} className="flex items-center">
        <Icon className="h-4 w-4 mr-3" />
        {t(labelKey)}
      </Link>
    </Button>
  );
};

const LabMobileSidebar = ({ isOpen, setIsOpen, onLogout }) => {
  const location = useLocation();
  const { t } = useI18n();

  const navItemsConfig = [
    { path: '/lab/dashboard', labelKey: 'navigation.labDashboard', icon: Building },
    { path: '/lab/tests', labelKey: 'navigation.labTestManagement', icon: ListChecks },
    { path: '/lab/appointments', labelKey: 'navigation.labAppointments', icon: CalendarClock },
    { path: '/lab/projects', labelKey: 'navigation.labProjects', icon: Briefcase },
    { path: '/lab/services', labelKey: 'navigation.labServices', icon: Microscope },
  ];
  
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed md:hidden inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-xl flex flex-col"
      >
        <div className="p-4 border-b flex items-center justify-between space-x-3 h-16">
          <div className="flex items-center space-x-3">
            <FlaskRound className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">{t('labPortal.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('labPortal.subtitle')}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closeSidebar} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">{t('common.closeMenu')}</span>
          </Button>
        </div>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItemsConfig.map((item) => (
            <NavItem key={item.path} {...item} currentPath={location.pathname} onClick={closeSidebar} />
          ))}
        </nav>
        <div className="p-3 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={() => { onLogout(); closeSidebar(); }}>
            <LogOut className="h-4 w-4 mr-3" />
            {t('navigation.logout')}
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default LabMobileSidebar;
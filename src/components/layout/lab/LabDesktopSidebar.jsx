import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FlaskRound, ListChecks, CalendarClock, Briefcase, Microscope, LogOut, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/I18nContext';

const NavItem = ({ path, labelKey, icon: Icon, currentPath }) => {
  const { t } = useI18n();
  return (
    <Button 
      variant={currentPath.startsWith(path) && (path !== '/lab/dashboard' || currentPath === '/lab/dashboard') ? "secondary" : "ghost"} 
      asChild 
      size="sm"
      className="w-full justify-start font-medium text-sm px-3 py-2"
    >
      <Link to={path} className="flex items-center">
        <Icon className="h-4 w-4 mr-3" />
        {t(labelKey)}
      </Link>
    </Button>
  );
};

const LabDesktopSidebar = ({ onLogout }) => {
  const location = useLocation();
  const { t } = useI18n();

  const navItemsConfig = [
    { path: '/lab/dashboard', labelKey: 'navigation.labDashboard', icon: Building },
    { path: '/lab/tests', labelKey: 'navigation.labTestManagement', icon: ListChecks },
    { path: '/lab/appointments', labelKey: 'navigation.labAppointments', icon: CalendarClock },
    { path: '/lab/projects', labelKey: 'navigation.labProjects', icon: Briefcase },
    { path: '/lab/services', labelKey: 'navigation.labServices', icon: Microscope },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-60 bg-card border-r">
       <div className="p-4 border-b flex items-center space-x-3 h-16">
          <FlaskRound className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-primary">{t('labPortal.title')}</h1>
            <p className="text-xs text-muted-foreground">{t('labPortal.subtitle')}</p>
          </div>
        </div>
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItemsConfig.map((item) => (
          <NavItem key={item.path} {...item} currentPath={location.pathname} />
        ))}
      </nav>
      <div className="p-3 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-3" />
          {t('navigation.logout')}
        </Button>
      </div>
    </aside>
  );
};

export default LabDesktopSidebar;
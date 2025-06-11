import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ListChecks, Clock, Wallet, ShoppingBag, 
  LogOut, Building, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/I18nContext';

const NavItem = ({ path, labelKey, icon: Icon, currentPath, onClick }) => {
  const { t } = useI18n();
  return (
    <Button 
      variant={currentPath.startsWith(path) ? "secondary" : "ghost"} 
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

const WorkerMobileSidebar = ({ isOpen, setIsOpen, onLogout }) => {
  const location = useLocation();
  const { t } = useI18n();
  
  const workerNavItems = [
    { path: '/worker/dashboard', labelKey: 'navigation.workerDashboard', icon: LayoutDashboard },
    { path: '/worker/tasks', labelKey: 'navigation.workerTasks', icon: ListChecks },
    { path: '/worker/time-log', labelKey: 'navigation.workerTimeLog', icon: Clock },
    { path: '/worker/payments', labelKey: 'navigation.workerPayments', icon: Wallet },
    { path: '/worker/marketplace', labelKey: 'navigation.workerMarketplace', icon: ShoppingBag },
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
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">{t('appName')}</h1>
              <p className="text-xs text-muted-foreground">{t('workerPortal.title')}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closeSidebar} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">{t('common.closeMenu')}</span>
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {workerNavItems.map((item) => (
            <NavItem 
              key={item.path} 
              {...item} 
              currentPath={location.pathname} 
              onClick={closeSidebar}
            />
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

export default WorkerMobileSidebar;
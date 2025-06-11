import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, DollarSign, Package, FlaskConical, ShoppingCart, Settings, LogOut, Building, FolderKanban, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';

const sidebarVariants = {
  initial: { x: -256 },
  animate: { x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

const navItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  hover: { scale: 1.05, x: 5, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.95 }
};

const AdminDesktopSidebar = ({ onLogout }) => {
  const location = useLocation();
  const { t } = useI18n();
  const { userProfile } = useAppContext();

  const navItems = [
    { to: '/dashboard', icon: Home, labelKey: 'navigation.dashboard', roles: ['admin', 'project_owner', 'site_manager'] },
    { to: '/projects', icon: FolderKanban, labelKey: 'navigation.projects', roles: ['admin', 'project_owner', 'site_manager'] },
    { to: '/personnel', icon: Users, labelKey: 'navigation.personnel', roles: ['admin', 'project_owner', 'site_manager'] },
    { to: '/site-management', icon: ClipboardList, labelKey: 'navigation.siteManagement', roles: ['admin', 'site_manager'] },
    { to: '/finance', icon: DollarSign, labelKey: 'navigation.finance', roles: ['admin', 'project_owner'] },
    { to: '/materials', icon: Package, labelKey: 'navigation.materials', roles: ['admin', 'project_owner', 'site_manager'] },
    { to: '/laboratory', icon: FlaskConical, labelKey: 'navigation.labTestsAdmin', roles: ['admin', 'project_owner'] },
    { to: '/marketplace', icon: ShoppingCart, labelKey: 'navigation.marketplace', roles: ['admin', 'project_owner', 'site_manager'] },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(userProfile?.role));

  return (
    <motion.div 
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
      className="hidden md:flex md:flex-col md:w-64 bg-card text-card-foreground border-r border-border shadow-lg"
    >
      <div className="flex items-center justify-center h-20 border-b border-border">
        <Building className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-primary">{t('appName')}</h1>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {filteredNavItems.map((item, index) => (
          <motion.div
            key={item.to}
            variants={navItemVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: index * 0.05 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive: navIsActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 ease-in-out group sidebar-item transform',
                  (isActive(item.to) || navIsActive) && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-md active'
                )
              }
            >
              <item.icon className={cn("h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110", (isActive(item.to)) && "text-primary-foreground")} />
              <span className="font-medium">{t(item.labelKey)}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
      <div className="px-3 py-6 border-t border-border space-y-2">
        <motion.div  variants={navItemVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap" transition={{ delay: filteredNavItems.length * 0.05 }}>
          <NavLink
            to="/settings"
            className={({ isActive: navIsActive }) =>
              cn(
                'flex items-center px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 ease-in-out group sidebar-item transform',
                (isActive('/settings') || navIsActive) && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-md active'
              )
            }
          >
            <Settings className={cn("h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110", isActive('/settings') && "text-primary-foreground")} />
            <span className="font-medium">{t('navigation.settings')}</span>
          </NavLink>
        </motion.div>
        <motion.div variants={navItemVariants} initial="initial" animate="animate" whileHover="hover" whileTap="tap" transition={{ delay: (filteredNavItems.length + 1) * 0.05 }}>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 ease-in-out group sidebar-item transform"
          >
            <LogOut className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium">{t('navigation.logout')}</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDesktopSidebar;
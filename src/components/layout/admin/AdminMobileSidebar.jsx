import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, DollarSign, Package, FlaskConical, ShoppingCart, Settings, LogOut, X, Building, FolderKanban, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { useAppContext } from '@/context/AppContext';

const AdminMobileSidebar = ({ isOpen, setIsOpen, onLogout }) => {
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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 bg-card text-foreground transition-transform duration-300 ease-in-out md:hidden transform border-r',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-20 px-4 border-b">
          <div className="flex items-center">
            <Building className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-primary">{t('appName')}</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive: navIsActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 group sidebar-item',
                  (isActive(item.to) || navIsActive) && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active'
                )
              }
            >
              <item.icon className={cn("h-5 w-5 mr-3", (isActive(item.to)) && "text-primary-foreground")} />
              <span className="font-medium">{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-6 border-t space-y-2">
          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={({ isActive: navIsActive }) =>
              cn(
                'flex items-center px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 group sidebar-item',
                (isActive('/settings') || navIsActive) && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active'
              )
            }
          >
            <Settings className={cn("h-5 w-5 mr-3", isActive('/settings') && "text-primary-foreground")} />
            <span className="font-medium">{t('navigation.settings')}</span>
          </NavLink>
          <button
            onClick={() => { onLogout(); setIsOpen(false); }}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors duration-150 group sidebar-item"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">{t('navigation.logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminMobileSidebar;
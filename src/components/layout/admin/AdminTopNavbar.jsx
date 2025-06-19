import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Settings, LogOut, Bell, Building, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import DashboardIcon from '/dist/assets/mainn.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useI18n } from '@/context/I18nContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const AdminTopNavbar = ({ setIsMobileSidebarOpen, onLogout, userProfile }) => {
  const navigate = useNavigate();
  const { t, locale } = useI18n(); 
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      { id: 1, title: t('notifications.sampleMaterialRequestTitle'), description: t('notifications.sampleMaterialRequestDesc'), time: t('notifications.time.minutesAgo', {count: 10}), read: false },
      { id: 2, title: t('notifications.sampleLabTestCompletedTitle'), description: t('notifications.sampleLabTestCompletedDesc'), time: t('notifications.time.hoursAgo', {count: 1}), read: false },
    ]);
  }, [t, locale]);


  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden rounded-full mr-3"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('common.openMenu')}</span>
        </Button>
        <Link to="/dashboard" className="flex items-center space-x-2 md:hidden">
          {/* <img src={DashboardIcon} alt="Dashboard icon" className="h-8 w-8 " /> */}
          <h1 className="text-xl font-bold text-primary">{t('appName').substring(0,2).toUpperCase()}</h1>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-3">
        <LanguageSwitcher />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative" aria-label={t('notifications.title')}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('notifications.title')}</h3>
              {unreadCount > 0 && <Button variant="link" size="sm" onClick={handleMarkAllRead} className="text-xs">{t('notifications.markAllRead')}</Button>}
            </div>
            <Separator />
            {notifications.length === 0 ? <p className="p-4 text-sm text-muted-foreground">{t('notifications.noNotifications')}</p> : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={cn("p-3 hover:bg-accent cursor-pointer", !n.read && "bg-primary/5")} onClick={() => handleNotificationClick(n.id)}>
                    <div className="flex items-start space-x-3">
                      {!n.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0"></div>}
                      <div className={cn(n.read && "ml-5", locale === 'ar' && !n.read && "mr-5 ml-0", locale === 'ar' && n.read && "mr-5")}>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Separator />
            <div className="p-2 text-center"><Button variant="link" size="sm" className="text-xs">{t('notifications.viewAll')}</Button></div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label={t('userMenu.userProfile')}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile?.avatarUrl || ""} alt={userProfile?.name || t('common.userAvatarAlt')} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userProfile?.name ? userProfile.name.substring(0,2).toUpperCase() : <UserCircle size={20}/>}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userProfile?.name || t('login.roleProjectOwner')}</p>
                <p className="text-xs leading-none text-muted-foreground">{userProfile?.email || "owner@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/settings')}><Settings className={locale === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /><span>{t('userMenu.settings')}</span></DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}><LogOut className={locale === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /><span>{t('userMenu.logout')}</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminTopNavbar;
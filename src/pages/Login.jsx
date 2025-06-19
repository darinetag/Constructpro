import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; 
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Beaker as BeakerIcon, HardHat, Building, Briefcase } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAppContext } from '@/context/AppContext';
import loginIcon from '/dist/assets/Login.svg';

const Login = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { handleLogin, isAuthenticated, userProfile } = useAppContext(); 

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'worker', 
  });
  const [isLoading, setIsLoading] = useState(false);

  // useEffect to handle redirection is managed by AppRoutes.jsx
  // If a user is already authenticated and tries to access /login,
  // AppRoutes.jsx will redirect them.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const getRoleDisplayName = (roleKey) => {
    const roleMap = {
      project_owner: t('login.roleProjectOwner'),
      admin: t('login.roleSiteManager'), 
      site_manager: t('login.roleSiteManager'),
      worker: t('login.roleWorker'),
      laboratory: t('login.roleLabPersonnel'),
    };
    return roleMap[roleKey] || 'User';
  }

  const processLogin = (roleToLoginAs) => {
    setIsLoading(true);
    const currentRole = roleToLoginAs || formData.role;

    setTimeout(() => {
      const userName = formData.email.split('@')[0];
      let avatarBgColor = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'; 
      let avatarType = 'pixel-art';
      
      if (currentRole === 'admin' || currentRole === 'project_owner' || currentRole === 'site_manager') { 
        avatarBgColor = '00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33';
        avatarType = 'initials';
      } else if (currentRole === 'laboratory') { 
        avatarBgColor = '80cbc4,a5d6a7,c5e1a5,e6ee9c,fff59d';
        avatarType = 'bottts';
      }

      const userToStore = { 
        email: formData.email, 
        name: userName,
        role: currentRole, 
        avatarUrl: `https://api.dicebear.com/7.x/${avatarType}/svg?seed=${userName}&backgroundColor=${avatarBgColor}`
      };
      
      handleLogin(userToStore, true); 
      
      toast({
        title: t('login.loginSuccessTitle'),
        description: t('login.loginSuccessDescription', { roleName: getRoleDisplayName(currentRole) }),
      });
      setIsLoading(false);
      // AppRoutes.jsx will handle navigation after isAuthenticated and userProfile are updated.
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: t('login.errorTitle'),
        description: t('login.fillFieldsError'),
        variant: "destructive",
      });
      return;
    }
    processLogin(formData.role);
  };

  const roles = [
    { value: 'project_owner', labelKey: 'login.roleProjectOwner', icon: Briefcase },
    { value: 'admin', labelKey: 'login.roleSiteManager', icon: HardHat }, 
    { value: 'worker', labelKey: 'login.roleWorker', icon: User },
    { value: 'laboratory', labelKey: 'login.roleLabPersonnel', icon: BeakerIcon },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative" 
      >
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block p-3 bg-primary/20 rounded-full mb-4"
              >
              <img src={loginIcon} alt="User icon" className="w-36 h-36" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-1">{t('login.title')}</h1>
              <p className="text-sky-300">{t('login.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sky-200">{t('login.emailLabel')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sky-200">{t('login.passwordLabel')}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('login.passwordPlaceholder')}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sky-200">{t('login.roleLabel')}</Label>
                <RadioGroup
                  value={formData.role}
                  name="role"
                  onValueChange={handleRoleChange}
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2" 
                >
                  {roles.map(role => (
                    <motion.div key={role.value} whileTap={{ scale: 0.97 }}>
                      <Label
                        htmlFor={`role-${role.value}`}
                        className={`flex flex-col items-center justify-center rounded-md border-2 p-3 h-full hover:bg-white/10 cursor-pointer transition-all ${ 
                          formData.role === role.value ? 'border-primary bg-primary/20' : 'border-white/20'
                        }`}
                      >
                        <RadioGroupItem value={role.value} id={`role-${role.value}`} className="sr-only" />
                        <role.icon className={`mb-1.5 h-5 w-5 ${formData.role === role.value ? 'text-primary' : 'text-sky-300'}`} />
                        <span className={`text-xs text-center font-medium ${formData.role === role.value ? 'text-primary' : 'text-sky-200'}`}>{t(role.labelKey)}</span>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-3 pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : null}
                  {isLoading ? t('login.signingInButton') : t('login.signInButton')}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-sky-300/80">
                {t('login.noAccount')}{' '}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                  {t('login.signUpLink')}
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-sky-300/70">
                {t('login.demoHint')}
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-sky-400/60 mt-6">
          {t('login.copyright', { year: new Date().getFullYear() })}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
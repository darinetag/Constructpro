import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Beaker as BeakerIcon, HardHat, Briefcase, UserPlus } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useAppContext } from '@/context/AppContext';

const SignUp = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setUserProfile } = useAppContext(); 

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'worker',
  });
  const [isLoading, setIsLoading] = useState(false);

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
      worker: t('login.roleWorker'),
      laboratory: t('login.roleLabPersonnel'),
    };
    return roleMap[roleKey] || t('common.user'); // Fallback to a generic user
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('login.errorTitle'),
        description: t('login.signup.passwordMismatchError'), // Corrected key
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.password) {
      toast({
        title: t('login.errorTitle'),
        description: t('login.fillFieldsError'),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    setTimeout(() => {
      let avatarBgColor = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf'; 
      let avatarType = 'pixel-art';
      
      if (formData.role === 'admin' || formData.role === 'project_owner') {
        avatarBgColor = '00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33';
        avatarType = 'initials';
      } else if (formData.role === 'laboratory') {
        avatarBgColor = '80cbc4,a5d6a7,c5e1a5,e6ee9c,fff59d';
        avatarType = 'bottts';
      }

      const newUser = {
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        avatarUrl: `https://api.dicebear.com/7.x/${avatarType}/svg?seed=${formData.fullName.split(' ').join('')}&backgroundColor=${avatarBgColor}`
      };

      localStorage.setItem('constructProUser', JSON.stringify(newUser));
      if (setUserProfile) { // Check if setUserProfile is defined
        setUserProfile(newUser);
      }
      
      toast({
        title: t('login.signup.signUpSuccessTitle'), // Corrected key
        description: t('login.signup.signUpSuccessDescription', { roleName: getRoleDisplayName(formData.role) }), // Corrected key
      });
      setIsLoading(false);
      navigate('/login'); 
    }, 1500);
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
                <UserPlus className="h-10 w-10 text-primary" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-1">{t('login.signup.title')}</h1>
              <p className="text-sky-300">{t('login.signup.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-sky-200">{t('login.signup.fullNameLabel')}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder={t('login.signup.fullNamePlaceholder')}
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
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

              <div className="space-y-1">
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
              
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-sky-200">{t('login.signup.confirmPasswordLabel')}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder={t('login.signup.confirmPasswordPlaceholder')}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
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
                        htmlFor={`role-signup-${role.value}`}
                        className={`flex flex-col items-center justify-center rounded-md border-2 p-3 h-full hover:bg-white/10 cursor-pointer transition-all ${
                          formData.role === role.value ? 'border-primary bg-primary/20' : 'border-white/20'
                        }`}
                      >
                        <RadioGroupItem value={role.value} id={`role-signup-${role.value}`} className="sr-only" />
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
                  {isLoading ? t('login.signup.signingUpButton') : t('login.signup.signUpButton')}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-sky-300/80">
                {t('login.signup.alreadyHaveAccount')}{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  {t('login.signup.loginLink')}
                </Link>
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

export default SignUp;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Camera, Phone, Briefcase, Building } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useI18n } from '@/context/I18nContext';

const SettingsPage = () => {
  const { userProfile, setUserProfile } = useAppContext();
  const { t } = useI18n();
  const { toast } = useToast();
  
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [jobTitle, setJobTitle] = useState(userProfile?.jobTitle || '');
  const [department, setDepartment] = useState(userProfile?.department || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...userProfile,
      name,
      email,
      phoneNumber,
      jobTitle,
      department,
      avatarUrl: newAvatarFile ? avatarUrl : userProfile?.avatarUrl, 
    };
    setUserProfile(updatedProfile); 
    toast({
      title: t('settings.profileUpdatedTitle'),
      description: t('settings.profileUpdatedDescription'),
      className: "bg-green-500 text-white",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-4"
    >
      <Card className="overflow-hidden shadow-xl transform hover:scale-101 transition-transform duration-300 ease-out bg-card">
        <CardHeader className="bg-gradient-to-br from-primary to-primary/80 p-6">
          <CardTitle className="text-3xl font-bold text-primary-foreground">{t('settings.title')}</CardTitle>
          <CardDescription className="text-primary-foreground/80">{t('settings.description')}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
                  <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt={name} />
                  <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                    {name ? name.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Label 
                  htmlFor="avatar-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-full"
                >
                  <Camera className="w-8 h-8" />
                </Label>
              </div>
              <Input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
              <p className="text-sm text-muted-foreground">{t('settings.avatarChangeHint')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium flex items-center text-foreground">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  {t('settings.fullNameLabel')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('settings.fullNamePlaceholder')}
                  className="text-base py-3 px-4 bg-input border-border focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium flex items-center text-foreground">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  {t('settings.emailLabel')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('settings.emailPlaceholder')}
                  className="text-base py-3 px-4 bg-input border-border focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base font-medium flex items-center text-foreground">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  {t('settings.phoneNumberLabel')}
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t('settings.phoneNumberPlaceholder')}
                  className="text-base py-3 px-4 bg-input border-border focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-base font-medium flex items-center text-foreground">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" />
                  {t('settings.jobTitleLabel')}
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder={t('settings.jobTitlePlaceholder')}
                  className="text-base py-3 px-4 bg-input border-border focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department" className="text-base font-medium flex items-center text-foreground">
                <Building className="w-5 h-5 mr-2 text-primary" />
                {t('settings.departmentLabel')}
              </Label>
              <Input
                id="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder={t('settings.departmentPlaceholder')}
                className="text-base py-3 px-4 bg-input border-border focus:ring-primary"
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                {t('settings.saveChangesButton')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;
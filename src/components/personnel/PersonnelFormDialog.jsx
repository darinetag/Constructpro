import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useI18n } from '@/context/I18nContext';

const PersonnelFormDialog = ({ isOpen, onOpenChange, mode, initialData, onSubmit, projects }) => {
  const { t } = useI18n();
  const defaultFormData = {
    name: '', role: '', phone: '', contact: '', status: 'active', hourlyRate: '', skills: '', projectId: '', avatar: '', experience: '',
  };
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          ...initialData,
          contact: initialData.contact || '', 
          hourlyRate: initialData.hourlyRate ? initialData.hourlyRate.toString() : '',
          skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : (initialData.skills || ''),
          projectId: initialData.projectId || '',
          experience: initialData.experience ? initialData.experience.toString() : '',
          avatar: initialData.avatar || '',
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, mode, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      experience: parseFloat(formData.experience) || 0,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-card-foreground rounded-lg shadow-xl border border-border sm:max-w-[525px] md:max-w-[650px]">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-semibold text-primary">
            {mode === 'add' ? t('personnelPage.form.addTitle') : t('personnelPage.form.editTitle')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'add' ? t('personnelPage.form.addDescription') : t('personnelPage.form.editDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">{t('personnelPage.form.nameLabel')}</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder={t('personnelPage.form.namePlaceholder')} required className="bg-input border-input focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-sm font-medium">{t('personnelPage.form.roleLabel')}</Label>
                <Input id="role" name="role" value={formData.role} onChange={handleInputChange} placeholder={t('personnelPage.form.rolePlaceholder')} required className="bg-input border-input focus:ring-primary" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contact" className="text-sm font-medium">{t('personnelPage.form.emailLabel')}</Label>
                <Input id="contact" name="contact" type="email" value={formData.contact} onChange={handleInputChange} placeholder={t('personnelPage.form.emailPlaceholder')} className="bg-input border-input focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">{t('personnelPage.form.phoneLabel')}</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('personnelPage.form.phonePlaceholder')} className="bg-input border-input focus:ring-primary" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-sm font-medium">{t('personnelPage.form.statusLabel')}</Label>
                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger className="bg-input border-input focus:ring-primary"><SelectValue placeholder={t('personnelPage.form.statusPlaceholder')} /></SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground">
                    <SelectItem value="active">{t('personnelPage.statusActive')}</SelectItem>
                    <SelectItem value="on-leave">{t('personnelPage.statusOnLeave')}</SelectItem>
                    <SelectItem value="inactive">{t('personnelPage.statusInactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hourlyRate" className="text-sm font-medium">{t('personnelPage.form.hourlyRateLabel', { currency: t('currency.dZD')})}</Label>
                <Input id="hourlyRate" name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} placeholder={t('personnelPage.form.hourlyRatePlaceholder')} className="bg-input border-input focus:ring-primary" />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="experience" className="text-sm font-medium">{t('personnelPage.form.experienceLabel')}</Label>
                  <Input id="experience" name="experience" type="number" value={formData.experience} onChange={handleInputChange} placeholder={t('personnelPage.form.experiencePlaceholder')} className="bg-input border-input focus:ring-primary" />
                </div>
                 <div className="space-y-1.5">
                  <Label htmlFor="avatar" className="text-sm font-medium">{t('personnelPage.form.avatarLabel')}</Label>
                  <Input id="avatar" name="avatar" value={formData.avatar} onChange={handleInputChange} placeholder={t('personnelPage.form.avatarPlaceholder')} className="bg-input border-input focus:ring-primary" />
                </div>
             </div>
            <div className="space-y-1.5">
              <Label htmlFor="skills" className="text-sm font-medium">{t('personnelPage.form.skillsLabel')}</Label>
              <Input id="skills" name="skills" value={formData.skills} onChange={handleInputChange} placeholder={t('personnelPage.form.skillsPlaceholder')} className="bg-input border-input focus:ring-primary" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="projectId" className="text-sm font-medium">{t('personnelPage.form.assignedProjectLabel')}</Label>
              <Select name="projectId" value={formData.projectId} onValueChange={(value) => handleSelectChange('projectId', value)}>
                <SelectTrigger className="bg-input border-input focus:ring-primary"><SelectValue placeholder={t('personnelPage.form.assignedProjectPlaceholder')} /></SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="">{t('personnelPage.form.notAssigned')}</SelectItem>
                  {(projects || []).map(project => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('actions.cancel')}</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {mode === 'add' ? t('personnelPage.form.addButton') : t('personnelPage.form.updateButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonnelFormDialog;
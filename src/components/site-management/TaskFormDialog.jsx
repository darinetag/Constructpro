import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateFnsLocaleMapping';
import { useI18n } from '@/context/I18nContext';

const TaskFormDialog = ({ isOpen, onClose, task, projects, personnel, onSubmit }) => {
  const { t, locale } = useI18n();
  const dateFnsLocale = getDateFnsLocale(locale);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    dueDate: null,
    priority: 'medium',
    status: 'pending',
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          projectId: '',
          assignedTo: '',
          dueDate: null,
          priority: 'medium',
          status: 'pending',
        });
      }
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, dueDate: formData.dueDate ? formData.dueDate.toISOString() : null });
  };
  
  const availablePersonnel = useMemo(() => {
    if (!formData.projectId) return personnel; 
    const project = projects.find(p => p.id === formData.projectId);
    if (!project || !project.assignedTeam || project.assignedTeam.length === 0) return personnel; 
    return personnel.filter(p => project.assignedTeam.includes(p.id));
  }, [formData.projectId, projects, personnel]);

  const [localProjects, setLocalProjects] = useState([]);
  function getProjectsFromLocalStorage() {
    try {
      const data = localStorage.getItem('projects');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  
  const [localPersonnels, setLocalPersonnels] = useState([]);
  function getPersonnelsFromLocalStorage() {
    try {
      const data = localStorage.getItem('constructProPersonnel');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  useEffect(() => {
    setLocalProjects(getProjectsFromLocalStorage());
    setLocalPersonnels(getPersonnelsFromLocalStorage());
  }, [localProjects, localPersonnels]); 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dialog-content-custom sm:max-w-[525px] rounded-xl">
        <DialogHeader className="dialog-header-custom pb-4">
          <DialogTitle className="text-2xl font-semibold text-primary">
            {task ? t('siteManagement.taskForm.editTitle') : t('siteManagement.taskForm.addTitle')}
          </DialogTitle>
          <DialogDescription className="text-muted-custom">
            {task ? t('siteManagement.taskForm.editDescription') : t('siteManagement.taskForm.addDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-5 max-h-[calc(80vh-120px)] overflow-y-auto custom-scrollbar pr-3">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-muted-custom font-medium">{t('siteManagement.taskForm.titleLabel')}</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder={t('siteManagement.taskForm.titlePlaceholder')} required className="input-custom h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-muted-custom font-medium">{t('siteManagement.taskForm.descriptionLabel')}</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder={t('siteManagement.taskForm.descriptionPlaceholder')} className="input-custom min-h-[100px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="projectId" className="text-muted-custom font-medium">{t('siteManagement.taskForm.projectLabel')}</Label>
              <Select name="projectId" value={formData.projectId} onValueChange={(value) => handleSelectChange('projectId', value)}>
                <SelectTrigger className="select-trigger-custom h-11"><SelectValue placeholder={t('siteManagement.taskForm.projectPlaceholder')} /></SelectTrigger>
                <SelectContent className="select-content-custom">
                  {localProjects.map(p => <SelectItem key={p.id} value={p.id} className="select-item-custom">{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignedTo" className="text-muted-custom font-medium">{t('siteManagement.taskForm.assignedToLabel')}</Label>
              <Select name="assignedTo" value={formData.assignedTo} onValueChange={(value) => handleSelectChange('assignedTo', value)} disabled={!formData.projectId && localPersonnels.length === personnel.length && personnel.length > 0}>
                <SelectTrigger className="select-trigger-custom h-11"><SelectValue placeholder={t('siteManagement.taskForm.assignedToPlaceholder')} /></SelectTrigger>
                <SelectContent className="select-content-custom">
                  <SelectItem value="" className="select-item-custom">{t('common.unassigned')}</SelectItem>
                  {localPersonnels.map(p => <SelectItem key={p.id} value={p.id} className="select-item-custom">{p.name} ({p.role})</SelectItem>)}
                </SelectContent>
              </Select>
              {(!formData.projectId && localPersonnels.length === personnel.length && personnel.length > 0) && <p className="text-xs text-gray-500 mt-1">{t('siteManagement.taskForm.selectProjectFirst')}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-muted-custom font-medium">{t('siteManagement.taskForm.dueDateLabel')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`w-full justify-start text-left font-normal input-custom h-11 ${!formData.dueDate && "text-gray-400"}`}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, 'PPP', { locale: dateFnsLocale }) : <span>{t('siteManagement.taskForm.datePlaceholder')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 select-content-custom" align="start">
                  <Calendar mode="single" selected={formData.dueDate} onSelect={handleDateChange} initialFocus locale={dateFnsLocale} classNames={{ day_selected: "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground", today: "text-primary" }}/>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-muted-custom font-medium">{t('siteManagement.taskForm.priorityLabel')}</Label>
              <Select name="priority" value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                <SelectTrigger className="select-trigger-custom h-11"><SelectValue placeholder={t('siteManagement.taskForm.priorityPlaceholder')} /></SelectTrigger>
                <SelectContent className="select-content-custom">
                  {['low', 'medium', 'high', 'critical'].map(p => <SelectItem key={p} value={p} className="select-item-custom">{t(`priority.${p}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-muted-custom font-medium">{t('siteManagement.taskForm.statusLabel')}</Label>
            <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="select-trigger-custom h-11"><SelectValue placeholder={t('siteManagement.taskForm.statusPlaceholder')} /></SelectTrigger>
              <SelectContent className="select-content-custom">
                {['pending', 'in-progress', 'completed', 'on-hold', 'cancelled'].map(s => <SelectItem key={s} value={s} className="select-item-custom">{t(`status.${s.replace('-', '')}`)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="dialog-footer-custom pt-6 mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="button-outline-custom h-11 px-6">
                {t('actions.cancel')}
              </Button>
            </DialogClose>
            <Button type="submit" className="button-primary-custom font-semibold shadow-md hover:shadow-lg transition-all duration-300 h-11 px-6">
              {task ? t('actions.saveChanges') : t('actions.addTask')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
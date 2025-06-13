import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPlus as CalendarIcon, Users, DollarSign, Percent, Palette, Type, Info, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/components/ui/use-toast';
import { getDateFnsLocale } from '@/lib/dateFnsLocaleMapping';

const LS_KEY = 'projects';

function getProjectsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveProjectsToLocalStorage(projects) {
  localStorage.setItem(LS_KEY, JSON.stringify(projects));
}

function generateProjectId() {
  return Date.now().toString();
}

const formFieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const FormField = ({ label, icon: Icon, htmlFor, children, error, className }) => (
  <motion.div variants={formFieldVariants} className={className}>
    <Label htmlFor={htmlFor} className="flex items-center mb-1.5 text-sm font-medium text-gray-300">
      {Icon && <Icon className="h-4 w-4 mr-2 text-blue-400" />}
      {label}
    </Label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
  </motion.div>
);

const ProjectFormDialog = ({
  isOpen,
  onClose,
  mode,
  projectData,
  personnel,
  currency,
  onProjectsChange // optional callback for parent sync
}) => {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const dateFnsLocale = getDateFnsLocale(locale);

  // --- Initial State ---
  const initialFormData = {
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    budget: '',
    status: 'planning',
    priority: 'medium',
    assignedTeam: [],
    location: '',
    type: '',
    clientName: '',
    completion: 0,
    color: '#A0AEC0'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // --- Populate for Edit Mode ---
  useEffect(() => {
    if (mode === 'edit' && projectData) {
      setFormData({
        ...projectData,
        startDate: projectData.startDate ? new Date(projectData.startDate) : null,
        endDate: projectData.endDate ? new Date(projectData.endDate) : null,
        budget: projectData.budget?.toString() || '',
        assignedTeam: Array.isArray(projectData.assignedTeam)
          ? projectData.assignedTeam
          : projectData.assignedTeam
            ? [projectData.assignedTeam]
            : [],
        completion: projectData.completion || 0,
        color: projectData.color || '#A0AEC0'
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [isOpen, mode, projectData]);

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // --- Multi-Select Team ---
  // Radix Select is single-select. For multi-select, use a custom multi-select or a list of checkboxes.
  // For now, we implement as single-select for MVP, but you can swap to a multi-select component if needed.
  const handleAssignedTeamChange = (value) => {
    setFormData(prev => ({ ...prev, assignedTeam: value ? [value] : [] }));
    if (errors.assignedTeam) setErrors(prev => ({ ...prev, assignedTeam: null }));
  };

  // --- Validation ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('projectsPage.form.error.nameRequired');
    if (!formData.startDate) newErrors.startDate = t('projectsPage.form.error.startDateRequired');
    if (!formData.endDate) newErrors.endDate = t('projectsPage.form.error.endDateRequired');
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = t('projectsPage.form.error.endDateInvalid');
    }
    if (!formData.budget.trim() || isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = t('projectsPage.form.error.budgetInvalid');
    }
    if (!formData.location.trim()) newErrors.location = t('projectsPage.form.error.locationRequired');
    if (!formData.type.trim()) newErrors.type = t('projectsPage.form.error.typeRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- LocalStorage CRUD ---
  const addProject = (project) => {
    const projects = getProjectsFromLocalStorage();
    const newProject = { ...project, id: generateProjectId() };
    const updatedProjects = [...projects, newProject];
    saveProjectsToLocalStorage(updatedProjects);
    if (onProjectsChange) onProjectsChange(updatedProjects);
  };

  const updateProject = (id, updatedProject) => {
    const projects = getProjectsFromLocalStorage();
    const updatedProjects = projects.map(p => (p.id === id ? { ...updatedProject, id } : p));
    saveProjectsToLocalStorage(updatedProjects);
    if (onProjectsChange) onProjectsChange(updatedProjects);
  };

  // --- Submission Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: t('projectsPage.form.error.validationFailedTitle'),
        description: t('projectsPage.form.error.validationFailedDescription'),
        variant: "destructive",
      });
      return;
    }

    const projectPayload = {
      ...formData,
      budget: parseFloat(formData.budget),
      startDate: formData.startDate ? formData.startDate.toISOString() : null,
      endDate: formData.endDate ? formData.endDate.toISOString() : null,
      completion: Number(formData.completion)
    };

    if (mode === 'add') {
      addProject(projectPayload);
    } else {
      updateProject(projectPayload.id, projectPayload);
    }
    onClose();
  };

  // --- Static Options ---
  const projectStatuses = ['planning', 'in-progress', 'completed', 'on-hold', 'cancelled'];
  const projectPriorities = ['low', 'medium', 'high', 'critical'];
  const projectColors = [
    { name: t('projectsPage.form.colorOptions.gray'), value: '#A0AEC0' },
    { name: t('projectsPage.form.colorOptions.red'), value: '#F56565' },
    { name: t('projectsPage.form.colorOptions.orange'), value: '#ED8936' },
    { name: t('projectsPage.form.colorOptions.yellow'), value: '#ECC94B' },
    { name: t('projectsPage.form.colorOptions.green'), value: '#48BB78' },
    { name: t('projectsPage.form.colorOptions.teal'), value: '#38B2AC' },
    { name: t('projectsPage.form.colorOptions.blue'), value: '#4299E1' },
    { name: t('projectsPage.form.colorOptions.indigo'), value: '#667EEA' },
    { name: t('projectsPage.form.colorOptions.purple'), value: '#9F7AEA' },
    { name: t('projectsPage.form.colorOptions.pink'), value: '#ED64A6' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-slate-900 to-gray-800 text-white border-slate-700 rounded-xl">
        <DialogHeader className="pb-4 border-b border-slate-700">
          <DialogTitle className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {mode === 'add' ? t('projectsPage.form.addTitle') : t('projectsPage.form.editTitle')}
          </DialogTitle>
        </DialogHeader>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 p-2 max-h-[70vh] overflow-y-auto custom-scrollbar"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label={t('projectsPage.form.nameLabel')} icon={Info} htmlFor="name" error={errors.name}>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t('projectsPage.form.namePlaceholder')} className="bg-slate-800 border-slate-600 focus:border-blue-500 placeholder-gray-500" />
            </FormField>
            <FormField label={t('projectsPage.form.typeLabel')} icon={Type} htmlFor="type" error={errors.type}>
              <Input id="type" name="type" value={formData.type} onChange={handleChange} placeholder={t('projectsPage.form.typePlaceholder')} className="bg-slate-800 border-slate-600 focus:border-purple-500 placeholder-gray-500" />
            </FormField>
          </div>

          <FormField label={t('projectsPage.form.descriptionLabel')} icon={Info} htmlFor="description">
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder={t('projectsPage.form.descriptionPlaceholder')} className="bg-slate-800 border-slate-600 focus:border-gray-500 placeholder-gray-500 min-h-[80px]" />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label={t('projectsPage.form.startDateLabel')} icon={CalendarIcon} htmlFor="startDate" error={errors.startDate}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`w-full justify-start text-left font-normal bg-slate-800 border-slate-600 hover:bg-slate-700 ${!formData.startDate && "text-gray-500"}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, 'PPP', { locale: dateFnsLocale }) : <span>{t('projectsPage.form.datePlaceholder')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                  <Calendar mode="single" selected={formData.startDate} onSelect={(date) => handleDateChange('startDate', date)} initialFocus locale={dateFnsLocale} />
                </PopoverContent>
              </Popover>
            </FormField>
            <FormField label={t('projectsPage.form.endDateLabel')} icon={CalendarIcon} htmlFor="endDate" error={errors.endDate}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`w-full justify-start text-left font-normal bg-slate-800 border-slate-600 hover:bg-slate-700 ${!formData.endDate && "text-gray-500"}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, 'PPP', { locale: dateFnsLocale }) : <span>{t('projectsPage.form.datePlaceholder')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                  <Calendar mode="single" selected={formData.endDate} onSelect={(date) => handleDateChange('endDate', date)} initialFocus locale={dateFnsLocale} />
                </PopoverContent>
              </Popover>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label={t('projectsPage.form.budgetLabel', { currency })} icon={DollarSign} htmlFor="budget" error={errors.budget}>
              <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder={t('projectsPage.form.budgetPlaceholder')} className="bg-slate-800 border-slate-600 focus:border-yellow-500 placeholder-gray-500" />
            </FormField>
            <FormField label={t('projectsPage.form.locationLabel')} icon={MapPin} htmlFor="location" error={errors.location}>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder={t('projectsPage.form.locationPlaceholder')} className="bg-slate-800 border-slate-600 focus:border-teal-500 placeholder-gray-500" />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label={t('projectsPage.form.statusLabel')} icon={Info} htmlFor="status">
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 focus:ring-indigo-500">
                  <SelectValue placeholder={t('projectsPage.form.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">
                  {projectStatuses.map(status => (
                    <SelectItem key={status} value={status} className="hover:bg-slate-700 focus:bg-slate-700">
                      {t(`status.${status.toLowerCase().replace('-', '')}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={t('projectsPage.form.priorityLabel')} icon={Info} htmlFor="priority">
              <Select name="priority" value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 focus:ring-pink-500">
                  <SelectValue placeholder={t('projectsPage.form.priorityPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">
                  {projectPriorities.map(priority => (
                    <SelectItem key={priority} value={priority} className="hover:bg-slate-700 focus:bg-slate-700">
                      {t(`priority.${priority.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label={t('projectsPage.form.assignedTeamLabel')} icon={Users} htmlFor="assignedTeam" error={errors.assignedTeam}>
            <Select
              name="assignedTeam"
              value={formData.assignedTeam[0] || ''}
              onValueChange={handleAssignedTeamChange}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 focus:ring-orange-500">
                <SelectValue placeholder={t('projectsPage.form.assignedTeamPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-700 max-h-48 overflow-y-auto">
                {(personnel || []).map(p => (
                  <SelectItem key={p.id} value={p.id} className="hover:bg-slate-700 focus:bg-slate-700">
                    {p.name} ({t(`personnelPage.roles.${p.role.toLowerCase()}`)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">{t('projectsPage.form.assignedTeamMultiSelectHint')}</p>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label={t('projectsPage.form.clientNameLabel')} icon={Users} htmlFor="clientName">
              <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} placeholder={t('projectsPage.form.clientNamePlaceholder')} className="bg-slate-800 border-slate-600 focus:border-cyan-500 placeholder-gray-500" />
            </FormField>
            <FormField label={t('projectsPage.form.completionLabel')} icon={Percent} htmlFor="completion">
              <Input id="completion" name="completion" type="number" min="0" max="100" value={formData.completion} onChange={handleChange} placeholder="0-100" className="bg-slate-800 border-slate-600 focus:border-lime-500 placeholder-gray-500" />
            </FormField>
          </div>

          <FormField label={t('projectsPage.form.colorLabel')} icon={Palette} htmlFor="color">
            <Select name="color" value={formData.color} onValueChange={(value) => handleSelectChange('color', value)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 focus:ring-rose-500">
                <SelectValue placeholder={t('projectsPage.form.colorPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-700">
                {projectColors.map(color => (
                  <SelectItem key={color.value} value={color.value} className="hover:bg-slate-700 focus:bg-slate-700">
                    <div className="flex items-center">
                      <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></span>
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <DialogFooter className="pt-8 mt-4 border-t border-slate-700">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-slate-600 hover:bg-slate-700 text-gray-300 hover:text-white">
                {t('actions.cancel')}
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
              {mode === 'add' ? t('projectsPage.form.addButton') : t('projectsPage.form.updateButton')}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;

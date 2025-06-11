import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarClock, PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useI18n } from '@/context/I18nContext';

const LabAppointments = () => {
  const { labAppointments, addLabAppointment, updateLabAppointment, deleteLabAppointment, projects, labTests, loading } = useAppContext();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [formMode, setFormMode] = useState('add'); 

  const initialFormData = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    projectId: '',
    testId: '',
    contactPerson: '',
    notes: '',
    status: 'scheduled'
  };
  const [formData, setFormData] = useState(initialFormData);

  const filteredAppointments = useMemo(() => {
    return labAppointments.filter(app => {
      const project = projects.find(p => p.id === app.projectId);
      const test = labTests.find(t => t.id === app.testId);
      const searchString = `${app.title} ${app.contactPerson} ${project?.name || ''} ${test?.type || ''} ${app.status}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    }).sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
  }, [labAppointments, projects, labTests, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'add') {
      addLabAppointment(formData);
    } else {
      updateLabAppointment(currentAppointment.id, formData);
    }
    setIsFormOpen(false);
    setFormData(initialFormData);
    setCurrentAppointment(null);
  };

  const openFormDialog = (mode, appointment = null) => {
    setFormMode(mode);
    if (mode === 'edit' && appointment) {
      setCurrentAppointment(appointment);
      setFormData({
        ...appointment,
        date: format(new Date(appointment.date), 'yyyy-MM-dd') 
      });
    } else {
      setCurrentAppointment(null);
      setFormData(initialFormData);
    }
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentAppointment) {
      deleteLabAppointment(currentAppointment.id);
    }
    setIsDeleteOpen(false);
    setCurrentAppointment(null);
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'cancelled') return 'bg-red-500';
    return 'bg-blue-500'; 
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) return <p>{t('common.loadingAppointments')}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <CalendarClock className="mr-3 h-8 w-8 text-primary" /> {t('labPersonnelPages.appointments.title')}
          </h1>
          <p className="text-muted-foreground">{t('labPersonnelPages.appointments.description')}</p>
        </div>
        <Button onClick={() => openFormDialog('add')} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> {t('labPersonnelPages.appointments.addNewButton')}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t('labPersonnelPages.appointments.searchPlaceholder')}
          className="pl-10 w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-10">
          <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">{t('labPersonnelPages.appointments.noAppointmentsFound')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? t('labPersonnelPages.appointments.noAppointmentsFilterHint') : t('labPersonnelPages.appointments.noAppointmentsGeneralHint')}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredAppointments.map(app => (
            <motion.div key={app.id} variants={itemVariants}>
              <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{app.title}</CardTitle>
                    <span className={`px-2 py-1 text-xs text-white rounded-full ${getStatusBadgeColor(app.status)}`}>
                      {t(`labPersonnelPages.appointments.card.status${app.status.charAt(0).toUpperCase() + app.status.slice(1)}`)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(app.date), 'PPP')} at {app.time}
                  </p>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  {app.projectId && <p><strong>{t('labPersonnelPages.appointments.card.projectPrefix')}:</strong> {projects.find(p => p.id === app.projectId)?.name || t('common.na')}</p>}
                  {app.testId && <p><strong>{t('labPersonnelPages.appointments.card.testPrefix')}:</strong> {labTests.find(t => t.id === app.testId)?.type || t('common.na')}</p>}
                  <p><strong>{t('labPersonnelPages.appointments.card.contactPrefix')}:</strong> {app.contactPerson}</p>
                  {app.notes && <p className="text-xs text-muted-foreground"><strong>{t('labPersonnelPages.appointments.card.notesPrefix')}:</strong> {app.notes}</p>}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openFormDialog('edit', app)}>
                    <Edit className="mr-1 h-3 w-3" /> {t('labPersonnelPages.appointments.card.editButton')}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(app)}>
                    <Trash2 className="mr-1 h-3 w-3" /> {t('labPersonnelPages.appointments.card.deleteButton')}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? t('labPersonnelPages.appointments.form.addTitle') : t('labPersonnelPages.appointments.form.editTitle')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div><Label htmlFor="title">{t('labPersonnelPages.appointments.form.titleLabel')}</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="date">{t('labPersonnelPages.appointments.form.dateLabel')}</Label><Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required /></div>
              <div><Label htmlFor="time">{t('labPersonnelPages.appointments.form.timeLabel')}</Label><Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} required /></div>
            </div>
            <div>
              <Label htmlFor="projectId">{t('labPersonnelPages.appointments.form.projectLabel')}</Label>
              <Select name="projectId" value={formData.projectId} onValueChange={(value) => handleSelectChange('projectId', value)}>
                <SelectTrigger><SelectValue placeholder={t('labPersonnelPages.appointments.form.projectPlaceholder')} /></SelectTrigger>
                <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="testId">{t('labPersonnelPages.appointments.form.testLabel')}</Label>
              <Select name="testId" value={formData.testId} onValueChange={(value) => handleSelectChange('testId', value)}>
                <SelectTrigger><SelectValue placeholder={t('labPersonnelPages.appointments.form.testPlaceholder')} /></SelectTrigger>
                <SelectContent>{labTests.map(t => <SelectItem key={t.id} value={t.id}>{t.type} (ID: {t.id})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label htmlFor="contactPerson">{t('labPersonnelPages.appointments.form.contactPersonLabel')}</Label><Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required /></div>
            <div>
              <Label htmlFor="status">{t('labPersonnelPages.appointments.form.statusLabel')}</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">{t('status.scheduled')}</SelectItem>
                  <SelectItem value="completed">{t('status.completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label htmlFor="notes">{t('labPersonnelPages.appointments.form.notesLabel')}</Label><Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>{t('labPersonnelPages.appointments.form.cancelButton')}</Button>
              <Button type="submit">{formMode === 'add' ? t('labPersonnelPages.appointments.form.addButton') : t('labPersonnelPages.appointments.form.updateButton')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('labPersonnelPages.appointments.deleteDialog.title')}</DialogTitle>
            <DialogDescription>{t('labPersonnelPages.appointments.deleteDialog.description', { appointmentTitle: currentAppointment?.title })}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>{t('actions.cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>{t('actions.delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabAppointments;
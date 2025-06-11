import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, PlusCircle, Trash2, Edit, CheckCircle, AlertCircle, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useI18n } from '@/context/I18nContext';

const TimeLogForm = ({ onSubmit, onCancel, projects, initialData }) => {
  const { t } = useI18n();
  const [date, setDate] = useState(initialData?.date || format(new Date(), 'yyyy-MM-dd'));
  const [hours, setHours] = useState(initialData?.hours || '');
  const [projectId, setProjectId] = useState(initialData?.projectId || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      id: initialData?.id || Date.now().toString(), 
      date, 
      hours: parseFloat(hours), 
      projectId, 
      description, 
      status: initialData?.status || 'pending' 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">{t('workerPages.timeLog.form.dateLabel')}</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="hours">{t('workerPages.timeLog.form.hoursLabel')}</Label>
          <Input id="hours" type="number" step="0.1" value={hours} onChange={(e) => setHours(e.target.value)} placeholder={t('workerPages.timeLog.form.hoursPlaceholder')} required />
        </div>
      </div>
      <div>
        <Label htmlFor="projectId">{t('workerPages.timeLog.form.projectLabel')}</Label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger><SelectValue placeholder={t('workerPages.timeLog.form.projectPlaceholder')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('common.none')}</SelectItem>
            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">{t('workerPages.timeLog.form.descriptionLabel')}</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('workerPages.timeLog.form.descriptionPlaceholder')} required />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>{t('workerPages.timeLog.form.cancelButton')}</Button>
        <Button type="submit">{initialData ? t('workerPages.timeLog.form.updateButton') : t('workerPages.timeLog.form.addButton')}</Button>
      </div>
    </form>
  );
};

const TimeLogCard = ({ log, project, onEdit, onDelete }) => {
  const { t } = useI18n();
  const getStatusBadge = (status) => {
    if (status === 'approved') return <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center"><CheckCircle className="h-3 w-3 mr-1" />{t('status.approved')}</span>;
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center"><Clock className="h-3 w-3 mr-1" />{t('status.pending')}</span>;
    if (status === 'rejected') return <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{t('status.rejected')}</span>;
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{format(new Date(log.date), 'PPP')} - {log.hours} {t('workerPages.timeLog.card.hoursSuffix')}</CardTitle>
            {getStatusBadge(log.status)}
          </div>
          {project && <CardDescription>{t('workerPages.timeLog.card.projectPrefix')}: {project.name}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{log.description}</p>
          {log.status === 'rejected' && log.notes && <p className="text-sm text-red-600 mt-1">{t('workerPages.timeLog.card.reasonPrefix')}: {log.notes}</p>}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {log.status === 'pending' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit(log)}><Edit className="h-4 w-4 mr-1" /> {t('workerPages.timeLog.card.editButton')}</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(log.id)}><Trash2 className="h-4 w-4 mr-1" /> {t('workerPages.timeLog.card.deleteButton')}</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const WorkerTimeLog = () => {
  const { projects, userProfile, loading, userTimeLogs, addUserTimeLog, updateUserTimeLog, deleteUserTimeLog } = useAppContext();
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTimeLogs = useMemo(() => {
    return userTimeLogs
      .filter(log => filterStatus === 'all' || log.status === filterStatus)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [userTimeLogs, filterStatus]);

  if (loading || !userProfile) {
    return <div className="flex items-center justify-center h-full">{t('common.loadingTimeLogs')}</div>;
  }

  const handleAddOrUpdateLog = (logData) => {
    if (editingLog) {
      updateUserTimeLog(editingLog.id, logData);
    } else {
      addUserTimeLog({ ...logData, assignedTo: userProfile.id });
    }
    setShowForm(false);
    setEditingLog(null);
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleDeleteLog = (logId) => {
    deleteUserTimeLog(logId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('workerPages.timeLog.title')}</h1>
          <p className="text-muted-foreground">{t('workerPages.timeLog.description')}</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditingLog(null); }}>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('workerPages.timeLog.addNewLogButton')}
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingLog ? t('workerPages.timeLog.editLogTitle') : t('workerPages.timeLog.addLogTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeLogForm 
              onSubmit={handleAddOrUpdateLog} 
              onCancel={() => { setShowForm(false); setEditingLog(null); }}
              projects={projects}
              initialData={editingLog}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('workerPages.timeLog.submittedLogsTitle')}</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('workerPages.timeLog.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('workerPages.timeLog.allStatuses')}</SelectItem>
                <SelectItem value="pending">{t('workerPages.timeLog.statusPending')}</SelectItem>
                <SelectItem value="approved">{t('workerPages.timeLog.statusApproved')}</SelectItem>
                <SelectItem value="rejected">{t('workerPages.timeLog.statusRejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTimeLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('workerPages.timeLog.noLogsFound')}</h3>
              <p className="text-muted-foreground mt-1">
                {filterStatus !== 'all' ? t('workerPages.timeLog.noLogsFilterHint') : t('workerPages.timeLog.noLogsGeneralHint')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTimeLogs.map(log => {
                const project = projects.find(p => p.id === log.projectId);
                return <TimeLogCard key={log.id} log={log} project={project} onEdit={handleEditLog} onDelete={handleDeleteLog} />;
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerTimeLog;
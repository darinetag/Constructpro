'use client';

import React, { useState, useMemo, useEffect } from 'react';
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

  const handleSubmit = e => {
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
          <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="hours">{t('workerPages.timeLog.form.hoursLabel')}</Label>
          <Input id="hours" type="number" step="0.1" value={hours} onChange={e => setHours(e.target.value)} required />
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
        <Input id="description" value={description} onChange={e => setDescription(e.target.value)} required />
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
  const getStatusBadge = status => {
    const icons = { approved: <CheckCircle />, pending: <Clock />, rejected: <AlertCircle /> };
    const colors = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center ${colors[status]}`}>
        {React.cloneElement(icons[status], { className: 'h-3 w-3 mr-1' })}{t(`status.${status}`)}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
              {format(new Date(log.date), 'PPP')} - {log.hours} {t('workerPages.timeLog.card.hoursSuffix')}
            </CardTitle>
            {getStatusBadge(log.status)}
          </div>
          {project && <CardDescription>{t('workerPages.timeLog.card.projectPrefix')}: {project.name}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{log.description}</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {log.status === 'pending' && (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit(log)}>
                <Edit className="h-4 w-4 mr-1" /> {t('workerPages.timeLog.card.editButton')}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(log.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> {t('workerPages.timeLog.card.deleteButton')}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const WorkerTimeLog = () => {
  const { t } = useI18n();

  const [userTimeLogs, setUserTimeLogs] = useState(() => {
    const stored = localStorage.getItem('userTimeLogs');
    return stored ? JSON.parse(stored) : [];
  });

  const [projects] = useState([
    { id: 'p1', name: 'Project Alpha' },
    { id: 'p2', name: 'Project Beta' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    localStorage.setItem('userTimeLogs', JSON.stringify(userTimeLogs));
  }, [userTimeLogs]);

  const filteredTimeLogs = useMemo(() => {
    return userTimeLogs
      .filter(log => filterStatus === 'all' || log.status === filterStatus)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [userTimeLogs, filterStatus]);

  const handleAddOrUpdateLog = logData => {
    setUserTimeLogs(prevLogs => {
      const existingIndex = prevLogs.findIndex(l => l.id === logData.id);
      if (existingIndex !== -1) {
        const updated = [...prevLogs];
        updated[existingIndex] = logData;
        return updated;
      } else {
        return [...prevLogs, logData];
      }
    });
    setShowForm(false);
    setEditingLog(null);
  };

  const handleDeleteLog = id => {
    setUserTimeLogs(prev => prev.filter(log => log.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('workerPages.timeLog.title')}</h1>
          <p>{t('workerPages.timeLog.description')}</p>
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
              onCancel={() => setShowForm(false)}
              projects={projects}
              initialData={editingLog}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('workerPages.timeLog.submittedLogsTitle')}</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('workerPages.timeLog.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                {['all', 'pending', 'approved', 'rejected'].map(val => (
                  <SelectItem key={val} value={val}>{t(`workerPages.timeLog.status${val.charAt(0).toUpperCase() + val.slice(1)}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTimeLogs.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <CalendarDays className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg">{t('workerPages.timeLog.noLogsFound')}</h3>
              <p>{t(filterStatus !== 'all' ? 'workerPages.timeLog.noLogsFilterHint' : 'workerPages.timeLog.noLogsGeneralHint')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTimeLogs.map(log => (
                <TimeLogCard
                  key={log.id}
                  log={log}
                  project={projects.find(p => p.id === log.projectId)}
                  onEdit={log => { setShowForm(true); setEditingLog(log); }}
                  onDelete={handleDeleteLog}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerTimeLog;

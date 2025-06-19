import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListChecks, Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/components/ui/use-toast';

const TaskCard = ({ task, project }) => {
  const { t } = useI18n();
  const { toast } = useToast();

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'in-progress') return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
    return <AlertCircle className="h-5 w-5 text-orange-500" />;
  };

  const handleMarkComplete = () => {
    toast({
      title: t('workerPages.tasks.card.actionCompleteToast', { taskName: task.title }),
      description: `Status: ${t('status.completed')}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            {getStatusIcon(task.status)}
          </div>
          <CardDescription>
            {t('workerPages.tasks.card.project')}: {project?.name || t('common.na')} | {t('workerPages.tasks.card.dueDate')}: {new Date(task.dueDate).toLocaleDateString(t('localeCode'))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{t('workerPages.tasks.card.description')}: {task.description || t('workerPages.tasks.card.noDescription')}</p>
          <p className="text-sm">{t('workerPages.tasks.card.priority')}: <span className="font-medium">{t(`priority.${task.priority?.toLowerCase() || 'medium'}`)}</span></p>
        </CardContent>
        <CardFooter className="flex justify-end">
          {task.status !== 'completed' && (
            <Button size="sm" onClick={handleMarkComplete}>
              {t('workerPages.tasks.card.markAsComplete')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};


const WorkerTasks = () => {
  const { projects, userProfile, loading, userTasks } = useAppContext();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const workerFilteredTasks = useMemo(() => {
    if (loading || !userProfile) return [];
    
    try {
      // Get data from localStorage
      const constructProPersonnel = JSON.parse(localStorage.getItem('constructProPersonnel') || '[]');
      const constructProSiteTasks = JSON.parse(localStorage.getItem('constructProSiteTasks') || '[]');
      
      // Find personnel by email
      const currentPersonnel = constructProPersonnel.find(person => {        
        return person.contact === userProfile.email;
      });
      
      if (!currentPersonnel) return [];
      
      // Filter tasks assigned to current personnel
      const userAssignedTasks = constructProSiteTasks.filter(task => task.assignedTo == currentPersonnel.id);
      
      // Apply search and status filters
      return userAssignedTasks.filter(task => {
        const projectForTask = projects.find(p => p.id == task.projectId);
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (projectForTask?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (task.priority?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }, [loading, userProfile, projects, searchTerm, filterStatus]);

  

  if (loading || !userProfile) {
    return <div className="flex items-center justify-center h-full">{t('common.loadingTasks')}</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('workerPages.tasks.title')}</h1>
          <p className="text-muted-foreground">{t('workerPages.tasks.description')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('workerPages.tasks.searchPlaceholder')}
                className="pl-9 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('workerPages.tasks.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('workerPages.tasks.statusAll')}</SelectItem>
                <SelectItem value="pending">{t('workerPages.tasks.statusPending')}</SelectItem>
                <SelectItem value="in-progress">{t('workerPages.tasks.statusInProgress')}</SelectItem>
                <SelectItem value="completed">{t('workerPages.tasks.statusCompleted')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {workerFilteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('workerPages.tasks.noTasksFound')}</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || filterStatus !== 'all' 
                  ? t('workerPages.tasks.noTasksFilterHint')
                  : t('workerPages.tasks.noTasksGeneralHint')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workerFilteredTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return <TaskCard key={task.id} task={task} project={project} />;
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerTasks;
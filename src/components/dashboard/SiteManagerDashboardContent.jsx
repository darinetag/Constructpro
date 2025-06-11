import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Users, AlertTriangle, ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/context/I18nContext';
import { useAppContext } from '@/context/AppContext';
import { Progress } from '@/components/ui/progress';

const StatCard = ({ title, value, icon, description, linkTo, linkText, children }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full card-hover">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              {icon && React.cloneElement(icon, { className: "h-5 w-5 mr-2 text-primary"})}
              {title}
            </CardTitle>
            {linkTo && (
              <Button variant="ghost" size="sm" asChild>
                <Link to={linkTo} className="text-xs">
                  {linkText} <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {value && <div className="text-3xl font-bold mb-2">{value}</div>}
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};


const SiteManagerDashboardContent = ({ projects, personnel, siteTasks, containerVariants }) => {
  const { t } = useI18n();
  const { userProfile } = useAppContext();

  const managedProjects = projects.filter(p => p.manager === userProfile?.id || p.siteManager === userProfile?.id);
  const managedProjectIds = managedProjects.map(p => p.id);
  
  const relevantTasks = siteTasks.filter(task => managedProjectIds.includes(task.projectId));

  const tasksToDo = relevantTasks.filter(task => task.status === 'todo').length;
  const tasksInProgress = relevantTasks.filter(task => task.status === 'in-progress').length;
  const tasksCompletedToday = relevantTasks.filter(task => 
    task.status === 'completed' && 
    new Date(task.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  const onSitePersonnelCount = personnel.filter(p => 
    managedProjects.some(mp => mp.assignedTeam && mp.assignedTeam.includes(p.id)) && p.status === 'active'
  ).length;
  
  const siteAlerts = [];
  managedProjects.forEach(project => {
    if (new Date(project.endDate) < new Date() && project.status !== 'completed') {
      siteAlerts.push({ 
        id: `sm-overdue-${project.id}`, 
        message: t('dashboard.siteManager.alerts.projectOverdue', { projectName: project.name }),
        type: 'project_overdue'
      });
    }
    const projectTasks = relevantTasks.filter(task => task.projectId === project.id);
    const overdueTasks = projectTasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed').length;
    if (overdueTasks > 0) {
      siteAlerts.push({
        id: `sm-overdue-tasks-${project.id}`,
        message: t('dashboard.siteManager.alerts.overdueTasks', { count: overdueTasks, projectName: project.name }),
        type: 'tasks_overdue'
      });
    }
  });


  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <StatCard 
        title={t('dashboard.siteManager.tasksSummary.title')}
        icon={<ClipboardList />}
        linkTo="/site-management"
        linkText={t('dashboard.siteManager.quickActions.goToTasks')}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>{t('dashboard.siteManager.tasksSummary.pending')}:</span> <span className="font-semibold">{tasksToDo}</span></div>
          <div className="flex justify-between"><span>{t('dashboard.siteManager.tasksSummary.inProgress')}:</span> <span className="font-semibold">{tasksInProgress}</span></div>
          <div className="flex justify-between"><span>{t('dashboard.siteManager.tasksSummary.completedToday')}:</span> <span className="font-semibold">{tasksCompletedToday}</span></div>
        </div>
      </StatCard>

      <StatCard 
        title={t('dashboard.siteManager.onSitePersonnel.title')}
        value={onSitePersonnelCount.toString()}
        icon={<Users />}
        description={t('dashboard.siteManager.onSitePersonnel.activeOnManagedProjects')}
        linkTo="/personnel"
        linkText={t('dashboard.siteManager.quickActions.viewPersonnel')}
      />

      <StatCard 
        title={t('dashboard.siteManager.siteAlerts.title')}
        icon={<AlertTriangle />}
        description={siteAlerts.length > 0 ? t('dashboard.siteManager.siteAlerts.issuesFound', {count: siteAlerts.length}) : t('dashboard.siteManager.siteAlerts.noAlerts')}
      >
        {siteAlerts.length > 0 ? (
          <ul className="space-y-2 text-sm max-h-32 overflow-y-auto">
            {siteAlerts.slice(0,3).map(alert => (
              <li key={alert.id} className="flex items-center">
                <AlertTriangle className={`h-4 w-4 mr-2 ${alert.type === 'project_overdue' ? 'text-red-500' : 'text-amber-500'}`} />
                {alert.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t('dashboard.siteManager.siteAlerts.allClear')}</p>
        )}
      </StatCard>

      {managedProjects.slice(0, 3).map(project => (
        <StatCard
          key={project.id}
          title={project.name}
          icon={<Briefcase />}
          description={t('dashboard.siteManager.projectProgress.location', {location: project.location})}
          linkTo={`/projects/${project.id}`} 
          linkText={t('dashboard.siteManager.projectProgress.viewDetails')}
        >
          <div className="text-sm mt-1">
            <div className="flex justify-between items-center mb-1">
              <span>{t('dashboard.siteManager.projectProgress.completion')}:</span>
              <span className="font-semibold">{project.completion}%</span>
            </div>
            <Progress value={project.completion} className="h-2" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{t('dashboard.siteManager.projectProgress.startDate')}: {new Date(project.startDate).toLocaleDateString(t('localeCode'))}</span>
              <span>{t('dashboard.siteManager.projectProgress.endDate')}: {new Date(project.endDate).toLocaleDateString(t('localeCode'))}</span>
            </div>
          </div>
        </StatCard>
      ))}
      
      {managedProjects.length === 0 && (
         <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>{t('dashboard.siteManager.noManagedProjectsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('dashboard.siteManager.noManagedProjectsDescription')}</p>
                <Button asChild className="mt-4">
                    <Link to="/projects">{t('dashboard.siteManager.viewAllProjectsButton')}</Link>
                </Button>
            </CardContent>
        </Card>
      )}

    </motion.div>
  );
};

export default SiteManagerDashboardContent;
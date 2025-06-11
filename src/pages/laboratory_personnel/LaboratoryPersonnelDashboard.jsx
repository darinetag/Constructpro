import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ListChecks, CalendarClock, Briefcase, Microscope, Users, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/I18nContext';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateFnsLocaleMapping';

const StatCard = ({ titleKey, value, icon: Icon, to, color }) => {
  const { t } = useI18n();
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Link to={to}>
        <Card className={`h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${color}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t(titleKey)}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const LaboratoryPersonnelDashboard = () => {
  const { labTests, labAppointments, projects, userProfile, labServices } = useAppContext();
  const { t, locale } = useI18n();
  const dateFnsLocale = getDateFnsLocale(locale);

  const pendingTests = labTests.filter(test => test.status === 'pending').length;
  const upcomingAppointments = labAppointments.filter(app => new Date(app.date) >= new Date()).length;
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const totalServices = labServices.length;

  const recentActivity = labTests
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(test => {
      const project = projects.find(p => p.id === test.projectId);
      const formattedDate = format(new Date(test.date), 'PP', { locale: dateFnsLocale });
      return {
        id: test.id,
        description: t('labPersonnelPages.dashboard.recentActivity.testDescriptionFull', {
          type: test.type,
          project: project?.name || t('common.na'),
          date: formattedDate,
          status: t(`status.${test.status.toLowerCase()}`)
        }),
        status: test.status
      };
    });


  return (
    <div className="space-y-8 p-1">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('labPersonnelPages.dashboard.welcome')}</h1>
        <p className="text-muted-foreground">{t('labPersonnelPages.dashboard.overview')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard titleKey="labPersonnelPages.dashboard.statCards.pendingTests" value={pendingTests} icon={ListChecks} to="/lab/tests" color="border-yellow-500" />
        <StatCard titleKey="labPersonnelPages.dashboard.statCards.upcomingAppointments" value={upcomingAppointments} icon={CalendarClock} to="/lab/appointments" color="border-blue-500" />
        <StatCard titleKey="labPersonnelPages.dashboard.statCards.associatedProjects" value={activeProjects} icon={Briefcase} to="/lab/projects" color="border-green-500" />
        <StatCard titleKey="labPersonnelPages.dashboard.statCards.servicesOffered" value={totalServices} icon={Microscope} to="/lab/services" color="border-purple-500" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />{t('labPersonnelPages.dashboard.recentActivity.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="flex items-start text-sm">
                    {activity.status === 'passed' && <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />}
                    {activity.status === 'failed' && <AlertTriangle className="h-4 w-4 mr-2 text-red-500 shrink-0 mt-0.5" />}
                    {activity.status === 'pending' && <CalendarClock className="h-4 w-4 mr-2 text-yellow-500 shrink-0 mt-0.5" />}
                    <span className="text-muted-foreground">{activity.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">{t('labPersonnelPages.dashboard.recentActivity.noActivity')}</p>
            )}
             <Link to="/lab/tests">
                <Button variant="link" className="mt-4 p-0 text-primary">{t('labPersonnelPages.dashboard.recentActivity.viewAll')}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary" />{t('labPersonnelPages.dashboard.quickActions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link to="/lab/tests">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                <ListChecks className="mr-2 h-4 w-4" /> {t('labPersonnelPages.dashboard.quickActions.manageTests')}
              </Button>
            </Link>
            <Link to="/lab/appointments">
              <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
                <CalendarClock className="mr-2 h-4 w-4" /> {t('labPersonnelPages.dashboard.quickActions.schedule')}
              </Button>
            </Link>
            <Link to="/lab/projects">
              <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                <Briefcase className="mr-2 h-4 w-4" /> {t('labPersonnelPages.dashboard.quickActions.viewProjects')}
              </Button>
            </Link>
             <Link to="/lab/services">
              <Button className="w-full justify-start bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white">
                <Microscope className="mr-2 h-4 w-4" /> {t('labPersonnelPages.dashboard.quickActions.labServices')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaboratoryPersonnelDashboard;
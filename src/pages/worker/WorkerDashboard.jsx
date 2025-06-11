import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Clock, Wallet, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';

const StatCard = ({ titleKey, value, icon, linkTo, linkTextKey, descriptionKey }) => {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t(titleKey)}</CardTitle>
            {icon}
          </div>
          {descriptionKey && <CardDescription className="text-sm">{t(descriptionKey)}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-3xl font-bold text-primary">{value}</div>
        </CardContent>
        {linkTo && (
          <div className="p-4 pt-0 border-t mt-auto">
            <Button asChild variant="outline" className="w-full">
              <Link to={linkTo} className="flex items-center justify-center">
                {t(linkTextKey)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

const WorkerDashboard = () => {
  const { marketplace, userProfile, loading, userTasks, userTimeLogs, userPayments } = useAppContext();
  const { t } = useI18n();

  if (loading || !userProfile) {
    return <div className="flex items-center justify-center h-full">{t('common.loadingWorkerData')}</div>;
  }

  const pendingTasksCount = userTasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;
  const pendingTimeLogsCount = userTimeLogs.filter(log => log.status === 'pending').length;
  const totalPaid = userPayments.reduce((sum, p) => sum + p.amount, 0);
  const activeListingsCount = marketplace.filter(item => item.contact === userProfile.email || item.name === userProfile.name).length;

  const getLatestItem = (items, dateField) => {
    if (!items || items.length === 0) return undefined;
    const sortedItems = [...items].sort((a, b) => new Date(b[dateField]) - new Date(a[dateField]));
    return sortedItems[0];
  };

  const lastTask = getLatestItem(userTasks, 'dueDate');
  
  const pendingLogs = userTimeLogs.filter(log => log.status === 'pending');
  const lastPendingLog = getLatestItem(pendingLogs, 'date');
  
  const lastPayment = getLatestItem(userPayments, 'date');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.worker.welcome')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          titleKey="dashboard.worker.stats.activeTasksTitle" 
          value={pendingTasksCount} 
          icon={<ListChecks className="h-6 w-6 text-blue-500" />}
          descriptionKey="dashboard.worker.stats.activeTasksDesc"
          linkTo="/worker/tasks"
          linkTextKey="dashboard.worker.viewAllTasks"
        />
        <StatCard 
          titleKey="dashboard.worker.stats.pendingTimeLogsTitle" 
          value={pendingTimeLogsCount} 
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          descriptionKey="dashboard.worker.stats.pendingTimeLogsDesc"
          linkTo="/worker/time-log"
          linkTextKey="dashboard.worker.viewTimeLogs"
        />
        <StatCard 
          titleKey="dashboard.worker.stats.totalPaymentsTitle" 
          value={`${totalPaid.toLocaleString(t('localeCode'))} ${t('currency.dZD')}`}
          icon={<Wallet className="h-6 w-6 text-green-500" />}
          descriptionKey="dashboard.worker.stats.totalPaymentsDesc"
          linkTo="/worker/payments"
          linkTextKey="dashboard.worker.viewPaymentHistory"
        />
        <StatCard 
          titleKey="dashboard.worker.stats.myListingsTitle" 
          value={activeListingsCount} 
          icon={<ShoppingBag className="h-6 w-6 text-purple-500" />}
          descriptionKey="dashboard.worker.stats.myListingsDesc"
          linkTo="/worker/marketplace"
          linkTextKey="navigation.myServices"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.worker.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild size="lg">
              <Link to="/worker/time-log" className="flex items-center justify-center">
                <Clock className="mr-2 h-5 w-5" /> {t('dashboard.worker.logTime')}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/worker/marketplace" className="flex items-center justify-center">
                <ShoppingBag className="mr-2 h-5 w-5" /> {t('dashboard.worker.addService')}
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.worker.recentActivity.title')}</CardTitle>
            <CardDescription>{t('dashboard.worker.recentActivity.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {(lastTask || lastPendingLog || lastPayment) ? (
              <ul className="space-y-2 text-sm">
                {lastTask && (
                  <li className="flex items-center">
                    <ListChecks className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{t('dashboard.worker.recentActivity.lastTaskAssigned', { taskName: lastTask.name, dueDate: new Date(lastTask.dueDate).toLocaleDateString(t('localeCode')) })}</span>
                  </li>
                )}
                {lastPendingLog && (
                   <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{t('dashboard.worker.recentActivity.pendingTimeLog', { date: new Date(lastPendingLog.date).toLocaleDateString(t('localeCode')) })}</span>
                  </li>
                )}
                {lastPayment && (
                  <li className="flex items-center">
                    <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{t('dashboard.worker.recentActivity.lastPaymentReceived', { date: new Date(lastPayment.date).toLocaleDateString(t('localeCode')), amount: lastPayment.amount.toLocaleString(t('localeCode')), currency: t('currency.dZD') })}</span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t('dashboard.worker.recentActivity.noActivity')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;
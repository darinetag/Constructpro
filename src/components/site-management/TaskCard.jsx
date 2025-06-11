import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, UserCheck, CalendarDays, CheckCircle, XCircle, Clock, AlertTriangle as PriorityIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateFnsLocaleMapping';
import { useI18n } from '@/context/I18nContext';

const TaskCard = ({ task, project, assignedUser, onEdit, onDelete, onStatusChange }) => {
  const { t, locale } = useI18n();
  const dateFnsLocale = getDateFnsLocale(locale);

  const priorityStyles = {
    low: {
      badge: 'border-sky-500 bg-sky-100 text-sky-700',
      icon: 'text-sky-600',
      cardBorder: 'border-sky-300',
    },
    medium: {
      badge: 'border-yellow-500 bg-yellow-100 text-yellow-700',
      icon: 'text-yellow-600',
      cardBorder: 'border-yellow-300',
    },
    high: {
      badge: 'border-orange-500 bg-orange-100 text-orange-700',
      icon: 'text-orange-600',
      cardBorder: 'border-orange-300',
    },
    critical: {
      badge: 'border-red-500 bg-red-100 text-red-700',
      icon: 'text-red-600',
      cardBorder: 'border-red-300',
    },
  };

  const statusStyles = {
    pending: { icon: <Clock className="h-3.5 w-3.5 text-yellow-600" />, badge: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    'in-progress': { icon: <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Clock className="h-3.5 w-3.5 text-blue-600" /></motion.div>, badge: 'bg-blue-100 text-blue-700 border-blue-300' },
    completed: { icon: <CheckCircle className="h-3.5 w-3.5 text-green-600" />, badge: 'bg-green-100 text-green-700 border-green-300' },
    'on-hold': { icon: <XCircle className="h-3.5 w-3.5 text-gray-500" />, badge: 'bg-gray-100 text-gray-600 border-gray-300' },
    cancelled: { icon: <XCircle className="h-3.5 w-3.5 text-red-600" />, badge: 'bg-red-100 text-red-700 border-red-300' },
  };

  const currentPriorityStyle = priorityStyles[task.priority] || priorityStyles.medium;
  const currentStatusStyle = statusStyles[task.status] || statusStyles.pending;

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <motion.div variants={cardVariants} layout>
      <Card className={`card-component border ${currentPriorityStyle.cardBorder} hover:shadow-primary/20 transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full`}>
        <CardHeader className="pb-3 pt-4 px-5 border-b">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold text-main leading-tight flex-1">{task.title}</CardTitle>
            <div className="flex-shrink-0">
              <Select value={task.status} onValueChange={(newStatus) => onStatusChange(task.id, newStatus)}>
                <SelectTrigger className={`h-8 text-xs px-2 w-auto min-w-[110px] ${currentStatusStyle.badge} focus:ring-0 focus:ring-offset-0 border select-trigger-custom`}>
                  <div className="flex items-center gap-1.5">
                    {currentStatusStyle.icon}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                   {Object.keys(statusStyles).map(s => (
                     <SelectItem key={s} value={s} className="select-item-custom text-xs">
                       <div className="flex items-center gap-1.5">
                         {statusStyles[s].icon}
                         <span>{t(`status.${s.replace('-', '')}`)}</span>
                       </div>
                     </SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {project && <CardDescription className="text-xs text-primary mt-1.5">{t('siteManagement.projectLabel')}: {project.name}</CardDescription>}
        </CardHeader>
        <CardContent className="p-5 space-y-3 flex-grow">
          {task.description ? (
            <p className="text-sm text-muted-custom line-clamp-3 leading-relaxed">{task.description}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">{t('siteManagement.task.noDescription')}</p>
          )}
          <div className="flex items-center text-xs text-muted-custom">
            <PriorityIcon className={`h-3.5 w-3.5 mr-1.5 ${currentPriorityStyle.icon}`} />
            <span className={`px-2 py-0.5 rounded-full font-medium border text-xs ${currentPriorityStyle.badge}`}>{t(`priority.${task.priority}`)}</span>
          </div>
          <div className="flex items-center text-xs text-muted-custom">
            <UserCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {t('siteManagement.task.assignedTo')}: {assignedUser ? `${assignedUser.name} (${assignedUser.role})` : <span className="italic text-gray-400">{t('common.unassigned')}</span>}
          </div>
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-custom">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary" />
              {t('siteManagement.task.dueDate')}: {format(new Date(task.dueDate), 'PP', { locale: dateFnsLocale })}
            </div>
          )}
        </CardContent>
        <div className="p-3 border-t bg-gray-50 flex justify-end space-x-2">
          <Button variant="ghost" size="iconSm" onClick={() => onEdit(task)} className="button-ghost-custom h-8 w-8 rounded-md p-1.5">
            <Edit className="h-4 w-4" /> <span className="sr-only">{t('actions.edit')}</span>
          </Button>
          <Button variant="ghost" size="iconSm" onClick={() => onDelete(task)} className="text-gray-500 hover:text-red-600 hover:bg-red-100 h-8 w-8 rounded-md p-1.5">
            <Trash2 className="h-4 w-4" /> <span className="sr-only">{t('actions.delete')}</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
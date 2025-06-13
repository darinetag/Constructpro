import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit3, Trash2, CalendarDays, MapPin, DollarSign, CheckCircle, Clock, PauseCircle, ArchiveRestore, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { getDateFnsLocale } from '@/lib/dateFnsLocaleMapping.js';

const ProjectCard = ({ project, onEdit, onDelete, onRestore, isBinned, viewMode, currencySymbol }) => {
  const { t, locale } = useI18n();
  const dateFnsLocale = getDateFnsLocale(locale);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'planning':
        return { text: t('projectsPage.statusPlanning'), icon: <Clock className="h-4 w-4 mr-1" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', progressColor: 'bg-blue-500' };
      case 'in-progress':
        return { text: t('projectsPage.statusInProgress'), icon: <Clock className="h-4 w-4 mr-1" />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300', progressColor: 'bg-yellow-500' };
      case 'completed':
        return { text: t('projectsPage.statusCompleted'), icon: <CheckCircle className="h-4 w-4 mr-1" />, color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300', progressColor: 'bg-green-500' };
      case 'on-hold':
        return { text: t('projectsPage.statusOnHold'), icon: <PauseCircle className="h-4 w-4 mr-1" />, color: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300', progressColor: 'bg-gray-500' };
      default:
        return { text: status, icon: null, color: 'bg-gray-200 text-gray-800', progressColor: 'bg-gray-500' };
    }
  };

  const statusInfo = getStatusInfo(project.status);
  const formattedStartDate = project.startDate ? new Date(project.startDate).toLocaleDateString(locale) : t('common.na');
  const formattedEndDate = project.endDate ? new Date(project.endDate).toLocaleDateString(locale) : t('common.na');
  const deletedAtRelative = project.deletedAt ? formatDistanceToNow(new Date(project.deletedAt), { addSuffix: true, locale: dateFnsLocale }) : null;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const cardBaseClass = "overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border rounded-xl";
  const binnedCardClass = isBinned ? "border-amber-500/50 bg-amber-50/10 dark:bg-amber-900/20 opacity-75 hover:opacity-100" : "border-border/50 bg-card";

  if (viewMode === 'list') {
    return (
      <motion.div variants={cardVariants}>
        <Card className={cn("w-full flex flex-col sm:flex-row", cardBaseClass, binnedCardClass)}>
          <div className="flex-1 p-5">
            <div className="flex justify-between items-start mb-2">
              <CardTitle className={cn("text-xl font-semibold", isBinned ? "text-amber-600 dark:text-amber-400" : "text-primary")}>{project.name}</CardTitle>
              {!isBinned && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.icon}
                  {statusInfo.text}
                </span>
              )}
              {isBinned && deletedAtRelative && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-100">
                  <Trash2 className="h-3 w-3 mr-1.5" />
                  {t('projectsPage.deletedTimeAgo', { time: deletedAtRelative })}
                </span>
              )}
            </div>
            <CardDescription className={cn("text-sm mb-3 line-clamp-2", isBinned ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground")}>{project.description}</CardDescription>
            
            {!isBinned && (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-sky-500" /> {project.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" /> {project.budget.toLocaleString(locale)} {currencySymbol}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-2 text-purple-500" /> {formattedStartDate} - {formattedEndDate}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>{t('projectsPage.card.progress')}</span>
                    <span>{project.completion}%</span>
                  </div>
                  <Progress value={project.completion} className={`h-2.5 rounded-full ${statusInfo.progressColor}`} indicatorClassName={statusInfo.progressColor} />
                </div>
              </>
            )}
          </div>
          <div className={cn(
            "flex sm:flex-col items-center justify-end sm:justify-center gap-2 p-4",
            isBinned ? "bg-amber-100/30 dark:bg-amber-800/30" : "bg-muted/30",
            locale === 'ar' ? "sm:border-r sm:border-l-0" : "sm:border-l",
            isBinned ? "sm:border-amber-500/50" : "sm:border-border/50"
            )}>
            {isBinned ? (
              <>
                <Button variant="outline" size="sm" onClick={() => onRestore(project)} className="w-full sm:w-auto hover:bg-green-500/20 hover:text-green-600 dark:hover:text-green-400 border-green-500/50 text-green-600 dark:text-green-400 transition-colors">
                  <ArchiveRestore className="h-4 w-4 mr-1 sm:mr-0 md:mr-1" /> <span className="hidden md:inline">{t('actions.restore')}</span>
                </Button>
                <Button
  variant="outline"
  size="sm"
  onClick={() => onDelete(project.id)}
  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
>
  <Trash2 className="h-4 w-4 mr-1" /> Delete
</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => onEdit(project)} className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary transition-colors">
                  <Edit3 className="h-4 w-4 mr-1 sm:mr-0 md:mr-1" /> <span className="hidden md:inline">{t('actions.edit')}</span>
                </Button>
                <Button
  variant="outline"
  size="sm"
  onClick={() => onDelete(project.id)}
  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
>
  <Trash2 className="h-4 w-4 mr-1" /> Delete
</Button>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants}>
      <Card className={cn("flex flex-col h-full", cardBaseClass, binnedCardClass)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className={cn("text-xl font-semibold", isBinned ? "text-amber-600 dark:text-amber-400" : "text-primary")}>{project.name}</CardTitle>
            {!isBinned && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.text}
              </span>
            )}
            {isBinned && deletedAtRelative && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-100">
                <Trash2 className="h-3 w-3 mr-1.5" />
                {t('projectsPage.deletedTimeAgo', { time: deletedAtRelative })}
              </span>
            )}
          </div>
          <CardDescription className={cn("text-sm pt-1 line-clamp-2", isBinned ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground")}>{project.description}</CardDescription>
        </CardHeader>
        {!isBinned && (
          <CardContent className="flex-grow space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 text-sky-500" /> {project.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2 text-green-500" /> {t('projectsPage.card.budget')}: {project.budget.toLocaleString(locale)} {currencySymbol}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-2 text-purple-500" /> {formattedStartDate} - {formattedEndDate}
            </div>
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>{t('projectsPage.card.progress')}</span>
                <span>{project.completion}%</span>
              </div>
              <Progress value={project.completion} className={`h-2.5 rounded-full ${statusInfo.progressColor}`} indicatorClassName={statusInfo.progressColor} />
            </div>
          </CardContent>
        )}
        {isBinned && (
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-3" />
                <p className="text-amber-600 dark:text-amber-400 font-medium">{t('projectsPage.projectInBin')}</p>
                <p className="text-xs text-amber-500 dark:text-amber-500">{t('projectsPage.projectInBinDescription')}</p>
            </CardContent>
        )}
        <CardFooter className={cn("flex justify-end gap-2 pt-4 border-t p-4", isBinned ? "border-amber-500/30 bg-amber-100/20 dark:bg-amber-800/20" : "border-border/20 bg-muted/20")}>
          {isBinned ? (
            <>
              <Button variant="outline" size="sm" onClick={() => onRestore(project)} className="hover:bg-green-500/20 hover:text-green-600 dark:hover:text-green-400 border-green-500/50 text-green-600 dark:text-green-400 transition-colors">
                <ArchiveRestore className="h-4 w-4 mr-1" /> {t('actions.restore')}
              </Button>
             <Button
  variant="outline"
  size="sm"
  onClick={() => onDelete(project.id)}
  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
>
  <Trash2 className="h-4 w-4 mr-1" /> Delete
</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit(project)} className="hover:bg-primary/10 hover:text-primary transition-colors">
                <Edit3 className="h-4 w-4 mr-1" /> {t('actions.edit')}
              </Button>
              <Button
  variant="outline"
  size="sm"
  onClick={() => onDelete(project.id)}
  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
>
  <Trash2 className="h-4 w-4 mr-1" /> Delete
</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;

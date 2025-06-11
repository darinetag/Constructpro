import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useI18n } from '@/context/I18nContext';

const UpcomingDeadlinesCard = ({ projects }) => {
  const { t } = useI18n();

  const upcomingDeadlines = projects
    .filter(p => p.status !== 'completed' && new Date(p.endDate) >= new Date())
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 3);

  const getDeadlineColor = (daysLeft) => {
    if (daysLeft <= 7) return 'text-red-500';
    if (daysLeft <= 30) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarClock className="h-5 w-5 mr-2 text-primary" />
          {t('dashboard.admin.upcomingDeadlines.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.admin.upcomingDeadlines.description') || 'Projects with approaching end dates.'}</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingDeadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.upcomingDeadlines.noDeadlines')}</p>
        ) : (
          <ul className="space-y-3">
            {upcomingDeadlines.map(project => {
              const daysLeft = differenceInDays(new Date(project.endDate), new Date());
              return (
                <li key={project.id} className="flex justify-between items-center pb-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.admin.upcomingDeadlines.dueDate', { date: format(new Date(project.endDate), 'PPP') }) || `Due: ${format(new Date(project.endDate), 'PPP')}`}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold ${getDeadlineColor(daysLeft)}`}>
                    {t('dashboard.admin.upcomingDeadlines.daysLeft', { count: daysLeft }) || `${daysLeft} days left`}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        {projects.length > 3 && (
           <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link to="/projects">{t('dashboard.admin.upcomingDeadlines.viewAllProjects')}</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

UpcomingDeadlinesCard.defaultProps = {
  projects: []
};


export default UpcomingDeadlinesCard;
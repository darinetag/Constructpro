import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/context/I18nContext';

const ProjectFinances = React.memo(({ projects, finances }) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  return (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle>{t('financePage.projectFinances.title')}</CardTitle>
      <CardDescription>{t('financePage.projectFinances.description')}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {projects.map(project => {
          const projectExpenses = finances
            .filter(f => f.projectId === project.id && f.type === 'expense')
            .reduce((sum, f) => sum + f.amount, 0);
          
          const projectIncome = finances
            .filter(f => f.projectId === project.id && f.type === 'income')
            .reduce((sum, f) => sum + f.amount, 0);
          
          const budgetUsed = project.budget > 0 ? (projectExpenses / project.budget) * 100 : 0;
          
          return (
            <div key={project.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{project.name}</span>
                <span className="font-medium">{projectExpenses.toLocaleString(t('localeCode'))} {currencySymbol} / {project.budget.toLocaleString(t('localeCode'))} {currencySymbol}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('financePage.projectFinances.budgetUsed', { percentage: budgetUsed.toFixed(1) })}</span>
                <span>{t('financePage.projectFinances.balance')}: {(projectIncome - projectExpenses).toLocaleString(t('localeCode'))} {currencySymbol}</span>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
  );
});

export default ProjectFinances;
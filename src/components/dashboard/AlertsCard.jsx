import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, FileWarning as PackageWarning, DollarSign, Clock } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const AlertsCard = ({ projects, materials, finances }) => {
  const { t } = useI18n();
  const alerts = [];

  // Low stock alert
  materials.forEach(material => {
    if (material.quantity < 50) { // Example threshold
      alerts.push({
        id: `low-stock-${material.id}`,
        type: 'low-stock',
        message: t('dashboard.admin.alerts.lowStockAlert', { materialName: material.name, quantity: material.quantity, unit: material.unit }),
        icon: <PackageWarning className="h-4 w-4 text-amber-500" />
      });
    }
  });

  // Budget overrun alert (simplified)
  projects.forEach(project => {
    const projectExpenses = finances
      .filter(f => f.projectId === project.id && f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0);
    if (project.budget > 0 && projectExpenses > project.budget) {
      alerts.push({
        id: `budget-${project.id}`,
        type: 'budget-overrun',
        message: t('dashboard.admin.alerts.budgetOverrunAlert', { projectName: project.name, overBudgetBy: (projectExpenses - project.budget).toLocaleString(), currency: t('currency.dZD') }),
        icon: <DollarSign className="h-4 w-4 text-red-500" />
      });
    }
  });
  
  // Overdue tasks (mock example, needs actual task data)
  // For demonstration, let's add a mock overdue task if a project is past its end date but not completed
  projects.forEach(project => {
    if (new Date(project.endDate) < new Date() && project.status !== 'completed') {
      alerts.push({
        id: `overdue-task-project-${project.id}`,
        type: 'overdue-task',
        message: t('dashboard.admin.alerts.overdueTaskAlert', { taskName: "Finalize Report", projectName: project.name }),
        icon: <Clock className="h-4 w-4 text-destructive" />
      });
    }
  });


  const displayedAlerts = alerts.slice(0, 4); // Display max 4 alerts

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
          {t('dashboard.admin.alerts.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.admin.alerts.description') || 'Important updates and potential issues.'}</CardDescription>
      </CardHeader>
      <CardContent>
        {displayedAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('dashboard.admin.alerts.noAlerts')}</p>
        ) : (
          <ul className="space-y-3">
            {displayedAlerts.map(alert => (
              <li key={alert.id} className="flex items-start space-x-3 pb-2 border-b last:border-b-0">
                {alert.icon}
                <p className="text-sm">{alert.message}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

AlertsCard.defaultProps = {
  projects: [],
  materials: [],
  finances: []
};

export default AlertsCard;
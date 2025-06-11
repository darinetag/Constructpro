import React from 'react';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import { Users, Banknote, Package, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/context/I18nContext';

const OverviewStats = ({ projects, personnel, materials, finances, containerVariants, currency }) => {
  const { t } = useI18n();

  const activeProjectsCount = projects.filter(p => p.status === 'in-progress').length;
  const totalProjectsCount = projects.length;
  const totalPersonnelCount = personnel.length;
  const activePersonnelCount = personnel.filter(p => p.status === 'active').length;
  
  const totalExpenses = finances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);
  
  const totalIncome = finances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);
  
  const totalMaterialsValue = materials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);
  
  const avgCompletion = totalProjectsCount > 0 
    ? projects.reduce((sum, p) => sum + p.completion, 0) / totalProjectsCount 
    : 0;

  const lowStockMaterialsCount = materials.filter(m => m.quantity < 100).length;
  const sufficientStockMaterialsCount = materials.length - lowStockMaterialsCount;

  const activePersonnelPercentage = totalPersonnelCount > 0 ? (activePersonnelCount / totalPersonnelCount) * 100 : 0;
  const incomeVsExpensePercentage = (totalIncome + totalExpenses) > 0 ? (totalIncome / (totalIncome + totalExpenses)) * 100 : 0;


  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <StatCard
        titleKey="dashboard.admin.statCard.activeProjects"
        value={activeProjectsCount}
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        descriptionKey="dashboard.admin.statCard.activeProjectsDesc"
        descriptionValue={totalProjectsCount}
        progressValue={avgCompletion}
        progressTextKey="dashboard.admin.statCard.avgCompletion"
        progressTextValue={parseFloat(avgCompletion.toFixed(0))}
      />
      <StatCard
        titleKey="dashboard.admin.statCard.personnel"
        value={activePersonnelCount}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        descriptionKey="dashboard.admin.statCard.personnelDesc"
        descriptionValue={totalPersonnelCount}
        progressValue={activePersonnelPercentage}
        progressTextKey="dashboard.admin.statCard.activeRate"
        progressTextValue={parseFloat(activePersonnelPercentage.toFixed(0))}
      />
      <StatCard
        titleKey="dashboard.admin.statCard.budget"
        value={totalIncome - totalExpenses}
        currency={currency}
        icon={<Banknote className="h-4 w-4 text-muted-foreground" />}
        descriptionKey="dashboard.admin.statCard.currentBalance"
        footerContent={
          <div className="flex-1">
            <div className="text-xs font-medium mb-1">{t('dashboard.admin.statCard.incomeVsExpenses')}</div>
            <Progress 
              value={incomeVsExpensePercentage} 
              className="h-2" 
            />
             <p className="text-xs text-muted-foreground mt-1">
              {t('dashboard.admin.statCard.incomePercent', { value: parseFloat(incomeVsExpensePercentage.toFixed(0)) })}
            </p>
          </div>
        }
      />
      <StatCard
        titleKey="dashboard.admin.statCard.materials"
        value={totalMaterialsValue}
        currency={currency}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        descriptionKey="dashboard.admin.statCard.inventoryValue"
        footerContent={
          <div>
            <div className="text-xs font-medium mb-1">{t('dashboard.admin.statCard.inventoryStatus')}</div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="text-xs">{t('dashboard.admin.statCard.sufficientStock', { count: sufficientStockMaterialsCount })}</div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="text-xs">{t('dashboard.admin.statCard.lowStock', { count: lowStockMaterialsCount })}</div>
            </div>
          </div>
        }
      />
    </motion.div>
  );
};

export default OverviewStats;
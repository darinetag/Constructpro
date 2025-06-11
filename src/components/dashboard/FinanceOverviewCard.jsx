import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/context/I18nContext';

const FinanceOverviewCard = ({ totalIncome, totalExpenses }) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  const balance = totalIncome - totalExpenses;
  const incomePercentage = (totalIncome + totalExpenses) > 0 ? (totalIncome / (totalIncome + totalExpenses)) * 100 : 0;
  const expensePercentage = (totalIncome + totalExpenses) > 0 ? (totalExpenses / (totalIncome + totalExpenses)) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.financeOverview.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{t('dashboard.financeOverview.totalIncome')}</div>
              <div className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString(t('localeCode'))} {currencySymbol}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t('dashboard.financeOverview.totalExpenses')}</div>
              <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString(t('localeCode'))} {currencySymbol}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">{t('dashboard.financeOverview.balance')}</div>
            <div className="text-2xl font-bold">{balance.toLocaleString(t('localeCode'))} {currencySymbol}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">{t('dashboard.financeOverview.incomeVsExpenses')}</div>
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${incomePercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <div>{t('dashboard.financeOverview.incomeLabel')}: {incomePercentage.toFixed(0)}%</div>
              <div>{t('dashboard.financeOverview.expensesLabel')}: {expensePercentage.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceOverviewCard;
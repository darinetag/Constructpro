import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, TrendingUp, TrendingDown } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const FinanceSummaryCard = React.memo(({ titleKey, value, icon, transactionsCount, colorClass = 'text-blue-600', bgColorClass = 'bg-blue-100', currency }) => {
  const { t } = useI18n();
  return (
  <Card className="card-hover">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{t(titleKey)}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${bgColorClass} flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <div>
          <div className={`text-2xl font-bold ${colorClass}`}>{value.toLocaleString()} {currency}</div>
          {transactionsCount !== undefined && (
            <div className="text-xs text-muted-foreground">
              {transactionsCount} {t('financePage.summary.transactions')}
            </div>
          )}
           {transactionsCount === undefined && (
            <div className="text-xs text-muted-foreground">{t('financePage.summary.netBalance')}</div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)});

const FinanceSummary = ({ totalIncome, totalExpenses, balance, incomeTransactionsCount, expenseTransactionsCount, currency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FinanceSummaryCard 
        titleKey="financePage.summary.totalIncome" 
        value={totalIncome} 
        icon={<TrendingUp className="h-5 w-5 text-green-600" />} 
        transactionsCount={incomeTransactionsCount}
        colorClass="text-green-600"
        bgColorClass="bg-green-100"
        currency={currency}
      />
      <FinanceSummaryCard 
        titleKey="financePage.summary.totalExpenses" 
        value={totalExpenses} 
        icon={<TrendingDown className="h-5 w-5 text-red-600" />} 
        transactionsCount={expenseTransactionsCount}
        colorClass="text-red-600"
        bgColorClass="bg-red-100"
        currency={currency}
      />
      <FinanceSummaryCard 
        titleKey="financePage.summary.currentBalance" 
        value={balance} 
        icon={<Banknote className="h-5 w-5 text-blue-600" />}
        colorClass={balance >= 0 ? 'text-blue-600' : 'text-red-600'}
        bgColorClass={balance >= 0 ? 'bg-blue-100' : 'bg-red-100'}
        currency={currency}
      />
    </div>
  );
};

export default FinanceSummary;
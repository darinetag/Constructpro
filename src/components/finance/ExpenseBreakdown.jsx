import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const ExpenseBreakdown = React.memo(({ expensesByCategory, totalExpenses, currency }) => {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('financePage.expenseBreakdown.title')}</CardTitle>
        <CardDescription>{t('financePage.expenseBreakdown.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(expensesByCategory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <DollarSign className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t('financePage.expenseBreakdown.noExpenses')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span className="font-medium">{amount.toLocaleString()} {currency}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: totalExpenses > 0 ? `${(amount / totalExpenses) * 100}%` : '0%'}}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {totalExpenses > 0 ? `${((amount / totalExpenses) * 100).toFixed(1)}% ${t('financePage.expenseBreakdown.ofTotal')}` : `0% ${t('financePage.expenseBreakdown.ofTotal')}`}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ExpenseBreakdown;
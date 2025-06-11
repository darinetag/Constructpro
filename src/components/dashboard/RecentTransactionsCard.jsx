import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Banknote } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const RecentTransactionsCard = ({ finances, projects }) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.recentTransactions.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {finances.slice(0, 5).map(transaction => {
            const project = projects.find(p => p.id === transaction.projectId);
            return (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className={`h-4 w-4 text-green-600`} />
                    ) : (
                      <Banknote className={`h-4 w-4 text-red-600`} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {project?.name || t('common.general')} • {new Date(transaction.date).toLocaleDateString(t('localeCode'))}
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString(t('localeCode'))} {currencySymbol}
                </div>
              </div>
            );
          })}
           {finances.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('dashboard.recentTransactions.noTransactions')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
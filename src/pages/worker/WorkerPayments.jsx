import React, { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, CalendarDays, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useI18n } from '@/context/I18nContext';

const WorkerPayments = () => {
  const { userProfile, loading, userPayments } = useAppContext();
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  const sortedPayments = useMemo(() => {
    if (loading || !userProfile) return [];
    return [...userPayments].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [userPayments, userProfile, loading]);

  const totalPaid = useMemo(() => {
    return sortedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [sortedPayments]);

  if (loading || !userProfile) {
    return <div className="flex items-center justify-center h-full">{t('common.loadingPaymentInfo')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('workerPages.payments.title')}</h1>
          <p className="text-muted-foreground">{t('workerPages.payments.description')}</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>{t('workerPages.payments.totalReceivedTitle')}</CardTitle>
            <CardDescription>{t('workerPages.payments.totalReceivedDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{totalPaid.toLocaleString(t('localeCode'))} {currencySymbol}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>{t('workerPages.payments.historyTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t('workerPages.payments.noPayments')}</h3>
                <p className="text-muted-foreground mt-1">{t('workerPages.payments.noPaymentsHint')}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><CalendarDays className="inline h-4 w-4 mr-1" />{t('workerPages.payments.table.date')}</TableHead>
                    <TableHead><FileText className="inline h-4 w-4 mr-1" />{t('workerPages.payments.table.description')}</TableHead>
                    <TableHead className="text-right">{t('workerPages.payments.table.amount', { currency: currencySymbol })}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(new Date(payment.date), 'PPP', { locale: t('dateFnsLocale')})}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right font-medium">{payment.amount.toLocaleString(t('localeCode'))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WorkerPayments;
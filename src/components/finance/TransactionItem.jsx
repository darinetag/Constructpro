import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Briefcase, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const TransactionItem = React.memo(({ transaction, project, onEdit, onDelete }) => {
  const { t } = useI18n();
  const currencySymbol = t('currency.dZD');

  return (
    <motion.div 
      className="flex items-center justify-between p-3 rounded-lg border"
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {transaction.type === 'income' ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <div className="font-medium">{transaction.description}</div>
          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(transaction.date).toLocaleDateString(t('localeCode'))}
            </span>
            <span className="flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              {transaction.category}
            </span>
            {project && (
              <span className="flex items-center">
                <Briefcase className="h-3 w-3 mr-1" />
                {project.name}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className={`font-medium ${
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString(t('localeCode'))} {currencySymbol}
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit(transaction)}
            aria-label={t('actions.edit')}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">{t('actions.edit')}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(transaction)}
            aria-label={t('actions.delete')}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t('actions.delete')}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

export default TransactionItem;
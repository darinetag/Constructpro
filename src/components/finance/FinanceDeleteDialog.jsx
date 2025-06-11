import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useI18n } from '@/context/I18nContext';

const FinanceDeleteDialog = ({ isOpen, onClose, transactionName, onDelete }) => {
  const { t } = useI18n();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('financePage.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('financePage.deleteDialog.description', { transactionName: transactionName || t('financePage.deleteDialog.thisTransaction') })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('financePage.deleteDialog.cancelButton')}</Button>
          <Button variant="destructive" onClick={onDelete}>{t('financePage.deleteDialog.deleteButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceDeleteDialog;
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

const LabTestDeleteDialog = ({ isOpen, onOpenChange, testType, onDelete }) => {
  const { t } = useI18n();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('laboratoryPage.admin.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('laboratoryPage.admin.deleteDialog.description', { testType: testType || t('common.thisItem')})}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('laboratoryPage.admin.deleteDialog.cancelButton')}</Button>
          <Button variant="destructive" onClick={onDelete}>{t('laboratoryPage.admin.deleteDialog.deleteButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LabTestDeleteDialog;
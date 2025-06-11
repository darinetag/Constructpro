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

const MarketplaceDeleteDialog = ({ isOpen, onOpenChange, itemName, onDelete }) => {
  const { t } = useI18n();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('marketplace.deleteDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('marketplace.deleteDialog.description', { itemName: itemName || t('common.thisItem') })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('marketplace.deleteDialog.cancelButton')}</Button>
          <Button variant="destructive" onClick={onDelete}>{t('marketplace.deleteDialog.deleteButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketplaceDeleteDialog;
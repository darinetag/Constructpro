import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const TaskDeleteDialog = ({ isOpen, onClose, taskTitle, onDelete }) => {
  const { t } = useI18n();
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="dialog-content-custom rounded-xl">
        <AlertDialogHeader className="dialog-header-custom">
          <AlertDialogTitle className="flex items-center text-xl font-semibold text-red-600 gap-2">
            <AlertTriangle className="h-6 w-6" />
            {t('siteManagement.deleteDialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-custom pt-2 text-base">
            {t('siteManagement.deleteDialog.description', { taskTitle: `"${taskTitle || t('siteManagement.deleteDialog.thisTask')}"` })}
            <br />
            <strong className="text-main">{t('siteManagement.deleteDialog.confirmation')}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="dialog-footer-custom mt-6 pt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} className="button-outline-custom h-11 px-6">
              {t('actions.cancel')}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white h-11 px-6 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {t('actions.delete')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TaskDeleteDialog;
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/I18nContext';
import { Trash2, AlertTriangle, Archive } from 'lucide-react';

const ProjectDeleteDialog = ({ isOpen, onClose, projectName, onDelete, isPermanentDelete }) => {
  const { t } = useI18n();

  const title = isPermanentDelete ? t('projectsPage.deleteDialog.permanentDeleteTitle') : t('projectsPage.deleteDialog.title');
  const description = isPermanentDelete 
    ? t('projectsPage.deleteDialog.permanentDeleteDescription', { projectName: projectName || t('projectsPage.deleteDialog.thisProject') })
    : t('projectsPage.deleteDialog.description', { projectName: projectName || t('projectsPage.deleteDialog.thisProject') });
  const actionButtonText = isPermanentDelete ? t('actions.deletePermanently') : t('actions.moveToBin');
  const ActionIcon = isPermanentDelete ? Trash2 : Archive;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gradient-to-br from-gray-900 to-slate-800 text-white border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-xl font-semibold text-red-400">
            <AlertTriangle className="h-6 w-6 mr-2" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400 pt-2">
            {description}
            <br />
            {isPermanentDelete ? t('projectsPage.deleteDialog.permanentDeleteConfirmation') : t('projectsPage.deleteDialog.confirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} className="border-slate-600 hover:bg-slate-700 text-gray-300 hover:text-white">
              {t('actions.cancel')}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={isPermanentDelete ? "destructive" : "warning"}
              onClick={() => {
                onDelete();
                onClose();
              }}
              className={isPermanentDelete ? "bg-red-600 hover:bg-red-700 text-white" : "bg-amber-500 hover:bg-amber-600 text-black"}
            >
              <ActionIcon className="h-4 w-4 mr-2" />
              {actionButtonText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectDeleteDialog;
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const SiteManagementHeader = ({ onAddTask, selectedProjectId }) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
          {t('siteManagement.title')}
        </h1>
        <p className="text-gray-600 mt-1 text-base">{t('siteManagement.description')}</p>
      </div>
      <Button
        onClick={onAddTask}
        disabled={!selectedProjectId}
        className="button-primary-custom font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-2 text-base"
      >
        <PlusCircle className="h-5 w-5" />
        {t('siteManagement.addTaskButton')}
      </Button>
    </div>
  );
};

export default SiteManagementHeader;
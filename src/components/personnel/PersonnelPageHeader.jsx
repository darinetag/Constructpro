import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const PersonnelPageHeader = ({ onAddPersonnel }) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {t('personnelPage.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('personnelPage.description')}</p>
      </div>
      <Button 
        onClick={onAddPersonnel}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        {t('personnelPage.addPersonnelButton')}
      </Button>
    </div>
  );
};

export default PersonnelPageHeader;
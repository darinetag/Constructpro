import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const NoTasksFound = ({ onAddTask }) => {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 shadow-lg my-6"
    >
      <Search className="h-16 w-16 text-primary mx-auto mb-5 opacity-70" />
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{t('siteManagement.noTasksFoundTitle')}</h3>
      <p className="text-gray-600 max-w-md mx-auto text-base">{t('siteManagement.noTasksFoundDescription')}</p>
      <Button
        onClick={onAddTask}
        className="mt-8 button-primary-custom font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-2 mx-auto text-base"
      >
        <PlusCircle className="h-5 w-5" />
        {t('siteManagement.addFirstTaskButton')}
      </Button>
    </motion.div>
  );
};

export default NoTasksFound;
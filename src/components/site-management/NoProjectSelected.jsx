import React from 'react';
import { motion } from 'framer-motion';
import { ListFilter } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const NoProjectSelected = () => {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 shadow-lg my-6"
    >
      <ListFilter className="h-16 w-16 text-primary mx-auto mb-5 opacity-70" />
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{t('siteManagement.noProjectSelectedTitle')}</h3>
      <p className="text-gray-600 max-w-md mx-auto text-base">{t('siteManagement.noProjectSelectedDescription')}</p>
    </motion.div>
  );
};

export default NoProjectSelected;
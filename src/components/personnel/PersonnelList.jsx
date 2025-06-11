import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import PersonnelCard from './PersonnelCard';
import { useI18n } from '@/context/I18nContext';

const PersonnelList = ({ personnel, projects, onEdit, onDelete, searchTerm, filterStatus }) => {
  const { t } = useI18n();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    }
  };

  if (personnel.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="inline-block p-8 bg-card rounded-full shadow-xl border border-border"
        >
          <Users className="h-20 w-20 text-primary mx-auto mb-4" />
        </motion.div>
        <h3 className="text-2xl font-semibold mt-8 mb-2">{t('personnelPage.noPersonnelFound')}</h3>
        <p className="text-muted-foreground max-w-md">
          {searchTerm || filterStatus !== 'all'
            ? t('personnelPage.noPersonnelFoundFilterHint')
            : t('personnelPage.noPersonnelFoundAddHint')}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {personnel.map(person => {
        const assignedProject = projects.find(p => Array.isArray(p.assignedTeam) && p.assignedTeam.includes(person.id));
        return (
          <PersonnelCard
            key={person.id}
            person={person}
            assignedProject={assignedProject}
            onEdit={() => onEdit(person)}
            onDelete={() => onDelete(person)}
          />
        );
      })}
    </motion.div>
  );
};

export default PersonnelList;
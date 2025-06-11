import React, { useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { PersonnelFormDialog, PersonnelDeleteDialog } from '@/components/personnel';
import PersonnelPageHeader from '@/components/personnel/PersonnelPageHeader';
import PersonnelFilters from '@/components/personnel/PersonnelFilters';
import PersonnelList from '@/components/personnel/PersonnelList';
import { useI18n } from '@/context/I18nContext';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const Personnel = () => {
  const { personnel, projects, addPersonnel, updatePersonnel, deletePersonnel, loading } = useAppContext();
  const { t } = useI18n();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [formMode, setFormMode] = useState('add'); 

  const filteredPersonnel = useMemo(() => {
    if (loading && !personnel.length) return []; 
    
    let currentPersonnelList = personnel;

    if (filterStatus !== 'all') {
      currentPersonnelList = currentPersonnelList.filter(person => person.status === filterStatus);
    }

    if (searchTerm) {
      currentPersonnelList = currentPersonnelList.filter(person => {
        const nameMatch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatch = person.role.toLowerCase().includes(searchTerm.toLowerCase());
        const skillsMatch = Array.isArray(person.skills) && person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        return nameMatch || roleMatch || skillsMatch;
      });
    }
    return currentPersonnelList.sort((a, b) => a.name.localeCompare(b.name));
  }, [personnel, searchTerm, filterStatus, loading]);

  const handleAddPersonnel = () => {
    setFormMode('add');
    setCurrentPerson(null);
    setIsFormDialogOpen(true);
  };
  
  const handleEditPersonnel = (person) => {
    setFormMode('edit');
    setCurrentPerson(person);
    setIsFormDialogOpen(true);
  };

  const handleDeletePersonnel = (person) => {
    setCurrentPerson(person);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = useCallback((formData) => {
    const personData = {
      ...formData,
      id: formMode === 'add' ? Date.now().toString() : currentPerson.id, 
      createdAt: formMode === 'add' ? new Date().toISOString() : currentPerson.createdAt,
      updatedAt: new Date().toISOString(),
    };

    if (formMode === 'add') {
      addPersonnel(personData);
      toast({
        title: t('common.toast.successTitle'),
        description: t('common.toast.addItemSuccess', { itemName: t('common.itemNames.personnel'), itemNameValue: personData.name }),
        className: "bg-green-500 text-white",
      });
    } else {
      updatePersonnel(currentPerson.id, personData);
      toast({
        title: t('common.toast.successTitle'),
        description: t('common.toast.updateItemSuccess', { itemName: t('common.itemNames.personnel'), itemNameValue: personData.name }),
        className: "bg-blue-500 text-white",
      });
    }
    setIsFormDialogOpen(false);
    setCurrentPerson(null);
  }, [formMode, currentPerson, addPersonnel, updatePersonnel, t, toast]);


  const handleDeleteConfirm = useCallback(() => {
    if (currentPerson) {
      deletePersonnel(currentPerson.id);
      toast({
        title: t('common.toast.successTitle'),
        description: t('common.toast.deleteItemSuccess', { itemName: t('common.itemNames.personnel'), itemNameValue: currentPerson.name }),
        className: "bg-red-500 text-white",
      });
    }
    setIsDeleteDialogOpen(false);
    setCurrentPerson(null);
  }, [currentPerson, deletePersonnel, t, toast]);

  if (loading && !personnel.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 50, height: 50, border: '4px solid transparent', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%' }}
        />
        <p className="mt-4 text-lg text-muted-foreground">{t('common.loadingPersonnel')}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0"
    >
      <PersonnelPageHeader onAddPersonnel={handleAddPersonnel} />
      <PersonnelFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <PersonnelList
        personnel={filteredPersonnel}
        projects={projects}
        onEdit={handleEditPersonnel}
        onDelete={handleDeletePersonnel}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
      />

      <PersonnelFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setCurrentPerson(null);
          setIsFormDialogOpen(isOpen);
        }}
        mode={formMode}
        initialData={currentPerson}
        onSubmit={handleFormSubmit}
        projects={projects}
      />

      <PersonnelDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        personName={currentPerson?.name}
        onDelete={handleDeleteConfirm}
      />
    </motion.div>
  );
};

export default Personnel;
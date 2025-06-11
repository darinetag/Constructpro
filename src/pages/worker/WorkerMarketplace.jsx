import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { MarketplaceItemCard, MarketplaceFormDialog, MarketplaceDeleteDialog } from '@/components/marketplace';
import { ShoppingBag, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';

const WorkerMarketplace = () => {
  const { marketplace, addMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem, userProfile, loading } = useAppContext();
  const { t } = useI18n();
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formMode, setFormMode] = useState('add');

  const workerListings = useMemo(() => {
    if (loading || !userProfile) return [];
    return marketplace.filter(item => 
      item.itemType === 'personnellisting' && 
      (item.contact === userProfile.email || item.name === userProfile.name)
    );
  }, [marketplace, userProfile, loading]);

  if (loading || !userProfile) {
    return <div className="flex items-center justify-center h-full">{t('common.loadingMarketplaceListings')}</div>;
  }

  const handleFormSubmit = (formData) => {
    const dataToSubmit = {
      ...formData,
      name: formData.name || userProfile.name,
      contact: formData.contact || userProfile.email,
      itemType: 'personnellisting', 
    };

    if (formMode === 'add') {
      addMarketplaceItem(dataToSubmit);
    } else {
      updateMarketplaceItem(currentItem.id, dataToSubmit);
    }
    setIsFormDialogOpen(false);
    setCurrentItem(null);
  };

  const openFormDialog = (mode, item = null) => {
    setFormMode(mode);
    const initialData = mode === 'add' 
      ? { name: userProfile.name, contact: userProfile.email, role: userProfile.role || '', itemType: 'personnellisting' } 
      : item;
    setCurrentItem(initialData);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (item) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentItem) {
      deleteMarketplaceItem(currentItem.id);
    }
    setIsDeleteDialogOpen(false);
    setCurrentItem(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('workerPages.marketplace.title')}</h1>
          <p className="text-muted-foreground">{t('workerPages.marketplace.description')}</p>
        </div>
        <Button onClick={() => openFormDialog(workerListings.length > 0 ? 'edit' : 'add', workerListings[0])}>
          <PlusCircle className="h-4 w-4 mr-2" /> 
          {workerListings.length > 0 ? t('workerPages.marketplace.editServiceButton') : t('workerPages.marketplace.addServiceButton')}
        </Button>
      </div>

      {workerListings.length === 0 && !isFormDialogOpen ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t('workerPages.marketplace.noServices')}</h3>
          <p className="text-muted-foreground mt-1 mb-4">{t('workerPages.marketplace.noServicesHint')}</p>
          <Button onClick={() => openFormDialog('add')}>
            <PlusCircle className="h-4 w-4 mr-2" /> {t('workerPages.marketplace.addServiceButton')}
          </Button>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {workerListings.map(item => (
            <MarketplaceItemCard
              key={item.id}
              item={item}
              onEdit={() => openFormDialog('edit', item)}
              onDelete={() => openDeleteDialog(item)}
              onViewDetails={() => { /* Worker might not need details view for their own listing */ }}
              isOwner={true} 
            />
          ))}
        </motion.div>
      )}

      {(isFormDialogOpen) && (
         <MarketplaceFormDialog
          isOpen={isFormDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) setCurrentItem(null);
            setIsFormDialogOpen(isOpen);
          }}
          mode={formMode}
          initialData={currentItem} 
          onSubmit={handleFormSubmit}
          isWorkerListing={true}
        />
      )}

      <MarketplaceDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemName={currentItem?.name}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default WorkerMarketplace;
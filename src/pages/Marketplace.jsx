import React, { useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { MarketplaceFormDialog, MarketplaceDeleteDialog } from '@/components/marketplace';
import MarketplaceItemDetailsDialog from '@/components/marketplace/MarketplaceItemDetailsDialog';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFilters from '@/components/marketplace/MarketplaceFilters';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';


const Marketplace = () => {
  const { 
    marketplace, addMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem, 
    loading, userProfile 
  } = useAppContext();
  const { t } = useI18n();
  
  const [activeTab, setActiveTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formMode, setFormMode] = useState('add'); 

  const isProjectOwner = userProfile?.role === 'admin';

  const filteredMarketplaceItems = useMemo(() => {
    if (loading) return [];
    return marketplace.filter(item => {
      const typeMatch = activeTab === 'all' || item.itemType === activeTab;
      
      const term = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(term);
      const roleMatch = item.role?.toLowerCase().includes(term) || false;
      const providerMatch = item.provider?.toLowerCase().includes(term) || false;
      const skillsMatch = Array.isArray(item.skills) && item.skills.some(skill => skill.toLowerCase().includes(term));
      const descriptionMatch = item.description?.toLowerCase().includes(term) || false;
      const locationMatch = item.location?.toLowerCase().includes(term) || false;
      const companyMatch = item.company?.toLowerCase().includes(term) || false;

      const searchMatch = nameMatch || roleMatch || providerMatch || skillsMatch || descriptionMatch || locationMatch || companyMatch;
      
      return typeMatch && searchMatch;
    });
  }, [marketplace, searchTerm, activeTab, loading]);

  const handleFormSubmit = useCallback((formData) => {
    let dataToSubmit = { ...formData };

    if (isProjectOwner && formMode === 'add') {
        dataToSubmit.itemType = 'job_opening';
        dataToSubmit.company = userProfile.companyName || userProfile.name; 
        dataToSubmit.contact = userProfile.email;
    }
    
    if (formMode === 'add') {
      addMarketplaceItem(dataToSubmit);
    } else {
      if (!isProjectOwner || (isProjectOwner && currentItem?.itemType === 'job_opening' && currentItem?.contact === userProfile?.email)) {
        updateMarketplaceItem(currentItem.id, dataToSubmit);
      }
    }
    setIsFormDialogOpen(false);
    setCurrentItem(null);
  }, [isProjectOwner, formMode, userProfile, addMarketplaceItem, updateMarketplaceItem, currentItem]);

  const openFormDialog = useCallback((mode, item = null) => {
    if (isProjectOwner && mode === 'edit' && item?.itemType !== 'job_opening') return; 
    if (isProjectOwner && mode === 'edit' && item?.itemType === 'job_opening' && item?.contact !== userProfile?.email) return;

    setFormMode(mode);
    let initialData = item;
    if (isProjectOwner && mode === 'add') {
        initialData = { itemType: 'job_opening', company: userProfile.companyName || userProfile.name, contact: userProfile.email };
    }
    setCurrentItem(initialData);
    setIsFormDialogOpen(true);
  }, [isProjectOwner, userProfile]);

  const openDeleteDialog = useCallback((item) => {
    if (isProjectOwner && item?.itemType !== 'job_opening') return;
    if (isProjectOwner && item?.itemType === 'job_opening' && item?.contact !== userProfile?.email) return;
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  }, [isProjectOwner, userProfile]);

  const handleDeleteConfirm = useCallback(() => {
    if (isProjectOwner && currentItem?.itemType !== 'job_opening') return;
    if (isProjectOwner && currentItem?.itemType === 'job_opening' && currentItem?.contact !== userProfile?.email) return;

    if (currentItem) {
      deleteMarketplaceItem(currentItem.id);
    }
    setIsDeleteDialogOpen(false);
    setCurrentItem(null);
  }, [isProjectOwner, currentItem, deleteMarketplaceItem, userProfile]);

  const openDetailsDialog = useCallback((item) => {
    setCurrentItem(item);
    setIsDetailsDialogOpen(true);
  }, []);

  if (loading || !userProfile) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">{t('common.loadingMarketplaceListings')}</div>;
  }

  return (
    <div className="space-y-6">
      <MarketplaceHeader 
        isProjectOwner={isProjectOwner}
        onOpenFormDialog={() => openFormDialog('add')}
        isFormDialogOpen={isFormDialogOpen && formMode === 'add'}
        onFormDialogOpenChange={(isOpen) => {
            if (!isOpen) setCurrentItem(null);
            setIsFormDialogOpen(isOpen);
        }}
        onFormSubmit={handleFormSubmit}
        userProfile={userProfile}
      />

      {isProjectOwner && (
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="font-semibold text-blue-800 dark:text-blue-200">{t('marketplace.projectOwnerViewTitle')}</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            {t('marketplace.projectOwnerViewDescription')}
          </AlertDescription>
        </Alert>
      )}

      <MarketplaceFilters 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />

      <MarketplaceGrid
        items={filteredMarketplaceItems}
        onEditItem={(item) => openFormDialog('edit', item)}
        onDeleteItem={openDeleteDialog}
        onViewDetails={openDetailsDialog}
        isProjectOwner={isProjectOwner}
        userProfile={userProfile}
        searchTerm={searchTerm}
        activeTab={activeTab}
      />

      {isFormDialogOpen && (formMode === 'edit' || (formMode === 'add' && !isProjectOwner)) && (
         <MarketplaceFormDialog
          isOpen={isFormDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) setCurrentItem(null);
            setIsFormDialogOpen(isOpen);
          }}
          mode={formMode}
          initialData={currentItem}
          onSubmit={handleFormSubmit}
          isProjectOwner={isProjectOwner}
          userProfile={userProfile}
        />
      )}
      
      {isFormDialogOpen && formMode === 'add' && isProjectOwner && (
         <MarketplaceFormDialog
          isOpen={isFormDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) setCurrentItem(null);
            setIsFormDialogOpen(isOpen);
          }}
          mode={formMode}
          initialData={{ itemType: 'job_opening', company: userProfile.companyName || userProfile.name, contact: userProfile.email }}
          onSubmit={handleFormSubmit}
          isProjectOwner={isProjectOwner}
          userProfile={userProfile}
        />
      )}


      <MarketplaceDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={(isOpen) => {
            if (!isOpen) setCurrentItem(null);
            setIsDeleteDialogOpen(isOpen);
        }}
        itemName={currentItem?.name}
        onDelete={handleDeleteConfirm}
      />

      <MarketplaceItemDetailsDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={(isOpen) => {
            if (!isOpen) setCurrentItem(null);
            setIsDetailsDialogOpen(isOpen);
        }}
        item={currentItem}
      />
    </div>
  );
};

export default Marketplace;
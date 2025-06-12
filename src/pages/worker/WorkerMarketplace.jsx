import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { MarketplaceItemCard, MarketplaceFormDialog } from '@/components/marketplace';
import { ShoppingBag, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';

const WorkerMarketplace = () => {
  const {
    marketplace,
    addMarketplaceItem,
    userProfile,
    loading,
  } = useAppContext();
  const { t } = useI18n();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const workerListings = useMemo(() => {
    if (loading || !userProfile) return [];
    return marketplace.filter(
      (item) =>
        item.itemType === 'personnellisting' &&
        (item.contact === userProfile.email || item.name === userProfile.name)
    );
  }, [marketplace, userProfile, loading]);

  const handleFormSubmit = (formData) => {
    const dataToSubmit = {
      ...formData,
      name: userProfile.name,
      contact: userProfile.email,
      itemType: 'personnellisting',
    };

    addMarketplaceItem(dataToSubmit);
    setIsFormDialogOpen(false);
    setCurrentItem(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        {t('common.loadingMarketplaceListings')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('workerPages.marketplace.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('workerPages.marketplace.description')}
          </p>
        </div>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('workerPages.marketplace.addServiceButton')}
        </Button>
      </div>

      {workerListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">
            {t('workerPages.marketplace.noServices')}
          </h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {t('workerPages.marketplace.noServicesHint')}
          </p>
          <Button onClick={() => setIsFormDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('workerPages.marketplace.addServiceButton')}
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {workerListings.map((item) => (
            <MarketplaceItemCard key={item.id} item={item} isOwner={true} />
          ))}
        </motion.div>
      )}

      {isFormDialogOpen && (
        <MarketplaceFormDialog
          isOpen={isFormDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) setCurrentItem(null);
            setIsFormDialogOpen(isOpen);
          }}
          mode="add"
          initialData={{
            name: userProfile.name,
            contact: userProfile.email,
            role: userProfile.role || '',
            itemType: 'personnellisting',
          }}
          onSubmit={handleFormSubmit}
          isWorkerListing={true}
        />
      )}
    </div>
  );
};

export default WorkerMarketplace;

import React from 'react';
import { motion } from 'framer-motion';
import { MarketplaceItemCard } from '@/components/marketplace';
import { ShoppingBag } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const MarketplaceGrid = ({ items, onEditItem, onDeleteItem, onViewDetails, isProjectOwner, userProfile, searchTerm, activeTab }) => {
  const { t } = useI18n();
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t('marketplace.noListingsFoundTitle')}</h3>
        <p className="text-muted-foreground mt-1">
          {searchTerm || activeTab !== 'all' 
            ? t('marketplace.noListingsFoundAdjustFilters')
            : isProjectOwner ? t('marketplace.noListingsFoundProjectOwnerHint') : t('marketplace.noListingsFoundGeneralHint')}
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {items.map(item => (
        <MarketplaceItemCard
          key={item.id}
          item={item}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
          onViewDetails={onViewDetails}
          isProjectOwner={isProjectOwner}
          userProfile={userProfile}
        />
      ))}
    </motion.div>
  );
};

export default MarketplaceGrid;
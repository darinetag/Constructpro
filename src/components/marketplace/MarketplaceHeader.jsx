import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MarketplaceFormDialog } from '@/components/marketplace';
import { useI18n } from '@/context/I18nContext';

const MarketplaceHeader = ({ isProjectOwner, onOpenFormDialog, isFormDialogOpen, onFormDialogOpenChange, onFormSubmit, userProfile }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('marketplace.title')}</h1>
        <p className="text-muted-foreground">
          {isProjectOwner ? t('marketplace.descriptionProjectOwner') : t('marketplace.descriptionGeneral')}
        </p>
      </div>
      {isProjectOwner ? (
          <Button onClick={onOpenFormDialog} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
              <PlusCircle className="h-4 w-4" /> {t('marketplace.addJobOpeningButton')}
          </Button>
      ) : (
           <MarketplaceFormDialog
              isOpen={isFormDialogOpen}
              onOpenChange={onFormDialogOpenChange}
              mode="add"
              onSubmit={onFormSubmit}
              isProjectOwner={isProjectOwner}
              userProfile={userProfile}
              triggerButton={
                <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground">
                  <PlusCircle className="h-4 w-4" /> {t('marketplace.addListingButton')}
                </Button>
              }
           />
      )}
    </div>
  );
};

export default MarketplaceHeader;
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Settings2, Briefcase, Package } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const MarketplaceFilters = ({ searchTerm, onSearchTermChange, activeTab, onActiveTabChange }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('marketplace.searchPlaceholder')}
          className="pl-9 w-full sm:w-[300px]"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <Tabs value={activeTab} onValueChange={onActiveTabChange}>
        <TabsList className="grid w-full grid-cols-2 sm:flex">
          <TabsTrigger value="all">{t('marketplace.tabs.all')}</TabsTrigger>
          <TabsTrigger value="job_opening"><Briefcase className="h-4 w-4 mr-1 sm:mr-2" /> {t('marketplace.tabs.jobOpenings')}</TabsTrigger>
          <TabsTrigger value="personnel_listing"> {/* Corrected key */}
            <User className="h-4 w-4 mr-1 sm:mr-2" /> {t('marketplace.tabs.personnel')}
          </TabsTrigger>
          <TabsTrigger value="service_listing"> {/* Corrected key */}
            <Settings2 className="h-4 w-4 mr-1 sm:mr-2" /> {t('marketplace.tabs.servicesEquipment')}
          </TabsTrigger>
           <TabsTrigger value="material_listing"> {/* Added material_listing */}
            <Package className="h-4 w-4 mr-1 sm:mr-2" /> {t('marketplace.tabs.materials')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default MarketplaceFilters;
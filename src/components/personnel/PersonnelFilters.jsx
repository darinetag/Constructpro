import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const PersonnelFilters = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  const { t } = useI18n();

  return (
    <div className="my-6 p-4 bg-card rounded-xl shadow-lg border border-border">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Filter className="h-5 w-5 text-primary mr-2 hidden sm:block" />
        <h3 className="text-lg font-semibold mb-2 sm:mb-0">{t('personnelPage.filters.title')}</h3>
        <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('personnelPage.searchPlaceholder')}
            className="pl-10 pr-4 py-2 rounded-lg border border-input bg-background shadow-sm focus:ring-2 focus:ring-primary w-full sm:w-[250px] md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background border-input shadow-sm focus:ring-2 focus:ring-primary">
            <SelectValue placeholder={t('personnelPage.filterStatusPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">{t('personnelPage.statusAll')}</SelectItem>
            <SelectItem value="active">{t('personnelPage.statusActive')}</SelectItem>
            <SelectItem value="inactive">{t('personnelPage.statusInactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PersonnelFilters;
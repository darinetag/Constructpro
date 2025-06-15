import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

const SiteManagementFilters = ({
  projects,
  personnel,
  selectedProjectId,
  setSelectedProjectId,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  assignedUserFilter,
  setAssignedUserFilter,
  currentProjectPersonnel
}) => {
  const { t } = useI18n();

  const [localProjects, setLocalProjects] = useState([]);
  function getProjectsFromLocalStorage() {
    try {
      const data = localStorage.getItem('projects');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  useEffect(() => {
    setLocalProjects(getProjectsFromLocalStorage());
  }, [localProjects]); 

  return (
    <Card className="card-component rounded-xl">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-semibold text-main">{t('siteManagement.filters.title')}</CardTitle>
        <CardDescription className="text-muted-custom text-sm">{t('siteManagement.filters.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-1">
          <Label htmlFor="projectFilter" className="text-sm font-medium text-muted-custom">{t('siteManagement.filters.projectLabel')}</Label>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger id="projectFilter" className="select-trigger-custom h-11">
              <SelectValue placeholder={t('siteManagement.filters.projectPlaceholder')} />
            </SelectTrigger>
            <SelectContent className="select-content-custom">
              <SelectItem value="" className="select-item-custom">{t('siteManagement.filters.allProjects')}</SelectItem>
              {localProjects.map(p => <SelectItem key={p.id} value={p.id} className="select-item-custom">{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="relative space-y-1">
          <Label htmlFor="taskSearch" className="text-sm font-medium text-muted-custom">{t('siteManagement.filters.searchLabel')}</Label>
          <Search className="absolute left-3 top-[calc(50%+0.4rem)] transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            id="taskSearch" 
            placeholder={t('siteManagement.filters.searchPlaceholder')} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 input-custom h-11" 
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="statusFilter" className="text-sm font-medium text-muted-custom">{t('siteManagement.filters.statusLabel')}</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="statusFilter" className="select-trigger-custom h-11">
              <SelectValue placeholder={t('siteManagement.filters.statusPlaceholder')} />
            </SelectTrigger>
            <SelectContent className="select-content-custom">
              <SelectItem value="all" className="select-item-custom">{t('siteManagement.filters.allStatuses')}</SelectItem>
              {['pending', 'in-progress', 'completed', 'on-hold', 'cancelled'].map(s => <SelectItem key={s} value={s} className="select-item-custom">{t(`status.${s.replace('-', '')}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="priorityFilter" className="text-sm font-medium text-muted-custom">{t('siteManagement.filters.priorityLabel')}</Label>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger id="priorityFilter" className="select-trigger-custom h-11">
              <SelectValue placeholder={t('siteManagement.filters.priorityPlaceholder')} />
            </SelectTrigger>
            <SelectContent className="select-content-custom">
              <SelectItem value="all" className="select-item-custom">{t('siteManagement.filters.allPriorities')}</SelectItem>
              {['low', 'medium', 'high', 'critical'].map(p => <SelectItem key={p} value={p} className="select-item-custom">{t(`priority.${p}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="assigneeFilter" className="text-sm font-medium text-muted-custom">{t('siteManagement.filters.assigneeLabel')}</Label>
          <Select value={assignedUserFilter} onValueChange={setAssignedUserFilter} disabled={!selectedProjectId && currentProjectPersonnel.length === personnel.length}>
            <SelectTrigger id="assigneeFilter" className="select-trigger-custom h-11">
              <SelectValue placeholder={t('siteManagement.filters.assigneePlaceholder')} />
            </SelectTrigger>
            <SelectContent className="select-content-custom">
              <SelectItem value="all" className="select-item-custom">{t('siteManagement.filters.allAssignees')}</SelectItem>
              {currentProjectPersonnel.map(p => <SelectItem key={p.id} value={p.id} className="select-item-custom">{p.name}</SelectItem>)}
              {(!selectedProjectId && currentProjectPersonnel.length === personnel.length) && 
                <div className="px-2 py-1.5 text-xs text-gray-500 italic">{t('siteManagement.filters.selectProjectForAssignees')}</div>}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteManagementFilters;
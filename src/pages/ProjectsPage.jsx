import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, LayoutGrid, List } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFormDialog from '@/components/projects/ProjectFormDialog';
import { useToast } from '@/components/ui/use-toast';
import { useI18n } from '@/context/I18nContext';

const LS_KEY = 'projects';

function getProjectsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveProjectsToLocalStorage(projects) {
  localStorage.setItem(LS_KEY, JSON.stringify(projects));
}

const ProjectsPage = () => {
  const { t } = useI18n();
  const { toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('name_asc');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [viewMode, setViewMode] = useState('grid');

  // Load projects from LocalStorage on mount
  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
  }, []);

  // Sync state and LocalStorage
  const syncProjects = (newProjects) => {
    setProjects(newProjects);
    saveProjectsToLocalStorage(newProjects);
  };

  // Callback for ProjectFormDialog
  const handleProjectsChange = (updatedProjects) => {
    syncProjects(updatedProjects);
    toast({ title: t('projectsPage.toast.projectCreated') });
  };

  // Delete handler that permanently removes project
  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    syncProjects(updatedProjects);
    toast({ title: t('projectsPage.toast.projectDeleted') });
  };

  // Filtering and sorting
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...projects];
    if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter);
    if (priorityFilter !== 'all') filtered = filtered.filter(p => p.priority === priorityFilter);
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.type && p.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered.sort((a, b) => {
      const [field, order] = currentSort.split('_');
      let comparison = 0;
      if (field === 'name') comparison = a.name.localeCompare(b.name);
      else if (field === 'endDate') {
        const dateA = a.endDate ? new Date(a.endDate) : 0;
        const dateB = b.endDate ? new Date(b.endDate) : 0;
        comparison = dateA - dateB;
      }
      else if (field === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return order === 'asc' ? comparison : -comparison;
    });
  }, [projects, statusFilter, priorityFilter, searchTerm, currentSort]);

  const openAddDialog = () => {
    setFormMode('add');
    setCurrentProject(null);
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (project) => {
    setFormMode('edit');
    setCurrentProject(project);
    setIsFormDialogOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h1 className="text-3xl font-bold">{t('projectsPage.title')}</h1>
        <Button variant="default" onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {t('projectsPage.addProject')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Input
            placeholder={t('projectsPage.searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('projectsPage.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('projectsPage.status.all')}</SelectItem>
            <SelectItem value="planning">{t('status.planning')}</SelectItem>
            <SelectItem value="in-progress">{t('status.inprogress')}</SelectItem>
            <SelectItem value="completed">{t('status.completed')}</SelectItem>
            <SelectItem value="on-hold">{t('status.onhold')}</SelectItem>
            <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('projectsPage.filterPriority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('projectsPage.priority.all')}</SelectItem>
            <SelectItem value="critical">{t('priority.critical')}</SelectItem>
            <SelectItem value="high">{t('priority.high')}</SelectItem>
            <SelectItem value="medium">{t('priority.medium')}</SelectItem>
            <SelectItem value="low">{t('priority.low')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={currentSort} onValueChange={setCurrentSort}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('projectsPage.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">{t('projectsPage.sort.nameAsc')}</SelectItem>
            <SelectItem value="name_desc">{t('projectsPage.sort.nameDesc')}</SelectItem>
            <SelectItem value="endDate_asc">{t('projectsPage.sort.endDateAsc')}</SelectItem>
            <SelectItem value="endDate_desc">{t('projectsPage.sort.endDateDesc')}</SelectItem>
            <SelectItem value="priority_asc">{t('projectsPage.sort.priorityAsc')}</SelectItem>
            <SelectItem value="priority_desc">{t('projectsPage.sort.priorityDesc')}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} title={t('projectsPage.viewMode.grid')}>
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} title={t('projectsPage.viewMode.list')}>
          <List className="h-5 w-5" />
        </Button>
      </div>

      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t('projectsPage.noProjects')}
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="show"
          className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
        >
          <AnimatePresence>
            {filteredAndSortedProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={openEditDialog}
                onDelete={handleDeleteProject}
                viewMode={viewMode}
                currencySymbol={t('currency.dZD')}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ProjectFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        mode={formMode}
        projectData={currentProject}
        personnel={[]} // Pass your personnel data here if needed
        currency={t('currency.dZD')}
        onProjectsChange={handleProjectsChange}
      />
    </motion.div>
  );
};

export default ProjectsPage;

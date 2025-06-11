import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, Filter, LayoutGrid, List, ArrowDownUp, Trash, ArchiveRestore, Archive } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFormDialog from '@/components/projects/ProjectFormDialog';
import ProjectDeleteDialog from '@/components/projects/ProjectDeleteDialog';
import { useToast } from '@/components/ui/use-toast';
import { useI18n } from '@/context/I18nContext';

const ProjectsPageHeader = ({ onAddProject, searchTerm, setSearchTerm, currentSort, setCurrentSort, t, onToggleBin, showingBin, activeProjectCount, binnedProjectCount }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
    <div>
      <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        {showingBin ? t('projectsPage.binTitle') : t('projectsPage.title')}
      </h1>
      <p className="text-muted-foreground mt-1">
        {showingBin 
          ? t('projectsPage.binDescription', { count: binnedProjectCount })
          : t('projectsPage.description', { count: activeProjectCount })}
      </p>
    </div>
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
      {!showingBin && (
        <>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('projectsPage.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-input bg-card shadow-sm focus:ring-2 focus:ring-primary w-full sm:w-[200px] md:w-[250px]"
            />
          </div>
          <Select value={currentSort} onValueChange={setCurrentSort}>
            <SelectTrigger className="w-full sm:w-[180px] bg-card border-input shadow-sm focus:ring-2 focus:ring-primary">
              <ArrowDownUp className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder={t('projectsPage.sort.label')} />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="name_asc">{t('projectsPage.sort.nameAsc')}</SelectItem>
              <SelectItem value="name_desc">{t('projectsPage.sort.nameDesc')}</SelectItem>
              <SelectItem value="endDate_asc">{t('projectsPage.sort.endDateAsc')}</SelectItem>
              <SelectItem value="endDate_desc">{t('projectsPage.sort.endDateDesc')}</SelectItem>
              <SelectItem value="priority_desc">{t('projectsPage.sort.priorityDesc')}</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
       <Button
        onClick={onToggleBin}
        variant="outline"
        className="w-full sm:w-auto"
      >
        {showingBin ? <LayoutGrid className="h-5 w-5 mr-2" /> : <Archive className="h-5 w-5 mr-2" />}
        {showingBin ? t('projectsPage.viewActiveProjects') : t('projectsPage.viewBinButton')} ({showingBin ? activeProjectCount : binnedProjectCount})
      </Button>
      {!showingBin && (
        <Button
          onClick={onAddProject}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out w-full sm:w-auto"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          {t('projectsPage.addProjectButton')}
        </Button>
      )}
    </div>
  </div>
);

const ProjectFilters = ({ statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, t }) => (
  <div className="mb-6 p-4 bg-card rounded-xl shadow-lg border border-border">
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Filter className="h-5 w-5 text-primary mr-2" />
      <h3 className="text-lg font-semibold">{t('projectsPage.filters.title')}</h3>
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background border-input shadow-sm focus:ring-primary">
            <SelectValue placeholder={t('projectsPage.filters.statusPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">{t('projectsPage.filters.allStatuses')}</SelectItem>
            <SelectItem value="planning">{t('status.planning')}</SelectItem>
            <SelectItem value="in-progress">{t('status.inprogress')}</SelectItem>
            <SelectItem value="completed">{t('status.completed')}</SelectItem>
            <SelectItem value="on-hold">{t('status.onhold')}</SelectItem>
            <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background border-input shadow-sm focus:ring-primary">
            <SelectValue placeholder={t('projectsPage.filters.priorityPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">{t('projectsPage.filters.allPriorities')}</SelectItem>
            <SelectItem value="low">{t('priority.low')}</SelectItem>
            <SelectItem value="medium">{t('priority.medium')}</SelectItem>
            <SelectItem value="high">{t('priority.high')}</SelectItem>
            <SelectItem value="critical">{t('priority.critical')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);


const ProjectsPage = () => {
  const { projects, personnel, loading, addProject, updateProject, deleteProject, restoreProject, permanentlyDeleteProject } = useAppContext();
  const { t } = useI18n();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('name_asc');
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [viewMode, setViewMode] = useState('grid');
  const [showingBin, setShowingBin] = useState(false);
  const [deleteActionType, setDeleteActionType] = useState('soft'); // 'soft', 'permanent'


  const activeProjects = useMemo(() => projects.filter(p => !p.isDeleted), [projects]);
  const binnedProjects = useMemo(() => projects.filter(p => p.isDeleted), [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    let sourceProjects = showingBin ? binnedProjects : activeProjects;
    let filtered = sourceProjects;

    if (!showingBin) { // Apply filters only for active projects view
      if (statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter);
      }
      if (priorityFilter !== 'all') {
        filtered = filtered.filter(p => p.priority === priorityFilter);
      }
      if (searchTerm) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.type && p.type.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
    } else { // For bin, maybe only search by name
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
    }


    return [...filtered].sort((a, b) => {
      const [field, order] = currentSort.split('_');
      let comparison = 0;
      if (field === 'name') comparison = a.name.localeCompare(b.name);
      else if (field === 'endDate') { // For binned items, sort by deletion date if available
        const dateA = showingBin ? (a.deletedAt ? new Date(a.deletedAt) : 0) : (a.endDate ? new Date(a.endDate) : 0);
        const dateB = showingBin ? (b.deletedAt ? new Date(b.deletedAt) : 0) : (b.endDate ? new Date(b.endDate) : 0);
        comparison = dateA - dateB;
      }
      else if (field === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return order === 'asc' ? comparison : -comparison;
    });
  }, [projects, statusFilter, priorityFilter, searchTerm, currentSort, showingBin, activeProjects, binnedProjects]);

  const handleAddProject = () => {
    setFormMode('add');
    setCurrentProject(null);
    setIsFormDialogOpen(true);
  };

  const handleEditProject = (project) => {
    if (showingBin) return; // No editing for binned projects
    setFormMode('edit');
    setCurrentProject(project);
    setIsFormDialogOpen(true);
  };

  const handleDeleteOrMoveToBin = (project) => {
    setCurrentProject(project);
    setDeleteActionType('soft');
    setIsDeleteDialogOpen(true);
  };
  
  const handleRestoreProject = (project) => {
    restoreProject(project.id);
  };

  const handlePermanentlyDeleteProject = (project) => {
    setCurrentProject(project);
    setDeleteActionType('permanent');
    setIsDeleteDialogOpen(true);
  };

  const executeDeleteProjectAction = useCallback(() => {
    if (currentProject) {
      if (deleteActionType === 'soft') {
        deleteProject(currentProject.id); // This is now soft delete
      } else if (deleteActionType === 'permanent') {
        permanentlyDeleteProject(currentProject.id);
      }
    }
    setIsDeleteDialogOpen(false);
    setCurrentProject(null);
  }, [currentProject, deleteProject, permanentlyDeleteProject, deleteActionType, t, toast]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const toggleBinView = () => {
    setShowingBin(!showingBin);
    setSearchTerm(''); // Reset search term when switching views
    if (!showingBin) { // When switching to bin view
      setCurrentSort('endDate_desc'); // Sort by deletion date (approximated by endDate for now)
    } else { // When switching back to active projects
      setCurrentSort('name_asc');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><p className="text-xl">{t('common.loadingProjects')}</p></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0"
    >
      <ProjectsPageHeader 
        onAddProject={handleAddProject}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentSort={currentSort}
        setCurrentSort={setCurrentSort}
        t={t}
        onToggleBin={toggleBinView}
        showingBin={showingBin}
        activeProjectCount={activeProjects.length}
        binnedProjectCount={binnedProjects.length}
      />
      {!showingBin && (
        <ProjectFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          t={t}
        />
      )}
      
      <div className="mb-4 flex justify-end items-center gap-2">
        <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} title={t('projectsPage.viewMode.grid')}>
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} title={t('projectsPage.viewMode.list')}>
          <List className="h-5 w-5" />
        </Button>
      </div>

      {filteredAndSortedProjects.length === 0 ? (
         <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-block p-8 bg-card rounded-full shadow-xl"
          >
            {showingBin ? <ArchiveRestore className="h-20 w-20 text-primary mx-auto mb-4" /> : <Filter className="h-20 w-20 text-primary mx-auto mb-4" />}
          </motion.div>
          <h3 className="text-2xl font-semibold mt-6 mb-2">
            {showingBin ? t('projectsPage.noBinnedProjectsFound') : t('projectsPage.noProjectsFound')}
          </h3>
          <p className="text-muted-foreground">
            {showingBin ? t('projectsPage.noBinnedProjectsFoundHint') : t('projectsPage.noProjectsFoundHint')}
          </p>
          {!showingBin && (
            <Button onClick={handleAddProject} className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('projectsPage.addFirstProjectButton')}
            </Button>
          )}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
        >
          <AnimatePresence>
            {filteredAndSortedProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={handleEditProject}
                onDelete={showingBin ? handlePermanentlyDeleteProject : handleDeleteOrMoveToBin}
                onRestore={showingBin ? handleRestoreProject : undefined}
                isBinned={showingBin}
                viewMode={viewMode}
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
        addProject={addProject}
        updateProject={updateProject}
        personnel={personnel || []}
        currency={t('currency.dZD')}
      />
      <ProjectDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        projectName={currentProject?.name}
        onDelete={executeDeleteProjectAction}
        isPermanentDelete={deleteActionType === 'permanent'}
      />
    </motion.div>
  );
};

export default ProjectsPage;
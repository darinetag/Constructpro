import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, LayoutGrid, List, Filter, Archive } from 'lucide-react';
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
  const [showingBin, setShowingBin] = useState(false);

  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
  }, []);

  const syncProjects = (newProjects) => {
    setProjects(newProjects);
    saveProjectsToLocalStorage(newProjects);
  };

  const handleProjectsChange = (updatedProjects) => {
    syncProjects(updatedProjects);
    toast({ title: t('projectsPage.toast.projectCreated') });
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    syncProjects(updatedProjects);
    toast({ title: t('projectsPage.toast.projectDeleted') });
  };

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
      className="bg-[#f9fafb] min-h-screen p-0"
    >
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-6 mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
          Projects Management
        </h1>
        <div className="flex gap-2">
          <Button
            variant={showingBin ? "default" : "outline"}
            onClick={() => setShowingBin(!showingBin)}
            className="flex items-center"
          >
            <Archive className="mr-2 h-5 w-5" />
            {showingBin ? t('projectsPage.viewActiveProjects') : t('projectsPage.viewBinButton')}
          </Button>
          <Button 
            onClick={openAddDialog}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl bg-white shadow flex flex-wrap items-center px-6 py-4 mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1"></div>
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-[220px] bg-gray-50 border-gray-200 pl-10"
        />
        <Search className="absolute left-[calc(100%-220px+12px)] top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Select value={currentSort} onValueChange={setCurrentSort}>
          <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="Name (A-Z)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="endDate_asc">End Date (Earliest)</SelectItem>
            <SelectItem value="endDate_desc">End Date (Latest)</SelectItem>
            <SelectItem value="priority_asc">Priority (Low-High)</SelectItem>
            <SelectItem value="priority_desc">Priority (High-Low)</SelectItem>
          </SelectContent>
        </Select>
        <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Projects List or Empty State */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24">
          <div className="rounded-full bg-white shadow-lg p-8 mb-6">
            <Filter className="h-20 w-20 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Projects Found</h2>
          <p className="text-gray-500 mb-6">Try adjusting your filters or add a new project.</p>
          <Button 
            onClick={openAddDialog}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg"
          >
            + Add Your First Project
          </Button>
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

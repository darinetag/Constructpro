import React, { useState, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useI18n } from '@/context/I18nContext';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

import SiteManagementHeader from '@/components/site-management/SiteManagementHeader';
import SiteManagementFilters from '@/components/site-management/SiteManagementFilters';
import TaskList from '@/components/site-management/TaskList';
import TaskFormDialog from '@/components/site-management/TaskFormDialog';
import TaskDeleteDialog from '@/components/site-management/TaskDeleteDialog';
import NoProjectSelected from '@/components/site-management/NoProjectSelected';
import NoTasksFound from '@/components/site-management/NoTasksFound';

const SiteManagement = () => {
  const { 
    projects, 
    personnel, 
    siteTasks, 
    addSiteTask, 
    updateSiteTask, 
    deleteSiteTask, 
    loading 
  } = useAppContext();
  const { t } = useI18n();
  const { toast } = useToast();

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignedUserFilter, setAssignedUserFilter] = useState('all');

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const filteredTasks = useMemo(() => {
    let tasks = siteTasks || [];
    if (selectedProjectId) {
      tasks = tasks.filter(task => task.projectId === selectedProjectId);
    }
    if (statusFilter !== 'all') {
      tasks = tasks.filter(task => task.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      tasks = tasks.filter(task => task.priority === priorityFilter);
    }
    if (assignedUserFilter !== 'all') {
      tasks = tasks.filter(task => task.assignedTo === assignedUserFilter);
    }
    if (searchTerm) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return tasks.sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [siteTasks, selectedProjectId, statusFilter, priorityFilter, assignedUserFilter, searchTerm]);

  const handleAddTask = useCallback(() => {
    if (!selectedProjectId) {
        toast({
            title: t('siteManagement.notifications.selectProjectFirstTitle'),
            description: t('siteManagement.notifications.selectProjectFirstDesc'),
            variant: "destructive",
        });
        return;
    }
    setEditingTask(null);
    setIsTaskFormOpen(true);
  }, [selectedProjectId, toast, t]);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteTask = useCallback(() => {
    if (taskToDelete && deleteSiteTask) {
      deleteSiteTask(taskToDelete.id);
      toast({
        title: t('common.toast.successTitle'),
        description: t('common.toast.deleteItemSuccess', { itemName: t('common.itemNames.task'), itemNameValue: taskToDelete.title }),
        className: "bg-red-500 text-white", 
      });
    }
    setIsDeleteConfirmationOpen(false);
    setTaskToDelete(null);
  }, [taskToDelete, deleteSiteTask, t, toast]);

  const handleTaskFormSubmit = useCallback((formData) => {
    const taskData = {
      ...formData,
      projectId: formData.projectId || selectedProjectId, 
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTask) {
      if (updateSiteTask) {
        updateSiteTask(editingTask.id, taskData);
        toast({
          title: t('common.toast.successTitle'),
          description: t('common.toast.updateItemSuccess', { itemName: t('common.itemNames.task'), itemNameValue: taskData.title }),
          className: "bg-blue-600 text-white", 
        });
      }
    } else {
      if (addSiteTask) {
        addSiteTask({ ...taskData, id: Date.now().toString() });
        toast({
          title: t('common.toast.successTitle'),
          description: t('common.toast.addItemSuccess', { itemName: t('common.itemNames.task'), itemNameValue: taskData.title }),
          className: "bg-green-600 text-white", 
        });
      }
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  }, [editingTask, addSiteTask, updateSiteTask, t, toast, selectedProjectId]);
  
  const handleTaskStatusChange = useCallback((taskId, newStatus) => {
    const task = siteTasks.find(t => t.id === taskId);
    if (task && updateSiteTask) {
      updateSiteTask(taskId, { ...task, status: newStatus, updatedAt: new Date().toISOString() });
       toast({
        title: t('siteManagement.toast.statusUpdateTitle'),
        description: t('siteManagement.toast.statusUpdateSuccess', { taskTitle: task.title, newStatus: t(`status.${newStatus.replace('-', '')}`) }),
      });
    }
  }, [siteTasks, updateSiteTask, t, toast]);

  const currentProjectPersonnel = useMemo(() => {
    if (!selectedProjectId) return personnel;
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project || !project.assignedTeam) return [];
    return personnel.filter(p => project.assignedTeam.includes(p.id));
  }, [selectedProjectId, projects, personnel]);


  if (loading) {
    return <div className="flex items-center justify-center h-full p-8 text-xl text-gray-700">{t('common.loading')}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-1 md:p-4 site-management-light"
    >
      <SiteManagementHeader onAddTask={handleAddTask} selectedProjectId={selectedProjectId} />
      
      <SiteManagementFilters
        projects={projects}
        personnel={personnel}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assignedUserFilter={assignedUserFilter}
        setAssignedUserFilter={setAssignedUserFilter}
        currentProjectPersonnel={currentProjectPersonnel}
      />
      
      {!selectedProjectId ? (
        <NoProjectSelected />
      ) : filteredTasks.length === 0 ? (
        <NoTasksFound onAddTask={handleAddTask} />
      ) : (
        <TaskList
          tasks={filteredTasks}
          projects={projects}
          personnel={personnel}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onTaskStatusChange={handleTaskStatusChange}
        />
      )}

      <TaskFormDialog
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        task={editingTask}
        projects={projects}
        personnel={personnel}
        onSubmit={handleTaskFormSubmit}
      />
      <TaskDeleteDialog
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        taskTitle={taskToDelete?.title}
        onDelete={confirmDeleteTask}
      />
    </motion.div>
  );
};

export default SiteManagement;
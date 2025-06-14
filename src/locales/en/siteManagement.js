export default {
  title: 'Site Task Management',
  description: 'Oversee and assign tasks for ongoing construction projects.',
  addTaskButton: 'Add New Task',
  filters: {
    title: 'Task Filters',
    description: 'Refine your task list by selecting a project, searching, or using the filters below.',
    projectLabel: 'Project',
    projectPlaceholder: 'Choose a project to manage tasks',
    allProjects: 'All Projects',
    searchLabel: 'Search',
    searchPlaceholder: 'Search by title or description...',
    statusLabel: 'Status',
    statusPlaceholder: 'Filter by Status',
    allStatuses: 'All Statuses',
    priorityLabel: 'Priority',
    priorityPlaceholder: 'Filter by Priority',
    allPriorities: 'All Priorities',
    assigneeLabel: 'Assignee',
    assigneePlaceholder: 'Filter by Assignee',
    allAssignees: 'All Personnel',
    selectProjectForAssignees: 'Select a project to see assignees'
  },
  noProjectSelectedTitle: 'Select a Project',
  noProjectSelectedDescription: 'Please select a project from the dropdown above to view and manage its tasks.',
  noTasksFoundTitle: 'No Tasks Match Criteria',
  noTasksFoundDescription: 'No tasks found matching current filters, or no tasks created for this project yet.',
  addFirstTaskButton: 'Add First Task for this Project',
  projectLabel: 'Project',
  assignedToLabel: 'Assigned To',
  dueDateLabel: 'Due Date',
  priorityLabel: 'Priority',
  statusLabel: 'Status',
  task: {
    assignedTo: 'Assigned To',
    dueDate: 'Due Date',
    priority: 'Priority',
    status: 'Status',
    noDescription: 'No description provided for this task.',
  },
  prompts: {
    selectProject: 'Please select a project to view its tasks.',
    noTasksMatchFilters: 'No tasks match the current filters for this project.',
    noTasksForProject: 'No tasks found for this project. Start by adding one!',
    addFirstTask: 'Add First Task',
  },
  taskForm: {
    addTitle: 'Add New Site Task',
    editTitle: 'Edit Site Task',
    addDescription: 'Fill in the details to create a new task for the selected project.',
    editDescription: 'Update the details of this site task.',
    titleLabel: 'Task Title',
    titlePlaceholder: 'e.g., Install scaffolding for Sector B',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Provide a detailed description of the task...',
    projectLabel: 'Project',
    projectPlaceholder: 'Select Project',
    assignedToLabel: 'Assigned To',
    assignedToPlaceholder: 'Select Personnel',
    statusLabel: 'Status',
    statusPlaceholder: 'Select Status',
    priorityLabel: 'Priority',
    priorityPlaceholder: 'Select Priority',
    dueDateLabel: 'Due Date',
    dueDatePlaceholder: 'Pick a date',
    addButton: 'Add Task',
    updateButton: 'Save Changes',
    selectProjectFirst: 'Select a project first to filter personnel.',
  },
  deleteDialog: {
    title: 'Delete Task',
    description: 'Are you sure you want to delete the task "{taskTitle}"?',
    thisTask: 'this task',
    confirmation: 'This action cannot be undone.',
  },
  notifications: {
    selectProjectFirstTitle: 'No Project Selected',
    selectProjectFirstDesc: 'Please select a project before adding a task.',
  },
  toast: {
    statusUpdateTitle: "Task Status Updated",
    statusUpdateSuccess: "Task '{taskTitle}' status updated to {newStatus}.",
  }
};
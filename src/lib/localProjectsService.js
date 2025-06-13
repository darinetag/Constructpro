// /lib/localProjectsService.js
const STORAGE_KEY = 'projects';

function getProjectsFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveProjectsToStorage(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// CREATE
export function createProject(project) {
  const projects = getProjectsFromStorage();
  const newProject = { ...project, id: crypto.randomUUID(), isDeleted: false, createdAt: new Date().toISOString() };
  projects.push(newProject);
  saveProjectsToStorage(projects);
  return newProject;
}

// READ
export function getProjects() {
  return getProjectsFromStorage();
}

// UPDATE
export function updateProject(updatedProject) {
  const projects = getProjectsFromStorage();
  const newProjects = projects.map(p => p.id === updatedProject.id ? { ...p, ...updatedProject } : p);
  saveProjectsToStorage(newProjects);
  return updatedProject;
}

// SOFT DELETE
export function softDeleteProject(projectId) {
  const projects = getProjectsFromStorage();
  const newProjects = projects.map(p => p.id === projectId ? { ...p, isDeleted: true, deletedAt: new Date().toISOString() } : p);
  saveProjectsToStorage(newProjects);
}

// RESTORE
export function restoreProject(projectId) {
  const projects = getProjectsFromStorage();
  const newProjects = projects.map(p => p.id === projectId ? { ...p, isDeleted: false, deletedAt: null } : p);
  saveProjectsToStorage(newProjects);
}

// PERMANENT DELETE
export function permanentlyDeleteProject(projectId) {
  const projects = getProjectsFromStorage();
  const newProjects = projects.filter(p => p.id !== projectId);
  saveProjectsToStorage(newProjects);
}

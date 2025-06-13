const PROJECTS_KEY = 'projects';

export function getProjects() {
  const data = localStorage.getItem(PROJECTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function addProject(project) {
  const projects = getProjects();
  const newProject = { ...project, id: crypto.randomUUID() }; // Unique ID
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
}

export function updateProject(id, updatedProject) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    projects[idx] = { ...updatedProject, id };
    saveProjects(projects);
  }
  return projects[idx];
}

export function deleteProject(id) {
  const projects = getProjects().filter(p => p.id !== id);
  saveProjects(projects);
}

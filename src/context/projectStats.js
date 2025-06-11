export const getProjectStats = (projectId, projects, personnel, materials, finances) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const projectPersonnel = personnel.filter(p => p.projectId === projectId);
  const projectMaterials = materials.filter(m => m.projectId === projectId);
  const projectFinances = finances.filter(f => f.projectId === projectId);
  
  const expenses = projectFinances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);
  
  const income = projectFinances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);
  
  const materialCost = projectMaterials.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0);
  
  return {
    personnelCount: projectPersonnel.length,
    materialsCount: projectMaterials.length,
    expenses,
    income,
    balance: income - expenses,
    materialCost,
    budget: project.budget,
    budgetRemaining: project.budget - expenses,
    completion: project.completion
  };
};
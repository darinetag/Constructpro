export const LS_KEY_PROJECTS = 'projects';
export const LS_KEY_TRANSACTIONS = 'transactions';

export function getProjectsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY_PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getTransactionsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY_TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
export function saveTransactionsToLocalStorage(transactions) {
  localStorage.setItem(LS_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

export function saveProjectsToLocalStorage(projects) {
  localStorage.setItem(LS_KEY_PROJECTS, JSON.stringify(projects));
}


export function generateId() {
  return Date.now().toString();
}
import { 
  initialPersonnel, 
  initialProjects, 
  initialMaterials, 
  initialFinances, 
  initialLabTests, 
  initialMarketplaceItems, 
  initialLabAppointments, 
  initialLabServices,
  initialUserTasks,
  initialUserTimeLogs,
  initialUserPayments
} from './initialData';

export const initialAppState = {
  loading: true,
  error: null,
  personnel: initialPersonnel,
  projects: initialProjects,
  materials: initialMaterials,
  finances: initialFinances,
  labTests: initialLabTests,
  marketplace: initialMarketplaceItems,
  labAppointments: initialLabAppointments,
  labServices: initialLabServices,
  userTasks: initialUserTasks,
  userTimeLogs: initialUserTimeLogs,
  userPayments: initialUserPayments,
  siteTasks: [], // Added new slice for site management tasks
};
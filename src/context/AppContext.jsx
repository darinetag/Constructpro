import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { initialAppState } from '@/context/appState';
import { loadDataFromStorage, saveDataToStorage, clearAllAppData, clearSpecificAppData } from '@/context/storageUtils';
import { useCrudOperations } from '@/context/useCrudOperations'; 
import { getProjectStats as calculateProjectStats } from '@/context/projectStats';
import { I18nProvider, useI18n } from '@/context/I18nContext';
import { DATA_SLICES_TO_PERSIST } from '@/context/appContextConstants';
import { 
  handleLogin as authLoginUtil, 
  handleLogout as authLogoutUtil, 
  loadUserFromStorage,
  saveUserToStorage
} from '@/context/authUtils';
import { supabase } from '@/lib/supabaseClient';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const AppProviderContent = ({ children }) => {
  const { toast } = useToast();
  const { locale, t } = useI18n(); 

  const [userProfile, setUserProfileState] = useState(null);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [isInitialAuthCheckDone, setIsInitialAuthCheckDone] = useState(false);

  const [state, setState] = useState(() => {
    return { ...initialAppState, loading: true };
  });

  useEffect(() => {
    const { user, authenticated } = loadUserFromStorage();
    if (user && authenticated) {
      setUserProfileState(user);
      setIsAuthenticatedState(true);
    }
    setIsInitialAuthCheckDone(true); 
  }, []);

  useEffect(() => {
    if (!isInitialAuthCheckDone) {
      return;
    }

    const fetchProjectsFromSupabase = async () => {
      if (!userProfile?.id) return [];
      setState(s => ({ ...s, loading: true }));
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.fetchError'), variant: 'destructive' });
          return [];
        }
        return data.map(p => ({
          ...p,
          startDate: p.start_date,
          endDate: p.end_date,
          clientName: p.client_name,
          isDeleted: p.is_deleted,
          deletedAt: p.deleted_at,
        }));
      } catch (err) {
        console.error('Supabase fetch error:', err);
        toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.fetchError'), variant: 'destructive' });
        return [];
      } finally {
        setState(s => ({ ...s, loading: false }));
      }
    };

    if (isAuthenticated && userProfile) {
      const otherPersistedData = loadDataFromStorage(
        Object.values(DATA_SLICES_TO_PERSIST).filter(key => key !== DATA_SLICES_TO_PERSIST.projects)
      );
      
      fetchProjectsFromSupabase().then(supabaseProjects => {
        setState({ 
          ...initialAppState, 
          ...otherPersistedData,  
          projects: supabaseProjects || initialAppState.projects,
          siteTasks: otherPersistedData.siteTasks || initialAppState.siteTasks,
          loading: false      
        });
      });
      
    } else {
      setState({ ...initialAppState, loading: false });
    }
  }, [isAuthenticated, userProfile, isInitialAuthCheckDone, t, toast]);

  useEffect(() => {
    if (!isInitialAuthCheckDone || state.loading) {
      return;
    }

    if (isAuthenticated && userProfile) {
      Object.entries(state).forEach(([sliceKey, data]) => {
        const storageKey = DATA_SLICES_TO_PERSIST[sliceKey];
        if (storageKey && data !== undefined && sliceKey !== 'projects') { // Exclude projects from localStorage
          saveDataToStorage(storageKey, data);
        }
      });
    }
    saveUserToStorage(userProfile, isAuthenticated);

  }, [state, userProfile, isAuthenticated, isInitialAuthCheckDone]);
  
  const createWrappedSetState = useCallback((sliceKey) => {
    return (dataUpdater) => {
      setState(s => {
        if (s.loading && sliceKey !== 'loading') return s; 
        const currentStateSlice = s[sliceKey];
        const newData = typeof dataUpdater === 'function' ? dataUpdater(currentStateSlice) : dataUpdater;
        return { ...s, [sliceKey]: newData };
      });
    };
  }, []);

  const personnelCrud = useCrudOperations(state.personnel, createWrappedSetState('personnel'), t('common.itemNames.personnel'), { toast }, t);
  
  const projectsCrud = useMemo(() => ({
    addProject: async (newProjectData) => {
      if (!userProfile?.id) {
        toast({ title: t('common.toast.errorTitle'), description: t('common.toast.notAuthenticated'), variant: 'destructive' });
        return false;
      }
      setState(s => ({ ...s, loading: true }));
      try {
        const projectPayload = {
          ...newProjectData,
          user_id: userProfile.id,
          start_date: newProjectData.startDate,
          end_date: newProjectData.endDate,
          client_name: newProjectData.clientName,
          is_deleted: false,
          deleted_at: null,
        };
        delete projectPayload.startDate;
        delete projectPayload.endDate;
        delete projectPayload.clientName;
        delete projectPayload.isDeleted;
        delete projectPayload.deletedAt;
        if (projectPayload.id) delete projectPayload.id; // Let Supabase generate ID
        const getProjectStats = useCallback(() => {
  return calculateProjectStats(state.projects);
}, [state.projects]);


        const { data, error } = await supabase
          .from('projects')
          .insert([projectPayload])
          .select()
          .single();

        if (error) {
          console.error('Error adding project:', error);
          toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.addError'), variant: 'destructive' });
          return false;
        }
        
        const formattedData = {
          ...data,
          startDate: data.start_date,
          endDate: data.end_date,
          clientName: data.client_name,
          isDeleted: data.is_deleted,
          deletedAt: data.deleted_at,
        };

        setState(s => ({ ...s, projects: [...s.projects, formattedData] }));
        toast({ title: t('common.toast.successTitle'), description: t('projectsPage.toast.addSuccess', { projectName: data.name }) });
        return true;
      } catch (err) {
        console.error('Supabase add error:', err);
        toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.addError'), variant: 'destructive' });
        return false;
      } finally {
        setState(s => ({ ...s, loading: false }));
      }
    },
    updateProject: async (id, updatedProjectData) => {
      setState(s => ({ ...s, loading: true }));
      try {
        const projectPayload = {
          ...updatedProjectData,
          start_date: updatedProjectData.startDate,
          end_date: updatedProjectData.endDate,
          client_name: updatedProjectData.clientName,
        };
        delete projectPayload.id; 
        delete projectPayload.user_id;
        delete projectPayload.created_at;
        delete projectPayload.startDate;
        delete projectPayload.endDate;
        delete projectPayload.clientName;
        delete projectPayload.isDeleted; 
        delete projectPayload.deletedAt;

        const { data, error } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', id)
          .eq('user_id', userProfile.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating project:', error);
          toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.updateError'), variant: 'destructive' });
          return false;
        }

        const formattedData = {
          ...data,
          startDate: data.start_date,
          endDate: data.end_date,
          clientName: data.client_name,
          isDeleted: data.is_deleted,
          deletedAt: data.deleted_at,
        };

        setState(s => ({
          ...s,
          projects: s.projects.map(p => (p.id === id ? formattedData : p)),
        }));
        toast({ title: t('common.toast.successTitle'), description: t('projectsPage.toast.updateSuccess', { projectName: data.name }) });
        return true;
      } catch (err) {
        console.error('Supabase update error:', err);
        toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.updateError'), variant: 'destructive' });
        return false;
      } finally {
        setState(s => ({ ...s, loading: false }));
      }
    },
    deleteProject: async (id) => { // Soft delete
      setState(s => ({ ...s, loading: true }));
      let projectName = '';
      try {
        const projectToUpdate = state.projects.find(p => p.id === id);
        projectName = projectToUpdate?.name || id;

        const { data, error } = await supabase
          .from('projects')
          .update({ is_deleted: true, deleted_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', userProfile.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error soft deleting project:', error);
          toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.deleteError'), variant: 'destructive' });
          return false;
        }

        const formattedData = {
          ...data,
          startDate: data.start_date,
          endDate: data.end_date,
          clientName: data.client_name,
          isDeleted: data.is_deleted,
          deletedAt: data.deleted_at,
        };

        setState(s => ({
          ...s,
          projects: s.projects.map(p => (p.id === id ? formattedData : p)),
        }));
        toast({ title: t('common.toast.successTitle'), description: t('projectsPage.toast.projectMovedToBin', { projectName }) });
        return true;
      } catch (err) {
        console.error('Supabase soft delete error:', err);
        toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.deleteError'), variant: 'destructive' });
        return false;
      } finally {
        setState(s => ({ ...s, loading: false }));
      }
    },
    restoreProject: async (id) => {
      setState(s => ({ ...s, loading: true }));
      let projectName = '';
      try {
        const projectToUpdate = state.projects.find(p => p.id === id);
        projectName = projectToUpdate?.name || id;

        const { data, error } = await supabase
          .from('projects')
          .update({ is_deleted: false, deleted_at: null })
          .eq('id', id)
          .eq('user_id', userProfile.id)
          .select()
          .single();

        if (error) {
          console.error('Error restoring project:', error);
          toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.restoreError'), variant: 'destructive' });
          return false;
        }
        
        const formattedData = {
          ...data,
          startDate: data.start_date,
          endDate: data.end_date,
          clientName: data.client_name,
          isDeleted: data.is_deleted,
          deletedAt: data.deleted_at,
        };

        setState(s => ({
          ...s,
          projects: s.projects.map(p => (p.id === id ? formattedData : p)),
        }));
        toast({ title: t('common.toast.successTitle'), description: t('projectsPage.toast.projectRestored', { projectName }) });
        return true;
      } catch (err) {
        console.error('Supabase restore error:', err);
        toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.restoreError'), variant: 'destructive' });
        return false;
      } finally {
        setState(s => ({ ...s, loading: false }));
      }
    },
    permanentlyDeleteProject: async (id) => {
      setState(s => ({ ...s, loading: true }));
      let projectName = '';
      try {
        const projectToDelete = state.projects.find(p => p.id === id);
        projectName = projectToDelete?.name || id;

        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('user_id', userProfile.id);

        if (error) {
          console.error('Error permanently deleting project:', error);
          toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.permanentDeleteError'), variant: 'destructive' });
          return false;
        }
        setState(s => ({
          ...s,
          projects: s.projects.filter(p => p.id !== id),
        }));
        toast({ title: t('common.toast.successTitle'), description: t('projectsPage.toast.projectPermanentlyDeleted', { projectName }), variant: 'destructive' });
        return true;
      } catch (err) {
        console.error('Supabase permanent delete error:', err);
        toast({ title: t('common.toast.errorTitle'), description: t('projectsPage.toast.permanentDeleteError'), variant: 'destructive' });
        return false;
      } finally {
        setState(s => ({ ...s, loading: false }));
      }
    },
  }), [state.projects, userProfile, setState, t, toast]);


  const materialsCrud = useCrudOperations(state.materials, createWrappedSetState('materials'), t('common.itemNames.material'), { toast }, t);
  const financesCrud = useCrudOperations(state.finances, createWrappedSetState('finances'), t('common.itemNames.finance'), { toast }, t);
  const labTestsCrud = useCrudOperations(state.labTests, createWrappedSetState('labTests'), t('common.itemNames.labTest'), { toast }, t);
  const marketplaceCrud = useCrudOperations(state.marketplace, createWrappedSetState('marketplace'), t('common.itemNames.marketplaceItem'), { toast }, t);
  const labAppointmentsCrud = useCrudOperations(state.labAppointments, createWrappedSetState('labAppointments'), t('common.itemNames.labAppointment'), { toast }, t);
  const labServicesCrud = useCrudOperations(state.labServices, createWrappedSetState('labServices'), t('common.itemNames.labService'), { toast }, t);
  const userTasksCrud = useCrudOperations(state.userTasks || [], createWrappedSetState('userTasks'), t('common.itemNames.userTask'), { toast }, t);
  const userTimeLogsCrud = useCrudOperations(state.userTimeLogs || [], createWrappedSetState('userTimeLogs'), t('common.itemNames.userTimeLog'), { toast }, t);
  const userPaymentsCrud = useCrudOperations(state.userPayments || [], createWrappedSetState('userPayments'), t('common.itemNames.userPayment'), { toast }, t);
  const siteTasksCrud = useCrudOperations(state.siteTasks || [], createWrappedSetState('siteTasks'), 'siteTask', { toast }, t);
  
  const getProjectStats = useCallback((projectId) => {
    return calculateProjectStats(projectId, state.projects, state.personnel, state.materials, state.finances);
  }, [state.projects, state.personnel, state.materials, state.finances]);

  const handleLogin = useCallback((profile, rememberMe) => {
    clearAllAppData(); 
    authLoginUtil(profile, setUserProfileState, setIsAuthenticatedState, rememberMe);
    saveUserToStorage(profile, true);
    // Project data will be fetched by the useEffect listening to isAuthenticated
  }, [authLoginUtil, setUserProfileState, setIsAuthenticatedState]);

  const handleLogout = useCallback(() => {
    authLogoutUtil(setUserProfileState, setIsAuthenticatedState); 
    // clearAllAppData(); 
    // clearSpecificAppData(DATA_SLICES_TO_PERSIST.projects); // Ensure projects are cleared from LS if any were there
    saveUserToStorage(null, false); 
  }, [authLogoutUtil, setUserProfileState, setIsAuthenticatedState]);

  const financeOperations = useMemo(() => ({
    addFinance: async (financeData) => {
      console.log('[DEBUG] Adding finance:', financeData);
      
      // Create the new finance record with proper ID generation
      const newFinance = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        ...financeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        // Use the CRUD operation
        const result = await financesCrud.addItem(newFinance);
        console.log('[DEBUG] Finance added successfully:', result);
        return result;
      } catch (error) {
        console.error('[ERROR] Failed to add finance:', error);
        throw error;
      }
    },
    
    updateFinance: async (id, financeData) => {
      console.log('[DEBUG] Updating finance:', id, financeData);
      
      try {
        const result = await financesCrud.updateItem(id, {
          ...financeData,
          updatedAt: new Date().toISOString()
        });
        console.log('[DEBUG] Finance updated successfully:', result);
        return result;
      } catch (error) {
        console.error('[ERROR] Failed to update finance:', error);
        throw error;
      }
    },
    
    deleteFinance: async (id) => {
      console.log('[DEBUG] Deleting finance:', id);
      
      try {
        const result = await financesCrud.deleteItem(id);
        console.log('[DEBUG] Finance deleted successfully:', result);
        return result;
      } catch (error) {
        console.error('[ERROR] Failed to delete finance:', error);
        throw error;
      }
    }
  }), [financesCrud]);
  
  // Then in your contextValue, use:
  const contextValue = useMemo(() => ({
    ...state,
    userProfile,
    isAuthenticated,
    isInitialAuthCheckDone, 
    setUserProfile: setUserProfileState, 
    setIsAuthenticated: setIsAuthenticatedState, 
    handleLogin,
    handleLogout,
    ...personnelCrud,
    ...projectsCrud,
    ...materialsCrud,
    ...financeOperations, // Use the wrapped operations
    ...labTestsCrud,
    ...marketplaceCrud,
    ...labAppointmentsCrud,
    ...labServicesCrud,
    ...userTasksCrud,
    ...userTimeLogsCrud,
    ...userPaymentsCrud,
    ...siteTasksCrud, 
    getProjectStats,
    locale 
  }), [
    state, 
    userProfile,
    isAuthenticated,
    isInitialAuthCheckDone,
    handleLogin,
    handleLogout,
    personnelCrud, 
    projectsCrud, 
    materialsCrud, 
    financeOperations, // Updated dependency
    labTestsCrud, 
    marketplaceCrud,
    labAppointmentsCrud,
    labServicesCrud,
    userTasksCrud,
    userTimeLogsCrud,
    userPaymentsCrud,
    siteTasksCrud,
    getProjectStats,
    locale
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider = ({ children }) => {
  return (
    <I18nProvider>
      <AppProviderContent>{children}</AppProviderContent>
    </I18nProvider>
  );
};
import appName from './fr/appName';
import localeCode from './fr/localeCode';
import dateFnsLocale from './fr/dateFnsLocale';
import navigation from './fr/navigation';
import actions from './fr/actions';
import common from './fr/common';
import currency from './fr/currency';
import { dashboard } from './fr/dashboard';
import financePage from './fr/financePage';
import laboratoryPage from './fr/laboratoryPage';
import materialsPage from './fr/materialsPage';
import personnelPage from './fr/personnelPage';
import projectsPage from './fr/projectsPage';
import siteManagement from './fr/siteManagement';
import marketplace from './fr/marketplace';
import settings from './fr/settings';
import userMenu from './fr/userMenu';
import login from './fr/login';
import logoutMessage from './fr/logoutMessage';
import notFoundPage from './fr/notFoundPage';
import placeholders from './fr/placeholders';
import status from './fr/status';
import priority from './fr/priority';
import loading from './fr/loading';
import notifications from './fr/notifications';
import workerPortal from './fr/workerPortal';
import workerPages from './fr/workerPages';
import labPortal from './fr/labPortal';
import labPersonnelPages from './fr/labPersonnelPages';
import languageSwitcher from './fr/languageSwitcher';

export default {
  appName,
  localeCode,
  dateFnsLocale,
  navigation,
  actions,
  common,
  currency,
     dashboard: {
    worker: {
      title: "Mon Tableau de Bord",
      welcome: "Bienvenue sur votre tableau de bord",
      stats: {
        activeTasksTitle: "Tâches actives",
        activeTasksDesc: "Tâches qui vous sont assignées",
        pendingTimeLogsTitle: "Feuilles de temps en attente",
        pendingTimeLogsDesc: "Feuilles de temps en attente de validation",
        totalPaymentsTitle: "Paiements totaux",
        totalPaymentsDesc: "Tous vos gains à ce jour",
        myListingsTitle: "Mes annonces",
        myListingsDesc: "Vos services publiés"
      },
      viewAllTasks: "Voir toutes les tâches",
      viewTimeLogs: "Voir les feuilles de temps",
      viewPaymentHistory: "Voir l'historique des paiements",
      quickActions: "Actions rapides",
      logTime: "Enregistrer du temps",
      addService: "Ajouter un service",
      recentActivity: {
        title: "Activité récente",
        description: "Voici ce que vous avez fait récemment",
        noActivity: "Aucune activité récente"
      }
    }
  },
  navigation: {
    myServices: "Mes services"
  },
  app: {
    name: "ConstructPro",
    portalTitle: "Portail travailleur"
  },
  user: {
    name: "Houssem"
  },
  financePage,
  laboratoryPage,
  materialsPage,
  personnelPage,
  projectsPage,
  siteManagement,
  marketplace,
  settings,
  userMenu,
  login,
  logoutMessage,
  notFoundPage,
  placeholders,
  status,
  priority,
  loading,
  notifications,
  workerPortal,
  workerPages,
  labPortal,
  labPersonnelPages,
  languageSwitcher,
};
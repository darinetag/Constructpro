import appName from './ar/appName';
import localeCode from './ar/localeCode';
import dateFnsLocale from './ar/dateFnsLocale';
import navigation from './ar/navigation';
import actions from './ar/actions';
import common from './ar/common';
import currency from './ar/currency';
import { dashboard } from './ar/dashboard';
import financePage from './ar/financePage';
import laboratoryPage from './ar/laboratoryPage';
import materialsPage from './ar/materialsPage';
import personnelPage from './ar/personnelPage';
import projectsPage from './ar/projectsPage';
import siteManagement from './ar/siteManagement';
import marketplace from './ar/marketplace';
import settings from './ar/settings';
import userMenu from './ar/userMenu';
import login from './ar/login';
import logoutMessage from './ar/logoutMessage';
import notFoundPage from './ar/notFoundPage';
import placeholders from './ar/placeholders';
import status from './ar/status';
import priority from './ar/priority';
import loading from './ar/loading';
import notifications from './ar/notifications';
import workerPortal from './ar/workerPortal';
import workerPages from './ar/workerPages';
import labPortal from './ar/labPortal';
import labPersonnelPages from './ar/labPersonnelPages';
import languageSwitcher from './ar/languageSwitcher';

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
      title: "لوحة التحكم الخاصة بي",
      welcome: "مرحبًا بك في لوحة التحكم",
      stats: {
        activeTasksTitle: "المهام النشطة",
        activeTasksDesc: "المهام المخصصة لك",
        pendingTimeLogsTitle: "سجلات الوقت المعلقة",
        pendingTimeLogsDesc: "سجلات الوقت التي تنتظر المراجعة",
        totalPaymentsTitle: "إجمالي الدفعات",
        totalPaymentsDesc: "جميع أرباحك حتى الآن",
        myListingsTitle: "قوائمي",
        myListingsDesc: "الخدمات التي قمت بنشرها"
      },
      viewAllTasks: "عرض جميع المهام",
      viewTimeLogs: "عرض سجلات الوقت",
      viewPaymentHistory: "عرض سجل الدفعات",
      quickActions: "إجراءات سريعة",
      logTime: "تسجيل الوقت",
      addService: "إضافة خدمة",
      recentActivity: {
        title: "النشاط الأخير",
        description: "إليك ما قمت به مؤخرًا",
        noActivity: "لا يوجد نشاط حديث"
      }
    }
  },
  navigation: {
    myServices: "خدماتي"
  },
  app: {
    name: "كونستركت برو",
    portalTitle: "بوابة العامل"
  },
  user: {
    name: "حُسّام"
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
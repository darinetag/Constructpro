import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/context/I18nContext';

const DashboardTabs = ({ tabContents }) => {
  const { t } = useI18n();
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">{t('dashboard.admin.tabs.overview')}</TabsTrigger>
        <TabsTrigger value="projects">{t('dashboard.admin.tabs.projects')}</TabsTrigger>
        <TabsTrigger value="finances">{t('dashboard.admin.tabs.finances')}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {tabContents.overview}
      </TabsContent>

      <TabsContent value="projects" className="space-y-6">
        {tabContents.projects}
      </TabsContent>

      <TabsContent value="finances" className="space-y-6">
        {tabContents.finances}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Search, Info, CalendarDays, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from '@/context/I18nContext';

const LabProjects = () => {
  const { projects, labTests, loading } = useAppContext();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const projectsWithLabData = useMemo(() => {
    if (loading) return [];
    return projects.map(project => {
      const testsForProject = labTests.filter(test => test.projectId === project.id);
      const passedCount = testsForProject.filter(t => t.status === 'passed').length;
      const failedCount = testsForProject.filter(t => t.status === 'failed').length;
      const pendingCount = testsForProject.filter(t => t.status === 'pending').length;
      return {
        ...project,
        totalTests: testsForProject.length,
        passedCount,
        failedCount,
        pendingCount,
      };
    }).filter(project => {
        const searchLower = searchTerm.toLowerCase();
        return project.name.toLowerCase().includes(searchLower) || 
               project.location.toLowerCase().includes(searchLower) ||
               (project.totalTests > 0 && searchTerm === "has tests"); 
    });
  }, [projects, labTests, loading, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) return <p>{t('common.loadingProjects')}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Briefcase className="mr-3 h-8 w-8 text-primary" /> {t('labPersonnelPages.projectTracker.title')}
            </h1>
            <p className="text-muted-foreground">{t('labPersonnelPages.projectTracker.description')}</p>
        </div>
      </div>
      
      <Alert variant="default" className="bg-sky-50 border-sky-200 text-sky-700">
        <Info className="h-5 w-5 text-sky-600" />
        <AlertTitle className="font-semibold text-sky-800">{t('labPersonnelPages.projectTracker.alert.title')}</AlertTitle>
        <AlertDescription className="text-sky-700">
          {t('labPersonnelPages.projectTracker.alert.description')}
        </AlertDescription>
      </Alert>


      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t('labPersonnelPages.projectTracker.searchProjectPlaceholder')}
          className="pl-10 w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {projectsWithLabData.length === 0 ? (
        <div className="text-center py-10">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">{t('labPersonnelPages.projectTracker.noProjectsFound')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? t('labPersonnelPages.projectTracker.noProjectsFilterHint') : t('labPersonnelPages.projectTracker.noProjectsGeneralHint')}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {projectsWithLabData.map(project => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" /> {project.location}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="text-sm text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" />{t('labPersonnelPages.projectTracker.card.startDatePrefix')}: {format(new Date(project.startDate), 'PP')}</span>
                    <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5" />{t('labPersonnelPages.projectTracker.card.endDatePrefix')}: {format(new Date(project.endDate), 'PP')}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">{t('labPersonnelPages.projectTracker.card.overallProgress', { completion: project.completion })}</p>
                    <Progress value={project.completion} className="h-2.5" />
                  </div>
                  {project.totalTests > 0 && (
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">{t('labPersonnelPages.projectTracker.card.labTestStatus', { count: project.totalTests })}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span>{t('labPersonnelPages.projectTracker.card.testsPassed', { count: project.passedCount })}</span>
                          <Progress value={(project.passedCount/project.totalTests)*100} className="h-1.5 w-2/3 bg-green-200" indicatorClassName="bg-green-500"/>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t('labPersonnelPages.projectTracker.card.testsFailed', { count: project.failedCount })}</span>
                           <Progress value={(project.failedCount/project.totalTests)*100} className="h-1.5 w-2/3 bg-red-200" indicatorClassName="bg-red-500"/>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{t('labPersonnelPages.projectTracker.card.testsPending', { count: project.pendingCount })}</span>
                           <Progress value={(project.pendingCount/project.totalTests)*100} className="h-1.5 w-2/3 bg-yellow-200" indicatorClassName="bg-yellow-500"/>
                        </div>
                      </div>
                    </div>
                  )}
                  {project.totalTests === 0 && (
                    <p className="text-sm text-muted-foreground italic">{t('labPersonnelPages.projectTracker.card.noTestsRecorded')}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LabProjects;
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskRound as FlaskIcon, Search, Beaker, Filter, Download, Info, PlusCircle } from 'lucide-react';
import { LabTestCard, LabTestFormDialog, LabTestDeleteDialog, LabTestStats } from '@/components/laboratory';
import { getLabTestsFromStorage, saveLabTestsToStorage } from '@/components/laboratory/LabTestFormDialog';
import NearbyLocationsCard from '@/components/common/NearbyLocationsCard';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/components/ui/use-toast';

const LaboratoryPageHeader = ({ onAddNewTest, isViewOnlyUser }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {t('laboratoryPage.admin.title')}
        </h1>
        <p className="text-muted-foreground">{t('laboratoryPage.admin.description')}</p>
      </div>
      {!isViewOnlyUser && (
        <Button onClick={onAddNewTest} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('laboratoryPage.admin.addNewTestButtonSmall')}
        </Button>
      )}
    </div>
  );
};

const LaboratoryFilterControls = ({ searchTerm, setSearchTerm, activeTab, setActiveTab, onExportPDF }) => {
  const { t } = useI18n();
  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
        <div className="relative w-full md:w-auto flex-grow md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('laboratoryPage.admin.searchPlaceholder')}
            className="pl-10 w-full sm:w-[350px] h-11 text-base rounded-lg focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
            <Filter className="h-5 w-5 text-muted-foreground"/>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-11 rounded-lg">
                <TabsTrigger value="all" className="text-base px-4">{t('laboratoryPage.admin.tabs.all')}</TabsTrigger>
                <TabsTrigger value="passed" className="text-base px-4">{t('laboratoryPage.admin.tabs.passed')}</TabsTrigger>
                <TabsTrigger value="failed" className="text-base px-4">{t('laboratoryPage.admin.tabs.failed')}</TabsTrigger>
                <TabsTrigger value="pending" className="text-base px-4">{t('laboratoryPage.admin.tabs.pending')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button onClick={onExportPDF} variant="outline" className="h-11 text-base rounded-lg">
            <Download className="h-4 w-4 mr-2" />
            {t('laboratoryPage.admin.exportPdfButton')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Laboratory = () => {
  const { 
    projects, materials, 
    loading, userProfile 
  } = useAppContext();
  const { t } = useI18n();
  const { toast } = useToast();
  
  // Local state for lab tests from localStorage
  const [labTests, setLabTests] = useState([]);
  const [labTestsLoading, setLabTestsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [formMode, setFormMode] = useState('add');

  const isSiteManagerViewOnly = userProfile?.role === 'site_manager';

  // Load lab tests from localStorage on component mount
  useEffect(() => {
    const loadLabTests = () => {
      try {
        setLabTestsLoading(true);
        const storedTests = getLabTestsFromStorage();
        setLabTests(storedTests);
        console.log('[DEBUG] Loaded lab tests from localStorage:', storedTests);
      } catch (error) {
        console.error('Error loading lab tests from localStorage:', error);
        toast({
          title: t('common.errorTitle'),
          description: t('common.toast.loadError'),
          variant: 'destructive',
        });
      } finally {
        setLabTestsLoading(false);
      }
    };

    loadLabTests();
  }, [t, toast]);

  // Function to refresh lab tests from localStorage
  const refreshLabTests = useCallback(() => {
    const storedTests = getLabTestsFromStorage();
    setLabTests(storedTests);
  }, []);

  // localStorage operations
  const addLabTest = useCallback((testData) => {
    try {
      const existingTests = getLabTestsFromStorage();
      const newTest = {
        ...testData,
        id: 'lab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedTests = [...existingTests, newTest];
      saveLabTestsToStorage(updatedTests);
      setLabTests(updatedTests);
      
      toast({
        title: t('common.success'),
        description: t('laboratoryPage.admin.toast.testAdded'),
        variant: 'default',
      });
      
      return newTest;
    } catch (error) {
      console.error('Error adding lab test:', error);
      toast({
        title: t('common.errorTitle'),
        description: t('common.toast.saveError'),
        variant: 'destructive',
      });
    }
  }, [t, toast]);

  const updateLabTest = useCallback((testId, updatedData) => {
    try {
      const existingTests = getLabTestsFromStorage();
      const updatedTests = existingTests.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              ...updatedData, 
              updatedAt: new Date().toISOString() 
            }
          : test
      );
      
      saveLabTestsToStorage(updatedTests);
      setLabTests(updatedTests);
      
      toast({
        title: t('common.success'),
        description: t('laboratoryPage.admin.toast.testUpdated'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating lab test:', error);
      toast({
        title: t('common.errorTitle'),
        description: t('common.toast.updateError'),
        variant: 'destructive',
      });
    }
  }, [t, toast]);

  const deleteLabTest = useCallback((testId) => {
    try {
      const existingTests = getLabTestsFromStorage();
      const updatedTests = existingTests.filter(test => test.id !== testId);
      
      saveLabTestsToStorage(updatedTests);
      setLabTests(updatedTests);
      
      toast({
        title: t('common.success'),
        description: t('laboratoryPage.admin.toast.testDeleted'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting lab test:', error);
      toast({
        title: t('common.errorTitle'),
        description: t('common.toast.deleteError'),
        variant: 'destructive',
      });
    }
  }, [t, toast]);

  const filteredLabTests = useMemo(() => {
    if (labTestsLoading || loading) return [];
    return labTests.filter(test => {
      const typeMatch = test.type.toLowerCase().includes(searchTerm.toLowerCase());
      const resultMatch = test.result.toLowerCase().includes(searchTerm.toLowerCase());
      const notesMatch = test.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const project = projects.find(p => p.id === test.projectId);
      const projectMatch = project?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const material = materials.find(m => m.id === test.materialId);
      const materialMatch = material?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      
      const matchesSearch = typeMatch || resultMatch || notesMatch || projectMatch || materialMatch;
      const matchesStatus = activeTab === 'all' || test.status === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [labTests, searchTerm, activeTab, labTestsLoading, loading, projects, materials]);

  const exportLabTestsPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text(t('laboratoryPage.admin.title'), 14, 16);
    
    const tableColumn = [
      t('laboratoryPage.admin.card.testId'), 
      t('laboratoryPage.admin.form.testTypeLabel'), 
      t('laboratoryPage.admin.card.date'), 
      t('laboratoryPage.admin.card.project'), 
      t('laboratoryPage.admin.card.material'), 
      t('laboratoryPage.admin.form.statusLabel'), 
      t('laboratoryPage.admin.card.result')
    ];
    const tableRows = [];

    filteredLabTests.forEach(test => {
      const projectData = projects.find(p => p.id === test.projectId);
      const materialData = materials.find(m => m.id === test.materialId);
      const testDataRow = [
        test.id, test.type, new Date(test.date).toLocaleDateString(t('localeCode')),
        projectData ? projectData.name : t('common.na'),
        materialData ? materialData.name : t('common.na'),
        t(`status.${test.status}`), test.result,
      ];
      tableRows.push(testDataRow);
    });

    doc.autoTable({
      startY: 22, head: [tableColumn], body: tableRows,
      theme: 'striped', headStyles: { fillColor: [22, 160, 133] }, styles: { fontSize: 8 },
    });
    doc.save(`lab_tests_report_${new Date().toISOString().split('T')[0]}.pdf`);
  }, [filteredLabTests, projects, materials, t]);

  const handleFormSubmit = useCallback((formData) => {
    if (isSiteManagerViewOnly) return;
    
    if (formMode === 'add') {
      addLabTest(formData);
    } else if (formMode === 'edit' && currentTest) {
      updateLabTest(currentTest.id, formData);
    }
    
    setIsFormDialogOpen(false);
    setCurrentTest(null);
    
    // Refresh lab tests after form submission
    refreshLabTests();
  }, [isSiteManagerViewOnly, formMode, currentTest, addLabTest, updateLabTest, refreshLabTests]);

  const openFormDialog = useCallback((mode, test = null) => {
    if (isSiteManagerViewOnly) return;
    setFormMode(mode);
    setCurrentTest(test);
    setIsFormDialogOpen(true);
  }, [isSiteManagerViewOnly]);

  const openDeleteDialog = useCallback((test) => {
    if (isSiteManagerViewOnly) return;
    setCurrentTest(test);
    setIsDeleteDialogOpen(true);
  }, [isSiteManagerViewOnly]);

  const handleDeleteConfirm = useCallback(() => {
    if (isSiteManagerViewOnly || !currentTest) return;
    deleteLabTest(currentTest.id);
    setIsDeleteDialogOpen(false);
    setCurrentTest(null);
  }, [isSiteManagerViewOnly, currentTest, deleteLabTest]);

  if (labTestsLoading || loading) {
    return <div className="flex items-center justify-center h-full text-lg font-semibold text-primary">{t('common.loadingLabTests')}</div>;
  }
  
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  
  const mockNearbyLabs = [
    { id: 'lab1', name: t('laboratoryPage.admin.nearbyLabs.lab1.name'), address: t('laboratoryPage.admin.nearbyLabs.lab1.address'), phone: '555-0011', website: '#' },
    { id: 'lab2', name: t('laboratoryPage.admin.nearbyLabs.lab2.name'), address: t('laboratoryPage.admin.nearbyLabs.lab2.address'), phone: '555-0022', website: '#' },
  ];

  return (
    <div className="space-y-8 p-1">
      <LaboratoryPageHeader onAddNewTest={() => openFormDialog('add')} isViewOnlyUser={isSiteManagerViewOnly} />
      <LabTestStats labTests={labTests} />
      
      {isSiteManagerViewOnly && (
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="font-semibold text-blue-800 dark:text-blue-200">{t('laboratoryPage.admin.viewOnlyAlertTitle')}</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            {t('laboratoryPage.admin.viewOnlyAlertDescriptionSiteManager')}
          </AlertDescription>
        </Alert>
      )}

      <LaboratoryFilterControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportPDF={exportLabTestsPDF}
      />
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border">
        {filteredLabTests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/30 rounded-lg">
            <FlaskIcon className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground">{t('laboratoryPage.admin.noTestsFound')}</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              {searchTerm || activeTab !== 'all' 
                ? t('laboratoryPage.admin.noTestsFoundFilterHint')
                : t('laboratoryPage.admin.noTestsFoundAddHint')}
            </p>
            {!isSiteManagerViewOnly && !(searchTerm || activeTab !== 'all') && (
                 <Button onClick={() => openFormDialog('add')} className="mt-6">{t('laboratoryPage.admin.addNewTestButtonSmall')}</Button>
            )}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants} initial="hidden" animate="show"
          >
            {filteredLabTests.map(test => (
              <LabTestCard
                key={test.id} test={test}
                relatedProject={projects.find(p => p.id === test.projectId)}
                relatedMaterial={materials.find(m => m.id === test.materialId)}
                onEdit={isSiteManagerViewOnly ? undefined : () => openFormDialog('edit', test)}
                onDelete={isSiteManagerViewOnly ? undefined : () => openDeleteDialog(test)}
                isViewOnlyUser={isSiteManagerViewOnly}
              />
            ))}
          </motion.div>
        )}
      </div>
      
      <NearbyLocationsCard title={t('laboratoryPage.admin.nearbyLabsTitle')} locations={mockNearbyLabs} icon={Beaker} />

      <LabTestFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={(isOpen) => { 
          if (!isOpen) setCurrentTest(null); 
          setIsFormDialogOpen(isOpen); 
        }}
        mode={formMode} 
        initialData={currentTest} 
        onSubmit={handleFormSubmit}
        projects={projects} 
        materials={materials} 
        isViewOnlyUser={isSiteManagerViewOnly}
      />
      <LabTestDeleteDialog
        isOpen={isDeleteDialogOpen} 
        onOpenChange={(isOpen) => { 
          if (!isOpen) setCurrentTest(null); 
          setIsDeleteDialogOpen(isOpen); 
        }}
        testType={currentTest?.type} 
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default Laboratory;
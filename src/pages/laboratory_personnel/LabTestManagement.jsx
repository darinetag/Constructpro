import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaskRound as FlaskIcon, Search, Filter, Download, PlusCircle } from 'lucide-react';
import { LabTestCard, LabTestFormDialog, LabTestDeleteDialog, LabTestStats } from '@/components/laboratory';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/I18nContext';

const LabTestManagement = () => {
  const { 
    labTests, projects, materials, 
    addLabTest, updateLabTest, deleteLabTest, 
    loading 
  } = useAppContext();
  const { t } = useI18n();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [formMode, setFormMode] = useState('add');

  const filteredLabTests = useMemo(() => {
    if (loading) return [];
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
  }, [labTests, searchTerm, activeTab, loading, projects, materials]);

  const exportLabTestsPDF = () => {
    const doc = new jsPDF();
    doc.text(t('labPersonnelPages.testManagement.title'), 14, 16);
    
    const tableColumn = [
      t('laboratoryPage.admin.card.testId'), 
      t('labPersonnelPages.testManagement.form.testTypeLabel'), 
      t('laboratoryPage.admin.card.date'), 
      t('laboratoryPage.admin.card.project'), 
      t('laboratoryPage.admin.card.material'), 
      t('labPersonnelPages.testManagement.form.statusLabel'), 
      t('laboratoryPage.admin.card.result')
    ];
    const tableRows = [];

    filteredLabTests.forEach(test => {
      const project = projects.find(p => p.id === test.projectId);
      const material = materials.find(m => m.id === test.materialId);
      const testData = [
        test.id,
        test.type,
        new Date(test.date).toLocaleDateString(),
        project ? project.name : t('common.na'),
        material ? material.name : t('common.na'),
        t(`status.${test.status.toLowerCase()}`),
        test.result,
      ];
      tableRows.push(testData);
    });

    doc.autoTable({
      startY: 22,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [34, 107, 208] }, 
      styles: { fontSize: 8 },
    });
    doc.save(`lab_tests_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-lg font-semibold text-primary">{t('common.loadingLabTests')}</div>;
  }

  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      addLabTest(formData);
    } else {
      updateLabTest(currentTest.id, formData);
    }
    setIsFormDialogOpen(false);
    setCurrentTest(null);
  };

  const openFormDialog = (mode, test = null) => {
    setFormMode(mode);
    setCurrentTest(test);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (test) => {
    setCurrentTest(test);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentTest) {
      deleteLabTest(currentTest.id);
    }
    setIsDeleteDialogOpen(false);
    setCurrentTest(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400">
            {t('labPersonnelPages.testManagement.title')}
          </h1>
          <p className="text-muted-foreground">{t('labPersonnelPages.testManagement.description')}</p>
        </div>
        <Button onClick={() => openFormDialog('add')} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
            <PlusCircle className="h-4 w-4 mr-2"/>
            {t('labPersonnelPages.testManagement.addNewTestButton')}
        </Button>
      </div>

      <LabTestStats labTests={labTests} />
      
      <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative w-full md:w-auto flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('labPersonnelPages.testManagement.searchPlaceholder')}
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
                    <TabsTrigger value="all" className="text-base px-4">{t('labPersonnelPages.testManagement.allStatuses')}</TabsTrigger>
                    <TabsTrigger value="passed" className="text-base px-4">{t('labPersonnelPages.testManagement.statusPassed')}</TabsTrigger>
                    <TabsTrigger value="failed" className="text-base px-4">{t('labPersonnelPages.testManagement.statusFailed')}</TabsTrigger>
                    <TabsTrigger value="pending" className="text-base px-4">{t('labPersonnelPages.testManagement.statusPending')}</TabsTrigger>
                </TabsList>
                </Tabs>
            </div>
            <Button onClick={exportLabTestsPDF} variant="outline" className="h-11 text-base rounded-lg">
                <Download className="h-4 w-4 mr-2" />
                {t('labPersonnelPages.testManagement.exportPdfButton')}
            </Button>
          </div>
        </div>

        {filteredLabTests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/30 rounded-lg">
            <FlaskIcon className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-semibold text-foreground">{t('labPersonnelPages.testManagement.noTestsFound')}</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              {searchTerm || activeTab !== 'all' 
                ? t('labPersonnelPages.testManagement.noTestsFilterHint')
                : t('labPersonnelPages.testManagement.noTestsAddHint')}
            </p>
            {!(searchTerm || activeTab !== 'all') && (
                 <Button onClick={() => openFormDialog('add')} className="mt-6">{t('labPersonnelPages.testManagement.addNewTestButton')}</Button>
            )}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredLabTests.map(test => (
              <LabTestCard
                key={test.id}
                test={test}
                relatedProject={projects.find(p => p.id === test.projectId)}
                relatedMaterial={materials.find(m => m.id === test.materialId)}
                onEdit={() => openFormDialog('edit', test)}
                onDelete={() => openDeleteDialog(test)}
                isProjectOwner={false} 
              />
            ))}
          </motion.div>
        )}
      </div>
      
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
        isProjectOwner={false} 
      />
      
      <LabTestDeleteDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          testType={currentTest?.type}
          onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default LabTestManagement;
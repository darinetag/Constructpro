import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Download, Search, Briefcase } from 'lucide-react';
import FinanceFormDialog from '@/components/finance/FinanceFormDialog';
import FinanceDeleteDialog from '@/components/finance/FinanceDeleteDialog';
import FinanceSummary from '@/components/finance/FinanceSummary';
import TransactionList from '@/components/finance/TransactionList';
import ExpenseBreakdown from '@/components/finance/ExpenseBreakdown';
import ProjectFinances from '@/components/finance/ProjectFinances';
import { useI18n } from '@/context/I18nContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FinancePageHeader = ({ 
  onAddTransaction, 
  availableProjectsForFilter, 
  selectedProjectId, 
  setSelectedProjectId,
  userRole
}) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('financePage.title')}</h1>
        <p className="text-muted-foreground">{t('financePage.description', { currency: t('currency.dZD') })}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        {(userRole === 'Site Manager' || userRole === 'Admin') && availableProjectsForFilter.length > 0 && (
          <Select value={selectedProjectId || "all"} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background shadow-sm">
              <Briefcase className="h-4 w-4 mr-2 opacity-70" />
              <SelectValue placeholder={t('financePage.filterByProjectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('financePage.allProjects')}</SelectItem>
              {availableProjectsForFilter.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
         <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto" onClick={onAddTransaction}>
          <PlusCircle className="h-4 w-4" />
          {t('financePage.addTransactionButton')}
        </Button>
      </div>
    </div>
  );
};

const TransactionsCardHeader = ({ searchTerm, setSearchTerm, activeTab, setActiveTab, onExportPDF }) => {
  const { t } = useI18n();
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>{t('financePage.transactions.title')}</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('financePage.transactions.searchPlaceholder')}
              className="pl-9 w-full sm:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={onExportPDF} variant="outline" className="flex-grow sm:flex-grow-0">
            <Download className="h-4 w-4 mr-2" />
            {t('financePage.transactions.exportPdfButton')}
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t('financePage.transactions.tabs.all')}</TabsTrigger>
          <TabsTrigger value="income">{t('financePage.transactions.tabs.income')}</TabsTrigger>
          <TabsTrigger value="expense">{t('financePage.transactions.tabs.expenses')}</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
  );
};


const Finance = () => {
  const { finances, projects, addFinance, updateFinance, deleteFinance, loading, userProfile } = useAppContext();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [formMode, setFormMode] = useState('add'); 
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  const managedProjects = useMemo(() => {
    if (userProfile?.role === 'Site Manager' && userProfile?.id) {
      return projects.filter(p => p.managerId === userProfile.id || p.siteManager === userProfile.id);
    }
    // For Admins or other roles, they "manage" all projects in the context of filtering.
    return projects; 
  }, [projects, userProfile]);

  const availableProjectsForFilter = useMemo(() => {
    // Site Managers see their managed projects, Admins see all projects.
    return managedProjects;
  }, [managedProjects]);

  const financesForDisplay = useMemo(() => {
    if (loading) return [];
    let baseFinances = finances;

    if (selectedProjectId && selectedProjectId !== "all") {
      // If a specific project is selected, filter base finances to ONLY that project's transactions.
      // This applies to all roles (Admin or Site Manager selecting a project).
      baseFinances = finances.filter(f => f.projectId === selectedProjectId);

      // For Site Managers, ensure they can only see data for projects they actually manage
      // This check is an additional safeguard if selectedProjectId somehow isn't one of their managed projects.
      if (userProfile?.role === 'Site Manager') {
        const isSelectedProjectManaged = managedProjects.some(p => p.id === selectedProjectId);
        if (!isSelectedProjectManaged) {
          baseFinances = []; // If selected project isn't managed by SM, show no transactions.
        }
      }
    } else if (userProfile?.role === 'Site Manager') {
      // Site Manager selected "All Projects": show finances for all their managed projects + general finances (projectId === null).
      const managedProjectIds = managedProjects.map(p => p.id);
      baseFinances = finances.filter(f => f.projectId === null || managedProjectIds.includes(f.projectId));
    }
    // If Admin selects "All Projects", baseFinances remains all 'finances'.
    // For other roles without project selection, baseFinances remains all 'finances'.
    
    return baseFinances.filter(finance => {
      const matchesSearch = finance.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            finance.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeTab === 'all' || finance.type === activeTab;
      return matchesSearch && matchesType;
    });
  }, [finances, searchTerm, activeTab, loading, selectedProjectId, userProfile, managedProjects]);

  const projectsForFinanceDisplay = useMemo(() => {
    if (selectedProjectId && selectedProjectId !== "all") {
      // If a specific project is selected, show only that project in the ProjectFinances card.
      // This applies to both Admin and Site Manager.
      const project = projects.find(p => p.id === selectedProjectId);
      
      // For Site Managers, ensure it's one of their managed projects.
      if (userProfile?.role === 'Site Manager') {
        const isSelectedProjectManaged = managedProjects.some(p => p.id === selectedProjectId);
        return isSelectedProjectManaged && project ? [project] : [];
      }
      return project ? [project] : [];
    } else if (userProfile?.role === 'Site Manager') {
      // Site Manager selected "All Projects": show all their managed projects.
      return managedProjects;
    }
    // Admin selected "All Projects" or other roles: show all projects.
    return projects;
  }, [projects, managedProjects, selectedProjectId, userProfile]);


  const exportTransactionsPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text(t('financePage.transactions.title'), 14, 16);
    
    const tableColumn = [
      t('financePage.pdfExport.id'), 
      t('financePage.pdfExport.description'), 
      t('financePage.pdfExport.category'), 
      t('financePage.pdfExport.date'), 
      t('financePage.pdfExport.amount', {currency: t('currency.dZD')}), 
      t('financePage.pdfExport.type'), 
      t('financePage.pdfExport.project')
    ];
    const tableRows = [];

    financesForDisplay.forEach(transaction => {
      const projectData = projects.find(p => p.id === transaction.projectId);
      const transactionDataRow = [
        transaction.id, 
        transaction.description, 
        transaction.category, 
        new Date(transaction.date).toLocaleDateString(t('localeCode')),
        `${transaction.amount.toFixed(2)} ${t('currency.dZD')}`,
        t(`financePage.transactions.${transaction.type}`),
        projectData ? projectData.name : t('common.na'),
      ];
      tableRows.push(transactionDataRow);
    });

    doc.autoTable({
      startY: 22, head: [tableColumn], body: tableRows,
      theme: 'striped', headStyles: { fillColor: [76, 175, 80] }, styles: { fontSize: 8 },
    });
    doc.save(`transactions_report_${new Date().toISOString().split('T')[0]}.pdf`);
  }, [financesForDisplay, projects, t]);

  const totalIncome = useMemo(() => {
    if (loading) return 0;
    return financesForDisplay
      .filter(f => f.type === 'income')
      .reduce((sum, f) => sum + f.amount, 0);
  }, [financesForDisplay, loading]);
  
  const totalExpenses = useMemo(() => {
    if (loading) return 0;
    return financesForDisplay
      .filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0);
  }, [financesForDisplay, loading]);
  
  const expensesByCategory = useMemo(() => {
    if (loading) return {};
    return financesForDisplay
      .filter(f => f.type === 'expense')
      .reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + f.amount;
        return acc;
      }, {});
  }, [financesForDisplay, loading]);


  if (loading) {
    return <div className="flex items-center justify-center h-full">{t('common.loadingFinances')}</div>;
  }
  
  const balance = totalIncome - totalExpenses;

  const handleOpenFormDialog = (mode, transaction = null) => {
    setFormMode(mode);
    let initialTransactionData = transaction;
    
    if (mode === 'add' && selectedProjectId && selectedProjectId !== "all") {
        const projectIsSelectableInDropdown = availableProjectsForFilter.some(p => p.id === selectedProjectId);
        if (projectIsSelectableInDropdown) {
            initialTransactionData = { ...initialTransactionData, projectId: selectedProjectId };
        }
    }
    setCurrentTransaction(initialTransactionData);
    setIsFormDialogOpen(true);
  };
  
  const handleDeleteTransaction = () => {
    if (currentTransaction) {
      deleteFinance(currentTransaction.id);
    }
    setIsDeleteDialogOpen(false);
    setCurrentTransaction(null);
  };

  const openDeleteDialog = (transaction) => {
    setCurrentTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="space-y-6 p-1">
      <FinancePageHeader 
        onAddTransaction={() => handleOpenFormDialog('add')} 
        availableProjectsForFilter={availableProjectsForFilter}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        userRole={userProfile?.role}
      />

      <FinanceSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        incomeTransactionsCount={financesForDisplay.filter(f => f.type === 'income').length}
        expenseTransactionsCount={financesForDisplay.filter(f => f.type === 'expense').length}
        currency={t('currency.dZD')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
            <TransactionsCardHeader 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onExportPDF={exportTransactionsPDF}
            />
            <CardContent>
              {financesForDisplay.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">{t('financePage.transactions.noTransactionsFound')}</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchTerm || activeTab !== 'all' || (selectedProjectId && selectedProjectId !== "all")
                      ? t('financePage.transactions.noTransactionsFoundFilterHint')
                      : t('financePage.transactions.noTransactionsFoundAddHint')}
                  </p>
                </div>
              ) : (
                <TransactionList
                  transactions={financesForDisplay}
                  projects={projects} 
                  onEdit={(transaction) => handleOpenFormDialog('edit', transaction)}
                  onDelete={openDeleteDialog}
                  containerVariants={containerVariants}
                  currency={t('currency.dZD')}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ExpenseBreakdown 
            expensesByCategory={expensesByCategory} 
            totalExpenses={totalExpenses} 
            currency={t('currency.dZD')}
          />
          <ProjectFinances 
            projects={projectsForFinanceDisplay} 
            finances={financesForDisplay} 
            currency={t('currency.dZD')}
          />
        </div>
      </div>

      <FinanceFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        mode={formMode}
        transactionData={currentTransaction}
        projects={availableProjectsForFilter} 
        addFinance={addFinance}
        updateFinance={updateFinance}
        currency={t('currency.dZD')}
      />
      
      <FinanceDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        transactionName={currentTransaction?.description}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default Finance;
import React, { useState, useEffect } from 'react';
import ProjectFormDialog from '../projects/ProjectFormDialog';
import FinanceFormDialog from './FinanceFormDialog';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/I18nContext';
import { getProjectsFromLocalStorage, getTransactionsFromLocalStorage } from '@/utils/localStorageUtils';

const FinanceManager = () => {
  const { t } = useI18n();
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isFinanceDialogOpen, setIsFinanceDialogOpen] = useState(false);
  const [financeDialogMode, setFinanceDialogMode] = useState('add');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
    setTransactions(getTransactionsFromLocalStorage());
  }, []);

  const handleProjectsChange = (updatedProjects) => {
    console.log('🔍 Updating projects in FinanceManager:', updatedProjects);
    setProjects([...updatedProjects]); 
  };

  const handleTransactionsChange = (updatedTransactions) => {
    console.log('🔍 Updating transactions in FinanceManager:', updatedTransactions);
    setTransactions([...updatedTransactions]);
  };

  const openAddFinanceDialog = () => {
    setFinanceDialogMode('add');
    setSelectedTransaction(null);
    setIsFinanceDialogOpen(true);
  };

  const openEditFinanceDialog = (transaction) => {
    setFinanceDialogMode('edit');
    setSelectedTransaction(transaction);
    setIsFinanceDialogOpen(true);
  };

  return (
    <div className="p-4">
      <h1>{t('financePage.title')}</h1>
      <div className="space-x-4 mb-4">
        <Button onClick={() => setIsProjectDialogOpen(true)}>
          {t('projectsPage.form.addTitle')}
        </Button>
        <Button onClick={openAddFinanceDialog}>
          {t('financePage.form.addTitle')}
        </Button>
      </div>

      <ProjectFormDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        mode="add"
        currency={t('currency.dZD')}
        onProjectsChange={handleProjectsChange}
        personnel={[]}
      />

      <FinanceFormDialog
        isOpen={isFinanceDialogOpen}
        onClose={() => setIsFinanceDialogOpen(false)}
        mode={financeDialogMode}
        transactionData={selectedTransaction}
        projects={projects}
        onTransactionsChange={handleTransactionsChange}
        onProjectsChange={handleProjectsChange}
      />

      <div>
        <h2>{t('financePage.transactions')}</h2>
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between p-2 border-b">
            <span>{transaction.description}</span>
            <span>
              {transaction.projectId
                ? projects.find((p) => p.id === transaction.projectId)?.name || 'Unknown Project'
                : 'No Project'}
            </span>
            <Button onClick={() => openEditFinanceDialog(transaction)}>
              {t('actions.edit')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceManager;
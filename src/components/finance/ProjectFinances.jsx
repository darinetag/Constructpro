import React, { useState, useEffect } from 'react';
import FinanceFormDialog from '@/components/finance/FinanceFormDialog';
import TransactionList from '@/components/finance/TransactionList';

const LS_KEY = 'transactions';

function getTransactionsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveTransactionsToLocalStorage(transactions) {
  localStorage.setItem(LS_KEY, JSON.stringify(transactions));
}

const FinancePage = ({ projects }) => {
  const [transactions, setTransactions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setTransactions(getTransactionsFromLocalStorage());
  }, []);

  const handleTransactionsChange = (updatedTransactions) => {
    setTransactions(updatedTransactions);
    saveTransactionsToLocalStorage(updatedTransactions);
  };

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>Add Transaction</button>
      <FinanceFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode="add"
        projects={projects}
        onTransactionsChange={handleTransactionsChange}
      />
      <TransactionList
        transactions={transactions}
        projects={projects}
        onEdit={() => {}}
        onDelete={() => {}}
        containerVariants={{}}
        currency="DZD"
      />
    </div>
  );
};

export default FinancePage;

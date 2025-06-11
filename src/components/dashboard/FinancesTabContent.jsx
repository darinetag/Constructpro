import React from 'react';
import FinanceOverviewCard from './FinanceOverviewCard';
import RecentTransactionsCard from './RecentTransactionsCard';

const FinancesTabContent = ({ finances, projects, currency }) => {
  const totalIncome = finances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);
  
  const totalExpenses = finances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FinanceOverviewCard 
        totalIncome={totalIncome} 
        totalExpenses={totalExpenses} 
        currency={currency} 
      />
      <RecentTransactionsCard 
        finances={finances} 
        projects={projects} 
        currency={currency} 
      />
    </div>
  );
};

export default FinancesTabContent;
import React from 'react';
import { motion } from 'framer-motion';
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, projects, onEdit, onDelete, containerVariants, currency }) => {
  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {transactions.map(transaction => {
        const project = projects.find(p => p.id === transaction.projectId);
        return (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            currency={currency}
          />
        );
      })}
    </motion.div>
  );
};

export default TransactionList;
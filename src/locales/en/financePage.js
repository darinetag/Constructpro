export default {
  title: "Financial Management",
  description: "Track income, expenses and budgets in {currency}",
  addTransactionButton: "Add Transaction",
  summary: {
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    currentBalance: "Current Balance",
    transactions: "transactions",
    netBalance: "Net balance"
  },
  transactions: {
    title: "Transactions",
    searchPlaceholder: "Search transactions...",
    exportPdfButton: "Export PDF",
    tabs: {
      all: "All",
      income: "Income",
      expenses: "Expenses"
    },
    noTransactionsFound: "No transactions found",
    noTransactionsFoundFilterHint: "Try adjusting your search or filters",
    noTransactionsFoundAddHint: "Add your first transaction to get started",
    income: "Income",
    expense: "Expense",
    assignedTo: "Assigned to",
    edit: "Edit",
    delete: "Delete"
  },
  expenseBreakdown: {
    title: "Expense Breakdown",
    noExpenses: "No expenses recorded yet."
  },
  projectFinances: {
    title: "Project Finances",
    description: "Budget allocation",
    budgetUsed: "% of budget used",
    balance: "Balance"
  },
  form: {
    addTitle: "Add New Transaction",
    editTitle: "Edit Transaction",
    typeLabel: "Type",
    typeIncome: "Income",
    typeExpense: "Expense",
    descriptionLabel: "Description",
    descriptionPlaceholder: "e.g., Material Purchase, Client Payment",
    amountLabel: "Amount ({currency})",
    amountPlaceholder: "e.g., 1000",
    categoryLabel: "Category",
    categoryPlaceholder: "e.g., Labor, Materials, Equipment",
    dateLabel: "Date",
    projectLabel: "Associated Project (Optional)",
    projectPlaceholder: "Select a project",
    noProject: "None",
    addButton: "Add Transaction",
    updateButton: "Update Transaction",
    successAddTitle: "Transaction Added",
    successAddDescription: "The transaction has been successfully recorded.",
    successUpdateTitle: "Transaction Updated",
    successUpdateDescription: "The transaction has been successfully updated.",
    errorTitle: "Operation Failed",
  },
  deleteDialog: {
    title: "Confirm Deletion",
    description: "Are you sure you want to delete the transaction \"{transactionName}\"? This action cannot be undone.",
    cancelButton: "Cancel",
    deleteButton: "Delete",
    successTitle: "Transaction Deleted",
    successDescription: "Transaction \"{transactionName}\" has been deleted.",
    errorTitle: "Deletion Failed",
  },
  pdfExport: {
    id: "ID",
    description: "Description",
    category: "Category",
    date: "Date",
    amount: "Amount ({currency})",
    type: "Type",
    project: "Project"
  }
};
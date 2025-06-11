export default {
  title: "Gestion Financière",
  description: "Suivez les revenus, dépenses et budgets en {currency}",
  addTransactionButton: "Ajouter Transaction",
  summary: {
    totalIncome: "Revenus Totaux",
    totalExpenses: "Dépenses Totales",
    currentBalance: "Solde Actuel",
    transactions: "transactions",
    netBalance: "Solde net"
  },
  transactions: {
    title: "Transactions",
    searchPlaceholder: "Rechercher des transactions...",
    exportPdfButton: "Exporter PDF",
    tabs: {
      all: "Toutes",
      income: "Revenus",
      expenses: "Dépenses"
    },
    noTransactionsFound: "Aucune transaction trouvée",
    noTransactionsFoundFilterHint: "Essayez d'ajuster votre recherche ou vos filtres",
    noTransactionsFoundAddHint: "Ajoutez votre première transaction pour commencer",
    income: "Revenu",
    expense: "Dépense",
    assignedTo: "Assigné à",
    edit: "Modifier",
    delete: "Supprimer"
  },
  expenseBreakdown: {
    title: "Répartition des Dépenses",
    noExpenses: "Aucune dépense enregistrée pour le moment."
  },
  projectFinances: {
    title: "Finances du Projet",
    description: "Allocation budgétaire",
    budgetUsed: "% du budget utilisé",
    balance: "Solde"
  },
  form: {
    addTitle: "Ajouter Nouvelle Transaction",
    editTitle: "Modifier Transaction",
    typeLabel: "Type",
    typeIncome: "Revenu",
    typeExpense: "Dépense",
    descriptionLabel: "Description",
    descriptionPlaceholder: "ex: Achat de matériel, Paiement client",
    amountLabel: "Montant ({currency})",
    amountPlaceholder: "ex: 1000",
    categoryLabel: "Catégorie",
    categoryPlaceholder: "ex: Main d'œuvre, Matériaux, Équipement",
    dateLabel: "Date",
    projectLabel: "Projet Associé (Optionnel)",
    projectPlaceholder: "Sélectionnez un projet",
    noProject: "Aucun",
    addButton: "Ajouter Transaction",
    updateButton: "Mettre à Jour Transaction",
    successAddTitle: "Transaction Ajoutée",
    successAddDescription: "La transaction a été enregistrée avec succès.",
    successUpdateTitle: "Transaction Mise à Jour",
    successUpdateDescription: "La transaction a été mise à jour avec succès.",
    errorTitle: "Opération Échouée",
  },
  deleteDialog: {
    title: "Confirmer la Suppression",
    description: "Êtes-vous sûr de vouloir supprimer la transaction \"{transactionName}\" ? Cette action est irréversible.",
    cancelButton: "Annuler",
    deleteButton: "Supprimer",
    successTitle: "Transaction Supprimée",
    successDescription: "La transaction \"{transactionName}\" a été supprimée.",
    errorTitle: "Échec de la Suppression",
  },
  pdfExport: {
    id: "ID",
    description: "Description",
    category: "Catégorie",
    date: "Date",
    amount: "Montant ({currency})",
    type: "Type",
    project: "Projet"
  }
};
export const dashboard = {
  admin: {
    title: 'Tableau de Bord Admin',
    lastUpdated: 'Dernière mise à jour',
    tabs: {
      overview: 'Aperçu',
      projects: 'Projets',
      finances: 'Finances',
    },
    statCard: {
      activeProjects: 'Projets Actifs',
      activeProjectsDesc: 'sur {{count}} au total',
      avgCompletion: 'Achèvement Moyen',
      personnel: 'Personnel Actif',
      personnelDesc: 'sur {{count}} au total',
      activeRate: 'Taux d\'Activité',
      budget: 'Solde Net',
      currentBalance: 'Solde Financier Actuel',
      incomeVsExpenses: 'Revenus vs. Dépenses',
      incomePercent: '{{value}}% Revenus',
      materials: 'Valeur des Matériaux',
      inventoryValue: 'Valeur Totale d\'Inventaire',
      inventoryStatus: 'État de l\'Inventaire',
      sufficientStock: 'Stock Suffisant ({{count}})',
      lowStock: 'Stock Faible ({{count}})',
    },
    upcomingDeadlines: {
      title: 'Échéances Proches',
      description: 'Projets avec dates de fin approchantes.',
      dueDate: 'Échéance : {{date}}',
      daysLeft: '{{count}} jours restants',
      noDeadlines: 'Aucune échéance proche.',
      viewAllProjects: 'Voir Tous les Projets',
    },
    alerts: {
      title: 'Alertes Critiques',
      description: 'Mises à jour importantes et problèmes potentiels.',
      lowStockAlert: 'Stock faible pour {{materialName}}: {{quantity}} {{unit}} restants.',
      budgetOverrunAlert: 'Le projet {{projectName}} dépasse le budget de {{overBudgetBy}} {{currency}}.',
      overdueTaskAlert: 'La tâche "{{taskName}}" du projet {{projectName}} est en retard.',
      noAlerts: 'Aucune alerte critique pour le moment.',
    },
  },
  financeOverview: {
    title: 'Aperçu Financier',
    totalIncome: 'Revenus Totaux',
    totalExpenses: 'Dépenses Totales',
    balance: 'Solde Actuel',
    incomeVsExpenses: 'Répartition Revenus vs. Dépenses',
    incomeLabel: 'Revenus',
    expensesLabel: 'Dépenses',
  },
  recentTransactions: {
    title: 'Transactions Récentes',
    noTransactions: 'Aucune transaction récente trouvée.',
  },
  siteManager: {
    title: 'Tableau de Bord Opérations de Chantier',
    tasksSummary: {
      title: 'Résumé des Tâches Quotidiennes',
      pending: 'En Attente / À Faire',
      inProgress: 'En Cours',
      completedToday: 'Terminées Aujourd\'hui',
    },
    onSitePersonnel: {
      title: 'Personnel sur Site',
      activeOnManagedProjects: 'Actif sur vos projets',
    },
    siteAlerts: {
      title: 'Alertes de Chantier',
      issuesFound: '{{count}} alertes actives',
      noAlerts: 'Aucune alerte urgente sur le chantier.',
      allClear: 'Tout est calme sur le chantier !',
      projectOverdue: 'Le projet {{projectName}} a dépassé son échéance.',
      overdueTasks: '{{count}} tâches en retard pour {{projectName}}.',
    },
    projectProgress: {
        title: 'Focus Projet Géré',
        completion: 'Achèvement',
        location: 'Lieu : {{location}}',
        startDate: 'Date de Début',
        endDate: 'Date de Fin',
        viewDetails: 'Voir Détails'
    },
    quickActions: {
      title: 'Actions Rapides',
      goToTasks: 'Gérer les Tâches',
      viewPersonnel: 'Voir l\'Équipe',
    },
    noManagedProjectsTitle: 'Aucun Projet Assigné',
    noManagedProjectsDescription: 'Vous n\'êtes actuellement assigné comme responsable à aucun projet. Veuillez contacter un administrateur si vous pensez que c\'est une erreur.',
    viewAllProjectsButton: 'Voir Tous les Projets de l\'Entreprise'
  }
};
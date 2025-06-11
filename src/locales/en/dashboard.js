export const dashboard = {
  admin: {
    title: 'Admin Dashboard',
    lastUpdated: 'Last updated',
    tabs: {
      overview: 'Overview',
      projects: 'Projects',
      finances: 'Finances',
    },
    statCard: {
      activeProjects: 'Active Projects',
      activeProjectsDesc: 'out of {{count}} total',
      avgCompletion: 'Avg. Completion',
      personnel: 'Active Personnel',
      personnelDesc: 'out of {{count}} total',
      activeRate: 'Active Rate',
      budget: 'Net Balance',
      currentBalance: 'Current Financial Balance',
      incomeVsExpenses: 'Income vs. Expenses',
      incomePercent: '{{value}}% Income',
      materials: 'Materials Value',
      inventoryValue: 'Total Inventory Value',
      inventoryStatus: 'Inventory Status',
      sufficientStock: 'Sufficient ({{count}})',
      lowStock: 'Low Stock ({{count}})',
    },
    upcomingDeadlines: {
      title: 'Upcoming Deadlines',
      description: 'Projects with approaching end dates.',
      dueDate: 'Due: {{date}}',
      daysLeft: '{{count}} days left',
      noDeadlines: 'No upcoming deadlines.',
      viewAllProjects: 'View All Projects',
    },
    alerts: {
      title: 'Critical Alerts',
      description: 'Important updates and potential issues.',
      lowStockAlert: 'Low stock for {{materialName}}: {{quantity}} {{unit}} remaining.',
      budgetOverrunAlert: 'Project {{projectName}} is {{overBudgetBy}} {{currency}} over budget.',
      overdueTaskAlert: 'Task "{{taskName}}" for project {{projectName}} is overdue.',
      noAlerts: 'No critical alerts at the moment.',
    },
  },
  financeOverview: {
    title: 'Financial Overview',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    balance: 'Current Balance',
    incomeVsExpenses: 'Income vs. Expenses Breakdown',
    incomeLabel: 'Income',
    expensesLabel: 'Expenses',
  },
  recentTransactions: {
    title: 'Recent Transactions',
    noTransactions: 'No recent transactions found.',
  },
  siteManager: {
    title: 'Site Operations Dashboard',
    tasksSummary: {
      title: 'Daily Tasks Summary',
      pending: 'Pending / To Do',
      inProgress: 'In Progress',
      completedToday: 'Completed Today',
    },
    onSitePersonnel: {
      title: 'On-Site Personnel',
      activeOnManagedProjects: 'Active on your projects',
    },
    siteAlerts: {
      title: 'Site Alerts',
      issuesFound: '{{count}} active alerts',
      noAlerts: 'No urgent site alerts.',
      allClear: 'All clear on site!',
      projectOverdue: 'Project {{projectName}} is past its deadline.',
      overdueTasks: '{{count}} tasks overdue for {{projectName}}.',
    },
    projectProgress: {
        title: 'Managed Project Focus',
        completion: 'Completion',
        location: 'Location: {{location}}',
        startDate: 'Start Date',
        endDate: 'End Date',
        viewDetails: 'View Details'
    },
    quickActions: {
      title: 'Quick Actions',
      goToTasks: 'Manage Tasks',
      viewPersonnel: 'View Team',
    },
    noManagedProjectsTitle: 'No Projects Assigned',
    noManagedProjectsDescription: 'You are not currently assigned as a manager for any projects. Please contact an administrator if you believe this is an error.',
    viewAllProjectsButton: 'View All Company Projects'
  }
};
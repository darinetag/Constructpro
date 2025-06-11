export const dashboard = {
  admin: {
    title: 'لوحة تحكم المسؤول',
    lastUpdated: 'آخر تحديث',
    tabs: {
      overview: 'نظرة عامة',
      projects: 'المشاريع',
      finances: 'المالية',
    },
    statCard: {
      activeProjects: 'المشاريع النشطة',
      activeProjectsDesc: 'من أصل {{count}} مشروع',
      avgCompletion: 'متوسط الإنجاز',
      personnel: 'الموظفون النشطون',
      personnelDesc: 'من أصل {{count}} موظف',
      activeRate: 'معدل النشاط',
      budget: 'الرصيد الصافي',
      currentBalance: 'الرصيد المالي الحالي',
      incomeVsExpenses: 'الدخل مقابل المصروفات',
      incomePercent: '{{value}}% دخل',
      materials: 'قيمة المواد',
      inventoryValue: 'إجمالي قيمة المخزون',
      inventoryStatus: 'حالة المخزون',
      sufficientStock: 'مخزون كافٍ ({{count}})',
      lowStock: 'مخزون منخفض ({{count}})',
    },
    upcomingDeadlines: {
      title: 'المواعيد النهائية القادمة',
      description: 'مشاريع تقترب تواريخ انتهائها.',
      dueDate: 'تاريخ الاستحقاق: {{date}}',
      daysLeft: '{{count}} أيام متبقية',
      noDeadlines: 'لا توجد مواعيد نهائية قادمة.',
      viewAllProjects: 'عرض كل المشاريع',
    },
    alerts: {
      title: 'تنبيهات حرجة',
      description: 'تحديثات هامة ومشكلات محتملة.',
      lowStockAlert: 'مخزون منخفض لـ {{materialName}}: {{quantity}} {{unit}} متبقية.',
      budgetOverrunAlert: 'مشروع {{projectName}} تجاوز الميزانية بمقدار {{overBudgetBy}} {{currency}}.',
      overdueTaskAlert: 'مهمة "{{taskName}}" لمشروع {{projectName}} متأخرة.',
      noAlerts: 'لا توجد تنبيهات حرجة في الوقت الحالي.',
    },
  },
  financeOverview: {
    title: 'نظرة عامة مالية',
    totalIncome: 'إجمالي الدخل',
    totalExpenses: 'إجمالي المصروفات',
    balance: 'الرصيد الحالي',
    incomeVsExpenses: 'تفصيل الدخل مقابل المصروفات',
    incomeLabel: 'الدخل',
    expensesLabel: 'المصروفات',
  },
  recentTransactions: {
    title: 'المعاملات الأخيرة',
    noTransactions: 'لم يتم العثور على معاملات أخيرة.',
  },
  siteManager: {
    title: 'لوحة تحكم عمليات الموقع',
    tasksSummary: {
      title: 'ملخص المهام اليومية',
      pending: 'معلقة / قيد التنفيذ',
      inProgress: 'قيد الإنجاز',
      completedToday: 'أنجزت اليوم',
    },
    onSitePersonnel: {
      title: 'العاملون في الموقع',
      activeOnManagedProjects: 'نشطون في مشاريعك',
    },
    siteAlerts: {
      title: 'تنبيهات الموقع',
      issuesFound: '{{count}} تنبيهات نشطة',
      noAlerts: 'لا توجد تنبيهات موقع عاجلة.',
      allClear: 'كل شيء على ما يرام في الموقع!',
      projectOverdue: 'مشروع {{projectName}} تجاوز موعده النهائي.',
      overdueTasks: '{{count}} مهام متأخرة لمشروع {{projectName}}.',
    },
    projectProgress: {
        title: 'تركيز المشروع المُدار',
        completion: 'الإنجاز',
        location: 'الموقع: {{location}}',
        startDate: 'تاريخ البدء',
        endDate: 'تاريخ الانتهاء',
        viewDetails: 'عرض التفاصيل'
    },
    quickActions: {
      title: 'إجراءات سريعة',
      goToTasks: 'إدارة المهام',
      viewPersonnel: 'عرض الفريق',
    },
    noManagedProjectsTitle: 'لا توجد مشاريع معينة',
    noManagedProjectsDescription: 'أنت غير معين حاليًا كمدير لأي مشاريع. يرجى الاتصال بمسؤول إذا كنت تعتقد أن هذا خطأ.',
    viewAllProjectsButton: 'عرض جميع مشاريع الشركة'
  }
};
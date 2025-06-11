export default {
  title: "الإدارة المالية",
  description: "تتبع الدخل والمصروفات والميزانيات بـ {currency}",
  addTransactionButton: "إضافة معاملة",
  summary: {
    totalIncome: "إجمالي الدخل",
    totalExpenses: "إجمالي المصروفات",
    currentBalance: "الرصيد الحالي",
    transactions: "معاملات",
    netBalance: "الرصيد الصافي"
  },
  transactions: {
    title: "المعاملات",
    searchPlaceholder: "ابحث في المعاملات...",
    exportPdfButton: "تصدير PDF",
    tabs: {
      all: "الكل",
      income: "الدخل",
      expenses: "المصروفات"
    },
    noTransactionsFound: "لم يتم العثور على معاملات",
    noTransactionsFoundFilterHint: "حاول تعديل بحثك أو عوامل التصفية",
    noTransactionsFoundAddHint: "أضف أول معاملة لك للبدء",
    income: "دخل",
    expense: "مصروف",
    assignedTo: "معينة لـ",
    edit: "تعديل",
    delete: "حذف"
  },
  expenseBreakdown: {
    title: "تفصيل المصروفات",
    noExpenses: "لم يتم تسجيل أي مصروفات حتى الآن."
  },
  projectFinances: {
    title: "ماليات المشروع",
    description: "تخصيص الميزانية",
    budgetUsed: "% من الميزانية المستخدمة",
    balance: "الرصيد"
  },
  form: {
    addTitle: "إضافة معاملة جديدة",
    editTitle: "تعديل المعاملة",
    typeLabel: "النوع",
    typeIncome: "دخل",
    typeExpense: "مصروف",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "مثال: شراء مواد، دفعة عميل",
    amountLabel: "المبلغ ({currency})",
    amountPlaceholder: "مثال: 1000",
    categoryLabel: "الفئة",
    categoryPlaceholder: "مثال: عمالة، مواد، معدات",
    dateLabel: "التاريخ",
    projectLabel: "المشروع المرتبط (اختياري)",
    projectPlaceholder: "اختر مشروعًا",
    noProject: "لا شيء",
    addButton: "إضافة معاملة",
    updateButton: "تحديث المعاملة",
    successAddTitle: "تمت إضافة المعاملة",
    successAddDescription: "تم تسجيل المعاملة بنجاح.",
    successUpdateTitle: "تم تحديث المعاملة",
    successUpdateDescription: "تم تحديث المعاملة بنجاح.",
    errorTitle: "فشلت العملية",
  },
  deleteDialog: {
    title: "تأكيد الحذف",
    description: "هل أنت متأكد أنك تريد حذف المعاملة \"{transactionName}\"؟ لا يمكن التراجع عن هذا الإجراء.",
    cancelButton: "إلغاء",
    deleteButton: "حذف",
    successTitle: "تم حذف المعاملة",
    successDescription: "تم حذف المعاملة \"{transactionName}\".",
    errorTitle: "فشل الحذف",
  },
  pdfExport: {
    id: "المعرف",
    description: "الوصف",
    category: "الفئة",
    date: "التاريخ",
    amount: "المبلغ ({currency})",
    type: "النوع",
    project: "المشروع"
  }
};
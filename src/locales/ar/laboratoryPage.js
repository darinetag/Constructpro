export default {
  admin: {
    title: "مركز المختبر (عرض الإدارة)",
    description: "عرض اختبارات المواد ومراقبة الجودة والنتائج.",
    addNewTestButton: "إضافة اختبار معملي (غير متاح لمالك المشروع)",
    searchPlaceholder: "ابحث في الاختبارات حسب النوع، المشروع، المادة...",
    tabs: {
      all: "الكل",
      passed: "ناجح",
      failed: "فاشل",
      pending: "معلق"
    },
    exportPdfButton: "تصدير PDF",
    viewOnlyAlertTitle: "وصول للعرض فقط",
    viewOnlyAlertDescription: "بصفتك مالك مشروع، يمكنك عرض وتصدير نتائج الاختبارات المعملية. إضافة أو تعديل أو حذف الاختبارات مقيد.",
    noTestsFound: "لم يتم العثور على اختبارات معملية",
    noTestsFoundFilterHint: "لم يتطابق بحثك أو معايير التصفية مع أي اختبارات معملية.",
    noTestsFoundAddHint: "لم يتم تسجيل أي اختبارات معملية حتى الآن. يمكن للمستخدمين غير المسؤولين إضافة اختبارات.",
    addNewTestButtonSmall: "إضافة اختبار معملي جديد",
    nearbyLabsTitle: "مختبرات التحليل القريبة",
    nearbyLabs: {
      lab1: {
        name: "مختبرات الدقة للاختبارات",
        address: "789 شارع الاختبار، مدينة العلوم"
      },
      lab2: {
        name: "شركة تحليل المواد الجيولوجية",
        address: "321 شارع التربة، مدينة الصخور"
      }
    },
    stats: {
      totalTests: "إجمالي الاختبارات المجراة",
      passedTests: "الاختبارات الناجحة",
      failedTests: "الاختبارات الفاشلة",
      pendingTests: "الاختبارات المعلقة",
      rateSuffix: "معدل",
      awaitingResultsSuffix: "في انتظار النتائج"
    },
    card: {
      testId: "معرف الاختبار",
      date: "التاريخ",
      project: "المشروع",
      material: "المادة",
      result: "النتيجة",
      notes: "ملاحظات",
      edit: "تعديل",
      delete: "حذف",
      viewOnly: "عرض فقط"
    },
    form: {
      addTitle: "إضافة اختبار معملي جديد",
      editTitle: "تعديل تفاصيل الاختبار المعملي",
      testTypeLabel: "نوع الاختبار",
      testTypePlaceholder: "مثال: قوة الخرسانة، ضغط التربة",
      dateLabel: "تاريخ الاختبار",
      projectLabel: "المشروع المرتبط",
      projectPlaceholder: "اختر المشروع",
      materialLabel: "المادة المختبرة",
      materialPlaceholder: "اختر المادة",
      statusLabel: "الحالة",
      statusPassed: "ناجح",
      statusFailed: "فاشل",
      statusPending: "معلق",
      resultLabel: "ملخص النتيجة",
      resultPlaceholder: "مثال: ناجح، فاشل - 25 ميجا باسكال، تحليل معلق",
      notesLabel: "ملاحظات (اختياري)",
      notesPlaceholder: "ملاحظات أو تفاصيل إضافية",
      addButton: "إضافة اختبار",
      updateButton: "تحديث الاختبار",
      successAddTitle: "تمت إضافة الاختبار المعملي",
      successAddDescription: "تم تسجيل الاختبار المعملي بنجاح.",
      successUpdateTitle: "تم تحديث الاختبار المعملي",
      successUpdateDescription: "تم تحديث تفاصيل الاختبار المعملي.",
      errorTitle: "فشلت العملية",
      projectOwnerError: "لا يمكن لمالكي المشاريع إضافة أو تعديل الاختبارات المعملية.",
    },
    deleteDialog: {
      title: "تأكيد الحذف",
      description: "هل أنت متأكد أنك تريد حذف الاختبار المعملي \"{testType}\"؟ لا يمكن التراجع عن هذا الإجراء.",
      cancelButton: "إلغاء",
      deleteButton: "حذف",
      successTitle: "تم حذف الاختبار المعملي",
      successDescription: "تم حذف الاختبار المعملي \"{testType}\".",
      errorTitle: "فشل الحذف",
      projectOwnerError: "لا يمكن لمالكي المشاريع حذف الاختبارات المعملية.",
    }
  }
};
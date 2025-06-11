export default {
  dashboard: {
      title: "لوحة تحكم المختبر",
      welcome: "مرحباً!",
      overview: "إليك نظرة عامة على أنشطة مختبرك.",
      statCards: {
        pendingTests: "الاختبارات المعلقة",
        upcomingAppointments: "المواعيد القادمة",
        associatedProjects: "المشاريع المرتبطة",
        servicesOffered: "الخدمات المقدمة"
      },
      recentActivity: {
        title: "أنشطة الاختبار الأخيرة",
        noActivity: "لا توجد أنشطة اختبار حديثة.",
        viewAll: "عرض جميع الاختبارات",
        testDescription: "اختبار \"{type}\" لمشروع \"{project}\" الحالة: {status}."
      },
      quickActions: {
        title: "إجراءات سريعة",
        manageTests: "إدارة الاختبارات",
        schedule: "جدولة",
        viewProjects: "عرض المشاريع",
        labServices: "خدمات المختبر"
      }
  },
  testManagement: {
      title: "إدارة الاختبارات",
      description: "عرض وإضافة وإدارة جميع اختبارات المختبر.",
      addNewTestButton: "إضافة اختبار معملي جديد",
      searchPlaceholder: "ابحث في الاختبارات...",
      filterStatus: "تصفية حسب الحالة",
      allStatuses: "جميع الحالات",
      statusPassed: "ناجح",
      statusFailed: "فاشل",
      statusPending: "معلق",
      exportPdfButton: "تصدير PDF",
      noTestsFound: "لم يتم العثور على اختبارات معملية",
      noTestsFilterHint: "لم يتطابق بحثك أو معايير التصفية مع أي اختبارات معملية.",
      noTestsAddHint: "لم يتم تسجيل أي اختبارات معملية حتى الآن. انقر فوق 'إضافة اختبار معملي جديد' للبدء.",
      form: { 
          addTitle: "تسجيل اختبار معملي جديد",
          editTitle: "تحديث سجل الاختبار المعملي",
          testTypeLabel: "نوع الاختبار",
          testTypePlaceholder: "مثال: قوة الخرسانة، ضغط التربة",
          dateLabel: "تاريخ الاختبار",
          projectLabel: "المشروع المرتبط",
          projectPlaceholder: "اختر المشروع",
          materialLabel: "المادة المختبرة",
          materialPlaceholder: "اختر المادة",
          statusLabel: "الحالة",
          resultLabel: "ملخص النتيجة",
          resultPlaceholder: "مثال: ناجح، فاشل - 25 ميجا باسكال، تحليل معلق",
          notesLabel: "ملاحظات (اختياري)",
          notesPlaceholder: "ملاحظات أو تفاصيل إضافية",
          assignedPersonnelLabel: "الموظف المعين",
          assignedPersonnelPlaceholder: "اختر فني المختبر",
          addButton: "إضافة اختبار",
          updateButton: "تحديث الاختبار",
          successAddTitle: "تمت إضافة الاختبار المعملي",
          successAddDescription: "تم تسجيل الاختبار المعملي بنجاح.",
          successUpdateTitle: "تم تحديث الاختبار المعملي",
          successUpdateDescription: "تم تحديث تفاصيل الاختبار المعملي.",
          errorTitle: "فشلت العملية",
      },
      deleteDialog: {
          title: "تأكيد الحذف",
          description: "هل أنت متأكد أنك تريد حذف الاختبار المعملي \"{testType}\"؟ لا يمكن التراجع عن هذا الإجراء.",
          cancelButton: "إلغاء",
          deleteButton: "حذف",
          successTitle: "تم حذف الاختبار المعملي",
          successDescription: "تم حذف الاختبار المعملي \"{testType}\".",
          errorTitle: "فشل الحذف",
      }
  },
  appointments: {
      title: "مواعيد المختبر",
      description: "إدارة جداول الاختبارات ومواعيد العملاء.",
      addNewButton: "إضافة موعد",
      searchPlaceholder: "ابحث في المواعيد...",
      noAppointmentsFound: "لم يتم العثور على مواعيد",
      noAppointmentsFilterHint: "حاول تعديل بحثك.",
      noAppointmentsGeneralHint: "أضف موعدًا جديدًا للبدء.",
      card: {
        statusScheduled: "مجدول",
        statusCompleted: "مكتمل",
        statusCancelled: "ملغى",
        projectPrefix: "المشروع",
        testPrefix: "الاختبار",
        contactPrefix: "جهة الاتصال",
        notesPrefix: "ملاحظات",
        editButton: "تعديل",
        deleteButton: "حذف"
      },
      form: {
          addTitle: "إضافة موعد جديد",
          editTitle: "تعديل الموعد",
          titleLabel: "العنوان",
          dateLabel: "التاريخ",
          timeLabel: "الوقت",
          projectLabel: "المشروع (اختياري)",
          projectPlaceholder: "اختر مشروعًا",
          testLabel: "الاختبار (اختياري)",
          testPlaceholder: "اختر اختبارًا",
          contactPersonLabel: "الشخص المسؤول",
          statusLabel: "الحالة",
          notesLabel: "ملاحظات (اختياري)",
          cancelButton: "إلغاء",
          addButton: "إضافة موعد",
          updateButton: "حفظ التغييرات"
      },
      deleteDialog: {
          title: "تأكيد الحذف",
          description: "هل أنت متأكد أنك تريد حذف الموعد لـ \"{appointmentTitle}\"؟ لا يمكن التراجع عن هذا الإجراء.",
          cancelButton: "إلغاء",
          deleteButton: "حذف"
      }
  },
  projectTracker: {
      title: "المشاريع المرتبطة",
      description: "عرض المشاريع المرتبطة باختبارات وأنشطة المختبر.",
      searchPlaceholder: "ابحث في المشاريع بالاسم أو الموقع...",
      noProjectsFound: "لم يتم العثور على مشاريع",
      noProjectsFilterHint: "حاول تعديل بحثك.",
      noProjectsGeneralHint: "لا توجد مشاريع حاليًا لها اختبارات معملية مرتبطة.",
      alert: {
          title: "معلومات المشروع",
          description: "يعرض هذا القسم المشاريع التي لها اختبارات معملية مرتبطة. يمكنك تتبع تقدم الاختبار لكل مشروع."
      },
      card: {
          startDatePrefix: "البداية",
          endDatePrefix: "النهاية",
          overallProgress: "التقدم العام للمشروع: {completion}%",
          labTestStatus: "حالة اختبارات المختبر (الإجمالي {count}):",
          testsPassed: "الناجحة: {count}",
          testsFailed: "الفاشلة: {count}",
          testsPending: "المعلقة: {count}",
          noTestsRecorded: "لم يتم تسجيل أي اختبارات معملية لهذا المشروع حتى الآن."
      }
  },
  services: {
      title: "خدمات المختبر",
      description: "إدارة خدمات الاختبار التي يقدمها المختبر.",
      addNewButton: "إضافة خدمة",
      searchPlaceholder: "ابحث في الخدمات بالاسم أو الفئة...",
      noServicesFound: "لم يتم العثور على خدمات",
      noServicesFilterHint: "حاول تعديل بحثك.",
      noServicesGeneralHint: "أضف خدمة جديدة للبدء.",
      card: {
          pricePrefix: "السعر",
          durationPrefix: "المدة",
          editButton: "تعديل",
          deleteButton: "حذف"
      },
      form: {
          addTitle: "إضافة خدمة جديدة",
          editTitle: "تعديل الخدمة",
          nameLabel: "اسم الخدمة",
          categoryLabel: "الفئة",
          categoryPlaceholder: "مثال: اختبار التربة، تحليل الخرسانة",
          descriptionLabel: "الوصف",
          priceLabel: "السعر ({currency})",
          durationLabel: "المدة المقدرة (اختياري)",
          durationPlaceholder: "مثال: 2-3 أيام",
          cancelButton: "إلغاء",
          addButton: "إضافة خدمة",
          updateButton: "حفظ التغييرات"
      },
      deleteDialog: {
          title: "تأكيد الحذف",
          description: "هل أنت متأكد أنك تريد حذف الخدمة \"{serviceName}\"؟ لا يمكن التراجع عن هذا الإجراء.",
          cancelButton: "إلغاء",
          deleteButton: "حذف"
      }
  }
};
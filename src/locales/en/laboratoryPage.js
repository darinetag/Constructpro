export default {
  admin: {
    title: "Laboratory Center (Admin View)",
    description: "View material tests, quality control, and results.",
    addNewTestButton: "Add Lab Test (N/A for Project Owner)",
    searchPlaceholder: "Search tests by type, project, material...",
    tabs: {
      all: "All",
      passed: "Passed",
      failed: "Failed",
      pending: "Pending"
    },
    exportPdfButton: "Export PDF",
    viewOnlyAlertTitle: "View-Only Access",
    viewOnlyAlertDescription: "As a Project Owner, you can view and export lab test results. Adding, editing, or deleting tests is restricted.",
    noTestsFound: "No Lab Tests Found",
    noTestsFoundFilterHint: "Your search or filter criteria did not match any lab tests.",
    noTestsFoundAddHint: "No lab tests have been recorded yet. Non-admin users can add tests.",
    addNewTestButtonSmall: "Add New Lab Test",
    nearbyLabsTitle: "Nearby Testing Labs",
    nearbyLabs: {
      lab1: {
        name: "Precision Testing Labs",
        address: "789 Test Ave, Scienceton"
      },
      lab2: {
        name: "GeoMaterials Analysis Inc.",
        address: "321 Soil St, Rockburg"
      }
    },
    stats: {
      totalTests: "Total Tests Conducted",
      passedTests: "Passed Tests",
      failedTests: "Failed Tests",
      pendingTests: "Pending Tests",
      rateSuffix: "Rate",
      awaitingResultsSuffix: "Awaiting Results"
    },
    card: {
      testId: "Test ID",
      date: "Date",
      project: "Project",
      material: "Material",
      result: "Result",
      notes: "Notes",
      edit: "Edit",
      delete: "Delete",
      viewOnly: "View Only"
    },
    form: {
      addTitle: "Add New Lab Test",
      editTitle: "Edit Lab Test Details",
      testTypeLabel: "Test Type",
      testTypePlaceholder: "e.g., Concrete Strength, Soil Compression",
      dateLabel: "Test Date",
      projectLabel: "Associated Project",
      projectPlaceholder: "Select Project",
      materialLabel: "Material Tested",
      materialPlaceholder: "Select Material",
      statusLabel: "Status",
      statusPassed: "Passed",
      statusFailed: "Failed",
      statusPending: "Pending",
      resultLabel: "Result Summary",
      resultPlaceholder: "e.g., Passed, Failed - 25MPa, Analysis Pending",
      notesLabel: "Notes (Optional)",
      notesPlaceholder: "Additional remarks or details",
      addButton: "Add Test",
      updateButton: "Update Test",
      successAddTitle: "Lab Test Added",
      successAddDescription: "The lab test has been successfully recorded.",
      successUpdateTitle: "Lab Test Updated",
      successUpdateDescription: "Lab test details have been updated.",
      errorTitle: "Operation Failed",
      projectOwnerError: "Project Owners cannot add or edit lab tests.",
    },
    deleteDialog: {
      title: "Confirm Deletion",
      description: "Are you sure you want to delete the lab test \"{testType}\"? This action cannot be undone.",
      cancelButton: "Cancel",
      deleteButton: "Delete",
      successTitle: "Lab Test Deleted",
      successDescription: "The lab test \"{testType}\" has been deleted.",
      errorTitle: "Deletion Failed",
      projectOwnerError: "Project Owners cannot delete lab tests.",
    }
  }
};
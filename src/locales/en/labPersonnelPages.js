export default {
  dashboard: {
      title: "Laboratory Dashboard",
      welcome: "Welcome!",
      overview: "Here's an overview of your laboratory activities.",
      statCards: {
        pendingTests: "Pending Tests",
        upcomingAppointments: "Upcoming Appointments",
        associatedProjects: "Associated Projects",
        servicesOffered: "Services Offered"
      },
      recentActivity: {
        title: "Recent Test Activities",
        noActivity: "No recent test activities.",
        viewAll: "View All Tests",
        testDescription: "Test \"{type}\" for project \"{project}\" status: {status}."
      },
      quickActions: {
        title: "Quick Actions",
        manageTests: "Manage Tests",
        schedule: "Schedule",
        viewProjects: "View Projects",
        labServices: "Lab Services"
      }
  },
  testManagement: {
      title: "Test Management",
      description: "View, add, and manage all laboratory tests.",
      addNewTestButton: "Add New Lab Test",
      searchPlaceholder: "Search tests...",
      filterStatus: "Filter by Status",
      allStatuses: "All Statuses",
      statusPassed: "Passed",
      statusFailed: "Failed",
      statusPending: "Pending",
      exportPdfButton: "Export PDF",
      noTestsFound: "No Lab Tests Found",
      noTestsFilterHint: "Your search or filter criteria didn't match any lab tests.",
      noTestsAddHint: "No lab tests recorded yet. Click 'Add New Lab Test' to start.",
      form: { 
          addTitle: "Record New Lab Test",
          editTitle: "Update Lab Test Record",
          testTypeLabel: "Test Type",
          testTypePlaceholder: "e.g., Concrete Strength, Soil Compaction",
          dateLabel: "Test Date",
          projectLabel: "Associated Project",
          projectPlaceholder: "Select Project",
          materialLabel: "Material Tested",
          materialPlaceholder: "Select Material",
          statusLabel: "Status",
          resultLabel: "Result Summary",
          resultPlaceholder: "e.g., Passed, Failed - 25MPa, Pending Analysis",
          notesLabel: "Notes (Optional)",
          notesPlaceholder: "Additional observations or details",
          assignedPersonnelLabel: "Assigned Personnel",
          assignedPersonnelPlaceholder: "Select lab technician",
          addButton: "Add Test",
          updateButton: "Update Test",
          successAddTitle: "Lab Test Added",
          successAddDescription: "The lab test has been successfully recorded.",
          successUpdateTitle: "LabTest Updated",
          successUpdateDescription: "The lab test details have been updated.",
          errorTitle: "Operation Failed",
      },
      deleteDialog: {
          title: "Confirm Deletion",
          description: "Are you sure you want to delete the lab test \"{testType}\"? This action cannot be undone.",
          cancelButton: "Cancel",
          deleteButton: "Delete",
          successTitle: "Lab Test Deleted",
          successDescription: "Lab test \"{testType}\" has been deleted.",
          errorTitle: "Deletion Failed",
      }
  },
  appointments: {
      title: "Lab Appointments",
      description: "Manage test schedules and client appointments.",
      addNewButton: "Add Appointment",
      searchPlaceholder: "Search appointments...",
      noAppointmentsFound: "No appointments found",
      noAppointmentsFilterHint: "Try adjusting your search.",
      noAppointmentsGeneralHint: "Add a new appointment to get started.",
      card: {
        statusScheduled: "Scheduled",
        statusCompleted: "Completed",
        statusCancelled: "Cancelled",
        projectPrefix: "Project",
        testPrefix: "Test",
        contactPrefix: "Contact",
        notesPrefix: "Notes",
        editButton: "Edit",
        deleteButton: "Delete"
      },
      form: {
          addTitle: "Add New Appointment",
          editTitle: "Edit Appointment",
          titleLabel: "Title",
          dateLabel: "Date",
          timeLabel: "Time",
          projectLabel: "Project (Optional)",
          projectPlaceholder: "Select project",
          testLabel: "Test (Optional)",
          testPlaceholder: "Select test",
          contactPersonLabel: "Contact Person",
          statusLabel: "Status",
          notesLabel: "Notes (Optional)",
          cancelButton: "Cancel",
          addButton: "Add Appointment",
          updateButton: "Save Changes"
      },
      deleteDialog: {
          title: "Confirm Deletion",
          description: "Are you sure you want to delete the appointment for \"{appointmentTitle}\"? This cannot be undone.",
          cancelButton: "Cancel",
          deleteButton: "Delete"
      }
  },
  projectTracker: {
      title: "Associated Projects",
      description: "View projects linked to laboratory tests and activities.",
      searchPlaceholder: "Search projects by name or location...",
      noProjectsFound: "No projects found",
      noProjectsFilterHint: "Try adjusting your search.",
      noProjectsGeneralHint: "No projects currently have associated lab tests.",
      alert: {
          title: "Project Information",
          description: "This section displays projects that have associated laboratory tests. You can track test progress for each project."
      },
      card: {
          startDatePrefix: "Start",
          endDatePrefix: "End",
          overallProgress: "Overall Project Progress: {completion}%",
          labTestStatus: "Lab Test Status ({count} total):",
          testsPassed: "Passed: {count}",
          testsFailed: "Failed: {count}",
          testsPending: "Pending: {count}",
          noTestsRecorded: "No lab tests recorded for this project yet."
      }
  },
  services: {
      title: "Laboratory Services",
      description: "Manage the testing services offered by the laboratory.",
      addNewButton: "Add Service",
      searchPlaceholder: "Search services by name, category...",
      noServicesFound: "No services found",
      noServicesFilterHint: "Try adjusting your search.",
      noServicesGeneralHint: "Add a new service to get started.",
      card: {
          pricePrefix: "Price",
          durationPrefix: "Duration",
          editButton: "Edit",
          deleteButton: "Delete"
      },
      form: {
          addTitle: "Add New Service",
          editTitle: "Edit Service",
          nameLabel: "Service Name",
          categoryLabel: "Category",
          categoryPlaceholder: "e.g., Soil Testing, Concrete Analysis",
          descriptionLabel: "Description",
          priceLabel: "Price ({currency})",
          durationLabel: "Est. Duration (Optional)",
          durationPlaceholder: "e.g., 2-3 days",
          cancelButton: "Cancel",
          addButton: "Add Service",
          updateButton: "Save Changes"
      },
      deleteDialog: {
          title: "Confirm Deletion",
          description: "Are you sure you want to delete the service \"{serviceName}\"? This cannot be undone.",
          cancelButton: "Cancel",
          deleteButton: "Delete"
      }
  }
};
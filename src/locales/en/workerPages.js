export default {
  tasks: {
    title: "My Tasks",
    description: "View and manage your assigned tasks.",
    searchPlaceholder: "Search tasks by name, project...",
    filterStatus: "Filter by Status",
    noTasksFound: "No Tasks Found",
    noTasksFilterHint: "Try adjusting your search or filters, or you have no tasks assigned.",
    noTasksGeneralHint: "You currently have no tasks assigned.",
    statusAll: "All Statuses",
    statusPending: "Pending",
    statusInProgress: "In Progress",
    statusCompleted: "Completed",
    card: {
      priority: "Priority",
      dueDate: "Due Date",
      project: "Project",
      description: "Description",
      noDescription: "No description provided.",
      markAsComplete: "Mark as Complete",
      actionCompleteToast: "Marking task \"{taskName}\" as complete (mock action)."
    }
  },
  timeLog: {
    title: "My Time Logs",
    description: "Track your work hours and submit for approval.",
    addNewLogButton: "Add New Log",
    editLogTitle: "Edit Time Log",
    addLogTitle: "Add New Time Log",
    submittedLogsTitle: "Submitted Logs",
    filterByStatus: "Filter by status",
    allStatuses: "All Statuses",
    statusPending: "Pending",
    statusApproved: "Approved",
    statusRejected: "Rejected",
    noLogsFound: "No time logs found",
    noLogsFilterHint: "No logs match this filter.",
    noLogsGeneralHint: "Add your first time log to get started.",
    form: {
      dateLabel: "Date",
      hoursLabel: "Hours Worked",
      hoursPlaceholder: "e.g., 8 or 7.5",
      projectLabel: "Project (Optional)",
      projectPlaceholder: "Select a project",
      descriptionLabel: "Description/Notes",
      descriptionPlaceholder: "What did you work on?",
      cancelButton: "Cancel",
      addButton: "Add Log",
      updateButton: "Update Log",
    },
    card: {
      hoursSuffix: "hrs",
      projectPrefix: "Project",
      reasonPrefix: "Reason",
      editButton: "Edit",
      deleteButton: "Delete"
    }
  },
  payments: {
    title: "My Payments",
    description: "View your payment history.",
    totalReceivedTitle: "Total Payments Received",
    totalReceivedDesc: "Your total earnings recorded in the system.",
    historyTitle: "Payment History",
    noPayments: "No payments found",
    noPaymentsHint: "Your payment history will appear here.",
    table: {
      date: "Date",
      description: "Description",
      amount: "Amount ({currency})"
    }
  },
  marketplace: {
    title: "My Services",
    description: "Manage your service listings in the marketplace.",
    addServiceButton: "Add My Service Profile",
    editServiceButton: "Edit My Listing",
    noServices: "You haven't listed any services yet.",
    noServicesHint: "Add your profile to the marketplace to offer your skills.",
  }
};
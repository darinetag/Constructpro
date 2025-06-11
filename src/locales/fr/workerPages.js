export default {
  tasks: {
    title: "Mes Tâches",
    description: "Visualisez et gérez vos tâches assignées.",
    searchPlaceholder: "Rechercher des tâches par nom, projet...",
    filterStatus: "Filtrer par Statut",
    noTasksFound: "Aucune Tâche Trouvée",
    noTasksFilterHint: "Essayez d'ajuster votre recherche ou vos filtres, ou aucune tâche ne vous est assignée.",
    noTasksGeneralHint: "Aucune tâche ne vous est assignée actuellement.",
    statusAll: "Tous les Statuts",
    statusPending: "En attente",
    statusInProgress: "En Cours",
    statusCompleted: "Terminée",
    card: {
      priority: "Priorité",
      dueDate: "Date d'Échéance",
      project: "Projet",
      description: "Description",
      noDescription: "Aucune description fournie.",
      markAsComplete: "Marquer comme Terminé",
      actionCompleteToast: "Marquage de la tâche \"{taskName}\" comme terminée (action simulée)."
    }
  },
  timeLog: {
    title: "Mes Journaux de Temps",
    description: "Suivez vos heures de travail et soumettez-les pour approbation.",
    addNewLogButton: "Ajouter Nouveau Journal",
    editLogTitle: "Modifier Journal de Temps",
    addLogTitle: "Ajouter Nouveau Journal de Temps",
    submittedLogsTitle: "Journaux Soumis",
    filterByStatus: "Filtrer par statut",
    allStatuses: "Tous les Statuts",
    statusPending: "En attente",
    statusApproved: "Approuvé",
    statusRejected: "Rejeté",
    noLogsFound: "Aucun journal de temps trouvé",
    noLogsFilterHint: "Aucun journal ne correspond à ce filtre.",
    noLogsGeneralHint: "Ajoutez votre premier journal de temps pour commencer.",
    form: {
      dateLabel: "Date",
      hoursLabel: "Heures Travaillées",
      hoursPlaceholder: "ex: 8 ou 7.5",
      projectLabel: "Projet (Optionnel)",
      projectPlaceholder: "Sélectionnez un projet",
      descriptionLabel: "Description/Notes",
      descriptionPlaceholder: "Sur quoi avez-vous travaillé ?",
      cancelButton: "Annuler",
      addButton: "Ajouter Journal",
      updateButton: "Mettre à Jour Journal",
    },
    card: {
      hoursSuffix: "h",
      projectPrefix: "Projet",
      reasonPrefix: "Raison",
      editButton: "Modifier",
      deleteButton: "Supprimer"
    }
  },
  payments: {
    title: "Mes Paiements",
    description: "Consultez votre historique de paiements.",
    totalReceivedTitle: "Total des Paiements Reçus",
    totalReceivedDesc: "Vos revenus totaux enregistrés dans le système.",
    historyTitle: "Historique des Paiements",
    noPayments: "Aucun Paiement Trouvé",
    noPaymentsHint: "Votre historique de paiements apparaîtra ici.",
    table: {
      date: "Date",
      description: "Description",
      amount: "Montant ({currency})"
    }
  },
  marketplace: {
    title: "Mes Services",
    description: "Gérez vos annonces de services sur le marché.",
    addServiceButton: "Ajouter Mon Profil de Service",
    editServiceButton: "Modifier Mon Annonce",
    noServices: "Vous n'avez listé aucun service pour le moment.",
    noServicesHint: "Ajoutez votre profil au marché pour proposer vos compétences.",
  }
};
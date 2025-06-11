export default {
  dashboard: {
      title: "Tableau de Bord Laboratoire",
      welcome: "Bienvenue !",
      overview: "Voici un aperçu de vos activités de laboratoire.",
      statCards: {
        pendingTests: "Tests en Attente",
        upcomingAppointments: "Rendez-vous à Venir",
        associatedProjects: "Projets Associés",
        servicesOffered: "Services Offerts"
      },
      recentActivity: {
        title: "Activités de Test Récentes",
        noActivity: "Aucune activité de test récente.",
        viewAll: "Voir Tous les Tests",
        testDescription: "Test \"{type}\" pour projet \"{project}\" statut : {status}."
      },
      quickActions: {
        title: "Actions Rapides",
        manageTests: "Gérer les Tests",
        schedule: "Planifier",
        viewProjects: "Voir les Projets",
        labServices: "Services Labo"
      }
  },
  testManagement: {
      title: "Gestion des Tests",
      description: "Visualisez, ajoutez et gérez tous les tests de laboratoire.",
      addNewTestButton: "Ajouter Nouveau Test Labo",
      searchPlaceholder: "Rechercher des tests...",
      filterStatus: "Filtrer par Statut",
      allStatuses: "Tous les Statuts",
      statusPassed: "Réussi",
      statusFailed: "Échoué",
      statusPending: "En attente",
      exportPdfButton: "Exporter PDF",
      noTestsFound: "Aucun Test de Laboratoire Trouvé",
      noTestsFilterHint: "Votre recherche ou vos filtres n'ont pas trouvé de tests.",
      noTestsAddHint: "Aucun test enregistré. Cliquez sur 'Ajouter Test Labo' pour commencer.",
      form: { 
          addTitle: "Enregistrer Nouveau Test Labo",
          editTitle: "Mettre à Jour Enregistrement Test Labo",
          testTypeLabel: "Type de Test",
          testTypePlaceholder: "ex: Résistance Béton, Compactage Sol",
          dateLabel: "Date du Test",
          projectLabel: "Projet Associé",
          projectPlaceholder: "Sélectionnez Projet",
          materialLabel: "Matériau Testé",
          materialPlaceholder: "Sélectionnez Matériau",
          statusLabel: "Statut",
          resultLabel: "Résumé du Résultat",
          resultPlaceholder: "ex: Réussi, Échoué - 25MPa, Analyse en cours",
          notesLabel: "Notes (Optionnel)",
          notesPlaceholder: "Observations ou détails supplémentaires",
          assignedPersonnelLabel: "Personnel Assigné",
          assignedPersonnelPlaceholder: "Sélectionnez technicien de labo",
          addButton: "Ajouter Test",
          updateButton: "Mettre à Jour Test",
          successAddTitle: "Test Labo Ajouté",
          successAddDescription: "Le test de laboratoire a été enregistré avec succès.",
          successUpdateTitle: "Test Labo Mis à Jour",
          successUpdateDescription: "Les détails du test ont été mis à jour.",
          errorTitle: "Opération Échouée",
      },
      deleteDialog: {
          title: "Confirmer la Suppression",
          description: "Êtes-vous sûr de vouloir supprimer le test \"{testType}\" ? Cette action est irréversible.",
          cancelButton: "Annuler",
          deleteButton: "Supprimer",
          successTitle: "Test Labo Supprimé",
          successDescription: "Le test \"{testType}\" a été supprimé.",
          errorTitle: "Échec de la Suppression",
      }
  },
  appointments: {
      title: "Rendez-vous Laboratoire",
      description: "Gérez les plannings de tests et les rendez-vous clients.",
      addNewButton: "Ajouter Rendez-vous",
      searchPlaceholder: "Rechercher des rendez-vous...",
      noAppointmentsFound: "Aucun rendez-vous trouvé",
      noAppointmentsFilterHint: "Essayez d'ajuster votre recherche.",
      noAppointmentsGeneralHint: "Ajoutez un nouveau rendez-vous pour commencer.",
      card: {
        statusScheduled: "Planifié",
        statusCompleted: "Terminé",
        statusCancelled: "Annulé",
        projectPrefix: "Projet",
        testPrefix: "Test",
        contactPrefix: "Contact",
        notesPrefix: "Notes",
        editButton: "Modifier",
        deleteButton: "Supprimer"
      },
      form: {
          addTitle: "Ajouter Nouveau Rendez-vous",
          editTitle: "Modifier Rendez-vous",
          titleLabel: "Titre",
          dateLabel: "Date",
          timeLabel: "Heure",
          projectLabel: "Projet (Optionnel)",
          projectPlaceholder: "Sélectionnez un projet",
          testLabel: "Test (Optionnel)",
          testPlaceholder: "Sélectionnez un test",
          contactPersonLabel: "Personne à Contacter",
          statusLabel: "Statut",
          notesLabel: "Notes (Optionnel)",
          cancelButton: "Annuler",
          addButton: "Ajouter Rendez-vous",
          updateButton: "Enregistrer Modifications"
      },
      deleteDialog: {
          title: "Confirmer la Suppression",
          description: "Êtes-vous sûr de vouloir supprimer le rendez-vous pour \"{appointmentTitle}\" ? Ceci est irréversible.",
          cancelButton: "Annuler",
          deleteButton: "Supprimer"
      }
  },
  projectTracker: {
      title: "Projets Associés",
      description: "Visualisez les projets liés aux tests et activités du laboratoire.",
      searchPlaceholder: "Rechercher par nom ou lieu de projet...",
      noProjectsFound: "Aucun projet trouvé",
      noProjectsFilterHint: "Essayez d'ajuster votre recherche.",
      noProjectsGeneralHint: "Aucun projet n'a actuellement de tests de laboratoire associés.",
      alert: {
          title: "Information sur les Projets",
          description: "Cette section affiche les projets qui ont des tests de laboratoire associés. Vous pouvez suivre la progression des tests pour chaque projet."
      },
      card: {
          startDatePrefix: "Début",
          endDatePrefix: "Fin",
          overallProgress: "Progression Globale du Projet : {completion}%",
          labTestStatus: "Statut des Tests Labo ({count} au total) :",
          testsPassed: "Réussis : {count}",
          testsFailed: "Échoués : {count}",
          testsPending: "En attente : {count}",
          noTestsRecorded: "Aucun test de laboratoire enregistré pour ce projet pour l'instant."
      }
  },
  services: {
      title: "Services du Laboratoire",
      description: "Gérez les services de tests offerts par le laboratoire.",
      addNewButton: "Ajouter Service",
      searchPlaceholder: "Rechercher par nom ou catégorie de service...",
      noServicesFound: "Aucun service trouvé",
      noServicesFilterHint: "Essayez d'ajuster votre recherche.",
      noServicesGeneralHint: "Ajoutez un nouveau service pour commencer.",
      card: {
          pricePrefix: "Prix",
          durationPrefix: "Durée",
          editButton: "Modifier",
          deleteButton: "Supprimer"
      },
      form: {
          addTitle: "Ajouter Nouveau Service",
          editTitle: "Modifier Service",
          nameLabel: "Nom du Service",
          categoryLabel: "Catégorie",
          categoryPlaceholder: "ex: Test de Sol, Analyse Béton",
          descriptionLabel: "Description",
          priceLabel: "Prix ({currency})",
          durationLabel: "Durée Est. (Optionnel)",
          durationPlaceholder: "ex: 2-3 jours",
          cancelButton: "Annuler",
          addButton: "Ajouter Service",
          updateButton: "Enregistrer Modifications"
      },
      deleteDialog: {
          title: "Confirmer la Suppression",
          description: "Êtes-vous sûr de vouloir supprimer le service \"{serviceName}\" ? Ceci est irréversible.",
          cancelButton: "Annuler",
          deleteButton: "Supprimer"
      }
  }
};
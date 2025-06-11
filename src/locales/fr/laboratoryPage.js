export default {
  admin: {
    title: "Centre de Laboratoire (Vue Admin)",
    description: "Consultez les tests de matériaux, le contrôle qualité et les résultats.",
    addNewTestButton: "Ajouter Test Labo (N/A pour Chef de Projet)",
    searchPlaceholder: "Rechercher tests par type, projet, matériau...",
    tabs: {
      all: "Tous",
      passed: "Réussi",
      failed: "Échoué",
      pending: "En attente"
    },
    exportPdfButton: "Exporter PDF",
    viewOnlyAlertTitle: "Accès en Lecture Seule",
    viewOnlyAlertDescription: "En tant que Chef de Projet, vous pouvez consulter et exporter les résultats des tests de laboratoire. L'ajout, la modification ou la suppression des tests est restreint.",
    noTestsFound: "Aucun Test de Laboratoire Trouvé",
    noTestsFoundFilterHint: "Votre recherche ou vos critères de filtre n'ont correspondu à aucun test de laboratoire.",
    noTestsFoundAddHint: "Aucun test de laboratoire n'a encore été enregistré. Les utilisateurs non-administrateurs peuvent ajouter des tests.",
    addNewTestButtonSmall: "Ajouter Nouveau Test Labo",
    nearbyLabsTitle: "Laboratoires d'Analyse à Proximité",
    nearbyLabs: {
      lab1: {
        name: "Laboratoires de Test de Précision",
        address: "789 Av. du Test, Scienceton"
      },
      lab2: {
        name: "Analyse GéoMatériaux Inc.",
        address: "321 Rue du Sol, Rockburg"
      }
    },
    stats: {
      totalTests: "Total Tests Effectués",
      passedTests: "Tests Réussis",
      failedTests: "Tests Échoués",
      pendingTests: "Tests en Attente",
      rateSuffix: "Taux",
      awaitingResultsSuffix: "En Attente de Résultats"
    },
    card: {
      testId: "ID Test",
      date: "Date",
      project: "Projet",
      material: "Matériau",
      result: "Résultat",
      notes: "Notes",
      edit: "Modifier",
      delete: "Supprimer",
      viewOnly: "Voir Seul."
    },
    form: {
      addTitle: "Ajouter Nouveau Test Labo",
      editTitle: "Modifier Détails Test Labo",
      testTypeLabel: "Type de Test",
      testTypePlaceholder: "ex: Résistance Béton, Compression Sol",
      dateLabel: "Date du Test",
      projectLabel: "Projet Associé",
      projectPlaceholder: "Sélectionner Projet",
      materialLabel: "Matériau Testé",
      materialPlaceholder: "Sélectionner Matériau",
      statusLabel: "Statut",
      statusPassed: "Réussi",
      statusFailed: "Échoué",
      statusPending: "En attente",
      resultLabel: "Résumé Résultat",
      resultPlaceholder: "ex: Réussi, Échoué - 25MPa, Analyse en attente",
      notesLabel: "Notes (Optionnel)",
      notesPlaceholder: "Remarques ou détails supplémentaires",
      addButton: "Ajouter Test",
      updateButton: "Mettre à Jour Test",
      successAddTitle: "Test Labo Ajouté",
      successAddDescription: "Le test de laboratoire a été enregistré avec succès.",
      successUpdateTitle: "Test Labo Mis à Jour",
      successUpdateDescription: "Les détails du test de laboratoire ont été mis à jour.",
      errorTitle: "Opération Échouée",
      projectOwnerError: "Les Chefs de Projet ne peuvent pas ajouter ou modifier les tests de laboratoire.",
    },
    deleteDialog: {
      title: "Confirmer Suppression",
      description: "Êtes-vous sûr de vouloir supprimer le test de laboratoire \"{testType}\" ? Cette action est irréversible.",
      cancelButton: "Annuler",
      deleteButton: "Supprimer",
      successTitle: "Test Labo Supprimé",
      successDescription: "Le test de laboratoire \"{testType}\" a été supprimé.",
      errorTitle: "Échec Suppression",
      projectOwnerError: "Les Chefs de Projet ne peuvent pas supprimer les tests de laboratoire.",
    }
  }
};
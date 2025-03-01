reservationcontrollers



const db = require("../config/db");

// Fonction pour réserver un projecteur
exports.ajouterReservation = (req, res) => {
  const { projectorId, date } = req.body;
  const userId = req.user.id; // L'ID de l'utilisateur est obtenu grâce au token décodé dans le middleware

  // Vérifier si le projecteur est disponible
  db.query("SELECT available FROM projectors WHERE id = ?", [projectorId], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur interne du serveur" });

    if (result.length === 0) {
      return res.status(400).json({ message: "Projecteur non trouvé" });
    }

    if (result[0].available === 0) {
      return res.status(400).json({ message: "Projecteur non disponible" });
    }

    // Créer la réservation
    db.query(
      "INSERT INTO reservations (userId, projectorId, date) VALUES (?, ?, ?)",
      [userId, projectorId, date],
      (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la réservation" });

        // Mettre à jour la disponibilité du projecteur
        db.query("UPDATE projectors SET available = 0 WHERE id = ?", [projectorId], (err) => {
          if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité du projecteur" });
          res.status(201).json({ message: "Réservation effectuée avec succès" });
        });
      }
    );
  });
};

// Lister toutes les réservations d'un utilisateur
exports.getReservations = (req, res) => {
  db.query("SELECT * FROM reservations WHERE userId = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur interne du serveur" });
    res.json(result);
  });
};

// Annuler une réservation
exports.supprimerReservation = (req, res) => {
  const reservationId = req.params.id;

  // Vérifier si la réservation appartient à l'utilisateur
  db.query("SELECT * FROM reservations WHERE id = ? AND userId = ?", [reservationId, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur interne" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée ou accès non autorisé" });
    }

    // Supprimer la réservation
    db.query("DELETE FROM reservations WHERE id = ?", [reservationId], (err) => {
      if (err) return res.status(500).json({ message: "Erreur lors de l'annulation de la réservation" });

      // Remettre le projecteur à sa disponibilité initiale
      db.query("UPDATE projectors SET available = 1 WHERE id = ?", [result[0].projectorId], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité du projecteur" });
        res.json({ message: "Réservation annulée avec succès" });
      });
    });
  });
};
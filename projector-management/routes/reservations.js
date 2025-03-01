const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware"); // Auth middleware pour vérifier le token JWT
const db = require("../config/db");

// Réserver un projecteur
router.post("/", authMiddleware, (req, res) => {
  const { projectorId, date } = req.body;  // On reçoit l'ID du projecteur et la date de la réservation
  const userId = req.user.id; // Récupère l'ID de l'utilisateur depuis le token JWT

  // Vérifier si le projecteur est disponible
  db.query("SELECT available FROM projectors WHERE id = ?", [projectorId], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur interne" });

    if (result.length === 0) {
      return res.status(400).json({ message: "Projecteur non trouvé" });
    }

    if (result[0].available === 0) {
      return res.status(400).json({ message: "Projecteur non disponible" });
    }

    // Insérer la réservation dans la base de données
    db.query(
      "INSERT INTO reservations (userId, projectorId, date) VALUES (?, ?, ?)",
      [userId, projectorId, date],
      (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la réservation" });

        // Mettre à jour la disponibilité du projecteur pour qu'il soit marqué comme réservé
        db.query("UPDATE projectors SET available = 0 WHERE id = ?", [projectorId], (err) => {
          if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité du projecteur" });

          res.status(201).json({ message: "Réservation effectuée avec succès" });
        });
      }
    );
  });
});

// Lister toutes les réservations
router.get("/", authMiddleware, (req, res) => {
  db.query("SELECT * FROM reservations WHERE userId = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur interne" });
    res.json(result);
  });
});

// Annuler une réservation
router.delete("/:id", authMiddleware, (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.id; // Utilisateur authentifié via JWT

  // Vérifier si la réservation existe et appartient à l'utilisateur
  db.query("SELECT * FROM reservations WHERE id = ? AND userId = ?", [reservationId, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur interne" });

    if (result.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée ou accès non autorisé" });
    }

    // Annuler la réservation
    db.query("DELETE FROM reservations WHERE id = ?", [reservationId], (err) => {
      if (err) return res.status(500).json({ message: "Erreur lors de l'annulation de la réservation" });

      // Remettre à jour la disponibilité du projecteur
      const projectorId = result[0].projectorId;
      db.query("UPDATE projectors SET available = 1 WHERE id = ?", [projectorId], (err) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour de la disponibilité du projecteur" });
        res.json({ message: "Réservation annulée avec succès" });
      });
    });
  });
});

module.exports = router;
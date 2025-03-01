projectorController.js



// controllers/projectorController.js
const db = require("../config/db");  // Importer la connexion à la DB

// Récupérer tous les projecteurs
exports.getProjectors = (req, res) => {
  const query = "SELECT * FROM projecteurs";  // Utilise la bonne table 'projecteurs'

  db.query(query, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des projecteurs :", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);  // Renvoyer les projecteurs récupérés
  });
};

// Récupérer les projecteurs disponibles
exports.getAvailableProjectors = (req, res) => {
  const query = "SELECT * FROM projecteurs WHERE disponibilite = 1";  // Requête pour récupérer uniquement les projecteurs disponibles

  db.query(query, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des projecteurs disponibles :", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);  // Renvoyer les projecteurs disponibles
  });
};

// Ajouter un nouveau projecteur
exports.ajouterProjecteur = (req, res) => {
  const { nom, etat, disponibilite } = req.body;

  const query = "INSERT INTO projecteurs (nom, etat, disponibilite) VALUES (?, ?, ?)";  // Utilise 'projecteurs' pour l'insertion
  const values = [nom, etat, disponibilite];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout du projecteur :", err);
      return res.status(500).json({ message: "Erreur lors de l'ajout du projecteur", error: err.message });
    }

    res.status(201).json({
      message: "Projecteur ajouté avec succès",
      projecteur: { id: result.insertId, nom, etat, disponibilite },  // Renvoyer l'objet ajouté avec l'id généré
    });
  });
};
const express = require("express");
const { getProjectors, ajouterProjecteur, getAvailableProjectors } = require("../controllers/projectorController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Route protégée par un token JWT pour récupérer tous les projecteurs
router.get("/", authMiddleware, getProjectors);

// Route pour récupérer les projecteurs disponibles
router.get("/available", authMiddleware, getAvailableProjectors);  // Nouvelle route pour récupérer les projecteurs disponibles

// Route pour ajouter un projecteur
router.post("/add", ajouterProjecteur);

module.exports = router;
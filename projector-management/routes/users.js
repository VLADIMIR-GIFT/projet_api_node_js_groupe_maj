const express = require("express");
const { register, login } = require("../controllers/userController");
const router = express.Router();

// Route pour l'enregistrement
router.post("/register", register);

// Route pour la connexion
router.post("/login", login);

module.exports = router;
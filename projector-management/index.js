require("dotenv").config();  // Assure-toi que dotenv est bien importé
const express = require("express");
const cors = require("cors");
const db = require("./config/db"); // Importation de la connexion à la base de données
const userRoutes = require("./routes/users"); // Routes utilisateur
const projectorRoutes = require("./routes/projectors");  // Routes projecteurs
const reservationRoutes = require("./routes/reservations"); // Ajoute les routes des réservations

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Pour traiter le JSON dans le corps des requêtes

// Routes spécifiques
app.use("/users", userRoutes); // Les routes d'utilisateur
app.use("/projectors", projectorRoutes);  // Les routes des projecteurs
app.use("/reservations", reservationRoutes); // Ajoute les routes des réservations

// Route racine ("/")
app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur de gestion des projecteurs !");
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

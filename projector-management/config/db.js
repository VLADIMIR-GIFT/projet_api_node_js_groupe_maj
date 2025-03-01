// config/db.js
const mysql = require("mysql2");

// Créer une connexion à la base de données MySQL
const db = mysql.createConnection({
  host: "localhost",  // Adresse de la base de données
  user: "root",       // Nom d'utilisateur
  password: "",       // Mot de passe de la base de données
  database: "gestion_projecteurs",  // Nom de la base de données
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données : ", err);
  } else {
    console.log("Connexion à la base de données réussie !");
  }
});

module.exports = db;

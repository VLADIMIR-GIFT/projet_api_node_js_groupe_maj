const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");  // Importer l'instance Sequelize

// Définir le modèle
const Projector = sequelize.define("Projector", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: DataTypes.STRING, allowNull: false },
    etat: { type: DataTypes.STRING, allowNull: false },
    disponibilite: { type: DataTypes.BOOLEAN, allowNull: false },
});

module.exports = Projector;

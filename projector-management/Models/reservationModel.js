// models/reservationModel.js
const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Reservation = db.define("reservations", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    projecteur_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_reservation: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("en attente", "confirmée", "annulée"),
        defaultValue: "en attente"
    }
}, {
    timestamps: false,
    tableName: "reservations"
});

module.exports = Reservation;
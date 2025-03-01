const db = require("../config/db");

class User {
    // Créer un utilisateur
    static async createUser(nom, email, mot_de_passe, role = "etudiant") {
        const sql = "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)";
        return new Promise((resolve, reject) => {
            db.query(sql, [nom, email, mot_de_passe, role], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Trouver un utilisateur par son email
    static async findByEmail(email) {
        const sql = "SELECT * FROM utilisateurs WHERE email = ?";
        return new Promise((resolve, reject) => {
            db.query(sql, [email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]); // Retourne le premier utilisateur trouvé
                }
            });
        });
    }
}

module.exports = User;

usercontrollers



const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

// Fonction pour enregistrer un nouvel utilisateur
exports.register = async (req, res) => {
    try {
        const { nom, email, mot_de_passe, role } = req.body;

        // Validation simple des données
        if (!nom || !email || !mot_de_passe) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé." });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Créer l'utilisateur dans la base de données
        await User.createUser(nom, email, hashedPassword, role);
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur", error);
        res.status(500).json({ error: error.message });
    }
};

// Fonction de connexion (login)
exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({ message: "Email et mot de passe sont requis." });
        }

        const user = await User.findByEmail(email);
        if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur", error);
        res.status(500).json({ error: error.message });
    }
};
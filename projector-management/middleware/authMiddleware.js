const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  // Extraction du token de l'en-tête Authorization
  const authorizationHeader = req.header("Authorization");

  // Log pour voir l'en-tête Authorization reçu
  console.log("En-tête Authorization reçu : ", authorizationHeader);

  // Vérifier si l'en-tête contient un token de type 'Bearer <token>'
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé, token manquant ou mal formaté" });
  }

  // Extraire le token en utilisant la méthode split()
  const token = authorizationHeader.split(" ")[1];

  console.log("Token extrait : ", token); // Log pour vérifier ce qui est extrait

  // Si le token est absent après l'extraction
  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    // Vérifier le token avec la clé secrète
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter les informations de l'utilisateur vérifié dans la requête
    req.user = verified;

    // Passer au prochain middleware ou à la fonction de traitement de la route
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token : ", error);  // Log l'erreur pour plus de détails
    res.status(400).json({ message: "Token invalide ou expiré" });
  }
};
/**
 * Serveur minimal pour héberger le formulaire "Inscription — Visite libre"
 * sur un sous-domaine egi.immo (via Render), afin d'éviter la restriction
 * de sécurité qui empêche les pages publiées comme "page Claude" d'envoyer
 * des données vers un site externe (Google Apps Script).
 *
 * Ce serveur ne fait rien d'autre que servir le fichier public/index.html
 * (le formulaire) et répondre au health check de Render sur /ping.
 * Aucune donnée n'est stockée ici : chaque visiteur envoie directement ses
 * informations depuis son navigateur vers le script Google (Code.gs), qui
 * s'occupe de FUB, du Sheet et du courriel de confirmation.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Health check attendu par Render.
app.get('/ping', (req, res) => {
  res.status(200).send('ok');
});

// Sert le formulaire (public/index.html) et tout autre fichier statique
// qu'on pourrait ajouter plus tard (ex. une nouvelle version par propriété).
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Visite libre EGI — serveur démarré sur le port ${PORT}`);
});

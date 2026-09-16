# Déploiement du formulaire "Visite libre" sur Render

Ce dossier contient tout ce qu'il faut pour héberger le formulaire client
sur `visite.egi.immo` (ou un autre sous-domaine de votre choix), avec la
même recette que votre outil QR Manager. Ça règle le problème de sécurité
rencontré avec la page Claude, puisque le formulaire tournera sur votre
propre domaine, comme un vrai site Web.

**Noms utilisés dans les fichiers, à ajuster si vous voulez autre chose :**
- Dépôt GitHub : `martcoco/visite-libre-egi`
- Sous-domaine : `visite.egi.immo`

Si vous préférez d'autres noms, dites-le-moi et je corrige les fichiers
avant que vous les mettiez en ligne.

## Contenu du dossier

- `Dockerfile` — recette de construction du service (identique à votre gabarit).
- `render.yaml` — configuration du service Render (santé, domaine, variables).
- `package.json` — dépendances (juste `express`, un petit serveur Web).
- `src/server.js` — sert le formulaire et répond à `/ping` (health check).
- `public/index.html` — le formulaire lui-même, déjà configuré avec l'adresse
  de votre script Google et le mot de passe secret (`FORM_TOKEN`).

Ce formulaire ne stocke aucune donnée localement (pas de base de données,
pas de disque nécessaire) : chaque visiteur envoie directement ses
informations à Google (FUB, Sheet, courriel) depuis son navigateur.

## Étape 1 — Mettre les fichiers sur GitHub (sans ligne de commande)

1. Allez sur github.com et connectez-vous à votre compte.
2. Cliquez sur **"New repository"** (nouveau dépôt).
3. Nommez-le `visite-libre-egi` (ou le nom que vous préférez — voir plus haut).
4. Laissez-le vide (pas de README généré automatiquement), cliquez **"Create repository"**.
5. Sur la page du dépôt vide, cliquez **"uploading an existing file"**.
6. Glissez-déposez **tous les fichiers et dossiers** de ce dossier (en gardant
   la structure : `src/`, `public/`, `Dockerfile`, `render.yaml`, `package.json`)
   dans la zone de dépôt, puis cliquez **"Commit changes"**.

## Étape 2 — Créer le service sur Render

1. Allez sur render.com et connectez-vous (ou créez un compte, relié à GitHub).
2. Cliquez **"New" > "Blueprint"**.
3. Choisissez le dépôt `visite-libre-egi` que vous venez de créer.
4. Render détecte automatiquement `render.yaml` et propose la configuration
   (type Web Service, Docker, plan Starter, health check `/ping`). Vérifiez
   que tout correspond, puis cliquez **"Apply"** / **"Create"**.
5. Le premier déploiement prend quelques minutes. Une fois terminé, Render
   vous donne une adresse temporaire du type `xxx.onrender.com` — le site
   fonctionne déjà à cette adresse, avant même de brancher votre domaine.

## Étape 3 — Brancher le sous-domaine `visite.egi.immo`

1. Dans Render, ouvrez le service, section **"Settings" > "Custom Domains"**.
2. Le domaine `visite.egi.immo` (déjà indiqué dans `render.yaml`) devrait
   apparaître ; Render vous donne une valeur CNAME à utiliser (quelque chose
   comme `xxx.onrender.com`).
3. Allez dans votre compte GoDaddy, section DNS du domaine `egi.immo`.
4. Ajoutez un enregistrement **CNAME** :
   - Nom/host : `visite`
   - Valeur : l'adresse `xxx.onrender.com` donnée par Render
5. Attendez quelques minutes à quelques heures (propagation DNS). Render
   installe automatiquement le certificat HTTPS une fois le DNS reconnu.

## Étape 4 — Tester

Une fois le domaine actif, ouvrez :

`https://visite.egi.immo/?adresse=Test%20123%20rue%20Exemple&mls=99999999&courtier=Martin%20Rodrigue`

Remplissez le formulaire. Cette fois, l'envoi vers Google devrait fonctionner
sans le message d'erreur rencontré avec la page Claude.

## Étape 5 — Mettre à jour le générateur

Une fois `visite.egi.immo` confirmé fonctionnel, il faudra mettre à jour le
champ "Domaine du formulaire de saisie" dans le générateur de visite libre
pour qu'il pointe vers `https://visite.egi.immo/` au lieu du lien de la page
Claude — je m'en occupe dès que vous me confirmez que le test a réussi.

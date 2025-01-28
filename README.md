# API ValueMyCar

Ce projet propose une API RESTful pour la gestion de voitures et de marques. Elle permet aussi de gérer les utilisateurs, avec un certain niveau d'accès à l'API en fonction de leur rôle. 
La documentation de l'API est disponible via Swagger.

## Fonctionnalités principales

### Utilisateurs

Création, mise à jour et suppression des utilisateurs.

Gestion des rôles: Utilisateur, Administrateur et Super-Administrateur.
Ces derniers sécurisants l'accès à certaines routes.

Authentification et gestion des droits d'accès via JWT.

### Voitures

Gestion des voitues : création, lecture, mise à jour et suppression.

Attribution d'une marque à chaque voiture.
Affichage de leur prix et date de sortie.

### Marques

Gestion des marques liées aux voitures.

## Prérequis

Avant de démarrer, assurez-vous d'avoir installé les outils suivants :

Node.js (v16+ recommandé)

TypeScript

MongoDB

Installation

## Clonez le dépôt :

git clone <URL_DU_DEPOT>
cd <NOM_DU_DOSSIER>

### Installez les dépendances :

npm install

### Configurez les bases de données dans les fichiers suivants :

src/configs/databases/mongoose.config.ts pour MongoDB.

src/configs/databases/mysql.config.ts pour MySQL.

### Configurez les variables d'environnement en créant un fichier .env à la racine du projet :

PORT=3000
MONGODB_URI=<URI_MONGODB>
SECRET_KEY=<VOTRE_SECRET>
SECRET_KEY_REFRESH=<VOTRE_SECRET>

### Lancez le serveur :

npm run dev

## Documentation Swagger

La documentation de l'API est disponible via Swagger. Pour y accéder :

Lancez le projet.

Rendez-vous à l'adresse suivante dans votre navigateur : http://localhost:3000/api-docs

Les fichiers Swagger sont situés dans le dossier : src/doc/swagger/.

## Structure du projet

src/
├── app.ts                 # Configuration principale de l'application
├── server.ts              # Démarrage du serveur
├── configs/               # Configuration des bases de données
├── controllers/           # Logique des routes
├── middlewares/           # Middleware (authentification, logs, etc.)
├── repositories/          # Accès aux données
├── routes/                # Définition des routes de l'API
├── services/              # Services pour la logique métier
├── types/                 # Typages TypeScript
├── utils/                 # Fonctions utilitaires
└── docs/swagger/          # Documentation Swagger

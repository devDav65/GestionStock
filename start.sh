#!/bin/sh

echo "Initialisation de Prisma ORM..."
# On génère le client prisma manquant à l'étape finale
npx prisma generate

echo "Exécution des Migrations (Déploiement de Base de données)..."
npx prisma migrate deploy

echo "Démarrage automatique du serveur web Next.js en cours..."
node server.js

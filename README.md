# Elaia Studio - Application de Gestion

Application web moderne pour la gestion d'un studio de Pilates Reformer, développée avec React et Node.js.

## 🌟 Fonctionnalités

- **Gestion des réservations** : Système de réservation en temps réel pour les cours
- **Gestion des abonnements** : Suivi des abonnements mensuels et à la séance
- **Système de crédits** : Achat et gestion des crédits via Payrexx
- **Interface administrateur** : Tableau de bord complet pour la gestion du studio
- **Design responsive** : Interface adaptée pour tous les appareils
- **Authentification sécurisée** : Système de connexion avec Supabase
- **Notifications push** : Rappels et confirmations automatiques

## 🚀 Technologies utilisées

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- Supabase (PostgreSQL)
- Payrexx (paiements)
- JWT pour l'authentification

### Services externes
- **Supabase** : Base de données et authentification
- **Payrexx** : Paiements sécurisés
- **Service Worker** : Notifications push

## 📦 Installation

1. Cloner le repository
```bash
git clone https://github.com/[votre-username]/elaia-studio-app.git
cd elaia-studio-app
```

2. Installer les dépendances
```bash
npm run install:all
```

3. Configurer Supabase
- Créez un compte sur [supabase.com](https://supabase.com)
- Créez un nouveau projet
- Copiez les clés API

4. Configurer Payrexx (optionnel)
- Créez un compte sur [payrexx.com](https://payrexx.com)
- Récupérez votre nom d'instance et clé API

5. Configurer les variables d'environnement
Créer un fichier `.env` dans le dossier `server` :
```env
PORT=5000
JWT_SECRET=votre_secret_jwt

# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service

# Payrexx (optionnel)
PAYREXX_INSTANCE_NAME=votre-instance
PAYREXX_API_KEY=votre-cle-api

# Frontend
FRONTEND_URL=http://localhost:5173
```

Et dans le dossier `client` :
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

6. Lancer l'application en développement
```bash
# Méthode recommandée :
# Terminal 1 - Serveur
cd server && npm run dev:supabase

# Terminal 2 - Client
cd client && npm run dev
```

Ou utiliser le script automatique :
```bash
.\start-supabase.ps1
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:5000

## 🌐 Déploiement

Ce projet est configuré pour être déployé sur Vercel.

1. Connectez votre repository GitHub à Vercel
2. Les configurations de build sont déjà présentes dans `vercel.json`
3. Ajoutez vos variables d'environnement dans le dashboard Vercel

## 📱 Captures d'écran

*À ajouter : captures d'écran de l'application*

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence ISC.

---

Développé avec ❤️ pour Elaia Studio 
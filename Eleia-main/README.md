# Elaia Studio - Application de Gestion

Application web moderne pour la gestion d'un studio de Pilates Reformer, développée avec React et Node.js.

## 🌟 Fonctionnalités

- **Gestion des réservations** : Système de réservation en temps réel pour les cours
- **Gestion des abonnements** : Suivi des abonnements mensuels et à la séance
- **Interface administrateur** : Tableau de bord complet pour la gestion du studio
- **Design responsive** : Interface adaptée pour tous les appareils
- **Authentification sécurisée** : Système de connexion avec JWT

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
- SQLite
- JWT pour l'authentification

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

3. Configurer les variables d'environnement
Créer un fichier `.env` dans le dossier `server` :
```
PORT=5000
JWT_SECRET=votre_secret_jwt
```

4. Lancer l'application en développement
```bash
npm run dev
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
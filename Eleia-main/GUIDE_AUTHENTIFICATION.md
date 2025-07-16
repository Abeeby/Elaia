# Guide du Système d'Authentification ELAÏA

## 🔐 Vue d'ensemble

Le système d'authentification d'ELAÏA Studio est maintenant pleinement fonctionnel avec un design moderne inspiré d'Ohemia.de.

## 🚀 Démarrage

### 1. **Démarrer le serveur backend**
```bash
cd server
npm install
$env:PORT="5001"; npm run dev
# ou sur Mac/Linux : PORT=5001 npm run dev
```

### 2. **Démarrer le client frontend**
```bash
cd client
npm install
npm run dev
```

Le site sera accessible sur : **http://localhost:5173/** (ou 5174 si le port est occupé)

## 📱 Pages d'Authentification

### **Page de Connexion** (`/login`)
- Design épuré et moderne
- Formulaire minimaliste avec validation
- Comptes de démonstration disponibles

### **Page d'Inscription** (`/register`)
- Formulaire complet avec tous les champs nécessaires
- Validation en temps réel
- Design cohérent avec le reste du site

## 🎨 Nouveau Design

Les pages d'authentification suivent le nouveau design Ohemia avec :
- **Typographie élégante** : Playfair Display pour les titres
- **Champs minimalistes** : Underline design sans bordures
- **Palette de couleurs neutres** : Noir, blanc, et accents dorés
- **Layout centré** : Focus sur le contenu important

## 👤 Comptes de Démonstration

Pour tester rapidement sans créer de compte :

### **Compte Admin**
- Email : `admin@elaiastudio.ch`
- Mot de passe : `admin123`
- Accès complet au tableau de bord admin

### **Compte Client**
- Email : `marie.dupont@email.com`
- Mot de passe : `client123`
- Accès client standard

## 🔧 Configuration Technique

### **Backend (Port 5001)**
- Express.js avec TypeScript
- JWT pour l'authentification
- SQLite en développement
- Bcrypt pour le hachage des mots de passe

### **Frontend**
- React avec TypeScript
- Axios pour les appels API
- React Hook Form pour la gestion des formulaires
- Zustand pour la gestion d'état

## 📝 Flux d'Authentification

1. **Inscription**
   - L'utilisateur remplit le formulaire
   - Validation côté client et serveur
   - Hachage du mot de passe
   - Création du compte en base de données
   - Email de bienvenue envoyé
   - Token JWT généré et stocké

2. **Connexion**
   - Saisie email/mot de passe
   - Vérification des identifiants
   - Génération du token JWT
   - Redirection vers le dashboard

3. **Session**
   - Token JWT stocké dans localStorage
   - Envoyé automatiquement avec chaque requête
   - Expiration après 30 jours

## 🛡️ Sécurité

- Mots de passe hachés avec bcrypt
- Tokens JWT signés avec une clé secrète
- Validation des données côté client et serveur
- Protection des routes privées
- CORS configuré pour la sécurité

## 🚨 Problèmes Courants

### **Port déjà utilisé**
Si vous avez l'erreur "EADDRINUSE", changez le port :
```bash
# Backend
$env:PORT="5002"; npm run dev

# Puis mettez à jour client/src/services/api.ts
# Changez 5001 par 5002
```

### **Nodemon non trouvé**
```bash
cd server
npm install nodemon --save-dev
```

### **Erreur de connexion API**
Vérifiez que :
- Le serveur backend est bien démarré
- Le port dans `api.ts` correspond au serveur
- Pas de problème CORS

## ✨ Fonctionnalités

- ✅ Inscription avec validation complète
- ✅ Connexion sécurisée
- ✅ Gestion de session avec JWT
- ✅ Profil utilisateur
- ✅ Changement de mot de passe
- ✅ Design moderne et responsive
- ✅ Comptes de démonstration

Le système d'authentification est maintenant pleinement opérationnel avec un design moderne et élégant ! 
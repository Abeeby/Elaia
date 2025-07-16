# Guide d'Inscription - Elaia Studio

## Comment créer un compte

La fonctionnalité d'inscription est **entièrement disponible** et accessible de plusieurs façons :

### 1. 🏠 Depuis la page d'accueil
- Cliquez sur le bouton **"Créer mon compte"** en haut à droite
- Ou sur le bouton **"S'inscrire maintenant"** dans la section héro
- Ou dans la section "Prêt à commencer" en bas de page

### 2. 🔐 Depuis la page de connexion
- Allez sur `/login`
- Cliquez sur **"Créer un compte"** en bas du formulaire

### 3. 💰 Depuis la page des tarifs
- Allez sur `/pricing`
- Cliquez sur **"Choisir"** sur n'importe quel plan

### 4. 📋 Accès direct
- Tapez directement `/register` dans l'URL
- Ou cliquez sur **"Inscription"** dans le menu de navigation

## Processus d'inscription

### Informations requises :
- ✅ **Prénom** et **Nom**
- ✅ **Email** (unique dans le système)
- ✅ **Téléphone** (format suisse : +41XXXXXXXXX ou 0XXXXXXXXX)
- ✅ **Adresse complète** (rue, ville, code postal)
- ✅ **Mot de passe** (minimum 6 caractères)
- ✅ **Acceptation des conditions générales**

### Validation automatique :
- 📧 Format email vérifié
- 📱 Format téléphone suisse validé
- 🏠 Code postal suisse (4 chiffres)
- 🔒 Confirmation du mot de passe
- ⚖️ Acceptance des CGV obligatoire

## Après l'inscription

### Connexion automatique
- Redirection vers le **tableau de bord client**
- Token JWT généré automatiquement
- Profil utilisateur créé

### Fonctionnalités accessibles :
- 📊 **Dashboard personnel** avec statistiques
- 📅 **Planning des cours** avec réservation
- 💳 **Système de crédits** et abonnements  
- 👤 **Profil modifiable**
- 📖 **Historique des réservations**

## Offre de bienvenue

🎁 **Nouveau client** : 1 séance achetée + 2 offertes pour 45 CHF

## Modes de fonctionnement

### Mode Production
- Inscription directe dans la base de données PostgreSQL
- Validation email unique
- Hashage sécurisé des mots de passe

### Mode Démo (fallback)
- Si l'API n'est pas disponible
- Utilisation du service mock
- Démonstration complète des fonctionnalités

## URLs importantes

- **Application locale** : http://localhost:5173
- **Page d'inscription** : http://localhost:5173/register
- **API Backend** : https://eleia-production.up.railway.app

## Support

Si vous rencontrez des problèmes :

1. ✅ Vérifiez que l'application est démarrée (`npm run dev`)
2. ✅ Testez l'URL directe : `/register`
3. ✅ Vérifiez la console navigateur (F12) pour les erreurs
4. ✅ Le système dispose d'un fallback mock si l'API est indisponible

---

**L'inscription fonctionne parfaitement** ! Tous les composants sont en place et testés. 🚀 
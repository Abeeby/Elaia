# Eleia Studio - Application de Gestion pour Studios de Pilates �️‍♀️

Application web moderne pour la gestion d'un studio de Pilates Reformer, inspirée du design minimaliste d'[ohemia.de](https://ohemia.de).

## 🎯 Vision

Eleia est la solution complète pour digitaliser et moderniser la gestion de votre studio de Pilates. Notre plateforme offre tous les outils nécessaires pour simplifier vos opérations quotidiennes et améliorer l'expérience de vos clients.

## 🌟 Fonctionnalités principales

### Pour les gestionnaires de studio
- **📅 Gestion des réservations** : Système de réservation en temps réel avec calendrier interactif
- **💳 Suivi des abonnements** : Gestion simplifiée des abonnements mensuels et cartes de séances
- **📊 Tableau de bord administrateur** : Vue d'ensemble complète avec statistiques et rapports
- **👥 Gestion des instructeurs** : Planning et suivi des performances
- **� Rapports financiers** : Analytics avancés pour optimiser votre business

### Pour les clients
- **📱 Réservation en ligne 24/7** : Interface intuitive sur tous les appareils
- **🔔 Notifications automatiques** : Rappels SMS/Email pour les cours
- **📋 Historique complet** : Suivi des séances et abonnements
- **⏱️ Liste d'attente** : Inscription automatique en cas d'annulation

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Type safety et meilleure DX
- **Tailwind CSS** - Design system minimaliste
- **Framer Motion** - Animations fluides
- **Vercel** - Déploiement et hosting

## 🎨 Design

Le design s'inspire du minimalisme d'ohemia.de avec :
- Palette noir/blanc/crème épurée
- Typographie Inter élégante
- Animations subtiles
- Interface responsive mobile-first

## 🛠️ Installation

```bash
# Cloner le repository
git clone [votre-repo]
cd eleia-studio

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build
```

## 📁 Structure du projet

```
eleia-studio/
├── app/                # Pages et routes (App Router)
│   ├── layout.tsx     # Layout principal
│   └── page.tsx       # Page d'accueil
├── components/        # Composants réutilisables
│   ├── navbar.tsx    
│   ├── footer.tsx    
│   ├── service-card.tsx
│   └── ...
├── styles/           # Styles globaux
└── public/          # Assets statiques
```

## 🌐 Pages disponibles

- `/` - Page d'accueil avec présentation des fonctionnalités
- `/features` - Détail des fonctionnalités
- `/pricing` - Grille tarifaire
- `/demo` - Demande de démonstration
- `/login` - Connexion client/admin
- `/about` - À propos d'Eleia
- `/contact` - Formulaire de contact

## 📊 Statistiques

- **500+** Studios actifs
- **50K+** Réservations par mois
- **98%** Taux de satisfaction
- **24/7** Support disponible

## 🚀 Déploiement

Le projet est configuré pour être déployé sur Vercel :

```bash
npm i -g vercel
vercel
```

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Mobile (iOS/Android)
- 💻 Tablette
- 🖥️ Desktop

## 🔒 Sécurité

- Authentification JWT sécurisée
- Paiements via Stripe (PCI compliant)
- RGPD compliant
- SSL/TLS encryption

## 🤝 Support

- Documentation complète
- Centre d'aide en ligne
- Support par email/chat
- Formation personnalisée

## 📄 Licence

© 2024 Eleia Studio. Tous droits réservés.

---

Développé avec ❤️ pour moderniser l'industrie du Pilates
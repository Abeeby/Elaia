# 📱 GUIDE DE DÉPLOIEMENT MOBILE - ELAÏA STUDIO

## 🚀 SOLUTION RECOMMANDÉE : CAPACITOR

Capacitor permet de transformer votre app React en app native iOS/Android tout en gardant le même code.

## 📋 PRÉREQUIS

### Pour Android (Play Store)
- Android Studio installé
- Compte Google Play Developer (25$ une fois)
- JDK 11 ou supérieur

### Pour iOS (App Store)
- Mac avec Xcode
- Compte Apple Developer (99$/an)
- Certificats de signature

## 🛠️ INSTALLATION CAPACITOR

```bash
# Dans le dossier client
cd client

# Installer Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialiser Capacitor
npx cap init "ELAIA Studio" "com.elaia.studio"

# Construire l'app web
npm run build

# Ajouter les plateformes
npx cap add android
npx cap add ios

# Synchroniser
npx cap sync
```

## 📝 CONFIGURATION CAPACITOR

Créer `client/capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elaia.studio',
  appName: 'ELAÏA Studio',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // URL de production de votre API
    url: 'https://api.elaiastudio.ch',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#F5F3F0",
      showSpinner: false
    }
  }
};

export default config;
```

## 🎨 ASSETS REQUIS

### Icônes
- **Android**: 
  - 512x512px (Play Store)
  - 192x192px (xxxhdpi)
  - 144x144px (xxhdpi)
  - 96x96px (xhdpi)
  - 72x72px (hdpi)
  - 48x48px (mdpi)

### iOS:
  - 1024x1024px (App Store)
  - 180x180px (iPhone)
  - 167x167px (iPad Pro)
  - 152x152px (iPad)
  - 120x120px (iPhone Retina)

### Splash Screens
- 2732x2732px (universel, sera recadré)

## 📱 FONCTIONNALITÉS NATIVES

### Notifications Push
```bash
npm install @capacitor/push-notifications
```

### Géolocalisation (pour trouver le studio)
```bash
npm install @capacitor/geolocation
```

### Calendrier (ajouter les cours)
```bash
npm install @capacitor/calendar
```

## 🏗️ BUILD & DÉPLOIEMENT

### Android
```bash
# Ouvrir dans Android Studio
npx cap open android

# OU build direct
cd android
./gradlew assembleRelease
```

### iOS
```bash
# Ouvrir dans Xcode
npx cap open ios

# Build depuis Xcode
# Product > Archive
```

## 📊 METADATA POUR LES STORES

### Play Store
```json
{
  "title": "ELAÏA Studio - Pilates Genève",
  "shortDescription": "Réservez vos cours de Pilates",
  "fullDescription": "ELAÏA Studio est votre partenaire bien-être...",
  "category": "Santé et remise en forme",
  "contentRating": "Tout public",
  "price": "Gratuit",
  "inAppPurchases": true
}
```

### App Store
```json
{
  "name": "ELAÏA Studio",
  "subtitle": "Pilates & Bien-être",
  "categories": ["Health & Fitness", "Lifestyle"],
  "keywords": "pilates,geneve,fitness,wellness,sport",
  "ageRating": "4+",
  "price": "Free"
}
```

## 📸 SCREENSHOTS REQUIS

### Android (Play Store)
- Minimum 2, maximum 8
- 1080x1920px ou 1920x1080px
- Format: JPEG ou PNG

### iOS (App Store)
- 5.5" : 1242x2208px
- 6.5" : 1242x2688px
- iPad : 2048x2732px

## ⚙️ VARIABLES D'ENVIRONNEMENT

Créer `client/.env.production`:
```env
VITE_API_URL=https://api.elaiastudio.ch
VITE_SUPABASE_URL=https://jtazaosrsymffhxmwfyo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 🔐 SÉCURITÉ

1. **Obfusquer le code**
```bash
npm install --save-dev javascript-obfuscator
```

2. **Certificate Pinning** (optionnel)
```bash
npm install @capacitor/https
```

3. **Stockage sécurisé**
```bash
npm install @capacitor/secure-storage
```

## 📅 TIMELINE DE DÉPLOIEMENT

### Semaine 1
- ✅ Corriger bugs critiques
- ✅ Tester sur appareils réels
- ✅ Préparer assets (icônes, screenshots)

### Semaine 2
- 📱 Build Android & iOS
- 📝 Soumettre sur Play Store (2-3h validation)
- 📝 Soumettre sur App Store (24-48h validation)

### Semaine 3
- 🚀 Publication
- 📊 Monitoring & corrections

## 💰 COÛTS

- **Google Play**: 25$ (une fois)
- **Apple Store**: 99$/an
- **Total première année**: ~125$
- **Années suivantes**: 99$/an

## 🎯 CHECKLIST FINALE

- [ ] App testée sur Android & iOS
- [ ] Icônes & splash screens créés
- [ ] Screenshots pris
- [ ] Descriptions rédigées
- [ ] Politique de confidentialité
- [ ] Conditions d'utilisation
- [ ] Compte développeur créé
- [ ] Build de production généré
- [ ] Formulaires stores remplis
- [ ] App soumise pour validation

## 🆘 SUPPORT

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
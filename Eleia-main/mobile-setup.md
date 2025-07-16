# 📱 Guide de création de l'application mobile Elaïa Studio

## Option 1: Progressive Web App (PWA) - Recommandé pour commencer

### ✅ Déjà configuré :
- `manifest.json` pour l'installation
- Service Worker pour le mode hors ligne

### 📋 Étapes suivantes :

1. **Ajouter le manifest dans index.html** :
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#D6B88F">
```

2. **Créer les icônes** (192x192 et 512x512 pixels)

3. **Enregistrer le service worker** dans `main.tsx` :
```typescript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js');
  });
}
```

4. **Tester sur mobile** :
- Ouvrir https://votre-domaine.com sur Chrome mobile
- Menu → "Ajouter à l'écran d'accueil"

## Option 2: React Native avec Expo

### 🚀 Installation :

```bash
# Installer Expo CLI
npm install -g expo-cli

# Créer le projet
npx create-expo-app elaia-studio-mobile --template typescript

# Naviguer dans le projet
cd elaia-studio-mobile

# Installer les dépendances nécessaires
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install axios react-hook-form
npm install @tanstack/react-query
npm install react-native-async-storage/async-storage
```

### 📁 Structure suggérée :

```
elaia-studio-mobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ScheduleScreen.tsx
│   │   ├── BookingsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── ClassCard.tsx
│   │   └── BookingCard.tsx
│   ├── services/
│   │   └── api.ts (réutiliser depuis l'app web)
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── store/
│       └── authStore.ts (adapter pour React Native)
```

### 🎨 Exemple de composant React Native :

```typescript
// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenue chez Elaïa</Text>
        <Text style={styles.subtitle}>
          Votre studio de Pilates Reformer
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Schedule')}
      >
        <Text style={styles.buttonText}>Voir le planning</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // elaia-beige
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3F3F3F', // elaia-gray
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6A7352', // elaia-green
  },
  button: {
    backgroundColor: '#D6B88F', // elaia-gold
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

## Option 3: Capacitor (Hybride)

### 🔧 Installation :

```bash
# Dans le dossier client
npm install @capacitor/core @capacitor/cli
npx cap init "Elaia Studio" "ch.elaiastudio.app"

# Ajouter les plateformes
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# Construire l'app web
npm run build

# Synchroniser avec les plateformes natives
npx cap sync

# Ouvrir dans Xcode (iOS)
npx cap open ios

# Ouvrir dans Android Studio
npx cap open android
```

## 📱 Fonctionnalités mobiles spécifiques

### Notifications Push :
```bash
npm install @capacitor/push-notifications
```

### Géolocalisation :
```bash
npm install @capacitor/geolocation
```

### Calendrier natif :
```bash
npm install @capacitor/calendar
```

## 🚀 Déploiement

### PWA :
- Déployer sur votre serveur web avec HTTPS
- Les utilisateurs peuvent installer depuis le navigateur

### App Stores :
1. **Apple App Store** :
   - Compte développeur Apple (99$/an)
   - Xcode pour compiler
   - Processus de review (~1 semaine)

2. **Google Play Store** :
   - Compte développeur Google (25$ une fois)
   - Android Studio pour compiler
   - Review plus rapide (~2-3 jours)

## 💡 Recommandations

1. **Commencer par PWA** pour tester rapidement
2. **Passer à React Native** pour une vraie app native
3. **Utiliser Expo** pour simplifier le développement
4. **Réutiliser** le maximum de code de l'app web
5. **Tester** sur de vrais appareils

## 🎯 Prochaines étapes

1. Choisir l'approche (PWA recommandé pour débuter)
2. Configurer l'environnement de développement
3. Adapter l'interface pour mobile
4. Implémenter les fonctionnalités natives
5. Tester et déployer 
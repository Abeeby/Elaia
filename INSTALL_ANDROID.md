# 📱 Installation Android Studio pour ELAÏA

## ✅ Solution la plus simple : Android Studio

Android Studio installe automatiquement tout ce dont vous avez besoin :
- Android SDK
- Émulateur Android
- Outils de build

### 📥 Étapes d'installation (5-10 minutes)

1. **[Téléchargez Android Studio](https://developer.android.com/studio)** (environ 1GB)

2. **Lancez l'installateur**
   - Acceptez les paramètres par défaut
   - IMPORTANT : Cochez ✅ "Android Virtual Device"

3. **Premier lancement**
   - Android Studio va télécharger les composants (~2GB)
   - Attendez que tout soit installé

4. **Ouvrez votre projet ELAÏA**
   ```bash
   cd C:\Users\AminT\Elaia\client
   npx cap open android
   ```

5. **Lancez l'app**
   - Attendez que le projet se charge
   - Cliquez sur le bouton vert ▶️ "Run"
   - Choisissez votre appareil ou créez un émulateur

## 🎯 Alternative rapide : APK Direct

Si vous voulez juste tester sur votre téléphone sans installer Android Studio, je peux :
1. Configurer un build automatique sur GitHub
2. Vous fournir un APK pré-compilé

## 📱 Pour tester sur votre téléphone physique

1. Sur votre téléphone Android :
   - Paramètres → À propos → Tapez 7 fois sur "Numéro de build"
   - Paramètres → Options développeur → Activer "Débogage USB"

2. Connectez votre téléphone par USB

3. Android Studio le détectera automatiquement

## ⏰ Temps estimé

- Téléchargement : 5-10 min (selon connexion)
- Installation : 5 min
- Premier lancement : 5-10 min
- **Total : ~20 minutes**

## 🚀 Que faire maintenant ?

1. **Installez Android Studio** (recommandé pour le développement)
2. **OU** dites-moi si vous préférez un APK pré-compilé pour tester rapidement

---

💡 **Note** : Une fois Android Studio installé, vous pourrez compiler et tester l'app mobile facilement !

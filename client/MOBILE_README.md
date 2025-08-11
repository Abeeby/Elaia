# 📱 ELAÏA Studio - Application Mobile

## ✅ Installation effectuée !

L'application mobile est maintenant configurée dans votre projet. Voici comment la lancer et la déployer.

## 🚀 Lancer l'app sur Android

### Option 1 : Via Android Studio (Recommandé)
```bash
# Ouvrir le projet dans Android Studio
npx cap open android

# Android Studio va s'ouvrir
# 1. Attendez que Gradle se synchronise
# 2. Connectez votre téléphone Android (mode développeur activé)
# 3. Cliquez sur "Run" (bouton vert ▶️)
```

### Option 2 : En ligne de commande
```bash
# Construire l'APK de debug
cd android
./gradlew assembleDebug

# L'APK sera dans : android/app/build/outputs/apk/debug/app-debug.apk
# Transférez-le sur votre téléphone pour l'installer
```

## 📲 Lancer l'app sur iOS (Mac requis)

```bash
# Installer les pods iOS
npx cap sync ios

# Ouvrir dans Xcode
npx cap open ios

# Dans Xcode :
# 1. Sélectionnez votre iPhone ou un simulateur
# 2. Cliquez sur "Run" (bouton ▶️)
```

## 🔄 Workflow de développement

Chaque fois que vous modifiez le code React :

```bash
# 1. Reconstruire l'app web
npm run build

# 2. Synchroniser avec les plateformes natives
npx cap sync

# 3. Relancer sur votre appareil
npx cap run android
# ou
npx cap run ios
```

## 🔥 Mode Live Reload (Développement)

Pour tester en temps réel sur votre téléphone :

```bash
# 1. Lancez le serveur de dev
npm run dev

# 2. Trouvez votre IP locale (ex: 192.168.1.100)
ipconfig

# 3. Modifiez capacitor.config.ts temporairement :
# server: { url: "http://192.168.1.100:5173" }

# 4. Synchronisez et lancez
npx cap sync
npx cap run android --livereload --external
```

## 📦 Build de production

### Android (APK/AAB)
```bash
# Build APK signé
cd android
./gradlew assembleRelease

# Build AAB pour Play Store
./gradlew bundleRelease
# Fichier : android/app/build/outputs/bundle/release/app-release.aab
```

### iOS (IPA)
```bash
# Dans Xcode :
# 1. Product > Scheme > Edit Scheme > Release
# 2. Product > Archive
# 3. Distribute App > App Store Connect
```

## 🏪 Publication sur les stores

### Play Store
1. Créez un compte développeur Google Play (25$ une fois)
2. Créez une nouvelle app dans la console
3. Uploadez le fichier `.aab`
4. Remplissez les informations requises
5. Soumettez pour validation (2-3h)

### App Store
1. Créez un compte Apple Developer (99$/an)
2. Créez une App ID dans Apple Developer
3. Créez l'app dans App Store Connect
4. Uploadez via Xcode ou Transporter
5. Soumettez pour validation (24-48h)

## 🎨 Personnalisation

### Changer l'icône
Placez votre icône (1024x1024) dans `resources/icon.png` puis :
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --iconOnly
```

### Changer le splash screen
Placez votre splash (2732x2732) dans `resources/splash.png` puis :
```bash
npx capacitor-assets generate --splashOnly
```

### Changer les couleurs
Éditez `android/app/src/main/res/values/colors.xml`

## 🐛 Debugging

### Android
```bash
# Voir les logs
adb logcat

# Dans Chrome : chrome://inspect
```

### iOS
```bash
# Dans Safari : Développement > [Votre iPhone]
```

## 📋 Checklist avant publication

- [ ] Icône de l'app (toutes tailles)
- [ ] Splash screen
- [ ] Version et build number mis à jour
- [ ] API URL de production configurée
- [ ] Mode debug désactivé
- [ ] App signée correctement
- [ ] Screenshots pour les stores
- [ ] Description et metadata
- [ ] Politique de confidentialité
- [ ] Test sur appareil réel

## 🆘 Problèmes courants

### "Gradle sync failed"
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### "Pod install failed" (iOS)
```bash
cd ios/App
pod repo update
pod install
```

### L'app crash au démarrage
- Vérifiez les permissions dans AndroidManifest.xml
- Vérifiez que l'API URL est correcte
- Regardez les logs : `adb logcat | grep -i capacitor`

## 📞 Support

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Forum Ionic](https://forum.ionicframework.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)

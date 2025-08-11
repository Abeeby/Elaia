# 📱 Génération des icônes et splash screens Android

## Icônes requises

Placez vos icônes dans `client/android/app/src/main/res/` :

### Icônes d'application
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Icônes rondes (Android 7+)
- `mipmap-hdpi/ic_launcher_round.png` (72x72)
- `mipmap-mdpi/ic_launcher_round.png` (48x48)
- `mipmap-xhdpi/ic_launcher_round.png` (96x96)
- `mipmap-xxhdpi/ic_launcher_round.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher_round.png` (192x192)

### Splash Screen
- `drawable/splash.png` (2732x2732)
- `drawable-land-hdpi/splash.png` (800x480)
- `drawable-land-mdpi/splash.png` (480x320)
- `drawable-land-xhdpi/splash.png` (1280x720)
- `drawable-land-xxhdpi/splash.png` (1600x960)
- `drawable-land-xxxhdpi/splash.png` (1920x1280)
- `drawable-port-hdpi/splash.png` (480x800)
- `drawable-port-mdpi/splash.png` (320x480)
- `drawable-port-xhdpi/splash.png` (720x1280)
- `drawable-port-xxhdpi/splash.png` (960x1600)
- `drawable-port-xxxhdpi/splash.png` (1280x1920)

## Génération automatique avec Capacitor Assets

```bash
# Installer l'outil
npm install -g @capacitor/assets

# Créer un dossier resources
mkdir resources

# Placer votre logo source (1024x1024) dans resources/icon.png
# Placer votre splash source (2732x2732) dans resources/splash.png

# Générer toutes les ressources
npx capacitor-assets generate
```

## Couleurs du thème

Éditez `client/android/app/src/main/res/values/colors.xml` :

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#6B46C1</color>
    <color name="colorPrimaryDark">#5A3A9F</color>
    <color name="colorAccent">#D6B88F</color>
    <color name="splashBackground">#F5F3F0</color>
</resources>
```

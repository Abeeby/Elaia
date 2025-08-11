# 🔧 Installation de Java pour Android

## ❌ Problème détecté
Vous avez Java 8, mais Android nécessite Java 11 minimum (Java 17 recommandé).

## ✅ Solution rapide

### Option 1 : Télécharger Java 17 (Recommandé)

1. **Téléchargez Java 17** depuis l'un de ces liens :
   - [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#jdk17-windows)
   - [OpenJDK 17 (Gratuit)](https://adoptium.net/temurin/releases/?version=17)

2. **Installez Java 17**
   - Lancez l'installateur
   - Suivez les instructions
   - Cochez "Set JAVA_HOME variable"

3. **Vérifiez l'installation**
   ```bash
   java -version
   # Devrait afficher : java version "17.x.x"
   ```

### Option 2 : Utiliser Chocolatey (si installé)
```bash
choco install openjdk17
```

### Option 3 : Configuration manuelle du PATH

Si vous avez déjà Java 11+ installé ailleurs :

1. Trouvez où Java est installé (ex: `C:\Program Files\Java\jdk-17`)
2. Ajoutez au PATH système :
   - Windows + Pause → Paramètres système avancés
   - Variables d'environnement
   - Nouvelle variable système :
     - Nom : `JAVA_HOME`
     - Valeur : `C:\Program Files\Java\jdk-17`
   - Modifiez PATH, ajoutez : `%JAVA_HOME%\bin`

## 🚀 Après installation

```bash
# Vérifier la version
java -version

# Retourner dans le dossier Android
cd C:\Users\AminT\Elaia\client\android

# Nettoyer le cache Gradle
./gradlew clean

# Relancer le build
./gradlew assembleDebug
```

## 📱 Alternative : Sans installer Java

Si vous ne voulez pas installer Java, utilisez Android Studio qui inclut tout :

1. [Téléchargez Android Studio](https://developer.android.com/studio)
2. Installez (cochez "Android Virtual Device")
3. Ouvrez votre projet :
   ```bash
   cd C:\Users\AminT\Elaia\client
   npx cap open android
   ```
4. Android Studio utilisera son propre Java

## 🎯 Solution temporaire (pour tester rapidement)

Je peux aussi créer un APK pré-compilé que vous pourrez installer directement sur votre téléphone sans avoir besoin de Java. Voulez-vous cette option ?

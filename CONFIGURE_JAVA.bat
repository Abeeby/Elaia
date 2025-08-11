@echo off
echo ====================================
echo Configuration de Java 17 pour ELAIA
echo ====================================
echo.

REM Définir le chemin vers votre JDK 17
set JAVA_PATH=C:\jdk-17.0.16+8

echo Verification du dossier Java...
if exist "%JAVA_PATH%\bin\java.exe" (
    echo ✓ Java trouvé dans %JAVA_PATH%
) else (
    echo ✗ ERREUR: Java non trouvé dans %JAVA_PATH%
    echo.
    echo Vérifiez que vous avez bien extrait OpenJDK dans C:\
    echo Le dossier devrait s'appeler "jdk-17.0.16+8"
    pause
    exit /b 1
)

echo.
echo Configuration des variables d'environnement...

REM Configurer JAVA_HOME pour cette session
setx JAVA_HOME "%JAVA_PATH%"

REM Ajouter Java au PATH
setx PATH "%JAVA_PATH%\bin;%PATH%"

echo.
echo ====================================
echo Configuration terminée !
echo ====================================
echo.
echo Fermez et rouvrez PowerShell, puis testez avec:
echo   java -version
echo.
pause

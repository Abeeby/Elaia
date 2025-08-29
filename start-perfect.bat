@echo off
echo ========================================
echo 🚀 Démarrage d'ELAÏA Studio - Version Parfaite
echo ========================================
echo.

REM Vérification des fichiers .env
echo 🔍 Vérification des configurations...
if not exist "server\.env" (
    echo ❌ ERREUR : server/.env manquant
    echo Copiez server/env.example vers server/.env
    pause
    exit /b 1
) else (
    echo ✅ Serveur : .env trouvé
)

if not exist "client\.env" (
    echo ❌ ERREUR : client/.env manquant
    echo Copiez client/env.example vers client/.env
    pause
    exit /b 1
) else (
    echo ✅ Client : .env trouvé
)

echo.
echo 👨‍💻 Démarrage du serveur...
echo Port : 5001 ^| Base : Supabase
start "Serveur ELAÏA" cmd /k "cd server && npm run dev:supabase"

timeout /t 3 /nobreak > nul

echo.
echo 🎨 Démarrage du client...
echo Port : 5173 ^| Framework : React + Vite
start "Client ELAÏA" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo ✅ APPLICATION DÉMARRÉE AVEC SUCCÈS !
echo ========================================
echo.
echo 👋 URLs d'accès :
echo   🌐 Client : http://localhost:5173
echo   🚀 API : http://localhost:5001/api
echo   🗄️ Supabase : https://app.supabase.com
echo.
echo 🔐 Comptes de test :
echo   👤 Client : test@elaia-studio.ch / Test123!
echo   👨‍💼 Admin : admin@elaia-studio.ch / Admin123!
echo.
echo ⏹️ Ctrl+C dans chaque fenêtre pour arrêter
echo.
echo 🎉 BONNE DÉCOUVERTE D'ELAÏA STUDIO !
echo.
pause

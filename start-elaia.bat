@echo off
echo ===================================
echo   ELAIA Studio - Demarrage
echo ===================================
echo.

echo Verification des fichiers .env...
if not exist "server\.env" (
    echo ERREUR: server\.env manquant!
    echo Copiez server\.env-supabase-example vers server\.env
    pause
    exit /b 1
)

if not exist "client\.env" (
    echo ERREUR: client\.env manquant!
    echo Copiez client\.env-supabase-example vers client\.env
    pause
    exit /b 1
)

echo.
echo Demarrage du backend (port 5001)...
start "ELAIA Backend" cmd /k "cd server && npm run dev:supabase"

timeout /t 3 /nobreak > nul

echo Demarrage du frontend (port 5173)...
start "ELAIA Frontend" cmd /k "cd client && npm run dev"

echo.
echo ===================================
echo   ELAIA Studio demarre !
echo ===================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5001/api
echo Supabase: https://app.supabase.com
echo.
echo Fermez cette fenetre pour continuer...
pause > nul 
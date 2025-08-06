@echo off
echo =======================================
echo    ELAIA STUDIO - DEMARRAGE DEV
echo =======================================
echo.

echo Demarrage du serveur backend...
start "ELAIA Backend" cmd /k "cd server && npm run dev"

timeout /t 3 > nul

echo Demarrage du client frontend...
start "ELAIA Frontend" cmd /k "cd client && npm run dev"

echo.
echo Les deux serveurs sont en cours de demarrage...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul

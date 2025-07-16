# Script de demarrage ELAIA Studio avec Supabase
Write-Host "Demarrage d'ELAIA Studio avec Supabase..." -ForegroundColor Cyan

# Verifier si les fichiers .env existent
$serverEnvPath = "./server/.env"
$clientEnvPath = "./client/.env"

if (-not (Test-Path $serverEnvPath)) {
    Write-Host "ERREUR: Fichier server/.env manquant !" -ForegroundColor Red
    Write-Host "Creez-le en copiant server/.env-supabase-example" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $clientEnvPath)) {
    Write-Host "ERREUR: Fichier client/.env manquant !" -ForegroundColor Red
    Write-Host "Creez-le en copiant client/.env-supabase-example" -ForegroundColor Yellow
    exit 1
}

# Demarrer le serveur backend
Write-Host ""
Write-Host "Demarrage du serveur backend avec Supabase (port 5001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev:supabase"

# Attendre un peu
Start-Sleep -Seconds 3

# Demarrer le client frontend  
Write-Host "Demarrage du client frontend (port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

# Afficher les informations
Write-Host ""
Write-Host "ELAIA Studio est en cours d'execution !" -ForegroundColor Green
Write-Host "Frontend : http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API : http://localhost:5001/api" -ForegroundColor Cyan
Write-Host "Supabase Dashboard : https://app.supabase.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Conseil : Verifiez vos cles Supabase dans les fichiers .env" -ForegroundColor Yellow
Write-Host "Documentation : voir GUIDE_SUPABASE_INTEGRATION.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter..." -ForegroundColor Gray

# Garder le script actif
while ($true) {
    Start-Sleep -Seconds 60
} 
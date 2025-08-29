# Script de démarrage simple ELAÏA Studio
Write-Host "🚀 Démarrage simple d'ELAÏA Studio..." -ForegroundColor Cyan

# Vérifier si les fichiers .env existent
$serverEnvPath = "./server/.env"
$clientEnvPath = "./client/.env"

if (-not (Test-Path $serverEnvPath)) {
    Write-Host "❌ Fichier server/.env manquant !" -ForegroundColor Red
    Write-Host "📝 Créez-le avec vos clés Supabase" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $clientEnvPath)) {
    Write-Host "❌ Fichier client/.env manquant !" -ForegroundColor Red
    Write-Host "📝 Créez-le avec vos clés Supabase" -ForegroundColor Yellow
    exit 1
}

# Démarrer le serveur backend
Write-Host "`n📦 Démarrage du serveur backend..." -ForegroundColor Green
Set-Location server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:supabase"

# Revenir au répertoire racine
Set-Location ..

# Attendre un peu
Start-Sleep -Seconds 3

# Démarrer le client frontend
Write-Host "🎨 Démarrage du client frontend..." -ForegroundColor Green
Set-Location client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# Revenir au répertoire racine
Set-Location ..

# Afficher les informations
Write-Host "`n✅ ELAÏA Studio est en cours d'exécution !" -ForegroundColor Green
Write-Host "📍 Frontend : http://localhost:5173" -ForegroundColor Cyan
Write-Host "📍 Backend API : http://localhost:5001/api" -ForegroundColor Cyan
Write-Host "`n💡 Appuyez sur Ctrl+C dans chaque fenetre pour arreter" -ForegroundColor Yellow

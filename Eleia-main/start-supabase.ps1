# Script de démarrage ELAÏA Studio avec Supabase
Write-Host "🚀 Démarrage d'ELAÏA Studio avec Supabase..." -ForegroundColor Cyan

# Vérifier si les fichiers .env existent
$serverEnvPath = "./server/.env"
$clientEnvPath = "./client/.env"

if (-not (Test-Path $serverEnvPath)) {
    Write-Host "❌ Fichier server/.env manquant !" -ForegroundColor Red
    Write-Host "📝 Créez-le en copiant server/.env-supabase-example" -ForegroundColor Yellow
    Write-Host "Commande : cp server/.env-supabase-example server/.env" -ForegroundColor Gray
    exit 1
}

if (-not (Test-Path $clientEnvPath)) {
    Write-Host "❌ Fichier client/.env manquant !" -ForegroundColor Red
    Write-Host "📝 Créez-le en copiant client/.env-supabase-example" -ForegroundColor Yellow
    Write-Host "Commande : cp client/.env-supabase-example client/.env" -ForegroundColor Gray
    exit 1
}

# Démarrer le serveur backend avec Supabase
Write-Host "`n📦 Démarrage du serveur backend avec Supabase sur le port 5001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev:supabase"

# Attendre un peu pour que le serveur démarre
Start-Sleep -Seconds 3

# Démarrer le client frontend
Write-Host "🎨 Démarrage du client frontend sur le port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

# Afficher les informations
Write-Host "`n✅ ELAÏA Studio est en cours d'exécution !" -ForegroundColor Green
Write-Host "📍 Frontend : http://localhost:5173" -ForegroundColor Cyan
Write-Host "📍 Backend API : http://localhost:5001/api" -ForegroundColor Cyan
Write-Host "📍 Supabase Dashboard : https://app.supabase.com" -ForegroundColor Cyan
Write-Host "`n💡 Conseil : Vérifiez vos clés Supabase dans les fichiers .env" -ForegroundColor Yellow
Write-Host "📚 Documentation : voir GUIDE_SUPABASE_INTEGRATION.md" -ForegroundColor Gray
Write-Host "`nAppuyez sur Ctrl+C pour arrêter..." -ForegroundColor Gray

# Garder le script actif
while ($true) {
    Start-Sleep -Seconds 60
} 
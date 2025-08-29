# Script de démarrage manuel ELAÏA Studio
Write-Host "🚀 Démarrage manuel d'ELAÏA Studio..." -ForegroundColor Cyan

# Vérifier si les fichiers .env existent
$serverEnvPath = "./server/.env"
$clientEnvPath = "./client/.env"

if (-not (Test-Path $serverEnvPath)) {
    Write-Host "❌ Fichier server/.env manquant !" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $clientEnvPath)) {
    Write-Host "❌ Fichier client/.env manquant !" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Fichiers de configuration trouvés" -ForegroundColor Green
Write-Host "`n📋 Instructions manuelles :" -ForegroundColor Yellow
Write-Host "1. Ouvrez un premier terminal PowerShell" -ForegroundColor White
Write-Host "2. Tapez : cd server" -ForegroundColor White
Write-Host "3. Tapez : npm run dev:supabase" -ForegroundColor White
Write-Host "4. Ouvrez un deuxième terminal PowerShell" -ForegroundColor White
Write-Host "5. Tapez : cd client" -ForegroundColor White
Write-Host "6. Tapez : npm run dev" -ForegroundColor White

Write-Host "`n🔗 URLs après démarrage :" -ForegroundColor Cyan
Write-Host "Frontend : http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend : http://localhost:5001/api" -ForegroundColor Cyan

Write-Host "`n⏹️ Pour arrêter : Ctrl+C dans chaque terminal" -ForegroundColor Yellow

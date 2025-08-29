# Script de démarrage parfait pour ELAÏA Studio
Write-Host "ðŸš€ DÃ©marrage d'ELAÃA Studio - Version Parfaite..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Yellow

# VÃ©rification des fichiers .env
Write-Host "`nðŸ”Ž VÃ©rification des configurations..." -ForegroundColor Blue

$serverEnv = "server/.env"
$clientEnv = "client/.env"

if (-not (Test-Path $serverEnv)) {
    Write-Host "âš ï¸� ERREUR : $serverEnv manquant" -ForegroundColor Red
    Write-Host "Copiez server/env.example vers server/.env" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "âœ… Serveur : $serverEnv trouvÃ©" -ForegroundColor Green
}

if (-not (Test-Path $clientEnv)) {
    Write-Host "âš ï¸� ERREUR : $clientEnv manquant" -ForegroundColor Red
    Write-Host "Copiez client/env.example vers client/.env" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "âœ… Client : $clientEnv trouvÃ©" -ForegroundColor Green
}

# DÃ©marrage du serveur
Write-Host "`nðŸ‘¨â€�'ðŸ’» DÃ©marrage du serveur..." -ForegroundColor Magenta
Write-Host "Port : 5001 | Base : Supabase" -ForegroundColor Gray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev:supabase" -WorkingDirectory $PSScriptRoot

Start-Sleep -Seconds 2

# DÃ©marrage du client
Write-Host "`nðŸŽ¨ DÃ©marrage du client..." -ForegroundColor Magenta
Write-Host "Port : 5173 | Framework : React + Vite" -ForegroundColor Gray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WorkingDirectory $PSScriptRoot

# Informations finales
Write-Host "`nâœ… APPLICATION DÃ‰MARRÃ‰E AVEC SUCCÃˆS !" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Yellow
Write-Host "ðŸ‘Š URLs d'accÃ¨s :" -ForegroundColor Cyan
Write-Host "  ðŸ’� Client : http://localhost:5173" -ForegroundColor White
Write-Host "  ðŸš€ API : http://localhost:5001/api" -ForegroundColor White
Write-Host "  ðŸ’‹ Supabase : https://app.supabase.com" -ForegroundColor White
Write-Host "`nðŸš« Comptes de test :" -ForegroundColor Yellow
Write-Host "  ðŸ‘© Client : test@elaia-studio.ch / Test123!" -ForegroundColor White
Write-Host "  ðŸ‘¨â€� Admin : admin@elaia-studio.ch / Admin123!" -ForegroundColor White
Write-Host "`nâŒˆ Ctrl+C dans chaque fenÃªtre pour arrÃªter" -ForegroundColor Gray

Write-Host "`nðŸŽ‰ BONNE DÃ‰COUVERTE D'ELAÃA STUDIO !" -ForegroundColor Green

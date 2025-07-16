# Script de démarrage pour ELAÏA Studio
Write-Host "🚀 Démarrage d'ELAÏA Studio..." -ForegroundColor Cyan

# Démarrer le serveur backend sur le port 5001
Write-Host "`n📦 Démarrage du serveur backend sur le port 5001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; `$env:PORT='5001'; npm run dev"

# Attendre un peu pour que le serveur démarre
Start-Sleep -Seconds 3

# Démarrer le client frontend
Write-Host "`n🎨 Démarrage du client frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "`n✅ Les services sont en cours de démarrage!" -ForegroundColor Green
Write-Host "`n📍 URLs:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:5173/" -ForegroundColor White
Write-Host "   - Backend API: http://localhost:5001/api" -ForegroundColor White
Write-Host "`n👤 Comptes de démonstration:" -ForegroundColor Magenta
Write-Host "   - Admin: admin@elaiastudio.ch / admin123" -ForegroundColor White
Write-Host "   - Client: marie.dupont@email.com / client123" -ForegroundColor White

Write-Host "`n🛑 Pour arrêter les services, fermez les fenêtres PowerShell" -ForegroundColor Red 
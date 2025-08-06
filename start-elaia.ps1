# Script PowerShell pour lancer Elaia Studio
# Usage: .\start-elaia.ps1

Write-Host "🌟 === ELAIA STUDIO - DEMARRAGE ===" -ForegroundColor Green
Write-Host ""

# Vérifier si nous sommes dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé" -ForegroundColor Red
    Write-Host "Assurez-vous d'être dans le dossier elaia-app" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Vérification des dépendances..." -ForegroundColor Cyan

# Installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installation des dépendances..." -ForegroundColor Yellow
    npm run install:all
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dépendances OK" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Lancement de l'application..." -ForegroundColor Cyan
Write-Host "   - Serveur backend: http://localhost:5000" -ForegroundColor Gray
Write-Host "   - Client frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host ""

Write-Host "🔐 Comptes de test:" -ForegroundColor Yellow
Write-Host "   Admin: admin@elaiastudio.ch / admin123" -ForegroundColor Gray
Write-Host "   Client: marie.dupont@email.com / client123" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Pour tester les crédits dans un autre terminal:" -ForegroundColor Yellow
Write-Host "   node test-credits.js" -ForegroundColor Gray
Write-Host ""

Write-Host "⏱️  Démarrage en cours..." -ForegroundColor Cyan
Write-Host "   (Appuyez sur Ctrl+C pour arrêter)" -ForegroundColor Gray
Write-Host ""

# Lancer l'application
npm run dev 
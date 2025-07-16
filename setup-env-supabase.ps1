# Script de configuration des fichiers .env pour ELAÏA Studio avec Supabase
Write-Host "🔧 Configuration des fichiers .env pour ELAÏA Studio..." -ForegroundColor Cyan

# Configuration Frontend
$clientEnvContent = @"
# ELAÏA Studio Frontend - Configuration
VITE_API_URL=http://localhost:5001/api

# Configuration Supabase
VITE_SUPABASE_URL=https://tgwrpvxexwnohptafosx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnd3JwdnhleHdub2hwdGFmb3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjI4NzksImV4cCI6MjA2NjY5ODg3OX0.Op_TvU_22FZ-ZDcPL6pRiPCpezUgWTTY9hQJVFjCPFw
"@

# Configuration Backend avec la clé service_role
$serverEnvContent = @"
# Environment
NODE_ENV=development

# Server
PORT=5001

# JWT Secret - Clé générée automatiquement
JWT_SECRET=elaia-studio-secret-key-$(Get-Random -Minimum 1000000 -Maximum 9999999)

# Supabase Configuration
SUPABASE_URL=https://tgwrpvxexwnohptafosx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnd3JwdnhleHdub2hwdGFmb3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjI4NzksImV4cCI6MjA2NjY5ODg3OX0.Op_TvU_22FZ-ZDcPL6pRiPCpezUgWTTY9hQJVFjCPFw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnd3JwdnhleHdub2hwdGFmb3N4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEyMjg3OSwiZXhwIjoyMDY2Njk4ODc5fQ.8fRDr02kx90-9H-2_iPmd7Bu8F-lHg3wmv5fOSTxErQ

# Email Service (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
"@

# Créer les fichiers .env
try {
    # Frontend .env
    $clientEnvContent | Out-File -FilePath "client\.env" -Encoding UTF8
    Write-Host "✅ Fichier client/.env créé" -ForegroundColor Green
    
    # Backend .env
    $serverEnvContent | Out-File -FilePath "server\.env" -Encoding UTF8
    Write-Host "✅ Fichier server/.env créé avec la clé service_role" -ForegroundColor Green
    
    Write-Host "`n✅ Configuration terminée !" -ForegroundColor Green
    Write-Host "`n📍 Votre projet Supabase :" -ForegroundColor Cyan
    Write-Host "   URL: https://tgwrpvxexwnohptafosx.supabase.co" -ForegroundColor Gray
    Write-Host "   Dashboard: https://supabase.com/dashboard/project/tgwrpvxexwnohptafosx" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Erreur lors de la création des fichiers : $_" -ForegroundColor Red
} 
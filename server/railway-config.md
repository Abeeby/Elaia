# 🚄 Configuration Railway PostgreSQL pour Elaïa Studio

## 📋 Étapes de configuration

### 1. Dans Railway Dashboard
1. Cliquez sur votre projet PostgreSQL
2. Allez dans l'onglet **"Variables"** ou **"Connect"**
3. Copiez ces informations :

```
PGHOST=containers-us-west-xxx.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=xxxxxxxxxx
PGDATABASE=railway
```

### 2. Créer le fichier .env
Créez un fichier `.env` dans le dossier `server/` avec :

```env
# Database Railway
DATABASE_URL=postgresql://postgres:VOTRE_PASSWORD@VOTRE_HOST:5432/railway
PGHOST=containers-us-west-xxx.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=votre-password-railway
PGDATABASE=railway

# JWT Secret
JWT_SECRET=elaia-studio-secret-2024-super-secure

# Environment
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### 3. Installation des dépendances PostgreSQL
```bash
npm install pg @types/pg
```

### 4. Test de connexion
Le serveur se connectera automatiquement à Railway au démarrage.

## 🔄 Migration depuis SQLite
Toutes vos données actuelles seront recréées automatiquement dans PostgreSQL.

## ✅ Avantages Railway
- 🆓 500MB gratuit (largement suffisant)
- ⚡ Connexions rapides depuis l'Europe
- 🔒 SSL/TLS automatique
- 📊 Monitoring intégré
- 💾 Backups automatiques 
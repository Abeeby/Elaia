# 🚀 Démarrage Rapide - ELAÏA Studio avec Supabase

## ✅ Étape 1 : Configuration des clés

J'ai préparé vos fichiers avec votre clé publique Supabase !

**Exécutez ce script PowerShell pour créer les fichiers .env :**
```powershell
.\setup-env-supabase.ps1
```

## ⚠️ Étape 2 : Récupérer votre Service Role Key

1. Allez sur : https://supabase.com/dashboard/project/tgwrpvxexwnohptafosx/settings/api
2. Dans la section **Project API keys**, trouvez **service_role (secret)**
3. Cliquez sur **Reveal** et copiez la clé
4. Ajoutez-la dans `server/.env` à la ligne `SUPABASE_SERVICE_ROLE_KEY=`

## 📊 Étape 3 : Créer les tables dans Supabase

1. Allez sur : https://supabase.com/dashboard/project/tgwrpvxexwnohptafosx/sql/new
2. Copiez-collez le contenu de `server/supabase/schema-elaia.sql`
3. Cliquez sur **Run**

## 🔐 Étape 4 : Configurer l'authentification

Dans votre dashboard Supabase :
1. **Authentication > Providers** : Vérifiez que Email est activé
2. **Authentication > Email Templates** : Personnalisez si besoin
3. **Authentication > URL Configuration** : 
   - Site URL : `http://localhost:5173`
   - Redirect URLs : `http://localhost:5173/*`

## 🚀 Étape 5 : Démarrer l'application

```powershell
# Initialiser les données de démonstration
cd server
npm run init-supabase

# Démarrer l'application
cd ..
.\start-supabase.ps1
```

## 📝 Comptes de démonstration

Une fois les données initialisées :
- **Admin** : admin@elaiastudio.ch / admin123
- **Client** : marie.dupont@email.com / client123

## 🔗 URLs importantes

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5001/api
- **Supabase Dashboard** : https://supabase.com/dashboard/project/tgwrpvxexwnohptafosx
- **Supabase API** : https://tgwrpvxexwnohptafosx.supabase.co

## 🆘 Dépannage

### Erreur CORS
Dans Supabase Dashboard > Authentication > URL Configuration, ajoutez :
- `http://localhost:5173`
- `http://localhost:5001`

### Erreur de connexion à la base de données
Vérifiez que votre `SUPABASE_SERVICE_ROLE_KEY` est correcte dans `server/.env`

### Tables non créées
Assurez-vous d'avoir exécuté le script SQL dans Supabase SQL Editor

## 🎉 Prochaines étapes

1. **Tester l'authentification** : Créez un compte depuis la page d'inscription
2. **Explorer le dashboard** : Voyez vos données dans Supabase
3. **Activer RLS** : Pour sécuriser vos données en production
4. **Configurer les emails** : Pour les notifications automatiques

Votre projet ELAÏA Studio est maintenant connecté à Supabase ! 🚀 
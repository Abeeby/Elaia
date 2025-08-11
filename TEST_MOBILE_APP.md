# 📱 GUIDE DE TEST - APP MOBILE ELAÏA STUDIO

## 🚀 Lancement de l'app

### Sur Android Studio
1. Attendez la synchronisation (barre de progression)
2. Cliquez sur Run ▶️
3. Choisissez votre appareil (émulateur ou téléphone)

## ✅ Tests à effectuer

### 1. Connexion
```
Email: marie.dupont@email.com
Mot de passe: Client123!
```
- [ ] Page de connexion s'affiche
- [ ] Connexion réussie
- [ ] Redirection vers dashboard

### 2. Inscription
- [ ] Formulaire complet avec :
  - Infos personnelles
  - "Comment avez-vous connu ELAÏA?"
  - Champ parrainage
- [ ] Validation des champs
- [ ] Création de compte

### 3. Navigation
- [ ] Menu burger fonctionne
- [ ] Toutes les pages accessibles
- [ ] Retour arrière Android fonctionne

### 4. Fonctionnalités client
- [ ] Voir les cours disponibles
- [ ] Réserver un cours
- [ ] Consulter mes réservations
- [ ] Voir mes crédits
- [ ] Acheter des crédits

### 5. Test Admin
```
Email: admin@elaiastudio.ch
Mot de passe: Admin123!
```
- [ ] Accès panel admin
- [ ] Gestion des clients
- [ ] Ajout/retrait de crédits
- [ ] Modification parrainage

### 6. Performance mobile
- [ ] App fluide
- [ ] Pas de lag au scroll
- [ ] Transitions smooth
- [ ] Chargement rapide

## 🐛 Problèmes possibles

### L'app ne se lance pas
- Vérifiez que le backend tourne : http://localhost:5001
- Vérifiez les logs dans Android Studio (Logcat)

### Erreur de connexion API
- L'émulateur/téléphone doit être sur le même réseau
- Pour émulateur : utilisez `10.0.2.2:5001` au lieu de `localhost`

### Page blanche
- Ouvrez Chrome DevTools :
  - Dans Chrome : `chrome://inspect`
  - Votre app apparaîtra → "Inspect"

## 📊 Checklist finale

- [ ] Login/Logout fonctionne
- [ ] Inscription complète
- [ ] Navigation fluide
- [ ] Réservations OK
- [ ] Crédits visibles
- [ ] Admin peut gérer
- [ ] Responsive parfait
- [ ] Pas d'erreurs console

## 🎉 Succès !

Si tous les tests passent, votre app est prête pour :
1. Build de production
2. Publication Play Store
3. Tests utilisateurs

---

💡 **Astuce** : Activez le "Hot Reload" dans Android Studio pour voir les changements en temps réel !

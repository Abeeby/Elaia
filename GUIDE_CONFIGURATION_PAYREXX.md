# 🚀 Guide de Configuration Payrexx pour ELAÏA Studio

## 📋 **INFORMATIONS REQUISES POUR PAYREXX**

Voici tout ce dont vous avez besoin pour intégrer Payrexx à ELAÏA Studio :

---

## 🔑 **1. CRÉATION D'UN COMPTE PAYREXX**

### **Étape 1 : S'inscrire**
1. Allez sur [payrexx.com](https://payrexx.com)
2. Créez un compte (version gratuite disponible)
3. Vérifiez votre email

### **Étape 2 : Configurer votre instance**
- Payrexx vous donne un **nom d'instance** (ex: `elaia-studio`)
- Ce nom sera utilisé dans l'URL : `https://elaia-studio.payrexx.com`

---

## 🗝️ **2. RÉCUPÉRER VOS CLÉS API**

### **Dans votre compte Payrexx :**

1. **Allez dans Settings → API**
2. **Activez l'API** si nécessaire
3. **Copiez votre clé API** :
   ```env
   # Votre clé API Payrexx
   PAYREXX_API_KEY=your-api-key-here
   ```

4. **Votre nom d'instance** :
   ```env
   # Nom de votre instance Payrexx
   PAYREXX_INSTANCE_NAME=elaia-studio
   ```

---

## 💳 **3. CONFIGURATION DES PAIEMENTS**

### **Étape 1 : Activer les méthodes de paiement**
Dans Payrexx :
1. **Settings → Payment Methods**
2. Activez : **Carte de crédit**, **Twint**, **PayPal**, etc.
3. Configurez vos comptes bancaires

### **Étape 2 : Configuration des webhooks (optionnel)**
1. **Settings → Webhooks**
2. Ajoutez l'URL : `https://votre-domaine.com/api/payments/webhook`
3. Événements : `transaction_confirmed`, `transaction_cancelled`

---

## 🔧 **4. CONFIGURATION TECHNIQUE**

### **Côté Serveur (`server/.env`) :**
```env
# Payrexx Configuration
PAYREXX_INSTANCE_NAME=elaia-studio
PAYREXX_API_KEY=votre-cle-api-payrexx
```

### **Côté Client (optionnel - `client/.env`) :**
```env
# Configuration Payrexx (côté client - optionnel)
VITE_PAYREXX_INSTANCE_NAME=elaia-studio
```

---

## 💰 **5. FONCTIONNEMENT DES PAIEMENTS**

### **Processus de paiement :**
1. **Utilisateur choisit ses crédits** → Calcul du prix
2. **Clic "Payer avec Payrexx"** → Création de la facture
3. **Redirection vers Payrexx** → Paiement sécurisé
4. **Retour automatique** → Crédits ajoutés au compte

### **Statuts de paiement Payrexx :**
- `waiting` : En attente de paiement
- `confirmed` : Payé et confirmé
- `cancelled` : Annulé par l'utilisateur
- `expired` : Expiré

---

## 🔗 **6. URLS DE REDIRECTION**

### **Configuration des URLs dans Payrexx :**
- **URL de succès** : `https://votredomaine.com/payment/success?payment_id={PAYMENT_ID}`
- **URL d'annulation** : `https://votredomaine.com/payment/cancel`

### **Variables disponibles :**
- `{PAYMENT_ID}` : ID de la transaction Payrexx
- `{REFERENCE_ID}` : ID de référence (contient userId et crédits)
- `{AMOUNT}` : Montant payé
- `{CURRENCY}` : Devise

---

## 📊 **7. TEST DE L'INTÉGRATION**

### **Étape 1 : Mode test Payrexx**
1. Dans Payrexx : **Settings → General**
2. Activez le **mode test**
3. Utilisez les cartes de test Payrexx

### **Étape 2 : Tester un paiement**
1. Lancez ELAÏA Studio
2. Connectez-vous
3. Allez dans **Acheter des crédits**
4. Choisissez un pack
5. Cliquez **"Payer avec Payrexx"**
6. Payez avec une carte de test
7. Vérifiez que les crédits sont ajoutés

---

## 🎯 **8. FONCTIONS DISPONIBLES**

### **API Payrexx utilisée :**
- ✅ **Créer une facture** (`POST /Invoice/`)
- ✅ **Vérifier le statut** (`GET /Invoice/{id}`)
- ✅ **Annuler un paiement** (`DELETE /Invoice/{id}`)
- ✅ **Lister les paiements** (`GET /Invoice/`)

### **Gestion automatique :**
- ✅ **Ajout automatique des crédits** après paiement
- ✅ **Historique des transactions** sauvegardé
- ✅ **Webhook pour confirmation** (optionnel)

---

## 🚨 **PROBLÈMES COURANTS**

### **Erreur "Instance not found" :**
- ✅ Vérifiez `PAYREXX_INSTANCE_NAME`
- ✅ Vérifiez que l'instance existe

### **Erreur "Invalid API key" :**
- ✅ Vérifiez `PAYREXX_API_KEY`
- ✅ Vérifiez que l'API est activée

### **Paiement non confirmé :**
- ✅ Vérifiez le webhook URL
- ✅ Vérifiez les événements configurés
- ✅ Vérifiez les logs serveur

---

## 💰 **TARIFS PAYREXX**

### **Version gratuite :**
- ✅ 25 transactions/mois
- ✅ Toutes les méthodes de paiement
- ✅ API complète
- ✅ Webhooks

### **Versions payantes :**
- **Basic** : 49 CHF/mois (transactions illimitées)
- **Pro** : 149 CHF/mois (fonctionnalités avancées)
- **Enterprise** : Sur mesure

---

## 🔒 **SÉCURITÉ**

### **Certifications Payrexx :**
- ✅ **PCI DSS** Level 1 (sécurité bancaire)
- ✅ **SSL/TLS** chiffré
- ✅ **Conforme RGPD**
- ✅ **Hébergé en Suisse**

### **Données sensibles :**
- 🔒 **Pas de stockage** des données cartes
- 🔒 **Chiffrement** des communications
- 🔒 **Conformité** bancaire suisse

---

## 🎉 **AVANTAGES PAYREXX**

### **Pour ELAÏA Studio :**
- ✅ **Interface suisse** (en français)
- ✅ **Support suisse** (en français)
- ✅ **Tarifs compétitifs**
- ✅ **Intégration simple** (API REST)
- ✅ **Toutes les méthodes de paiement** suisses
- ✅ **Conforme aux réglementations** suisses

### **Méthodes de paiement supportées :**
- 💳 **Cartes de crédit** (Visa, MasterCard, etc.)
- 🇨🇭 **Twint** (très populaire en Suisse)
- 📱 **Apple Pay** / **Google Pay**
- 🏦 **Virements bancaires**
- 💰 **PayPal**

---

## 📞 **SUPPORT PAYREXX**

- **Email** : support@payrexx.com
- **Téléphone** : +41 44 585 15 85
- **Chat en ligne** : Disponible sur le site
- **Documentation** : [docs.payrexx.com](https://docs.payrexx.com)

---

## 🚀 **PRÊT À L'EMPLOI !**

Une fois configuré, votre système de paiement Payrexx sera :

- ✅ **Sécurisé** et conforme
- ✅ **Facile à utiliser** pour vos clients
- ✅ **Intégré automatiquement** à ELAÏA Studio
- ✅ **Prêt pour la production**

**Vous pouvez maintenant accepter des paiements en toute sécurité ! 🎉**

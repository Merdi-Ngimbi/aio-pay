# AIO Pay – Application de paiement des frais académiques

**AIO Pay** permet aux étudiants en République Démocratique du Congo de payer leurs frais académiques (inscription, examen, minerval, session…) directement depuis leur téléphone, sans perdre une journée en agence bancaire.

---

## 1. Ce qui est déjà développé

### Frontend (Next.js) – `apps/web`

| Page / Fonctionnalité              | Description                                      | Statut |
|------------------------------------|--------------------------------------------------|--------|
| Page d'accueil                     | Présentation du service + boutons d'action       | ✅     |
| Connexion (Login)                  | Téléphone + code OTP en 2 étapes                 | ✅     |
| Dashboard étudiant                 | Accueil + derniers paiements + actions rapides   | ✅     |
| Parcours de paiement               | 4 étapes : Université → Banque → Motif → Confirm | ✅     |
| Historique                         | Liste de tous les paiements                      | ✅     |
| Reçu numérique                     | Détail + bouton téléchargement PDF               | ✅     |
| Logo officiel                      | Intégré dans le header et les pages              | ✅     |

### Backend (NestJS) – `apps/api`

| Module              | Rôle principal                                      | Statut |
|---------------------|-----------------------------------------------------|--------|
| Auth                | OTP + JWT (request-otp, verify-otp, me)             | ✅     |
| Users               | Création / recherche d'utilisateurs                 | ✅     |
| Universities        | Liste UPC + banques de convenance                   | ✅     |
| Payments            | Création de transaction + calcul frais 1,5 USD      | ✅     |
| Webhooks            | Réception des notifications FlexPay                 | ✅     |
| Notifications       | Envoi SMS (actuellement loggé dans la console)      | ✅     |

---

## 2. Structure des dossiers

```
aio-pay/
├── README.md                          ← Ce fichier
├── apps/
│   ├── web/                           ← Frontend Next.js
│   │   ├── public/logo.png            ← Logo officiel
│   │   ├── src/
│   │   │   ├── app/                   ← Pages (App Router)
│   │   │   ├── components/            ← Composants réutilisables
│   │   │   ├── lib/                   ← Client API + utilitaires
│   │   │   ├── stores/                ← État global (Zustand)
│   │   │   └── types/                 ← Types TypeScript
│   │   └── package.json
│   │
│   └── api/                           ← Backend NestJS
│       ├── src/
│       │   ├── auth/                  ← Authentification OTP + JWT
│       │   ├── users/                 ← Utilisateurs
│       │   ├── universities/          ← Universités & banques
│       │   ├── payments/              ← Transactions
│       │   ├── webhooks/              ← FlexPay
│       │   ├── notifications/         ← SMS
│       │   ├── main.ts                ← Point d'entrée
│       │   └── app.module.ts
│       ├── .env.example
│       └── package.json
```

---

## 3. Comment lancer le projet (Windows)

### 3.1 Lancer le Frontend

Ouvre un **premier** terminal (PowerShell ou CMD) :

```bash
cd C:\Users\User\Downloads\aio-pay\apps\web
npm install
npm run dev
```

→ L'application web sera disponible sur : **http://localhost:3000**

### 3.2 Lancer le Backend

Ouvre un **deuxième** terminal :

```bash
cd C:\Users\User\Downloads\aio-pay\apps\api
npm install
```

Crée le fichier `.env` à partir de l'exemple :

```bash
copy .env.example .env
```

Puis lance le serveur :

```bash
npm run start:dev
```

→ L'API sera disponible sur : **http://localhost:3001**

### 3.3 Tester la connexion OTP

1. Va sur http://localhost:3000
2. Clique sur « Se connecter »
3. Entre un numéro (ex: `0812345678`)
4. Regarde la **console du backend** : le code OTP s'affiche
5. Saisis ce code dans l'application → tu es connecté

---

## 4. Variables d'environnement importantes

Fichier `apps/api/.env` :

| Variable       | Description                              | Valeur exemple                          |
|----------------|------------------------------------------|-----------------------------------------|
| PORT           | Port de l'API                            | 3001                                    |
| JWT_SECRET     | Clé de signature des tokens              | une-longue-phrase-secrete               |
| FLEXPAY_API_KEY| Clé API FlexPay (sandbox)                | (à remplir plus tard)                   |

---

## 5. Décisions techniques respectées (roadmap)

- AIO Pay **ne manipule jamais les fonds** → tout passe par FlexPay
- Frais de service MVP : **1,50 USD** (équivalent transport)
- Université pilote : **UPC**
- Authentification : téléphone + OTP (pas de mot de passe)
- Code entièrement commenté en français
- Architecture modulaire prête pour la production

---

## 6. Prochaines étapes prévues

1. Brancher la vraie API FlexPay (sandbox)
2. Remplacer le stockage en mémoire par PostgreSQL + Prisma
3. Générer les reçus PDF
4. Back-office Université (UPC)
5. Back-office Admin AIO Pay
6. Docker Compose pour tout lancer en une commande

---

## 7. Support

Si une commande échoue, vérifie toujours que tu es dans le **bon dossier** (`apps\web` ou `apps\api`) avant d'exécuter `npm install` ou `npm run ...`.

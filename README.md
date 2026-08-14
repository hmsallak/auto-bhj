# Auto BHJ

Site de vente de vehicules d'occasion, en deux parties :

- **`frontend/`** : le site public (consultation des voitures par les clients) et
  l'espace admin, construits avec Next.js (React). C'est aussi ici que tourne
  l'unique serveur de l'application.
- **`backend/`** : toute la logique metier — base de donnees SQLite, modeles
  (voitures, comptes admin), authentification et securite. Ce dossier ne lance
  aucun serveur lui-meme, il est utilise directement par les routes API du
  frontend.

## Base de donnees

Chaque voiture est stockee dans une vraie base SQLite (`backend/data/autobhj.db`,
cree automatiquement) :

- `id` : cle primaire technique (auto-incrementee).
- `reference` : identifiant unique et lisible (ex. `AB-000123`), utilise pour la
  recherche cote client et les fiches voiture (`/cars/AB-000123`).

## Demarrage

```bash
npm install
cp frontend/.env.example frontend/.env.local   # puis modifier les valeurs
npm run dev
```

Le site est disponible sur `http://localhost:3000`, l'espace admin sur
`http://localhost:3000/admin`.

## Variables d'environnement (`frontend/.env.local`)

| Variable          | Role                                                              |
| ----------------- | ------------------------------------------------------------------ |
| `ADMIN_USER`      | Identifiant du compte admin cree automatiquement au premier login |
| `ADMIN_PASSWORD`  | Mot de passe initial (change le, il est hache en base ensuite)    |
| `SESSION_SECRET`  | Cle secrete pour signer les sessions admin (obligatoire en prod)  |
| `NODE_ENV`        | `production` active le cookie de session en mode `Secure`         |

Le mot de passe admin n'est **jamais stocke en clair** : il est hache avec
`scrypt` en base des la premiere connexion.

## Migration des anciennes donnees

Si un fichier `data/cars.json` existe encore a la racine (ancien format), le
migrer une fois vers SQLite avec :

```bash
npm run seed
```

## Securite de l'espace admin

- Mots de passe haches (`scrypt`), jamais en clair.
- Sessions signees (HMAC), cookies `HttpOnly`, `SameSite=Strict`, `Secure` en
  production, expiration automatique apres 8h.
- Limitation des tentatives de connexion (8 essais / 10 minutes / IP).
- Toutes les routes de gestion (`/api/admin/cars/*`) exigent une session valide.

Pour un site en production, deployez toujours derriere HTTPS : cela chiffre le
transport (identifiants, cookies de session) entre le navigateur et le serveur.

## Scripts

| Commande        | Effet                                      |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Lance le serveur de developpement            |
| `npm run build` | Prepare une version de production           |
| `npm start`     | Lance le serveur de production (apres build) |
| `npm run seed`  | Migre `data/cars.json` (ancien) vers SQLite  |

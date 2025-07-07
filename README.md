# 📊 Dashboard Factory

Un'applicazione full-stack per visualizzare dati di produzione industriale in tempo reale, con:

- 🔧 Backend in Node.js + Express con connessione a SQL Server
- ⚙️ Frontend in React (Vite)
- 🔗 API RESTful
- 🧠 Visualizzazione intelligente dati macchina

---

## 🧪 Avvio del progetto

### 1. Backend

1. Copia il file `.env` nella cartella `backend/` con i parametri:
   ```env
   DB_USER=tuo_utente
   DB_PASSWORD=la_tua_password
   DB_SERVER=IP_del_tuo_SQL_Server
   DB_NAME=nome_del_database
   ```

2. Installa le dipendenze:
   ```bash
   cd backend
   npm install
   ```

3. Avvia il server:
   ```bash
   node server.js
   ```

### 2. Frontend

1. Installa le dipendenze:
   ```bash
   cd frontend
   npm install
   ```

2. Avvia l’app:
   ```bash
   npm run dev
   ```

---

## 💾 Come salvare le modifiche su GitHub

> Esegui sempre questi comandi **dalla root del progetto** (`dashboard-factory`):

### Aggiungi le modifiche:
```bash
git add .
```

### Crea un commit con messaggio:
```bash
git commit -m "Descrizione delle modifiche"
```

### Aggiorna il ramo remoto (dopo aver risolto eventuali conflitti/pull):
```bash
git push origin main
```

> ❗ Se ottieni errori tipo `non fast-forward`, prima fai:
```bash
git pull origin main --rebase
```
Poi riprova:
```bash
git push origin main
```

---

## 📁 Struttura del progetto

```
dashboard-factory/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env (🔒 escluso da Git)
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚫 File ignorati da Git

Nel file `.gitignore` sono esclusi:

- `node_modules/`
- `dist/`, `build/`, `.vite/`
- `.env`, `.log`, `.DS_Store`
- File temporanei (`*.swp`, `*.tmp`, ecc.)

---

## ✅ Prerequisiti

- Node.js (>= 16)
- SQL Server attivo e accessibile
- Git installato

---

Made with ❤️ by [anninasim](https://github.com/anninasim)


# 🏭 Dashboard Factory – Guida Esperta all’Installazione e Manutenzione

Dashboard Factory è una soluzione full-stack per la visualizzazione industriale in tempo reale, progettata per essere robusta, scalabile e facilmente installabile su qualsiasi dispositivo, inclusi mini PC industriali, server edge e workstation di fabbrica.

---

## � Caratteristiche principali

- Backend Node.js + Express, ottimizzato per SQL Server
- Frontend React (Vite) con UI industriale, responsive e leggibile su TV 4K
- API RESTful sicure
- Visualizzazione dati macchina, KPI, progressi, alert e stato linea
- Stile dark industriale, palette sobria, animazioni CSS ottimizzate

---

## 🛠️ Installazione passo-passo (qualsiasi dispositivo)

### 1. Prerequisiti

- **Node.js** (>= 16) – Scarica da [nodejs.org](https://nodejs.org/)
- **Git** – Scarica da [git-scm.com](https://git-scm.com/)
- **SQL Server** attivo e accessibile dalla rete del dispositivo
- (Opzionale) **PowerShell** o terminale bash per comandi

### 2. Clona il repository

```bash
git clone https://github.com/anninasim/dashboard-factory.git
cd dashboard-factory
```

### 3. Configura il backend

1. Copia il file `.env.example` (o creane uno nuovo) in `backend/.env`:
   ```env
   DB_USER=tuo_utente
   DB_PASSWORD=la_tua_password
   DB_SERVER=IP_del_tuo_SQL_Server
   DB_NAME=nome_del_database
   ```
2. Installa le dipendenze backend:
   ```bash
   cd backend
   npm install
   ```
3. Avvia il backend:
   ```bash
   node server.js
   ```
   > Consiglio: usa `pm2` o `forever` per esecuzione continua su mini PC/edge.

### 4. Configura il frontend

1. Apri una nuova finestra terminale, vai in `frontend/`:
   ```bash
   cd ../frontend
   npm install
   ```
2. Avvia il frontend:
   ```bash
   npm run dev
   ```
   > Per produzione: usa `npm run build` e un server statico (es. serve, nginx).

---

## 🖥️ Avvio automatico su mini PC industriale

1. Installa [pm2](https://pm2.keymetrics.io/) globalmente:
   ```bash
   npm install -g pm2
   ```
2. Avvia backend e frontend come servizi:
   ```bash
   pm2 start backend/server.js --name dashboard-backend
   pm2 start "npm run dev" --name dashboard-frontend --cwd frontend
   pm2 save
   pm2 startup
   ```
3. (Opzionale) Configura avvio automatico all’accensione tramite Task Scheduler (Windows) o systemd (Linux).

---

## 🧩 Struttura del progetto

```
dashboard-factory/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
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

## �️ Sicurezza e consigli industriali

- Proteggi il file `.env` e non committarlo mai su GitHub
- Usa reti cablate e firewall per dispositivi di produzione
- Aggiorna regolarmente Node.js e le dipendenze (`npm audit`)
- Per accesso remoto, usa VPN o tunnel sicuri
- Esegui backup periodici di dati e configurazioni

---

## 🛠️ Manutenzione e troubleshooting

- Per errori di build: elimina `node_modules`, reinstalla con `npm install`
- Per problemi di connessione: verifica parametri `.env` e accesso SQL Server
- Per log dettagliati: aggiungi `console.log` in backend/server.js e nei componenti React
- Per aggiornare: esegui `git pull` e ripeti `npm install` in backend/frontend

---

## 📚 Risorse utili

- [Documentazione React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/icons/)
- [pm2](https://pm2.keymetrics.io/)

---

## 👷‍♂️ Credits e licenza

Creato da [anninasim](https://github.com/anninasim).<br>
Licenza MIT. Sentiti libero di contribuire, segnalare issue o proporre miglioramenti!

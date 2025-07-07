# 🏭 Dashboard Factory

Una dashboard di produzione industriale in tempo reale sviluppata con React (frontend) e Node.js + SQL Server (backend). Il sistema mostra lo stato delle macchine, gli ordini in corso, e i dati di produzione aggiornati.

---

## 📦 Tecnologie utilizzate

- ⚛️ **React** (Vite) – Frontend
- 🟨 **Node.js + Express** – Backend REST API
- 🗃️ **Microsoft SQL Server** – Database
- 🧠 **CSS Responsive** per display 4K montati in produzione

---

## 🚀 Avvio del progetto

### 1️⃣ Backend

📁 Vai nella cartella `backend/` e segui questi passaggi:

```bash
npm install
npm start


🔐 Crea un file .env nella root del backend con i seguenti parametri:
DB_USER=tuo_user_sql
DB_PASSWORD=la_tua_password
DB_SERVER=ip_o_nome_del_server
DB_NAME=nome_database

La tua API sarà disponibile su http://localhost:3001/api/dashboard

---

### 2️⃣ Frontend
📁 Vai nella cartella frontend/:
npm install
npm run dev



📁 Struttura del progetto
pgsql
Copia
Modifica
dashboard-factory/
├── backend/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── index.html
│   ├── App.jsx
│   ├── App.css
│   └── components/
│       └── ProductionCard.jsx
└── README.md

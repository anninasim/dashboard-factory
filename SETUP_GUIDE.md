# 📋 GUIDA SETUP DASHBOARD FACTORY - NUOVO PC

## 🎯 PREREQUISITI SOFTWARE

### 1. **Node.js** (OBBLIGATORIO)
- Scarica da: https://nodejs.org/
- **Versione consigliata**: LTS (Long Term Support) - attualmente v18 o v20
- Durante installazione: ✅ Seleziona "Add to PATH"
- Verifica installazione: `node --version` e `npm --version`

### 2. **Git** (OBBLIGATORIO)
- Scarica da: https://git-scm.com/
- Durante installazione: usa impostazioni di default
- Verifica: `git --version`

### 3. **VS Code** (CONSIGLIATO)
- Scarica da: https://code.visualstudio.com/
- Estensioni consigliate:
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Prettier
  - Tailwind CSS IntelliSense

---

## 📂 CLONAZIONE PROGETTO

### 1. **Clona Repository**
```bash
git clone https://github.com/anninasim/dashboard-factory.git
cd dashboard-factory
```

### 2. **Verifica Struttura**
Dovresti vedere:
```
dashboard-factory/
├── frontend/
├── backend/
├── README.md
├── package.json
└── ...
```

---

## ⚙️ SETUP BACKEND

### 1. **Installa Dipendenze Backend**
```bash
cd backend
npm install
```

### 2. **Verifica File Backend**
- `backend/package.json` - deve esistere
- `backend/server.js` - deve esistere

### 3. **Test Backend**
```bash
npm start
```
- Dovrebbe avviarsi su porta 3001
- Messaggio: "Server running on port 3001"

---

## 🎨 SETUP FRONTEND

### 1. **Installa Dipendenze Frontend**
```bash
cd ../frontend
npm install
```

### 2. **Verifica Dipendenze Principali**
Nel `frontend/package.json` dovrebbero esserci:
- React
- Vite
- Tailwind CSS
- Lucide React (per icone)

### 3. **Test Frontend**
```bash
npm run dev
```
- Dovrebbe avviarsi su porta 5173
- Apri browser: http://localhost:5173

---

## 🏃‍♂️ AVVIO COMPLETO DASHBOARD

### 1. **Avvia Backend** (Terminal 1)
```bash
cd backend
npm start
```

### 2. **Avvia Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```

### 3. **Verifica Funzionamento**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Dashboard dovrebbe caricare e mostrare le 8 card

---

## 🔧 CONFIGURAZIONI SPECIALI

### 1. **Configurazione TV 4K**
Il CSS è già ottimizzato per TV 4K (3840px+):
- File principale: `frontend/src/App.css`
- Sezione: `@media (min-width: 3840px)`

### 2. **Port Configuration**
Se hai conflitti di porte, modifica:
- **Backend**: `backend/server.js` - cambia `PORT = 3001`
- **Frontend**: `frontend/vite.config.js` - cambia porta dev server

### 3. **Animazioni Hopper**
Le animazioni pallini sono in:
- CSS: `frontend/src/App.css` (sezione hopper)
- Componente: `frontend/src/components/ModernHopperStatus.jsx`

---

## 🚨 TROUBLESHOOTING

### Errore: "npm: command not found"
- Reinstalla Node.js
- Riavvia terminale/PC
- Verifica PATH environment variables

### Errore: "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Oppure cambia porta in server.js
```

### Frontend non si connette al Backend
- Verifica backend sia avviato (porta 3001)
- Controlla CORS settings in `backend/server.js`
- Verifica URL API calls nel frontend

### Animazioni non funzionano
- Verifica che `ModernHopperStatus.jsx` sia senza errori
- Controlla CSS hopper in `App.css`
- F12 → Console per eventuali errori JavaScript

---

## 📁 STRUTTURA FILE IMPORTANTI

```
dashboard-factory/
├── backend/
│   ├── package.json         # Dipendenze backend
│   ├── server.js            # Server principale
│   └── node_modules/        # (auto-generato)
├── frontend/
│   ├── package.json         # Dipendenze frontend
│   ├── vite.config.js       # Configurazione Vite
│   ├── src/
│   │   ├── App.jsx          # Componente principale
│   │   ├── App.css          # 🎨 STILI PRINCIPALI + TV 4K
│   │   ├── main.jsx         # Entry point
│   │   └── components/
│   │       ├── ModernHopperStatus.jsx  # 🏭 Hopper con animazioni
│   │       ├── ProductionCard.jsx      # Card produzione
│   │       └── ...
│   └── node_modules/        # (auto-generato)
└── README.md
```

---

## ✅ CHECKLIST FINALE

- [ ] Node.js installato e funzionante
- [ ] Git installato
- [ ] Repository clonato
- [ ] `npm install` eseguito in backend/
- [ ] `npm install` eseguito in frontend/
- [ ] Backend avviato (porta 3001)
- [ ] Frontend avviato (porta 5173)
- [ ] Dashboard visibile e funzionante
- [ ] Animazioni hopper funzionanti
- [ ] Layout ottimizzato per TV 4K

---

## 📞 NOTE FINALI

- **Backup**: Usa sempre `git pull` per aggiornamenti
- **Modifiche**: Fai sempre `git add .` → `git commit` → `git push`
- **TV 4K**: Il layout è già ottimizzato, nessuna modifica necessaria
- **Performance**: Su TV potrebbe richiedere 10-15 secondi per caricare completamente

**🎉 La dashboard dovrebbe ora funzionare perfettamente sul nuovo PC!**

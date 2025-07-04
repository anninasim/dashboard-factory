// server.js - backend REST API con SQL Server
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('✅ Connessione SQL Server avviata');
    return pool;
  })
  .catch(err => console.error('❌ Errore SQL:', err));

app.get('/api/dashboard', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        fnt_sigla,
        mntg_rif_ordine,
        mntg_articolo,
        mntg_descr_articolo,  -- ⬅️ AGGIUNTA QUESTA RIGA
        mntg_codice_ricetta,
        mntg_qta_lotti,
        mntg_qta_lotti_attuale,
        mntg_vel_ril,
        mntg_portata_ril,
        mntg_stato_gruppo,
        mntg_azione AS mntg_azione
      FROM dbo.view_dash_react_factory_eye
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Errore nella query:', err);
    res.status(500).json({ error: 'Errore query SQL Server' });
  }
});

app.listen(3001, () => {
  console.log('✅ Backend attivo su http://localhost:3001');
});

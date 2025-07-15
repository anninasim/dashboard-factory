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
      mntg_descr_articolo,
      mntg_codice_ricetta,
      mntg_qta_lotti,
      mntg_qta_lotti_attuale,
      mntg_vel_ril,
      mntg_portata_ril,
      att_descr, -- ⬅️ AGGIUNTA QUESTA RIGA
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



// Utility function per convertire DataFormattata in HH:MM
function formatDataToTime(dataFormattata) {
  const timeStr = dataFormattata.slice(-4); // Ultimi 4 caratteri (HHMM)
  const hours = timeStr.slice(0, 2);
  const minutes = timeStr.slice(2, 4);
  return `${hours}:${minutes}`;
}

// Endpoint per i dati di portata
app.get('/api/flow-data', async (req, res) => {
  try {
    const pool = await poolPromise;
    const { date } = req.query;
    
    // Se non viene fornita una data, usa oggi
    const targetDate = date || new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    const result = await pool.request()
      .input('datePattern', sql.NVarChar, `${targetDate}%`)
      .query(`
        SELECT 
          macchina,
          DataFormattata,
          portata_ril
        FROM [OptimusNT_data].[dbo].[view_grafico_portata_giornaliera]
        WHERE DataFormattata LIKE @datePattern
        ORDER BY macchina, DataFormattata
      `);

    // Raggruppa i dati per macchina
    const machineData = {};
    
    result.recordset.forEach(row => {
      const machine = row.macchina;
      if (!machineData[machine]) {
        machineData[machine] = [];
      }
      
      machineData[machine].push({
        time: formatDataToTime(row.DataFormattata),
        rawTime: row.DataFormattata,
        flowRate: row.portata_ril,
        timestamp: row.DataFormattata
      });
    });

    // Calcola statistiche per ogni macchina
    const machines = Object.keys(machineData).map(machine => {
      const data = machineData[machine];
      const flowRates = data.map(d => d.flowRate);
      
      return {
        machine,
        dataPoints: data.length,
        data: data,
        stats: {
          min: Math.min(...flowRates),
          max: Math.max(...flowRates),
          avg: flowRates.reduce((a, b) => a + b, 0) / flowRates.length,
          latest: data[data.length - 1]?.flowRate || null
        }
      };
    });

    const response = {
      date: targetDate,
      machines: machines,
      totalMachines: machines.length,
      totalDataPoints: machines.reduce((sum, m) => sum + m.dataPoints, 0)
    };

    res.json(response);
    
  } catch (err) {
    console.error('❌ Errore nella query portata:', err);
    res.status(500).json({ error: 'Errore query dati portata' });
  }
});
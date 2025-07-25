// server.js - backend REST API con SQL Server (AGGIORNATO CON DEBUG KG TOTALI)
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

// 🔥 ENDPOINT AGGIORNATO: Dashboard con dati tecnici materiali + DEBUG KG TOTALI
app.get('/api/dashboard', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        -- Dati operativi dalla vista principale
        main.fnt_sigla,
        main.mntg_rif_ordine,
        main.mntg_articolo,
        main.mntg_descr_articolo,
        main.mntg_qta_ini,              -- 🎯 KG TOTALI (già presente)
        main.mntg_codice_ricetta,
        main.mntg_qta_lotti,
        main.mntg_qta_lotti_attuale,
        main.mntg_vel_ril,
        main.mntg_portata_ril,
        main.att_descr,
        main.mntg_stato_gruppo,
        main.mntg_azione,
        main.fp_schedula_completo,
        main.mntg_dataril,
              
        
        -- 🆕 NUOVI DATI TECNICI: Caratteristiche materiali
        tech.mntg_gruppo,          -- Per debug/verifica del join
        tech.mandrino,             -- Informazioni mandrino
        tech.tipologia,            -- Tipo di materiale
        tech.larghezza,            -- Dimensione materiale
        tech.spessore_micron,      -- Spessore in micron
        tech.qta_uni_kg,           -- Quantità unitaria in kg
        tech.qta_uni_ml,           -- Quantità unitaria in ml
        tech.num_bobine,           -- Numero bobine
        tech.stato_macchina_html,
        tech.additivazione_html


      FROM dbo.view_dash_react_factory_eye AS main
      
      -- JOIN con la vista tecnica usando mntg_gruppo (identificativo macchina)
      LEFT JOIN dbo.VIEW_display_s1_tab AS tech 
        ON main.mntg_gruppo = tech.mntg_gruppo
      
      -- Ordiniamo per identificativo macchina per consistenza
      ORDER BY main.fnt_sigla
    `);

    // 🆕 LOG COMPLETO PER DEBUG: verifica i nuovi campi + KG TOTALI
    console.log(`📊 Dashboard query completata: ${result.recordset.length} records`);
    console.log(`🔧 Primo record con dati tecnici + KG:`, {
      macchina: result.recordset[0]?.fnt_sigla,
      miscela: result.recordset[0]?.mntg_codice_ricetta,
      kg_totali: result.recordset[0]?.mntg_qta_ini,
      kg_tipo: typeof result.recordset[0]?.mntg_qta_ini,
      tipologia: result.recordset[0]?.tipologia,
      larghezza: result.recordset[0]?.larghezza,
      spessore: result.recordset[0]?.spessore_micron
    });

    // 🆕 LOG DETTAGLIATO: KG TOTALI per tutte le macchine
    console.log('🎯 KG TOTALI per tutte le macchine:');
    result.recordset.forEach(record => {
      console.log(`  ${record.fnt_sigla}: ${record.mntg_qta_ini} kg (tipo: ${typeof record.mntg_qta_ini})`);
    });

    // 🆕 LOG: Verifica se ci sono valori null
    const nullKgCount = result.recordset.filter(r => r.mntg_qta_ini === null || r.mntg_qta_ini === undefined).length;
    console.log(`⚠️  Macchine con kg_totali NULL: ${nullKgCount}/${result.recordset.length}`);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Errore nella query dashboard:', err);
    res.status(500).json({ 
      error: 'Errore query SQL Server',
      details: err.message 
    });
  }
});

// Utility function per convertire DataFormattata in HH:MM
function formatDataToTime(dataFormattata) {
  const timeStr = dataFormattata.slice(-4); // Ultimi 4 caratteri (HHMM)
  const hours = timeStr.slice(0, 2);
  const minutes = timeStr.slice(2, 4);
  return `${hours}:${minutes}`;
}

// Endpoint per i dati di portata (invariato)
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

app.listen(3001, () => {
  console.log('✅ Backend attivo su http://localhost:3001');
  console.log('🔧 Endpoint dashboard arricchito con dati tecnici materiali');
  console.log('🎯 Debug attivo per kg totali (mntg_qta_ini)');
});
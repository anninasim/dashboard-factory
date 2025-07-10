import React from 'react';
import LEDProgressBar from './LEDProgressBar';
import KpiBox from './components/Kpibox'; // ✅ Corretto il nome del file (b minuscola)

const getStatus = (stato, azione) => {
  const s = Number(stato);

  if (s === 5) {
    switch (azione) {
      case 'CPF':
        return { label: 'IN PRODUZIONE', color: '#4caf50' };
      case 'RIA':
        return { label: 'RIAVVIO', color: '#ffc107' };
      case 'INI':
        return { label: 'INIZIO PRODUZIONE', color: '#2196f3' };
      case 'SCR':
        return { label: 'SCARTO', color: '#f44336' };
      default:
        return { label: 'STATO 5', color: '#1976d2' };
    }
  }

  if (s === 7 && azione === 'FER') {
    return { label: 'FERMA', color: '#9e9e9e' };
  }

  return { label: '-', color: '#9e9e9e' };
};

function ProductionCard({ data }) {
  const stato = getStatus(data.mntg_stato_gruppo, data.mntg_azione);

  const descrizionePulita = data.mntg_descr_articolo
    ? data.mntg_descr_articolo.split('*')[0].trim()
    : '-';

  const messaggioAttDescr = data.att_descr
    ? data.att_descr.toUpperCase()
    : null;

  return (
    <div className="card">
      <div className="card-header" style={{ borderColor: stato.color }}>
        <h2>{data.fnt_sigla}</h2>
        <span className="status" style={{ backgroundColor: stato.color }}>
          {stato.label}
        </span>
      </div>
      <div className="card-body">
        <p><strong>Ordine:</strong> {data.mntg_rif_ordine}</p>
        <p><strong>Articolo:</strong> {data.mntg_articolo}</p>
        <p><strong>Descrizione:</strong> {descrizionePulita}</p>
        <p><strong>Miscela:</strong> {data.mntg_codice_ricetta}</p>

        <LEDProgressBar 
          current={data.mntg_qta_lotti_attuale}
          total={data.mntg_qta_lotti}
          unit=""
          machineStatus={stato.label}
        />

        {/* 🔢 Sezione KPI con Velocità e Portata */}
        <div className="kpi-boxes" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <KpiBox 
            label="Velocità" 
            value={data.mntg_vel_ril || 0} 
            unit="m/min" 
            color="text-blue-400" 
            icon="⚡" 
          />
          <KpiBox 
            label="Portata" 
            value={data.mntg_portata_ril || 0} 
            unit="Kg/h" 
            color="text-yellow-300" 
            icon="🌀" 
          />
        </div>

        {messaggioAttDescr && (
          <p style={{ marginTop: '12px', fontWeight: 'bold', color: '#ff9800' }}>
            ⚠️ {messaggioAttDescr}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductionCard;

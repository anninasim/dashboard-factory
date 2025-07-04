import React from 'react';

const getStatus = (stato, azione) => {
  const s = Number(stato);

  if (s === 5) {
    switch (azione) {
      case 'CPF':
        return { label: 'IN PRODUZIONE', color: '#4caf50' }; // verde
      case 'RIA':
        return { label: 'RIAVVIO', color: '#ffc107' }; // giallo
      case 'INI':
        return { label: 'INIZIO PRODUZIONE', color: '#2196f3' }; // blu
      case 'SCR':
        return { label: 'SCARTO', color: '#f44336' }; // rosso
      default:
        return { label: 'STATO 5', color: '#1976d2' }; // blu scuro
    }
  }

  if (s === 7 && azione === 'FER') {
    return { label: 'FERMA', color: '#9e9e9e' }; // grigio
  }

  return { label: '-', color: '#9e9e9e' }; // fallback
};

function ProductionCard({ data }) {
  const stato = getStatus(data.mntg_stato_gruppo, data.mntg_azione);
  const completamento = data.mntg_qta_lotti > 0
    ? Math.round((data.mntg_qta_lotti_attuale / data.mntg_qta_lotti) * 100)
    : 0;

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
        <p><strong>Bobine:</strong> {data.mntg_qta_lotti_attuale} / {data.mntg_qta_lotti}</p>
        <div className="progress-bar">
          <div className="fill" style={{ width: completamento + '%' }}></div>
        </div>
        <p><strong>Velocità:</strong> {data.mntg_vel_ril} m/min</p>
        <p><strong>Portata:</strong> {data.mntg_portata_ril} Kg/h</p>
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

import React from 'react';
import LEDProgressBar from './LEDProgressBar';
import KpiBox from './components/Kpibox';

// 🚨 LOGICA AGGIORNATA: Stato FERMA più visibile in stile industriale
const getStatus = (stato, azione, velocita, portata) => {
  const s = Number(stato);
  const vel = Number(velocita) || 0;
  const port = Number(portata) || 0;
  
  const isSensorsStopped = vel === 0 && port === 0;
  const isSensorsActive = vel > 0 || port > 0;
  
  // 🚨 PRIORITÀ 1: FERMA - Stesso stile ma colore distintivo
  if (isSensorsStopped) {
    return { 
      label: '🔴 FERMA', 
      color: '#e53e3e',           // Rosso industriale acceso
      bgColor: '#2a1f1f',         // Background rosso scuro
      borderColor: '#e53e3e',     // Border rosso
      animation: 'none',          // Nessuna animazione
      priority: 'critical'        // Priorità critica
    };
  }
  
  // Stati normali (produzione attiva)
  if (isSensorsActive) {
    if (s === 5) {
      switch (azione) {
        case 'CPF': return { 
          label: '🟢 IN PRODUZIONE', 
          color: '#4caf50',
          bgColor: '#1f2a1f',
          borderColor: '#4caf50',
          animation: 'none',
          priority: 'normal'
        };
        case 'RIA': return { 
          label: '🟡 RIAVVIO', 
          color: '#ffc107',
          bgColor: '#2a2a1f',
          borderColor: '#ffc107',
          animation: 'slowPulse',
          priority: 'medium'
        };
        case 'INI': return { 
          label: '🔵 INIZIO PRODUZIONE', 
          color: '#2196f3',
          bgColor: '#1f2a2a',
          borderColor: '#2196f3',
          animation: 'none',
          priority: 'normal'
        };
        case 'SCR': return { 
          label: '🟠 SCARTO', 
          color: '#f44336',
          bgColor: '#2a1f1f',
          borderColor: '#f44336',
          animation: 'fastPulse',
          priority: 'high'
        };
        default: return { 
          label: 'STATO 5', 
          color: '#1976d2',
          bgColor: '#1f1f2a',
          borderColor: '#1976d2',
          animation: 'none',
          priority: 'normal'
        };
      }
    }
    
    if (s === 7) {
      switch (azione) {
        case 'CPF': return { 
          label: '🟢 IN PRODUZIONE', 
          color: '#4caf50',
          bgColor: '#1f2a1f',
          borderColor: '#4caf50',
          animation: 'none',
          priority: 'normal'
        };
        case 'FER': return { 
          label: '🔴 FERMA', 
          color: '#e53e3e',
          bgColor: '#2a1f1f',
          borderColor: '#e53e3e',
          animation: 'none',
          priority: 'critical'
        };
        case 'RIA': return { 
          label: '🟡 RIAVVIO', 
          color: '#ffc107',
          bgColor: '#2a2a1f',
          borderColor: '#ffc107',
          animation: 'slowPulse',
          priority: 'medium'
        };
        case 'INI': return { 
          label: '🔵 INIZIO PRODUZIONE', 
          color: '#2196f3',
          bgColor: '#1f2a2a',
          borderColor: '#2196f3',
          animation: 'none',
          priority: 'normal'
        };
        case 'SCR': return { 
          label: '🟠 SCARTO', 
          color: '#f44336',
          bgColor: '#2a1f1f',
          borderColor: '#f44336',
          animation: 'fastPulse',
          priority: 'high'
        };
        default: return { 
          label: 'STATO 7', 
          color: '#666666',
          bgColor: '#252525',
          borderColor: '#666666',
          animation: 'none',
          priority: 'normal'
        };
      }
    }
  }
  
  return { 
    label: 'STATO SCONOSCIUTO', 
    color: '#9e9e9e',
    bgColor: '#252525',
    borderColor: '#9e9e9e',
    animation: 'none',
    priority: 'normal'
  };
};

// 🎯 Componente ottimizzato per le specifiche tecniche del materiale
const MaterialSpecs = ({ data }) => {
  // Verifica se abbiamo almeno un dato tecnico disponibile tra i 4 campi richiesti
  const hasTechnicalData = data.larghezza || data.spessore_micron || 
                          data.qta_uni_kg || data.qta_uni_ml;

  // Funzione helper per formattare i valori numerici senza decimali inutili
  const formatNumber = (value) => {
    // Se il valore è null, undefined o non numerico, ritorna '-'
    if (value === null || value === undefined || isNaN(value)) return '-';
    
    // Converte in numero se è una stringa numerica
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Se è NaN dopo la conversione, ritorna '-'
    if (isNaN(numValue)) return '-';
    
    // Se è un numero intero, mostralo senza decimali
    if (Number.isInteger(numValue)) {
      return numValue.toString();
    }
    
    // Se ha decimali, rimuovi gli zeri finali inutili
    return numValue.toString();
  };

  return (
    <div className="material-specs-section">
      {/* Header della sezione */}
      <div className="material-specs-header">
        <span className="material-icon">🔬</span>
        <span className="material-title">Specifiche Materiale</span>
      </div>

      {/* Miscela (spostata qui dalle info operative) */}
      <div className="spec-row-single">
        <div className="spec-item-full">
          <span className="spec-icon">⚗️</span>
          <span className="spec-label">Miscela</span>
          <span className="spec-value-key">{data.mntg_codice_ricetta || '-'}</span>
        </div>
      </div>

      {/* Verifica se ci sono dati tecnici disponibili */}
      {!hasTechnicalData ? (
        <div className="material-no-data">
          <span className="no-data-message">Dati tecnici materiale non disponibili</span>
        </div>
      ) : (
        <div className="material-specs-grid">
          
          {/* Prima riga: Dimensioni fisiche del materiale */}
          <div className="spec-row">
            {data.larghezza && (
              <div className="spec-item">
                <span className="spec-icon">📏</span>
                <span className="spec-label">Larghezza</span>
                <span className="spec-value-key">{formatNumber(data.larghezza)} mt</span>
              </div>
            )}
            
            {data.spessore_micron && (
              <div className="spec-item">
                <span className="spec-icon">📐</span>
                <span className="spec-label">Spessore</span>
                <span className="spec-value-key">{formatNumber(data.spessore_micron)} μm</span>
              </div>
            )}
          </div>

          {/* Seconda riga: Quantità unitarie del materiale */}
          <div className="spec-row">
            {data.qta_uni_kg && (
              <div className="spec-item">
                <span className="spec-icon">⚖️</span>
                <span className="spec-label">Kg unitari</span>
                <span className="spec-value-key">{formatNumber(data.qta_uni_kg)} kg</span>
              </div>
            )}
            
            {data.qta_uni_ml && (
              <div className="spec-item">
                <span className="spec-icon">📏</span>
                <span className="spec-label">Metri lineari</span>
                <span className="spec-value-key">{formatNumber(data.qta_uni_ml)} mt</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Styles per le specifiche materiale */}
      <style>{`
        .material-specs-section {
          margin: 20px 0;
          padding: 16px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.04));
          border: 1px solid #444;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .material-specs-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #555;
          justify-content: space-between;
        }

        .material-icon {
          font-size: 1.2rem;
          color: #00bcd4;
        }

        .material-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .material-no-data {
          text-align: center;
          padding: 12px;
          color: #888;
          font-style: italic;
        }

        .no-data-message {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .spec-row-single {
          margin-bottom: 12px;
        }

        .spec-item-full {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(0, 151, 167, 0.1));
          border: 1px solid #00bcd4;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .spec-item-full:hover {
          background: linear-gradient(135deg, rgba(0, 188, 212, 0.15), rgba(0, 151, 167, 0.15));
          border-color: #26c6da;
          transform: translateY(-1px);
        }

        .material-specs-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .spec-row {
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0; /* Per permettere il text truncation */
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid #555;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .spec-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #666;
          transform: translateY(-1px);
        }

        .spec-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          opacity: 0.8;
        }

        .spec-label {
          font-size: 0.85rem;
          color: #cccccc;
          font-weight: 500;
          flex-shrink: 0;
          min-width: 60px;
        }

        .spec-value-key {
          font-size: 1.4rem !important; /* ⭐ Numeri chiave più grandi */
          color: #ffffff !important;
          font-weight: 700 !important;
          text-align: right;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        /* Responsive per schermi più piccoli */
        @media (max-width: 768px) {
          .spec-row {
            flex-direction: column;
            gap: 8px;
          }
          
          .spec-item {
            justify-content: space-between;
          }
          
          .spec-label {
            min-width: auto;
          }

          .spec-value-key {
            font-size: 1.2rem !important;
          }
        }

        /* Responsive per TV 4K */
        @media (min-width: 3840px) {
          .material-specs-section {
            padding: 20px;
          }
          
          .material-title {
            font-size: 1.4rem;
          }
          
          .material-icon {
            font-size: 1.5rem;
          }
          
          .spec-item {
            padding: 12px 16px;
          }
          
          .spec-label {
            font-size: 1.2rem;
          }
          
          .spec-value-key {
            font-size: 1.6rem !important; /* ⭐ Ancora più grande su 4K */
          }
        }
      `}</style>
    </div>
  );
};

// 🎨 FUNZIONE per determinare i colori KPI in base allo stato macchina
const getKpiColor = (machineStatus, kpiType) => {
  // Colori base per diversi tipi di KPI
  const colorSchemes = {
    velocity: {
      active: '#4fc3f7',    // Azzurro per velocità attiva
      inactive: '#666666',  // Grigio per velocità ferma
      warning: '#ffc107',   // Giallo per velocità in allerta
      error: '#f44336'      // Rosso per velocità in errore
    },
    flow: {
      active: '#ffb74d',    // Arancione per portata attiva
      inactive: '#666666',  // Grigio per portata ferma
      warning: '#ffc107',   // Giallo per portata in allerta
      error: '#f44336'      // Rosso per portata in errore
    }
  };

  const scheme = colorSchemes[kpiType] || colorSchemes.velocity;

  // Logica di colore basata sullo stato della macchina
  if (machineStatus.includes('FERMA')) {
    return scheme.inactive;
  } else if (machineStatus.includes('IN PRODUZIONE')) {
    return scheme.active;
  } else if (machineStatus.includes('RIAVVIO')) {
    return scheme.warning;
  } else if (machineStatus.includes('SCARTO')) {
    return scheme.error;
  } else if (machineStatus.includes('INIZIO PRODUZIONE')) {
    return scheme.active;
  } else {
    return scheme.inactive;  // Default per stati sconosciuti
  }
};

function ProductionCard({ data }) {
  // 🎯 AGGIORNAMENTO: Passa velocità e portata alla funzione getStatus
  const stato = getStatus(
    data.mntg_stato_gruppo, 
    data.mntg_azione,
    data.mntg_vel_ril,      // ← AGGIUNGI velocità
    data.mntg_portata_ril   // ← AGGIUNGI portata
  );

  // ⭐ Combina articolo e descrizione in un unico campo
  const articoloCompleto = () => {
    const articolo = data.mntg_articolo || '';
    const descrizione = data.mntg_descr_articolo 
      ? data.mntg_descr_articolo.split('*')[0].trim() 
      : '';
    
    // Se abbiamo entrambi, li combiniamo con un trattino
    if (articolo && descrizione) {
      return `${articolo} - ${descrizione}`;
    }
    // Se abbiamo solo uno dei due, mostriamo quello disponibile
    if (articolo) return articolo;
    if (descrizione) return descrizione;
    // Se non abbiamo nessuno dei due, mostriamo un placeholder
    return '-';
  };

  const messaggioAttDescr = data.att_descr
    ? data.att_descr.toUpperCase()
    : null;

  return (
    <div className={`card ${stato.priority === 'critical' ? 'card-critical' : ''}`}>
      {/* Header con stato e alert */}
      <div className="card-header" style={{ 
        borderColor: stato.borderColor || stato.color,
        backgroundColor: stato.bgColor || 'transparent'
      }}>
        <h2>{data.fnt_sigla}</h2>
        
        {/* Alert al centro se presente */}
        {messaggioAttDescr && (
          <div className="header-alert-center">
            <span className="alert-icon-small">⚠️</span>
            <span className="alert-text-small">{messaggioAttDescr}</span>
          </div>
        )}
        
        <span 
          className={`status ${stato.animation !== 'none' ? stato.animation : ''}`}
          style={{ 
            backgroundColor: stato.color
          }}
        >
          {stato.label}
        </span>
      </div>

      <div className="card-body">
        {/* Informazioni operative dell'ordine */}
        <p><strong>Ordine:</strong> {data.mntg_rif_ordine}</p>
        <p><strong>Articolo:</strong> {articoloCompleto()}</p>

        {/* 🆕 NUOVA SEZIONE: Specifiche tecniche del materiale (include miscela) */}
        <MaterialSpecs data={data} />

        {/* 🎯 NUOVA SEZIONE: Avanzamento e Performance in layout orizzontale */}
        <div className="progress-and-kpi-container">
          {/* Barra di avanzamento LED (larghezza ridotta) */}
          <div className="progress-section">
            <LEDProgressBar 
              current={data.mntg_qta_lotti_attuale}
              total={data.mntg_qta_lotti}
              unit=""
              machineStatus={stato.label}
              machineColor={stato.color}  // ← NUOVO: Passa il colore dello stato
              percentage={data.mntg_qta_lotti > 0 ? (data.mntg_qta_lotti_attuale / data.mntg_qta_lotti) * 100 : 0}
            />
          </div>

          {/* KPI boxes per velocità e portata (a destra, impilate verticalmente) */}
          <div className="kpi-section">
            <KpiBox 
              label="Velocità" 
              value={data.mntg_vel_ril || 0} 
              unit="m/min" 
              color={getKpiColor(stato.label, 'velocity')}  // ← NUOVO: Colore condizionato
              background="#2a2a2a"
              border="#555"
            />
            <KpiBox 
              label="Portata" 
              value={data.mntg_portata_ril || 0} 
              unit="Kg/h" 
              color={getKpiColor(stato.label, 'flow')}      // ← NUOVO: Colore condizionato
              background="#2a2a2a"
              border="#555"
            />
          </div>
        </div>

        {/* 🚨 CSS COMPLETO per layout + animazioni industriali */}
        <style>{`
          .progress-and-kpi-container {
            display: flex;
            gap: 16px;
            align-items: flex-start;
            margin-top: 16px;
            width: 100%;
          }

          .progress-section {
            flex: 0 0 65%; /* Larghezza fissa al 65% per dare più spazio al conteggio e barra */
            min-width: 0;
          }

          .kpi-section {
            flex: 1; /* Occupa il resto dello spazio disponibile (35%) */
            display: flex;
            flex-direction: column; /* ✅ KPI impilate verticalmente */
            gap: 12px; /* Spazio tra velocità e portata */
            min-width: 0;
          }

          /* 🚨 CARD CRITICA: Stato FERMA - Stesso stile ma colore distintivo */
          .card-critical {
            border: 3px solid #e53e3e !important;
            background: linear-gradient(145deg, #2a1f1f, #331f1f) !important;
            position: relative;
          }

          /* 🟡 ANIMAZIONE SLOW PULSE - Per riavvio */
          @keyframes slowPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          /* 🟠 ANIMAZIONE FAST PULSE - Per scarto */
          @keyframes fastPulse {
            0%, 100% { opacity: 1; }
            25% { opacity: 0.6; }
            75% { opacity: 0.9; }
          }

          /* 🎯 APPLICAZIONE ANIMAZIONI - Solo per stati attivi */
          .status.slowPulse {
            animation: slowPulse 3s ease-in-out infinite;
          }

          .status.fastPulse {
            animation: fastPulse 1s ease-in-out infinite;
          }

          /* 🔴 OVERRIDE PER STATO FERMA - Elegante ma visibile */
          .card-critical .status {
            font-weight: 700 !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            font-size: 1.5rem !important;
            padding: 14px 28px !important;
          }

          /* Adattamenti per schermi più piccoli */
          @media (max-width: 1200px) {
            .progress-and-kpi-container {
              flex-direction: column;
              gap: 12px;
            }
            
            .progress-section {
              flex: none;
              width: 100%;
            }
            
            .kpi-section {
              flex-direction: row; /* Su schermi piccoli torna orizzontale */
              gap: 12px;
            }
          }

          /* 📱 Responsive per mobile */
          @media (max-width: 768px) {
            .progress-and-kpi-container {
              gap: 8px;
            }
            
            .kpi-section {
              gap: 8px;
            }
          }

          /* Ottimizzazioni per TV 4K */
          @media (min-width: 3840px) {
            .progress-and-kpi-container {
              gap: 24px;
              margin-top: 20px;
            }
            
            .progress-section {
              flex: 0 0 70%; /* Su 4K diamo ancora più spazio alla sezione progress */
            }
            
            .kpi-section {
              gap: 16px; /* Più spazio tra le KPI su schermi grandi */
            }
          }

          /* Adattamenti per schermi molto piccoli */
          @media (max-width: 768px) {
            .progress-and-kpi-container {
              gap: 8px;
            }
            
            .kpi-section {
              gap: 8px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ProductionCard;
import React from 'react';
import LEDProgressBar from './LEDProgressBar';
import KpiBox from './components/Kpibox';

// ✅ LOGICA CORRETTA: Solo stato PLC comanda, sensori ignorati
const getStatus = (stato, azione, velocita, portata) => {
  const s = Number(stato);
  
  // ✅ SOLO LOGICA BASATA SU STATO E AZIONE DEL PLC
  if (s === 5) {
    switch (azione) {
      case 'CPF': return { 
        label: '🟢 IN PRODUZIONE', 
        color: '#4caf50',           // Verde normale
        bgColor: '#1f2a1f',
        borderColor: '#4caf50',
        animation: 'none',
        priority: 'normal'
      };
      case 'RIA': return { 
        label: '🟡 RIAVVIO', 
        color: '#ffc107',           // Giallo
        bgColor: '#2a2a1f',
        borderColor: '#ffc107',
        animation: 'slowPulse',
        priority: 'medium'
      };
      case 'INI': return { 
        label: '🔵 INIZIO PRODUZIONE', 
        color: '#2196f3',           // Blu
        bgColor: '#1f2a2a',
        borderColor: '#2196f3',
        animation: 'none',
        priority: 'normal'
      };
      case 'SCR': return { 
        label: '🟠 SCARTO', 
        color: '#ff5722',           // Arancione/rosso per scarto
        bgColor: '#2a1f1f',
        borderColor: '#ff5722',
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
        color: '#4caf50',           // Verde normale
        bgColor: '#1f2a1f',
        borderColor: '#4caf50',
        animation: 'none',
        priority: 'normal'
      };
      case 'FER': return { 
        label: '🔴 FERMA', 
        color: '#e53e3e',           // Rosso per fermo
        bgColor: '#2a1f1f',
        borderColor: '#e53e3e',
        animation: 'none',
        priority: 'critical'
      };
      case 'RIA': return { 
        label: '🟡 RIAVVIO', 
        color: '#ffc107',           // Giallo
        bgColor: '#2a2a1f',
        borderColor: '#ffc107',
        animation: 'slowPulse',
        priority: 'medium'
      };
      case 'INI': return { 
        label: '🔵 INIZIO PRODUZIONE', 
        color: '#2196f3',           // Blu
        bgColor: '#1f2a2a',
        borderColor: '#2196f3',
        animation: 'none',
        priority: 'normal'
      };
      case 'SCR': return { 
        label: '🟠 SCARTO', 
        color: '#ff5722',           // Arancione/rosso per scarto
        bgColor: '#2a1f1f',
        borderColor: '#ff5722',
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
  
  // ✅ NUOVO: Gestione STATO 10
  if (s === 10) {
    switch (azione) {
      case 'FIN': return { 
        label: '🔵 PRODUZIONE TERMINATA', 
        color: '#1565c0',           // Blu industrial scuro
        bgColor: '#0d1b2a',
        borderColor: '#1565c0',
        animation: 'none',
        priority: 'completed'
      };
      default: return { 
        label: 'STATO 10', 
        color: '#1976d2',
        bgColor: '#1f1f2a',
        borderColor: '#1976d2',
        animation: 'none',
        priority: 'normal'
      };
    }
  }
  
  // ✅ Default per stati non riconosciuti
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

      {/* 🆕 MODIFICATO: Miscela + Kg Totali in doppia colonna */}
      <div className="spec-row">
        {/* Prima colonna: Miscela */}
        <div className="spec-item">
          <span className="spec-icon">⚗️</span>
          <span className="spec-label">Miscela</span>
          <span className="spec-value-key">{data.mntg_codice_ricetta || '-'}</span>
        </div>
        
        {/* Seconda colonna: Kg Totali */}
        <div className="spec-item">
          <span className="spec-icon">⚖️</span>
          <span className="spec-label">Kg Totali</span>
          <span className="spec-value-key">{formatNumber(data.mntg_qta_ini)} kg</span>
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
                <span className="spec-label">Metri unitari</span>
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

        .material-specs-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .spec-row {
          display: flex;
          gap: 16px;
          justify-content: space-between;
          margin-bottom: 12px;
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
  // ✅ STATO COMANDATO SOLO DAL PLC
  const stato = getStatus(
    data.mntg_stato_gruppo, 
    data.mntg_azione,
    data.mntg_vel_ril,      // ← Parametri mantenuti per compatibilità
    data.mntg_portata_ril   // ← Ma non più usati per determinare lo stato
  );

  // 🆕 AGGIUNTA: Rilevamento produzione completata
  const isProductionComplete = (
    data.mntg_stato_gruppo === '10' && 
    data.mntg_azione === 'FIN'
  );

  // 🆕 AGGIUNTA: Formattazione timestamp completamento (senza conversione fuso orario)
  const getCompletionDateTime = (timestampString) => {
    if (!timestampString) return { date: '', time: '' };
    
    try {
      // Formato input: "2025-07-19T16:25:31.140Z"
      // Rimuoviamo la Z per evitare la conversione UTC->locale di JavaScript
      const cleanTimestamp = timestampString.replace('Z', '').replace('T', ' ');
      
      // Parse manuale: "2025-07-19 16:25:31.140"
      const [datePart, timePart] = cleanTimestamp.split(' ');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      
      return {
        date: `${day}/${month}`,           // "19/07"
        time: `${hour}:${minute}`          // "16:25" (ora esatta dal DB)
      };
    } catch (error) {
      return { date: '', time: '' };
    }
  };

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
    <div 
      className={`card ${stato.priority === 'critical' ? 'card-critical' : ''} ${isProductionComplete ? 'card-completed' : ''}`}
      style={{ 
        position: 'relative',
        // 🆕 MODIFICA: Border teal quando produzione completata
        border: isProductionComplete ? '3px solid #1565c0' : undefined
      }}
    >
      {/* Header con stato e alert - SEMPRE NORMALE */}
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
        {/* Informazioni operative dell'ordine - GRIGIE SE COMPLETATA */}
        <p className={isProductionComplete ? 'content-completed' : ''}><strong>Ordine:</strong> {data.fp_schedula_completo}</p>
        <p className={isProductionComplete ? 'content-completed' : ''}><strong>Articolo:</strong> {articoloCompleto()}</p>

        {/* 🆕 NUOVA SEZIONE: Specifiche tecniche del materiale - GRIGIE SE COMPLETATA */}
        <div className={isProductionComplete ? 'section-completed' : ''}>
          <MaterialSpecs data={data} />
        </div>

        {/* 🎯 LAYOUT OTTIMIZZATO: 2 Colonne - Avanzamento + Performance - SPAZIATURA CORRETTA */}
        <div className={`progress-and-kpi-container-optimized ${isProductionComplete ? 'section-completed' : ''}`}>
          
          {/* SEZIONE SINISTRA: Bobine (62%) - SENZA HEADER */}
          <div className="metrics-box-minimalist">
            <div className="metrics-content">
              <LEDProgressBar 
                current={data.mntg_qta_lotti_attuale || 0}
                total={data.mntg_qta_lotti || 0}
                unit=""
                machineStatus={stato.label}
                machineColor={stato.color}
                percentage={data.mntg_qta_lotti > 0 ? (data.mntg_qta_lotti_attuale / data.mntg_qta_lotti) * 100 : 0}
              />
            </div>
          </div>

          {/* SEZIONE DESTRA: Performance (32%) - SENZA HEADER */}
          <div className="metrics-box-minimalist">
            <div className="metrics-content">
              <div className="kpi-stack">
                <KpiBox 
                  label="Velocità" 
                  value={data.mntg_vel_ril || 0} 
                  unit="mt/min" 
                  color={getKpiColor(stato.label, 'velocity')}
                  background="#2a2a2a"
                  border="#555"
                />
                <KpiBox 
                  label="Portata" 
                  value={data.mntg_portata_ril || 0} 
                  unit="Kg/h" 
                  color={getKpiColor(stato.label, 'flow')}
                  background="#2a2a2a"
                  border="#555"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 BANNER COMPLETAMENTO - DESIGN COMPATTO SU UNA RIGA */}
        {isProductionComplete && (
          <div className="completion-banner-large">
            <div className="completion-icon">✓</div>
            <div className="completion-info">
              {(() => {
                const completion = getCompletionDateTime(data.mntg_dataril);
                return completion.date && completion.time ? (
                  <div className="completion-single-line">
                    <span className="completion-status">PRODUZIONE COMPLETATA</span>
                    <span className="completion-datetime">{completion.date} ore {completion.time}</span>
                  </div>
                ) : (
                  <div className="completion-single-line">
                    <span className="completion-status">PRODUZIONE COMPLETATA</span>
                    <span className="completion-datetime">Completata con successo</span>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 🎨 CSS COMPLETO OTTIMIZZATO */}
        <style>{`
          /* 🎯 STATO COMPLETATO - TUTTO GRIGIO TRANNE HEADER */
          .card-completed {
            position: relative;
          }

          /* 📝 CONTENUTO TESTUALE GRIGIO */
          .content-completed {
            color: #666666 !important;
            opacity: 0.6;
            transition: all 0.3s ease;
          }

          .content-completed strong {
            color: #777777 !important;
          }

          /* 📊 SEZIONI INTERE GRIGIE */
          .section-completed {
            filter: grayscale(80%);
            opacity: 0.5;
            transition: all 0.3s ease;
          }

          /* 🎯 EFFETTO HOVER PER RIATTIVARE TEMPORANEAMENTE */
          .card-completed:hover .content-completed {
            opacity: 0.8;
          }

          .card-completed:hover .section-completed {
            filter: grayscale(60%);
            opacity: 0.7;
          }

          /* 🎯 OVERRIDE PER MATERIAL SPECS QUANDO COMPLETATA */
          .section-completed .material-specs-section {
            background: linear-gradient(135deg, rgba(102, 102, 102, 0.1), rgba(102, 102, 102, 0.2)) !important;
            border-color: #666666 !important;
          }

          .section-completed .material-title {
            color: #888888 !important;
          }

          .section-completed .material-icon {
            color: #666666 !important;
          }

          .section-completed .spec-value-key {
            color: #888888 !important;
          }

          .section-completed .spec-item {
            background: rgba(102, 102, 102, 0.1) !important;
            border-color: #666666 !important;
          }

          /* 🆕 LAYOUT SUPER-COMPATTO SENZA HEADER */
          .progress-and-kpi-container-optimized {
            display: flex;
            gap: 16px;
            align-items: stretch;
            margin: 12px 0; /* Aumentato da 8px a 12px */
            width: calc(100% - 16px); /* Ridotto di 16px per dare spazio ai bordi */
            padding: 0 8px; /* Padding orizzontale aggiunto */
          }
          
          /* Box con stile unificato - SENZA HEADER */
          .metrics-box-minimalist {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.04));
            border: 1px solid #444;
            border-radius: 8px;
            padding: 14px; /* Aumentato da 12px a 14px */
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Leggera ombra per profondità */
          }
          
          /* Distribuzione spazio - MODIFICATA PER LASCIARE MARGINE */
          .metrics-box-minimalist:first-child {
            flex: 0 0 62%; /* Ridotto da 65% a 62% */
          }
          
          .metrics-box-minimalist:last-child {
            flex: 0 0 32%; /* Ridotto da 35% a 32% */
          }
          
          /* Contenuto centrato verticalmente */
          .metrics-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2px; /* Piccolo padding interno */
          }
          
          /* Stack KPI */
          .kpi-stack {
            display: flex;
            flex-direction: column;
            gap: 10px; /* Aumentato da 8px a 10px */
            width: 100%;
          }
          
          /* Miglioramento stile per card responsive */
          .card-body {
            padding: 12px 16px; /* Assicura padding uniforme nel corpo */
          }

          /* Responsive */
          @media (max-width: 768px) {
            .progress-and-kpi-container-optimized {
              flex-direction: column;
              padding: 0 4px; /* Padding ridotto su mobile */
            }
            
            .metrics-box-minimalist {
              width: 100%;
              margin-bottom: 10px; /* Spazio tra i box impilati */
            }
            
            .metrics-box-minimalist:first-child,
            .metrics-box-minimalist:last-child {
              flex: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ProductionCard;
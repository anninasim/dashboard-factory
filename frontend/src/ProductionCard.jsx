import React from 'react';
import ModernHopperStatus from './components/ModernHopperStatus';
import CompactProgressSection from './components/CompactProgressSection';
import ModernMaterialSpecs from './components/ModernMaterialSpecs';
import ModernOrderInfo from './components/ModernOrderInfo';

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

  const messaggioAttDescr = data.att_descr
    ? data.att_descr.toUpperCase()
    : null;

  return (
    <div 
      className={`card ${stato.priority === 'critical' ? 'card-critical' : ''} ${isProductionComplete ? 'card-completed' : ''}`}
      style={{ 
        position: 'relative',
        border: isProductionComplete ? '2px solid #1565c0' : undefined
      }}
    >
      {/* Header con stato e alert - DESIGN COMPATTO */}
      <div className="card-header-compact" style={{ 
        borderColor: stato.borderColor || stato.color,
        backgroundColor: stato.bgColor || 'transparent'
      }}>
        <h2 className="machine-name">{data.fnt_sigla}</h2>
        
        {/* Alert al centro se presente */}
        {messaggioAttDescr && (
          <div className="header-alert-center">
            <span className="alert-icon-small">⚠️</span>
            <span className="alert-text-small">{messaggioAttDescr}</span>
          </div>
        )}
        
        <span 
          className={`status-compact ${stato.animation !== 'none' ? stato.animation : ''}`}
          style={{ 
            backgroundColor: stato.color
          }}
        >
          {stato.label}
        </span>
      </div>

      <div className="card-body space-y-4">
        {/* Sezione Ordine e Articolo MODERNA */}
        <ModernOrderInfo 
          data={data} 
          isCompleted={isProductionComplete}
        />

        {/* Sezione Specifiche Materiale MODERNA */}
        <ModernMaterialSpecs 
          data={data} 
          isCompleted={isProductionComplete}
        />

        {/* 🆕 SEZIONE PROGRESS BILANCIATA */}
        <CompactProgressSection data={data} />

        {/* Sezione Hopper MODERNA - SOTTO TUTTO */}
        <ModernHopperStatus 
          htmlString={data.stato_macchina_html || ''}
          isCompleted={isProductionComplete}
          machineName={data.fnt_sigla}
        />
      </div>

      {/* Banner completamento */}
      {isProductionComplete && (
        <div className="completion-banner">
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

      {/* 📺 NIENTE PIÙ CSS INLINE! Tutto controllato da App.css */}
    </div>
  );
}

export default ProductionCard;
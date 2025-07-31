import React from 'react';
import ModernHopperStatus from './components/ModernHopperStatus';
import CompactProgressSection from './components/CompactProgressSection';
import ModernMaterialSpecs from './components/ModernMaterialSpecs';
import ModernOrderInfo from './components/ModernOrderInfo';
import ModernEstrusoriSection from './components/ModernEstrusoriSection';
import { Loader2 } from 'lucide-react';

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
        color: '#ff9800',           // Arancione per scarto
        bgColor: '#2a1f1f',
        borderColor: '#ff9800',
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
        color: '#ff9800',           // Arancione per scarto
        bgColor: '#2a1f1f',
        borderColor: '#ff9800',
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
        color: '#92D050',           // Blu industrial scuro
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

function ProductionCard({ data, estrusori, estrusoriMiscele }) {
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
        borderColor: stato.borderColor,
        boxShadow: `0 0 0 2px ${stato.borderColor}22`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        overflow: 'hidden',
      }}
    >
      {/* Overlay rosso pulsante se FERMA (o stato critico) */}
      {(stato.label === '🔴 FERMA' || stato.priority === 'critical') && (
        <div className="card-overlay-ferma">
          {/* DEBUG: Overlay visibile */}
          {/* <div style={{position:'absolute',top:8,left:8,color:'#fff',zIndex:30,fontWeight:700}}>FERMA</div> */}
        </div>
      )}
      {/* Header con stato e alert - DESIGN COMPATTO */}
      <div className="card-header-compact" style={{
        borderColor: stato.borderColor || stato.color,
        backgroundColor: 'rgba(20, 24, 28, 0.96)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.18rem 0.6rem 0.18rem 0.6rem',
        minHeight: '2.1rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.13)',
        zIndex: 2
      }}>
        {/* Titolo macchina con rotella a sinistra e stato a destra (struttura classica separata) */}
        <h2 className="machine-name" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 800,
          color: '#f8ffe0',
          letterSpacing: '0.025em',
          textShadow: '0 1px 3px #000, 0 1px 2px #2d5016',
          padding: '0.04em 0.28em',
          borderRadius: '0.24em',
          border: `1.7px solid ${isProductionComplete ? '#84cc16' : stato.borderColor || stato.color}`,
          background: isProductionComplete ? 'rgba(40,60,20,0.92)' : 'rgba(20,24,28,0.92)',
          boxShadow: isProductionComplete ? '0 0 6px #84cc1633' : '0 1px 3px rgba(0,0,0,0.11)',
          minWidth: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          margin: 0,
        }}>
          {/* Icona animata solo se IN PRODUZIONE o INIZIO PRODUZIONE */}
          {(stato.label === '🟢 IN PRODUZIONE' || stato.label === '🔵 INIZIO PRODUZIONE') && (
            <Loader2 className="mr-1 text-cyan-300 animate-spin-slow" style={{verticalAlign:'middle', flexShrink:0}} size={18} />
          )}
          <span style={{flex: 1, minWidth: 0, textAlign: 'center'}}>{data.fnt_sigla}</span>
        </h2>
        <span
          className={`status-compact ${stato.animation !== 'none' ? stato.animation : ''}`}
          style={{
            background: isProductionComplete ? 'linear-gradient(135deg, #2d5016, #3f6e20)' : 'rgba(30,40,30,0.92)',
            color: isProductionComplete ? '#d9f99d' : stato.color,
            border: `1.5px solid ${isProductionComplete ? '#84cc16' : stato.color}`,
            borderRadius: '9999px',
            fontWeight: 800,
            padding: '0.18rem 0.7rem',
            fontSize: '0.9rem',
            boxShadow: isProductionComplete ? '0 0 8px #84cc1633' : 'none',
            textShadow: '0 1px 2px #000, 0 1px 2px #2d5016',
            flexShrink: 0,
            marginLeft: '0.7rem',
            marginTop: '0.08rem',
            display: 'inline-block',
            verticalAlign: 'middle'
          }}
        >
          {stato.label}
        </span>
        {/* Alert centrale se presente */}
        {messaggioAttDescr && (
          <div className="header-alert-center" style={{position:'absolute',left:'50%',top:'100%',transform:'translate(-50%,0)',marginTop:'0.2rem',zIndex:10}}>
            <span className="alert-icon-small">⚠️</span>
            <span className="alert-text-small">{messaggioAttDescr}</span>
          </div>
        )}
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
      <CompactProgressSection data={data} isCompleted={isProductionComplete} />

      {/* Sezione Hopper MODERNA - SOTTO TUTTO */}
      <ModernHopperStatus 
        htmlString={data.stato_macchina_html || ''}
        isCompleted={isProductionComplete}
        machineName={data.fnt_sigla}
        miscelaCode={data.mntg_codice_ricetta}
      />
      {/* Sezione compatta estrusori/miscele - modulare */}
      <ModernEstrusoriSection estrusoriMiscele={estrusoriMiscele} isCompleted={isProductionComplete} />
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

      {/* Footer compatto estrusori - facilmente rimovibile */}

      {/* 📺 NIENTE PIÙ CSS INLINE! Tutto controllato da App.css */}
    </div>
  );
}

export default ProductionCard;
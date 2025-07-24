import React from 'react';
import HopperStatus from './components/HopperStatus';
import ProgressSection from './components/ProgressSection';

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

// 🎯 Componente ottimizzato per le specifiche tecniche del materiale - LAYOUT 3x2
const MaterialSpecs = ({ data, isCompleted }) => {
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

  // 🆕 NUOVA LOGICA: Prepara tutti i 6 campi per layout 3x2
  const allFields = [
    // Prima riga (3 campi)
    {
      icon: '⚗️',
      label: 'Miscela',
      value: data.mntg_codice_ricetta || '-',
      key: 'miscela'
    },
    {
      icon: '⚖️',
      label: 'Kg Totali',
      value: `${formatNumber(data.mntg_qta_ini)} kg`,
      key: 'kg_totali'
    },
    {
      icon: '📏',
      label: 'Larghezza',
      value: data.larghezza ? `${formatNumber(data.larghezza)} mt` : '-',
      key: 'larghezza'
    },
    // Seconda riga (3 campi)
    {
      icon: '📐',
      label: 'Spessore',
      value: data.spessore_micron ? `${formatNumber(data.spessore_micron)} μm` : '-',
      key: 'spessore'
    },
    {
      icon: '⚖️',
      label: 'Kg unitari',
      value: data.qta_uni_kg ? `${formatNumber(data.qta_uni_kg)} kg` : '-',
      key: 'kg_unitari'
    },
    {
      icon: '📏',
      label: 'Metri unitari',
      value: data.qta_uni_ml ? `${formatNumber(data.qta_uni_ml)} mt` : '-',
      key: 'metri_unitari'
    }
  ];

  // 🆕 Divide i campi in 2 righe da 3
  const firstRow = allFields.slice(0, 3);  // Miscela, Kg Totali, Larghezza
  const secondRow = allFields.slice(3, 6); // Spessore, Kg unitari, Metri unitari

  return (
    <div className={`material-specs-section ${isCompleted ? 'completed' : ''}`}>
      {/* Header della sezione - INVARIATO */}
      <div className="material-specs-header">
        <span className="material-icon">🔬</span>
        <span className="material-title">Specifiche Materiale</span>
      </div>

      {/* 🆕 NUOVA STRUTTURA: Griglia unificata 3x2 */}
      <div className="material-specs-grid-3x2">
        
        {/* 🆕 PRIMA RIGA: Miscela, Kg Totali, Larghezza */}
        <div className="spec-row-3col">
          {firstRow.map((field, index) => (
            <div key={field.key} className="spec-item-3col">
              <span className="spec-icon">{field.icon}</span>
              <span className="spec-label">{field.label}</span>
              <span className="spec-value-key">{field.value}</span>
            </div>
          ))}
        </div>

        {/* 🆕 SECONDA RIGA: Spessore, Kg unitari, Metri unitari */}
        <div className="spec-row-3col">
          {secondRow.map((field, index) => (
            <div key={field.key} className="spec-item-3col">
              <span className="spec-icon">{field.icon}</span>
              <span className="spec-label">{field.label}</span>
              <span className="spec-value-key">{field.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
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

      <div className="card-body">
        {/* Sezione Ordine e Articolo */}
        <div className="order-article-vertical">
          {/* Box Ordine */}
          <div className="spec-item">
            <span className="spec-icon">📋</span>
            <span className="spec-label">Ordine</span>
            <span className="spec-value-key">{data.fp_schedula_completo || '-'}</span>
          </div>
          
          {/* Box Articolo */}
          <div className="spec-item">
            <span className="spec-icon">🏷️</span>
            <span className="spec-label">Articolo</span>
            <span className="spec-value-key">{articoloCompleto()}</span>
          </div>
        </div>

        {/* Sezione Specifiche Materiale */}
        <MaterialSpecs 
          data={data} 
          isCompleted={isProductionComplete}
        />

        {/* 🆕 NUOVA SEZIONE PROGRESS - DOPO MATERIAL SPECS */}
        <ProgressSection data={data} />

        {/* Sezione Hopper - SOTTO TUTTO */}
        <HopperStatus 
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
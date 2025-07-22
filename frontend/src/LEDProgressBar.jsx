import React, { useState, useEffect } from 'react';

// Componente Three Dots (ALLINEAMENTO SISTEMATO)
const LoadingThreeDots = ({ color = '#00cc66', size = 14 }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // 🎯 FISSO: Allineamento verticale perfetto
    gap: '8px', // 🎯 FISSO: Gap ridotto per compattezza
    height: '100%', // 🎯 FISSO: Usa tutta l'altezza del container
  }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: color,
          animation: `dotPulse 1.4s infinite ease-in-out both`,
          animationDelay: `${i * 0.16}s`,
          // 🎯 FISSO: Assicura allineamento perfetto
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    ))}
  </div>
);

const LEDProgressBar = ({ current, total, unit = "bobine", machineStatus }) => {
  const [pulseActive, setPulseActive] = useState(true);
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  // 🎨 NUOVA FUNZIONE: Colore dinamico basato su avanzamento + stato macchina (4 COLORI)
  const getProgressColor = () => {
    // Se la macchina è ferma, sempre grigio (OVERRIDE)
    if (machineStatus?.includes('FERMA')) {
      return {
        color: '#666666',  // Grigio - Macchina ferma
        name: 'Fermo',
        glow: '#66666660'
      };
    }
    
    // Se c'è un errore/scarto, sempre rosso scuro
    if (machineStatus?.includes('SCARTO')) {
      return {
        color: '#d32f2f',  // Rosso scuro - Errore/Scarto
        name: 'Errore',
        glow: '#d32f2f60'
      };
    }
    
    // Colore basato sulla percentuale di avanzamento (SOLO se macchina attiva)
    if (percentage >= 75) {
      return {
        color: '#4caf50',  // Verde - Quasi completato (75%+)
        name: 'Completamento',
        glow: '#4caf5060'
      };
    } else if (percentage >= 25) {
      return {
        color: '#ff9800',  // Arancione - Produzione normale (25-74%)
        name: 'Produzione',
        glow: '#ff980060'
      };
    } else if (percentage > 0) {
      return {
        color: '#f44336',  // Rosso - Inizio critico (1-24%)
        name: 'Inizio',
        glow: '#f4433660'
      };
    } else {
      return {
        color: '#666666',  // Grigio - Nessun avanzamento
        name: 'Fermo',
        glow: '#66666660'
      };
    }
  };
  
  const progressColor = getProgressColor();
  
  // Logica stato macchina - AGGIORNATA per usare colore dinamico con rosso
  const getMachineStatus = () => {
    if (percentage === 0) return { type: 'none', show: false, isActive: false };
    
    switch(machineStatus) {
      case '🔴 FERMA':
        return { type: 'dot', color: '#f44336', pulse: false, show: true, isActive: false };
      case '🟢 IN PRODUZIONE':
        return { type: 'motion', color: progressColor.color, show: true, isActive: true };
      case '🟡 RIAVVIO':
        return { type: 'motion', color: progressColor.color, show: true, isActive: true };
      case '🔵 INIZIO PRODUZIONE':
        return { type: 'motion', color: progressColor.color, show: true, isActive: true };
      case '🟠 SCARTO':
        return { type: 'dot', color: '#d32f2f', pulse: false, show: true, isActive: false };
      case 'STATO 5':
        return { type: 'dot', color: '#1976d2', pulse: false, show: true, isActive: false };
      case '-':
        return { type: 'dot', color: '#9e9e9e', pulse: false, show: true, isActive: false };
      default:
        if (percentage >= 95) return { type: 'dot', color: '#4caf50', pulse: false, show: true, isActive: false };
        return { type: 'motion', color: progressColor.color, show: true, isActive: true };
    }
  };

  const statusIndicator = getMachineStatus();
  
  return (
    <div className="led-progress-section">
      {/* 🎯 HEADER CON ALLINEAMENTO PERFETTO - SISTEMATP */}
      <div className="led-header-fixed">
        <div className="led-title-container">
          <span className="led-icon">⚙️</span>
          <span className="led-title">Avanzamento</span>
          {/* 🆕 NUOVO: Indicatore stato colore */}
          <span 
            className="progress-status-label"
            style={{ 
              color: progressColor.color,
              fontSize: '0.8rem',
              fontWeight: '500',
              opacity: 0.8
            }}
          >
            ({progressColor.name})
          </span>
        </div>
        
        {/* 🎯 CONTAINER PALLINI CON ALLINEAMENTO PERFETTO */}
        {statusIndicator.show && (
          <div className="status-indicator-container">
            {statusIndicator.type === 'motion' ? (
              <LoadingThreeDots color={statusIndicator.color} size={14} />
            ) : (
              <div className="status-dot" style={{
                backgroundColor: statusIndicator.color,
                opacity: statusIndicator.pulse ? (pulseActive ? 1 : 0.4) : 1,
                boxShadow: `0 0 8px ${statusIndicator.color}60`,
                border: `1px solid ${statusIndicator.color}80`
              }} />
            )}
          </div>
        )}
      </div>
      
      {/* ⭐ CONTEGGIO PROMINENTE con colore dinamico */}
      <div className="led-counter-prominent">
        <span 
          className="led-current-key"
          style={{ color: progressColor.color }}
        >
          {current}
        </span>
        <span className="led-separator-key">/</span>
        <span className="led-total-key">{total}</span>
      </div>
      
      {/* Barra di progresso wave con colore dinamico */}
      <div className="wave-progress-container">
        <div className="wave-progress-track">
          <div 
            className="wave-progress-fill"
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: progressColor.color,
              backgroundImage: statusIndicator.isActive ? 
                `repeating-linear-gradient(
                  45deg,
                  ${progressColor.color},
                  ${progressColor.color} 8px,
                  rgba(255,255,255,0.1) 8px,
                  rgba(255,255,255,0.1) 16px
                )` : 'none',
              animation: statusIndicator.isActive ? 'waveFlow 2s linear infinite' : 'none',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' // Smooth color transition
            }}
          >
            {statusIndicator.isActive && (
              <div 
                className="wave-glow"
                style={{
                  backgroundColor: progressColor.color,
                  boxShadow: `0 0 10px ${progressColor.glow}, inset 0 0 10px rgba(255,255,255,0.1)`
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 🎯 CSS AGGIORNATO con allineamento perfetto */}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { 
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes waveFlow {
          0% { background-position: 0px 0px; }
          100% { background-position: 32px 0px; }
        }

        /* 🎯 HEADER ALLINEAMENTO PERFETTO */
        .led-header-fixed {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 16px !important;
          padding: 8px 0 !important;
          min-height: 24px !important; /* 🎯 Altezza fissa per allineamento */
        }

        .led-title-container {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          height: 24px !important; /* 🎯 Stessa altezza del container pallini */
        }

        .led-title {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          color: #ffffff !important;
          text-transform: uppercase !important;
          letter-spacing: 0.02rem !important;
          line-height: 1 !important; /* 🎯 Line-height controllato */
        }

        .led-icon {
          font-size: 1rem !important;
          line-height: 1 !important; /* 🎯 Line-height controllato */
        }

        /* 🎯 CONTAINER PALLINI CON ALLINEAMENTO PERFETTO */
        .status-indicator-container {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 24px !important; /* 🎯 Stessa altezza del titolo */
          min-width: 60px !important; /* 🎯 Larghezza minima per 3 pallini */
        }

        .status-dot {
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
          transition: opacity 0.8s ease !important;
        }

        /* ⭐ CONTEGGIO PROMINENTE con colore dinamico */
        .led-counter-prominent {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 8px;
          margin: 20px 0;
          padding: 16px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.08));
          border-radius: 12px;
          border: 2px solid #444;
        }

        .led-current-key {
          font-size: 3.2rem !important;
          font-weight: 700 !important;
          line-height: 1;
          transition: color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .led-separator-key {
          font-size: 2.2rem !important;
          color: #888888;
          margin: 0 6px;
          font-weight: 500;
        }

        .led-total-key {
          font-size: 2.2rem !important;
          font-weight: 600 !important;
          color: #cccccc !important;
          line-height: 1;
        }

        /* Barra di progresso wave */
        .wave-progress-container {
          margin: 16px 0 0 0;
        }

        .wave-progress-track {
          width: 100%;
          height: 18px;
          background: linear-gradient(90deg, #2a2a2a, #333);
          border-radius: 9px;
          overflow: hidden;
          border: 1px solid #555;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .wave-progress-fill {
          height: 100%;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }

        .wave-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 8px;
          opacity: 0.3;
        }

        /* Responsive per schermi più piccoli */
        @media (max-width: 768px) {
          .led-current-key {
            font-size: 2.6rem !important;
          }

          .led-separator-key, .led-total-key {
            font-size: 1.8rem !important;
          }

          .led-header-fixed {
            min-height: 20px !important;
          }

          .led-title-container, .status-indicator-container {
            height: 20px !important;
          }

          .led-title {
            font-size: 0.8rem !important;
          }
        }

        /* Responsive per TV 4K */
        @media (min-width: 3840px) {
          .led-current-key {
            font-size: 4rem !important;
          }

          .led-separator-key, .led-total-key {
            font-size: 2.8rem !important;
          }

          .wave-progress-track {
            height: 24px;
          }

          .led-header-fixed {
            min-height: 32px !important;
          }

          .led-title-container, .status-indicator-container {
            height: 32px !important;
          }

          .led-title {
            font-size: 1.2rem !important;
          }

          .led-icon {
            font-size: 1.4rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LEDProgressBar;
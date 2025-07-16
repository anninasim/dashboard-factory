import React, { useState, useEffect } from 'react';

// Componente Three Dots (esistente)
const LoadingThreeDots = ({ color = '#00cc66', size = 14 }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
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
          animationDelay: `${i * 0.16}s`
        }}
      />
    ))}
  </div>
);

// 🎨 FUNZIONE per determinare i colori della barra in base allo stato macchina
const getProgressColors = (machineStatus, percentage) => {
  // Se la macchina è ferma, tutto grigio
  if (machineStatus.includes('FERMA')) {
    return {
      activeColor: '#666666',
      trackColor: '#333333',
      segments: {
        red: '#555555',
        orange: '#555555', 
        green: '#555555'
      }
    };
  }
  
  // Se la macchina è in scarto, tutto rosso/arancione
  if (machineStatus.includes('SCARTO')) {
    return {
      activeColor: '#f44336',
      trackColor: '#2a1f1f',
      segments: {
        red: '#f44336',
        orange: '#f44336',
        green: '#f44336'
      }
    };
  }
  
  // Se la macchina è in riavvio, tutto giallo
  if (machineStatus.includes('RIAVVIO')) {
    return {
      activeColor: '#ffc107',
      trackColor: '#2a2a1f',
      segments: {
        red: '#ffc107',
        orange: '#ffc107',
        green: '#ffc107'
      }
    };
  }
  
  // Se la macchina è in produzione, colori basati sull'avanzamento
  if (machineStatus.includes('IN PRODUZIONE') || machineStatus.includes('INIZIO PRODUZIONE')) {
    return {
      activeColor: '#00cc66',
      trackColor: '#1f2a1f',
      segments: {
        red: '#cc4444',     // 0-33%
        orange: '#cc7700',  // 34-66%
        green: '#00cc66'    // 67-100%
      }
    };
  }
  
  // Default: colori normali
  return {
    activeColor: '#00cc66',
    trackColor: '#2a2a2a',
    segments: {
      red: '#cc4444',
      orange: '#cc7700',
      green: '#00cc66'
    }
  };
};

const LEDProgressBar = ({ 
  current, 
  total, 
  unit = "bobine", 
  machineStatus, 
  machineColor,
  percentage 
}) => {
  const [pulseActive, setPulseActive] = useState(true);
  const calculatedPercentage = total > 0 ? (current / total) * 100 : 0;
  const segments = 20;
  const activeSegments = Math.floor((calculatedPercentage / 100) * segments);
  
  // 🎨 Ottieni i colori basati sullo stato della macchina
  const colors = getProgressColors(machineStatus, calculatedPercentage);
  
  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  // Logica stato macchina
  const getMachineStatus = () => {
    if (calculatedPercentage === 0) return { type: 'none', show: false, isActive: false };
    
    switch(machineStatus) {
      case '🔴 FERMA':
        return { type: 'dot', color: '#cc4444', pulse: false, show: true, isActive: false };
      case '🟢 IN PRODUZIONE':
        return { type: 'motion', color: colors.activeColor, show: true, isActive: true };
      case '🟡 RIAVVIO':
        return { type: 'motion', color: '#ffc107', show: true, isActive: true };
      case '🔵 INIZIO PRODUZIONE':
        return { type: 'motion', color: colors.activeColor, show: true, isActive: true };
      case '🟠 SCARTO':
        return { type: 'dot', color: '#f44336', pulse: false, show: true, isActive: false };
      case 'STATO 5':
        return { type: 'dot', color: '#1976d2', pulse: false, show: true, isActive: false };
      case '-':
        return { type: 'dot', color: '#9e9e9e', pulse: false, show: true, isActive: false };
      default:
        if (calculatedPercentage >= 95) return { type: 'dot', color: '#666666', pulse: false, show: true, isActive: false };
        return { type: 'motion', color: colors.activeColor, show: true, isActive: true };
    }
  };

  const statusIndicator = getMachineStatus();
  
  return (
    <div className="led-progress-section">
      {/* Header con indicatore di stato - titolo più conciso */}
      <div className="led-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-icon">⚙️</span>
          <span className="led-title">Avanzamento</span>
        </div>
        
        {statusIndicator.show && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {statusIndicator.type === 'motion' ? (
              <LoadingThreeDots color={statusIndicator.color} size={16} />
            ) : (
              <div style={{
                width: '10px',
                height: '10px',
                backgroundColor: statusIndicator.color,
                borderRadius: '50%',
                opacity: statusIndicator.pulse ? (pulseActive ? 1 : 0.4) : 1,
                transition: 'opacity 0.8s ease',
                boxShadow: `0 0 8px ${statusIndicator.color}60`,
                border: `1px solid ${statusIndicator.color}80`
              }} />
            )}
          </div>
        )}
      </div>
      
      {/* ⭐ CONTEGGIO PROMINENTE - Numeri chiave in grande evidenza */}
      <div className="led-counter-prominent">
        <span className="led-current-key" style={{ color: statusIndicator.isActive ? colors.activeColor : '#666666' }}>
          {current}
        </span>
        <span className="led-separator-key">/</span>
        <span className="led-total-key">{total}</span>
      </div>
      
      {/* Barra LED con colori condizionati */}
      <div className="led-bar-container">
        {Array.from({ length: segments }, (_, i) => {
          const isActive = i < activeSegments;
          let segmentClass = 'led-segment';
          
          if (isActive) {
            // Usa i colori condizionati invece di quelli fissi
            if (i < segments * 0.33) {
              segmentClass += ' led-red';
            } else if (i < segments * 0.66) {
              segmentClass += ' led-orange';
            } else {
              segmentClass += ' led-green';
            }
          } else {
            segmentClass += ' led-off';
          }
          
          return (
            <div
              key={i}
              className={segmentClass}
              style={{
                // Applica i colori condizionati
                backgroundColor: isActive ? 
                  (i < segments * 0.33 ? colors.segments.red :
                   i < segments * 0.66 ? colors.segments.orange : 
                   colors.segments.green) : 
                  '#333333'
              }}
            />
          );
        })}
      </div>
      
      {/* Barra di progresso wave con colori condizionati */}
      <div className="wave-progress-container">
        <div className="wave-progress-track" style={{ backgroundColor: colors.trackColor }}>
          <div 
            className="wave-progress-fill"
            style={{ 
              width: `${Math.min(calculatedPercentage, 100)}%`,
              backgroundColor: statusIndicator.isActive ? colors.activeColor : '#666666',
              backgroundImage: statusIndicator.isActive ? 
                `repeating-linear-gradient(
                  45deg,
                  ${colors.activeColor},
                  ${colors.activeColor} 8px,
                  rgba(255,255,255,0.1) 8px,
                  rgba(255,255,255,0.1) 16px
                )` : 'none',
              animation: statusIndicator.isActive ? 'waveFlow 2s linear infinite' : 'none'
            }}
          >
            {statusIndicator.isActive && (
              <div 
                className="wave-glow"
                style={{
                  backgroundColor: colors.activeColor,
                  boxShadow: `0 0 10px ${colors.activeColor}60, inset 0 0 10px rgba(255,255,255,0.1)`
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* CSS Styles per il nuovo design */}
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

        /* ⭐ NUOVI STILI: Conteggio prominente per massima visibilità */
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
          transition: color 0.5s ease;
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

        /* Barra LED con colori condizionati */
        .led-bar-container {
          display: flex;
          gap: 2px;
          margin-bottom: 12px;
          padding: 4px;
          background-color: #1a1a1a;
          border-radius: 6px;
          border: 1px solid #444;
          justify-content: center;
        }

        .led-segment {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          transition: all 0.4s ease;
          border: 1px solid #2a2a2a;
        }

        .led-segment.led-off {
          background-color: #333333;
          opacity: 0.4;
        }

        /* Barra di progresso wave (senza progresso circolare) */
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
          transition: background-color 0.5s ease;
        }

        .wave-progress-fill {
          height: 100%;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease;
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
        }
      `}</style>
    </div>
  );
};

export default LEDProgressBar;
import React, { useState, useEffect } from 'react';

const LEDProgressBar = ({ current, total, unit = "bobine", machineStatus }) => {
  const [pulseActive, setPulseActive] = useState(true);
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const segments = 20;
  const activeSegments = Math.floor((percentage / 100) * segments);
  
  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  // Logica stato macchina basata su dati reali
  const getMachineStatus = () => {
    if (percentage === 0) return { color: '#666666', pulse: false, show: false }; // Nessuna produzione
    if (machineStatus === 'FERMA') return { color: '#cc4444', pulse: false, show: true }; // Ferma
    if (machineStatus === 'IN PRODUZIONE') return { color: '#00cc66', pulse: true, show: true }; // Attiva
    if (machineStatus === 'RIAVVIO') return { color: '#ff9500', pulse: true, show: true }; // Riavvio
    if (percentage >= 95) return { color: '#666666', pulse: false, show: true }; // Completata
    
    // Default: in produzione
    return { color: '#00cc66', pulse: true, show: true };
  };

  const statusDot = getMachineStatus();
  
  return (
    <div className="led-progress-section">
      {/* Header con dot di stato */}
      <div className="led-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-icon">⚙️</span>
          <span className="led-title">Avanzamento {unit}</span>
        </div>
        
        {/* Dot di stato intelligente */}
        {statusDot.show && (
          <div style={{
            width: '10px',
            height: '10px',
            backgroundColor: statusDot.color,
            borderRadius: '50%',
            opacity: statusDot.pulse ? (pulseActive ? 1 : 0.4) : 1,
            transition: 'opacity 0.8s ease',
            boxShadow: `0 0 8px ${statusDot.color}60`,
            border: `1px solid ${statusDot.color}80`
          }} />
        )}
      </div>
      
      {/* Conteggio bobine */}
      <div className="led-counter">
        <span className="led-current">{current}</span>
        <span className="led-separator">/</span>
        <span className="led-total">{total}</span>
        <span className="led-unit">{unit}</span>
      </div>
      
      {/* Barra LED con pulse solo se attiva */}
      <div className="led-bar-container">
        {Array.from({ length: segments }, (_, i) => {
          const isActive = i < activeSegments;
          let segmentClass = 'led-segment';
          
          if (isActive) {
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
          
          // Pulse solo sull'ultimo LED se macchina attiva
          const isLastActive = isActive && i === activeSegments - 1;
          const shouldPulse = isLastActive && statusDot.pulse && pulseActive;
          
          return (
            <div
              key={i}
              className={segmentClass}
              style={{
                opacity: isActive ? (shouldPulse ? 1 : 0.85) : 0.3,
                transform: shouldPulse ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.6s ease'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LEDProgressBar;
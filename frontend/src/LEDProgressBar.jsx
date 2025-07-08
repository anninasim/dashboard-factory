import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Componente Three Dots esattamente come l'esempio originale Motion
const LoadingThreeDots = ({ color = '#00cc66', size = 12 }) => {
  const dotVariants = {
    pulse: {
      scale: [1, 1.3, 1],
      transition: {
        duration: 0.9,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="pulse"
      transition={{ staggerChildren: -0.15, staggerDirection: -1 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '7px',
      }}
    >
      <motion.div 
        variants={dotVariants}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: color,
          willChange: 'transform',
        }}
      />
      <motion.div 
        variants={dotVariants}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: color,
          willChange: 'transform',
        }}
      />
      <motion.div 
        variants={dotVariants}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: color,
          willChange: 'transform',
        }}
      />
    </motion.div>
  );
};

const LEDProgressBar = ({ current, total, unit = "bobine", machineStatus }) => {
  const [pulseActive, setPulseActive] = useState(true);
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const segments = 20;
  const activeSegments = Math.floor((percentage / 100) * segments);
  
  // Pulse animation per LED
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  // Logica stato macchina basata su dati reali
  const getMachineStatus = () => {
    if (percentage === 0) return { type: 'none', show: false };
    
    switch(machineStatus) {
      case 'FERMA':
        return { type: 'dot', color: '#cc4444', pulse: false, show: true }; // 🔴 Dot rosso fisso
        
      case 'IN PRODUZIONE':
        return { type: 'motion', color: '#00cc66', show: true }; // 🟢 Motion dots verdi
        
      case 'RIAVVIO':
        return { type: 'motion', color: '#ff9500', show: true }; // 🟡 Motion dots gialli
        
      case 'INIZIO PRODUZIONE':
        return { type: 'motion', color: '#00cc66', show: true }; // 🟢 Motion dots verdi
        
      case 'SCARTO':
        return { type: 'dot', color: '#cc4444', pulse: false, show: true }; // 🔴 Dot rosso fisso
        
      case 'STATO 5':
        return { type: 'dot', color: '#1976d2', pulse: false, show: true }; // 🔵 Dot blu fisso
        
      case '-':
        return { type: 'dot', color: '#9e9e9e', pulse: false, show: true }; // ⚫ Dot grigio fisso
        
      default:
        if (percentage >= 95) return { type: 'dot', color: '#666666', pulse: false, show: true };
        return { type: 'motion', color: '#00cc66', show: true }; // Default: motion dots verdi
    }
  };

  const statusIndicator = getMachineStatus();
  
  return (
    <div className="led-progress-section">
      {/* Header con indicatore di stato */}
      <div className="led-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-icon">⚙️</span>
          <span className="led-title">Avanzamento {unit}</span>
        </div>
        
        {/* Indicatore di stato con Motion originale */}
        {statusIndicator.show && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {statusIndicator.type === 'motion' ? (
              <LoadingThreeDots 
                color={statusIndicator.color} 
                size={8} 
              />
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
      
      {/* Conteggio bobine */}
      <div className="led-counter">
        <span className="led-current">{current}</span>
        <span className="led-separator">/</span>
        <span className="led-total">{total}</span>
        <span className="led-unit">{unit}</span>
      </div>
      
      {/* Barra LED */}
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
          const shouldPulse = isLastActive && statusIndicator.type === 'motion' && pulseActive;
          
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
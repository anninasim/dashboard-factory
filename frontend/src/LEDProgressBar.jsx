import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

// 📊 NUOVO: Circular Progress Chart
const CircularProgress = ({ percentage, size = 250, strokeWidth = 2 }) => {
  // Colore dinamico basato su percentuale
  const getProgressColor = (percent) => {
    if (percent < 33) return '#cc4444'; // Rosso
    if (percent < 66) return '#cc7700'; // Arancione  
    return '#00cc66'; // Verde
  };

  const progressColor = getProgressColor(percentage);
  const data = [
    { name: 'completed', value: percentage },
    { name: 'remaining', value: 100 - percentage }
  ];

  return (
    <div style={{ 
      position: 'relative', 
      width: size, 
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Chart circolare */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={size/2 - strokeWidth*2}
            outerRadius={size/2 - strokeWidth/2}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={progressColor} />
            <Cell fill="#333333" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Percentuale al centro */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: `${size * 0.2}px`,
          fontWeight: 'bold',
          color: '#ffffff',
          lineHeight: 1
        }}>
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
};

// 🌊 Wave Progress Component (esistente)
const WaveProgress = ({ percentage, isActive = false }) => {
  const getProgressColor = (percent) => {
    if (percent < 33) return '#cc4444';
    if (percent < 66) return '#cc7700';
    return '#00cc66';
  };

  const progressColor = getProgressColor(percentage);
  
  return (
    <div className="wave-progress-container">
      <div className="wave-progress-track">
        <div 
          className="wave-progress-fill"
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: progressColor,
            backgroundImage: isActive ? 
              `repeating-linear-gradient(
                45deg,
                ${progressColor},
                ${progressColor} 8px,
                rgba(255,255,255,0.1) 8px,
                rgba(255,255,255,0.1) 16px
              )` : 'none',
            animation: isActive ? 'waveFlow 2s linear infinite' : 'none'
          }}
        >
          {isActive && (
            <div 
              className="wave-glow"
              style={{
                backgroundColor: progressColor,
                boxShadow: `0 0 10px ${progressColor}60, inset 0 0 10px rgba(255,255,255,0.1)`
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

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
  
  // Logica stato macchina
  const getMachineStatus = () => {
    if (percentage === 0) return { type: 'none', show: false, isActive: false };
    
    switch(machineStatus) {
      case 'FERMA':
        return { type: 'dot', color: '#cc4444', pulse: false, show: true, isActive: false };
      case 'IN PRODUZIONE':
        return { type: 'motion', color: '#00cc66', show: true, isActive: true };
      case 'RIAVVIO':
        return { type: 'motion', color: '#ff9500', show: true, isActive: true };
      case 'INIZIO PRODUZIONE':
        return { type: 'motion', color: '#00cc66', show: true, isActive: true };
      case 'SCARTO':
        return { type: 'dot', color: '#cc4444', pulse: false, show: true, isActive: false };
      case 'STATO 5':
        return { type: 'dot', color: '#1976d2', pulse: false, show: true, isActive: false };
      case '-':
        return { type: 'dot', color: '#9e9e9e', pulse: false, show: true, isActive: false };
      default:
        if (percentage >= 95) return { type: 'dot', color: '#666666', pulse: false, show: true, isActive: false };
        return { type: 'motion', color: '#00cc66', show: true, isActive: true };
    }
  };

  const statusIndicator = getMachineStatus();
  
  return (
    <div className="led-progress-section">
      {/* Header con indicatore di stato */}
      <div className="led-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="led-icon">⚙️</span>
          <span className="led-title">Stato di avanzamento della produzione {unit}</span>
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
      
      {/* Conteggio bobine */}
      <div className="led-counter">
        <span className="led-current">{current}</span>
        <span className="led-separator">/</span>
        <span className="led-total">{total}</span>
        {/* <span className="led-unit">{unit}</span> */}
      </div>
      
      {/* 🎯 NUOVA SEZIONE: Progress Combo */}
      <div className="progress-combo">
        {/* Circular Progress - Ingrandito per TV 4K */}
        <div className="circular-section">
          <CircularProgress 
            percentage={percentage} 
            size={100} 
            strokeWidth={8}
          />
        </div>
        
        {/* Wave Progress */}
        <div className="wave-section">
          <WaveProgress 
            percentage={percentage} 
            isActive={statusIndicator.isActive}
          />
        </div>
      </div>
      
      {/* CSS Styles */}
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
        
        .progress-combo {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 16px 0;
        }
        
        .circular-section {
          flex-shrink: 0;
        }
        
        .wave-section {
          flex: 1;
        }
        
        .wave-progress-container {
          margin: 0;
        }
        
        .wave-progress-track {
          width: 100%;
          height: 14px;
          background: linear-gradient(90deg, #2a2a2a, #333);
          border-radius: 7px;
          overflow: hidden;
          border: 1px solid #555;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        
        .wave-progress-fill {
          height: 100%;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 6px;
          position: relative;
          overflow: hidden;
        }
        
        .wave-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 6px;
          opacity: 0.3;
        }
        
        /* Responsive per TV 4K */
        @media (min-width: 3840px) {
          .progress-combo {
            gap: 24px;
          }
          
          .circular-section {
            /* Ancora più grande su 4K */
            transform: scale(1.2);
          }
          
          .wave-progress-track {
            height: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default LEDProgressBar;
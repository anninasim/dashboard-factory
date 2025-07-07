import React from 'react';

const LEDProgressBar = ({ current, total, unit = "bobine" }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const segments = 20;
  const activeSegments = Math.floor((percentage / 100) * segments);
  
  return (
    <div className="led-progress-section">
      {/* Header della sezione */}
      <div className="led-header">
        <span className="led-icon">⚙️</span>
        <span className="led-title">Avanzamento {unit}</span>
      </div>
      
      {/* Conteggio bobine con numeri grandi */}
      <div className="led-counter">
        <span className="led-current">{current}</span>
        <span className="led-separator">/</span>
        <span className="led-total">{total}</span>
        <span className="led-unit">{unit}</span>
      </div>
      
      {/* Barra LED con quadratini */}
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
          
          return (
            <div
              key={i}
              className={segmentClass}
            />
          );
        })}
      </div>
      
      {/* Indicatori numerici minimi */}
      <div className="led-indicators">
        <span>0</span>
        <span>{total}</span>
      </div>
    </div>
  );
};

export default LEDProgressBar;
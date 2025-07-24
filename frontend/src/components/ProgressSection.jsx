import React from 'react';

// Componente ULTRA COMPATTO con effetto WOW come screenshot
const ProgressSection = ({ data }) => {
  const current = data.mntg_qta_lotti_attuale || 0;  
  const total = data.mntg_qta_lotti || 0;    
  const status = data.stato_desc || '';     

  const velocita = data.mntg_vel_ril || 0;
  const portata = data.mntg_portata_ril || 0;

  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  const getProgressColor = () => {
    // 🚫 STATI SPECIALI - mantengono colori specifici
    if (status?.includes('FERMA')) return 'linear-gradient(90deg, #666666, #777777)';
    if (status?.includes('SCARTO')) return 'linear-gradient(90deg, #ff6b35, #ff8a65)'; // Arancione invece di rosso
    
    // � GRADIENTI MULTI-COLORE DINAMICI BASATI SU PERCENTUALE
    // GRADIENTE DINAMICO ARANCIONE → GIALLO → VERDE
    if (percentage >= 80) {
      // 80-100%: GRADIENTE COMPLETO arancione → giallo → verde
      return 'linear-gradient(90deg, #ff9800 0%, #ffc107 50%, #4caf50 100%)';
    } else if (percentage >= 50) {
      // 50-79%: GRADIENTE arancione → giallo
      return 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)';
    } else if (percentage > 0) {
      // 1-49%: ARANCIONE puro
      return 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)';
    }
    
    return 'linear-gradient(90deg, #666666, #777777)'; // Grigio neutro per 0%
  };

  const progressColor = getProgressColor();
  const isActive = status?.includes('PRODUZIONE') || status?.includes('RIAVVIO');

  return (
    <div className="progress-ultra-compact">
      {/* 🎯 LAYOUT SEMPLICE: Counter SOPRA + Progress Bar PURA + KPI a DESTRA */}
      <div className="progress-clean-layout">
        
        {/* SINISTRA: Progress + Counter separati (60% larghezza) */}
        <div className="progress-section-clean">
          {/* Header con PROGRESSO a sinistra e percentuale a destra */}
          <div className="progress-header-top">
            <span className="progress-label-clean">PROGRESSO</span>
            <span className="percent-clean">{percentage.toFixed(0)}%</span>
          </div>
          
          {/* Counter ESTERNO alla progress bar - spostato più in basso */}
          <div className="progress-counter-external">
            <span className="counter-clean">
              <span className="count-current-clean">{current}</span>
              <span className="count-sep-clean">/</span>
              <span className="count-total-clean">{total}</span>
              <span className="count-unit-clean">bobine</span>
            </span>
          </div>
          
          {/* Progress bar PURA senza testo sovrapposto */}
          <div className="progress-bar-pure">
            <progress 
              className="progress-element"
              value={percentage} 
              max="100"
              style={{
                '--progress-color': progressColor,
                '--progress-glow': isActive ? `0 0 12px rgba(66, 165, 245, 0.4)` : 'none' // Glow blu neutro
              }}
            />
          </div>
        </div>

        {/* DESTRA: KPI Portata e Velocità (40% larghezza) */}
        <div className="kpi-section-clean">
          <div className="kpi-compact-clean">
            <div className="kpi-item-clean">
              <span className="kpi-label-clean">VEL</span>
              <div className="kpi-data-clean">
                <span className="kpi-icon-clean">⚡</span>
                <span className="kpi-val-clean" style={{ color: '#4fc3f7' }}>
                  {velocita.toFixed(0)}
                </span>
                <span className="kpi-unit-clean">mt/min</span>
              </div>
            </div>
            
            <div className="kpi-item-clean">
              <span className="kpi-label-clean">PORT</span>
              <div className="kpi-data-clean">
                <span className="kpi-icon-clean">⚖️</span>
                <span className="kpi-val-clean" style={{ color: '#ffb74d' }}>
                  {portata.toFixed(0)}
                </span>
                <span className="kpi-unit-clean">Kg/h</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProgressSection;
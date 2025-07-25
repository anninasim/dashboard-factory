import React from 'react';
import { Progress } from '../ui/Progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/BadgeFixed';
import { TrendingUp, Gauge, Zap, Package } from 'lucide-react';

// Componente Progress Section PROFESSIONALE con shadcn/ui
const ProgressSectionPro = ({ data }) => {
  const current = data.mntg_qta_lotti_attuale || 0;  
  const total = data.mntg_qta_lotti || 0;    
  const status = data.stato_desc || '';     

  const velocita = data.mntg_vel_ril || 0;
  const portata = data.mntg_portata_ril || 0;

  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  const getStatusBadge = () => {
    if (status?.includes('FERMA')) return { variant: 'secondary', label: 'FERMA' };
    if (status?.includes('SCARTO')) return { variant: 'warning', label: 'SCARTO' };
    if (status?.includes('PRODUZIONE')) return { variant: 'success', label: 'PRODUZIONE' };
    if (status?.includes('RIAVVIO')) return { variant: 'info', label: 'RIAVVIO' };
    return { variant: 'outline', label: status || 'N/A' };
  };

  const statusBadge = getStatusBadge();
  const isActive = status?.includes('PRODUZIONE') || status?.includes('RIAVVIO');

  return (
    <Card className="w-full h-80 bg-gradient-to-br from-slate-900/40 to-slate-800/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            PROGRESSO PRODUZIONE
          </CardTitle>
          <Badge variant={statusBadge.variant} className="text-xs font-semibold">
            {statusBadge.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-slate-400" />
              <span className="text-3xl font-bold text-white">
                {current}
              </span>
              <span className="text-lg text-slate-400">/</span>
              <span className="text-lg text-slate-300">
                {total}
              </span>
              <span className="text-sm text-slate-400 ml-1">bobine</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400">
                {percentage.toFixed(0)}%
              </div>
              <div className="text-xs text-slate-400">completato</div>
            </div>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-3 bg-slate-800/60 border border-slate-700/50" 
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-blue-300 uppercase tracking-wide">Velocità</div>
                  <div className="text-lg font-bold text-blue-400">
                    {velocita.toFixed(0)} <span className="text-xs text-blue-300">mt/min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-amber-700/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Gauge className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-amber-300 uppercase tracking-wide">Portata</div>
                  <div className="text-lg font-bold text-amber-400">
                    {portata.toFixed(0)} <span className="text-xs text-amber-300">Kg/h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

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

export default ProgressSectionPro;
// export default ProgressSection; // Versione compatta originale
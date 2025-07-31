import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/BadgeFixed';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/Tooltip';
import { Beaker, Scale, Ruler, Info } from 'lucide-react';

// 🎯 Componente MODERNO per le specifiche tecniche del materiale con shadcn/ui
const ModernMaterialSpecs = ({ data, isCompleted }) => {
  // Funzione helper per formattare i valori numerici senza decimali inutili
  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';
    return Number.isInteger(numValue) ? numValue.toString() : numValue.toString();
  };

  // 🆕 SEPARAZIONE: Miscela nel header, altri 5 nel grid
  const miscelaData = {
    icon: <Beaker className="w-4 h-4 text-purple-400" />,
    label: 'Miscela',
    value: data.mntg_codice_ricetta || '-',
    key: 'miscela',
    color: 'text-purple-300'
  };

  const gridFields = [
    {
      icon: <Scale className="w-4 h-4 text-green-400" />,
      label: 'Kg Totali',
      value: `${formatNumber(data.mntg_qta_ini)} kg`,
      key: 'kg_totali',
      color: 'text-green-300'
    },
    {
      icon: <Ruler className="w-4 h-4 text-blue-400" />,
      label: 'Larghezza',
      value: data.larghezza ? `${formatNumber(data.larghezza)} mt` : '-',
      key: 'larghezza',
      color: 'text-blue-300'
    },
    {
      icon: <Ruler className="w-4 h-4 text-orange-400" />,
      label: 'Spessore',
      value: data.spessore_micron ? `${formatNumber(data.spessore_micron)} μm` : '-',
      key: 'spessore',
      color: 'text-orange-300'
    },
    {
      icon: <Scale className="w-4 h-4 text-cyan-400" />,
      label: 'Kg unitari',
      value: data.qta_uni_kg ? `${formatNumber(data.qta_uni_kg)} kg` : '-',
      key: 'kg_unitari',
      color: 'text-cyan-300'
    },
    {
      icon: <Ruler className="w-4 h-4 text-pink-400" />,
      label: 'Metri unitari',
      value: data.qta_uni_ml ? `${formatNumber(data.qta_uni_ml)} mt` : '-',
      key: 'metri_unitari',
      color: 'text-pink-300'
    }
  ];
  
  // Inserisci foratura accanto a Metri Lineari solo se presente e >10 caratteri
  let showForatura = false;
  let foraturaValue = '';
  if (typeof data.foratura === 'string' && data.foratura.trim().length > 10) {
    showForatura = true;
    foraturaValue = data.foratura.trim();
  }

  // Stile grigio per stato completato
  const completedStyle = isCompleted
    ? {
        color: '#b0b0b0',
        filter: 'grayscale(0.7)',
        opacity: 0.7,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #232323 60%, #2d2d2d 100%)',
      }
    : {};

  return (
    <TooltipProvider>
      <div
        className="w-full bg-gradient-to-br from-slate-900/40 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl rounded-lg"
        style={{
          ...isCompleted ? completedStyle : {},
          marginTop: 0,
          marginBottom: 0,
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          boxSizing: 'border-box',
        }}
      >
        {/* HEADER CON MISCELA A DESTRA */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-slate-600/30">
          <div className="flex items-center gap-1.5">
            <Beaker className="w-5 h-5" style={{ color: isCompleted ? '#b0b0b0' : '#a78bfa' }} />
            <span className="text-lg font-bold" style={{ color: isCompleted ? '#b0b0b0' : '#fff', lineHeight: 1.1 }}>SPECIFICHE MATERIALE</span>
          </div>
          <div className="flex items-center gap-2">
            {/* MISCELA NEL HEADER */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-1.5 bg-slate-800/50 rounded border border-slate-600/30 transition-all duration-200 px-2 py-1"
                  style={isCompleted ? { filter: 'grayscale(1)', opacity: 0.6 } : {}}
                >
                  <Beaker className="w-3 h-3" style={{ color: isCompleted ? '#b0b0b0' : '#a78bfa' }} />
                  <span className="text-base font-medium" style={{ color: isCompleted ? '#b0b0b0' : '#94a3b8' }}>Miscela:</span>
                  <span className="text-base font-bold" style={{ color: isCompleted ? '#b0b0b0' : '#c4b5fd' }}>{miscelaData.value}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-base">Miscela: {miscelaData.value}</p>
              </TooltipContent>
            </Tooltip>
            {isCompleted && (
              <Badge variant="info" className="text-xs font-semibold px-1.5 py-0.5">
                OK
              </Badge>
            )}
          </div>
        </div>

        {/* GRID COMPATTO: 5 colonne (senza miscela) - LAYOUT MODIFICATO */}
        <div className={`flex flex-row flex-nowrap items-center gap-1 p-1.5`} style={{overflowX:'auto'}}>
          {[...gridFields, ...(showForatura ? [{
            icon: <Info className="w-4 h-4 text-yellow-400 opacity-90 flex-shrink-0" />,
            label: 'Foratura',
            value: foraturaValue,
            key: 'foratura',
            color: 'text-yellow-300',
            labelColor: '#fde68a',
          }] : [])].map((field) => (
            <Tooltip key={field.key}>
              <TooltipTrigger asChild>
                <div
                  className="flex flex-col items-center justify-center flex-1 bg-slate-800/50 rounded border border-slate-600/30 transition-all duration-200 px-1 py-0.5 min-w-0"
                  style={isCompleted ? { filter: 'grayscale(1)', opacity: 0.6, minWidth: 0 } : {minWidth: 0}}
                >
                  <span className="flex items-center gap-0.5 min-w-0">
                    <span className="text-base opacity-90 flex-shrink-0">
                      {React.cloneElement(field.icon, { style: isCompleted ? { color: '#b0b0b0' } : {} })}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide leading-tight flex-shrink-0" style={{ color: isCompleted ? '#b0b0b0' : (field.labelColor || '#94a3b8') }}>
                      {field.label}
                    </span>
                  </span>
                  <span className={`font-bold text-lg text-center truncate mt-0.5 ${!isCompleted ? field.color : ''}`} style={isCompleted ? { color: '#b0b0b0', maxWidth: '100%' } : {maxWidth: '100%'}}>
                    {field.value}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {field.label}: {field.value}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ModernMaterialSpecs;
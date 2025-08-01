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
    },
    // Tipologia: aggiunta come ultima cella della griglia (prima di foratura)
    {
      icon: <Beaker className="w-4 h-4 text-lime-400" />,
      label: 'Tipologia',
      value: data.tipologia ? data.tipologia : '-',
      key: 'tipologia',
      color: 'text-lime-300',
      labelColor: '#bef264',
    },
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
        {/* Divisore rimosso su richiesta utente */}

        {/* GRID COMPATTO: 5 colonne (senza miscela) - LAYOUT MODIFICATO */}
        <div className="flex flex-row items-center gap-1 p-0.25">
          {gridFields.map((field) => (
            <Tooltip key={field.key}>
              <TooltipTrigger asChild>
                <div
                  className="flex flex-col items-center justify-center flex-1 bg-slate-800/50 rounded border border-slate-600/30 transition-all duration-200 px-1 py-0.5 min-w-0"
                  style={{
                    ...(isCompleted ? { filter: 'grayscale(1)', opacity: 0.6, minWidth: 0 } : { minWidth: 0 }),
                    minHeight: '4.2rem',
                    height: '100%',
                  }}
                >
                  <span className="flex items-center gap-0.5 min-w-0">
                    <span className="text-base opacity-90 flex-shrink-0">
                      {React.cloneElement(field.icon, { style: isCompleted ? { color: '#b0b0b0' } : {} })}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide leading-tight flex-shrink-0" style={{ color: isCompleted ? '#b0b0b0' : (field.labelColor || '#94a3b8') }}>
                      {field.label}
                    </span>
                  </span>
                  <span
                    className={`font-bold text-center mt-0.5 ${!isCompleted ? field.color : ''} truncate`}
                    style={{
                      fontSize: [
                        'kg_totali',
                        'larghezza',
                        'spessore',
                        'kg_unitari',
                        'metri_unitari'
                      ].includes(field.key)
                        ? '1.45rem'
                        : '1.2rem',
                      color: isCompleted ? '#b0b0b0' : undefined,
                      maxWidth: '100%',
                      marginTop: '0.125rem', // mt-0.5 per tutte
                    }}
                  >
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

          {/* Foratura: stessa struttura degli altri campi, label sopra, valore sotto */}
          {showForatura && (
            <Tooltip key="foratura">
              <TooltipTrigger asChild>
                <div
                  className="flex flex-col items-center justify-center flex-1 bg-slate-800/50 rounded border border-slate-600/30 transition-all duration-200 px-1 py-0.5 min-w-0"
                  style={{
                    ...(isCompleted ? { filter: 'grayscale(1)', opacity: 0.6, minWidth: 0 } : { minWidth: 0 }),
                    minHeight: '4.2rem',
                    height: '100%',
                  }}
                >
                  <span className="flex items-center gap-0.5 min-w-0">
                    <span className="text-base opacity-90 flex-shrink-0">
                      {React.cloneElement(<Info className="w-4 h-4 text-yellow-400 opacity-90 flex-shrink-0" />, { style: isCompleted ? { color: '#b0b0b0' } : {} })}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide leading-tight flex-shrink-0" style={{ color: isCompleted ? '#b0b0b0' : '#fde68a' }}>
                      Foratura
                    </span>
                  </span>
                  <span
                    className={`font-bold text-center mt-0.5 ${!isCompleted ? 'text-yellow-300' : ''} truncate`}
                    style={{
                      fontSize: '1.1rem',
                      color: isCompleted ? '#b0b0b0' : undefined,
                      maxWidth: '100%',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      lineHeight: '1.2',
                      marginTop: '0.125rem', // mt-0.5 per tutte
                    }}
                  >
                    {foraturaValue}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Foratura: {foraturaValue}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
    </TooltipProvider>
  );
}

export default ModernMaterialSpecs;
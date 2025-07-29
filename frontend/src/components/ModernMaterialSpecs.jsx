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
        style={isCompleted ? { ...completedStyle } : {}}
      >
        {/* HEADER CON MISCELA A DESTRA */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-600/30">
          <div className="flex items-center gap-1.5">
            <Beaker className="w-3.5 h-3.5" style={{ color: isCompleted ? '#b0b0b0' : '#a78bfa' }} />
            <span className="text-base font-bold" style={{ color: isCompleted ? '#b0b0b0' : '#fff' }}>SPECIFICHE MATERIALE</span>
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

        {/* GRID COMPATTO: 5 colonne (senza miscela) */}
        <div className="grid grid-cols-5 gap-1 p-2">
          {gridFields.map((field) => (
            <Tooltip key={field.key}>
              <TooltipTrigger asChild>
                <div
                  className="bg-slate-800/50 rounded border border-slate-600/30 transition-all duration-200 group px-1.5 py-1.5"
                  style={isCompleted ? { filter: 'grayscale(1)', opacity: 0.6 } : {}}
                >
                  <div className="flex flex-col items-center text-center space-y-0.5">
                    <div className="transition-transform duration-200 text-sm opacity-80">
                      {React.cloneElement(field.icon, { style: isCompleted ? { color: '#b0b0b0' } : {} })}
                    </div>
                    <div className="text-[0.75rem] font-medium uppercase tracking-wide leading-tight truncate w-full" style={{ color: isCompleted ? '#b0b0b0' : '#94a3b8' }}>
                      {field.label}
                    </div>
                    <div className="text-xl font-semibold w-full text-center" style={{ color: isCompleted ? '#b0b0b0' : undefined }}>
                      {field.value}
                    </div>
                  </div>
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

import React from 'react';
import { Badge } from './ui/BadgeFixed';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/Tooltip';
import { ClipboardList, Package } from 'lucide-react';

// 🎯 Componente MODERNO per ORDINE e ARTICOLO con shadcn/ui
const ModernOrderInfo = ({ data, isCompleted }) => {
  // ⭐ Combina articolo e descrizione in un unico campo
  const articoloCompleto = () => {
    const articolo = data.mntg_articolo || '';
    const descrizione = data.mntg_descr_articolo 
      ? data.mntg_descr_articolo.split('*')[0].trim() 
      : '';
    
    // Se abbiamo entrambi, li combiniamo con un trattino
    if (articolo && descrizione) {
      return `${articolo} - ${descrizione}`;
    }
    // Se abbiamo solo uno dei due, mostriamo quello disponibile
    if (articolo) return articolo;
    if (descrizione) return descrizione;
    // Se non abbiamo nessuno dei due, mostriamo un placeholder
    return '-';
  };

  const ordineValue = data.fp_schedula_completo || '-';
  const articoloValue = articoloCompleto();

  return (
    <TooltipProvider>
      <div className="w-full bg-gradient-to-br from-slate-900/40 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl rounded-lg">
        {/* HEADER ULTRA-COMPATTO CON TUTTO INLINE */}
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-white">ORDINE</span>
          </div>
          
          {/* ORDINE E ARTICOLO TUTTO INLINE */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* ORDINE COMPATTO */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-slate-800/50 rounded border border-slate-600/30 hover:border-blue-400/50 transition-all duration-200 px-2 py-0.5">
                  <ClipboardList className="w-3 h-3 text-blue-400" />
                  <span className="text-xs font-bold text-blue-300">{ordineValue}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Ordine: {ordineValue}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* SEPARATORE */}
            <div className="w-px h-4 bg-slate-600/30"></div>
            
            {/* ARTICOLO COMPATTO */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-slate-800/50 rounded border border-slate-600/30 hover:border-green-400/50 transition-all duration-200 px-2 py-0.5 max-w-xs">
                  <Package className="w-3 h-3 text-green-400" />
                  <span className="text-xs font-bold text-green-300 truncate">{articoloValue}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs max-w-xs">
                  <div className="font-semibold mb-1">Articolo:</div>
                  <div className="whitespace-pre-wrap">{articoloValue}</div>
                </div>
              </TooltipContent>
            </Tooltip>
            
            {isCompleted && (
              <Badge variant="info" className="text-xs font-semibold px-1.5 py-0.5">
                OK
              </Badge>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ModernOrderInfo;

import React from 'react';
import { Progress } from './ui/Progress';
import { Badge } from './ui/BadgeFixed';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/Tooltip';
import { TrendingUp, Package, Zap, Gauge } from 'lucide-react';

// Componente Progress Section BILANCIATO
const CompactProgressSection = ({ data }) => {
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
    if (status?.includes('SETUP')) return { variant: 'info', label: 'SETUP' };
    if (status?.includes('MANUTENZIONE')) return { variant: 'warning', label: 'MANUTENZIONE' };
    if (status?.includes('FERMO')) return { variant: 'secondary', label: 'FERMO' };
    // Se c'è un stato ma non è riconosciuto, mostriamo il testo originale
    if (status && status.trim() !== '') return { variant: 'outline', label: status.substring(0, 15) };
    // Solo se proprio non c'è niente
    return { variant: 'outline', label: 'STATO NON DISPONIBILE' };
  };

  const statusBadge = getStatusBadge();

  return (
    <TooltipProvider>
      <div className="w-full bg-gradient-to-br from-slate-900/40 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl rounded-lg">
        {/* HEADER CON PERCENTUALE */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-600/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">Progresso Produzione</span>
          </div>
          {/* PERCENTUALE NELL'HEADER */}
          <div className="text-xl font-bold text-cyan-400">{percentage.toFixed(0)}%</div>
        </div>

        {/* CONTENUTO BILANCIATO: PROGRESSO A SINISTRA, INDICATORI A DESTRA */}
        <div className="p-4">
          <div className="flex gap-6 items-start">
            
            {/* SEZIONE PROGRESSO - OCCUPA MENO DELLA METÀ */}
            <div className="flex-1 max-w-[40%] space-y-3">
              {/* CONTEGGIO BOBINE SOPRA LA BARRA CON CARATTERI PIÙ GRANDI */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300 font-medium">Bobine</span>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  {/* BOBINE FATTE - ANCORA PIÙ GRANDI */}
                  <span className="text-3xl font-bold text-white">{current}</span>
                  <span className="text-xl text-slate-400">/</span>
                  {/* BOBINE TOTALI - PIÙ GRANDI */}
                  <span className="text-2xl font-bold text-slate-300">{total}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {/* SOLO BARRA DI PROGRESSO SENZA PERCENTUALE */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Progress 
                        value={percentage} 
                        className="h-4 bg-slate-800/60 border border-slate-700/50" 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Progresso: {percentage.toFixed(1)}% completato</p>
                    <p>Bobine: {current} di {total}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* SEZIONE INDICATORI - AFFIANCATI SU UNA LINEA */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                {/* VELOCITÀ */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-slate-800/50 rounded-lg border border-slate-600/30 hover:border-blue-400/50 transition-all duration-200 p-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <div className="flex-1">
                          <div className="text-xs text-blue-300 font-medium mb-1">Velocità</div>
                  <div className="text-2xl font-bold text-blue-400 leading-tight">
                    {velocita.toFixed(0)} <span className="text-sm text-blue-300 font-normal align-top">m/min</span>
                  </div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Velocità: {velocita.toFixed(1)} metri/minuto</p>
                  </TooltipContent>
                </Tooltip>

                {/* PORTATA */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-slate-800/50 rounded-lg border border-slate-600/30 hover:border-amber-400/50 transition-all duration-200 p-3">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-amber-400" />
                        <div className="flex-1">
                          <div className="text-xs text-amber-300 font-medium mb-1">Portata</div>
                  <div className="text-2xl font-bold text-amber-400 leading-tight">
                    {portata.toFixed(0)} <span className="text-sm text-amber-300 font-normal align-top">kg/h</span>
                  </div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Portata: {portata.toFixed(1)} chilogrammi/ora</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CompactProgressSection;

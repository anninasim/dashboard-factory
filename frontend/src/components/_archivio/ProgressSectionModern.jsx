import React from 'react';
import { Progress } from '../ui/Progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/BadgeFixed';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/Tooltip';
import { TrendingUp, Gauge, Zap, Package, Info } from 'lucide-react';

// Componente Progress Section PROFESSIONALE con shadcn/ui
const ProgressSection = ({ data }) => {
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
    <TooltipProvider>
      <Card className="w-full h-80 bg-gradient-to-br from-slate-900/40 to-slate-800/40 border-slate-700/50 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
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
                <Tooltip>
                  <TooltipTrigger>
                    <Package className="w-4 h-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Numero di bobine prodotte</p>
                  </TooltipContent>
                </Tooltip>
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
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Progress 
                    value={percentage} 
                    className="h-3 bg-slate-800/60 border border-slate-700/50" 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Progresso: {percentage.toFixed(1)}% completato</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/30 hover:border-blue-600/50 transition-colors">
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Velocità attuale di produzione: {velocita.toFixed(1)} metri al minuto</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-amber-700/30 hover:border-amber-600/50 transition-colors">
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Portata di materiale: {portata.toFixed(1)} chilogrammi all'ora</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ProgressSection;

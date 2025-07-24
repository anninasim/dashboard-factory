import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/Tooltip';
import { 
  TrendingUp, 
  Gauge, 
  Zap, 
  Package, 
  Settings, 
  BarChart3, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';

// Componente demo che mostra le potenzialità dei componenti moderni
const ModernDashboardDemo = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const metrics = [
    {
      id: 'efficiency',
      title: 'Efficienza Produzione',
      value: 87,
      unit: '%',
      icon: Target,
      color: 'green',
      trend: '+5.2%',
      description: 'Efficienza complessiva della linea produttiva'
    },
    {
      id: 'quality',
      title: 'Qualità Output',
      value: 94,
      unit: '%',
      icon: CheckCircle2,
      color: 'blue',
      trend: '+2.1%',
      description: 'Percentuale di prodotti conformi agli standard'
    },
    {
      id: 'uptime',
      title: 'Tempo Attivo',
      value: 91,
      unit: '%',
      icon: Clock,
      color: 'amber',
      trend: '-1.3%',
      description: 'Tempo di funzionamento della macchina'
    },
    {
      id: 'alerts',
      title: 'Allerte Attive',
      value: 3,
      unit: '',
      icon: AlertTriangle,
      color: 'orange',
      trend: '+2',
      description: 'Numero di allerte che richiedono attenzione'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: 'from-green-900/30 to-green-800/30',
        border: 'border-green-700/30',
        icon: 'bg-green-500/20',
        iconColor: 'text-green-400',
        text: 'text-green-400'
      },
      blue: {
        bg: 'from-blue-900/30 to-blue-800/30',
        border: 'border-blue-700/30',
        icon: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        text: 'text-blue-400'
      },
      amber: {
        bg: 'from-amber-900/30 to-amber-800/30',
        border: 'border-amber-700/30',
        icon: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        text: 'text-amber-400'
      },
      orange: {
        bg: 'from-orange-900/30 to-orange-800/30',
        border: 'border-orange-700/30',
        icon: 'bg-orange-500/20',
        iconColor: 'text-orange-400',
        text: 'text-orange-400'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6">
        <Card className="bg-gradient-to-br from-slate-900/40 to-slate-800/40 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Dashboard Moderno con Shadcn/UI
              <Badge variant="success" className="ml-auto">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-slate-300 text-sm">
              Questo è un esempio di come i componenti professionali di shadcn/ui possono trasformare 
              completamente l'aspetto della dashboard, rendendola più moderna, intuitiva e funzionale.
            </div>

            {/* Grid di metriche moderne */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => {
                const colorClasses = getColorClasses(metric.color);
                const Icon = metric.icon;
                
                return (
                  <Tooltip key={metric.id}>
                    <TooltipTrigger asChild>
                      <Card 
                        className={`bg-gradient-to-br ${colorClasses.bg} ${colorClasses.border} cursor-pointer hover:scale-105 transition-all duration-300 ${
                          selectedCard === metric.id ? 'ring-2 ring-cyan-400' : ''
                        }`}
                        onClick={() => setSelectedCard(selectedCard === metric.id ? null : metric.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 ${colorClasses.icon} rounded-lg`}>
                              <Icon className={`w-4 h-4 ${colorClasses.iconColor}`} />
                            </div>
                            <Badge 
                              variant={metric.trend.startsWith('+') ? 'success' : 'warning'}
                              className="text-xs"
                            >
                              {metric.trend}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-xs text-slate-400 uppercase tracking-wide">
                              {metric.title}
                            </div>
                            <div className={`text-2xl font-bold ${colorClasses.text} flex items-baseline gap-1`}>
                              {metric.value}
                              <span className="text-sm text-slate-400">{metric.unit}</span>
                            </div>
                          </div>
                          
                          {metric.unit === '%' && (
                            <div className="mt-3">
                              <Progress value={metric.value} className="h-2" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{metric.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Sezione dettagli */}
            {selectedCard && (
              <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/20 border-cyan-700/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-semibold">
                      Dettagli per {metrics.find(m => m.id === selectedCard)?.title}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300">
                    {selectedCard === 'efficiency' && "L'efficienza è calcolata come rapporto tra output effettivo e capacità teorica massima."}
                    {selectedCard === 'quality' && "La qualità è misurata attraverso controlli automatici e test di conformità."}
                    {selectedCard === 'uptime' && "Il tempo attivo considera tutti i periodi di funzionamento escluse le manutenzioni programmate."}
                    {selectedCard === 'alerts' && "Le allerte includono anomalie di processo, manutenzioni richieste e soglie di attenzione."}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vantaggi dei componenti moderni */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                <Settings className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Componenti Professionali</div>
                  <div className="text-slate-400">
                    Utilizzo di librerie testate come Radix UI per accessibilità e robustezza
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Performance Ottimizzate</div>
                  <div className="text-slate-400">
                    Animazioni fluide, lazy loading e rendering ottimizzato per TV 4K
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                <Package className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white mb-1">Design System</div>
                  <div className="text-slate-400">
                    Coerenza visiva, temi configurabili e componenti riutilizzabili
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ModernDashboardDemo;

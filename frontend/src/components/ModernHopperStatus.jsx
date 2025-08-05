import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/BadgeFixed';
import { Progress } from './ui/Progress';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/Tooltip';
import { Factory, Gauge, AlertCircle, CheckCircle, Info } from 'lucide-react';

// 🏭 ICONA HOPPER SEMPLIFICATA
const HopperIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    className={className} 
    viewBox="0 0 32 32" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Parte cilindrica superiore */}
    <rect x="8" y="6" width="16" height="14" rx="1" />
    {/* Parte conica inferiore */}
    <path d="M8 20 L16 28 L24 20" />
  </svg>
);

// 🗺️ MAPPATURA FISSA MACCHINA → HOPPER
const MACHINE_HOPPER_MAP = {
  'TR80': ['H16.7'],
  'TR100A': ['H16.11', 'H16.12'],
  'TR100B': ['H16.9', 'H16.10'],
  'TR100C': ['H16.6'],
  'TR120A': ['H16.1', 'H16.2', 'H16.3'],
  'TR120B': ['H16.8'],
  'TR160': ['H16.4', 'H16.5'],
  'COEX7S': ['H16.13', 'H16.14', 'H16.15', 'H16.16']
};

// 🧠 PARSER HOPPER HTML PULITO
const parseHopperHTML = (htmlString) => {
  if (!htmlString || !htmlString.trim()) {
    return {};
  }

  try {
    let cleanHtml = htmlString
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      .replace(/<table[^>]*>/gi, '')
      .replace(/<\/table>/gi, '')
      .replace(/<tr[^>]*>/gi, '')
      .replace(/<\/tr>/gi, '');

    const tdRegex = /<td[^>]*>.*?<\/td>/gi;
    const tdMatches = cleanHtml.match(tdRegex) || [];
    
    const hopperData = {};

    tdMatches.forEach((td) => {
      // Trova nome hopper (gestisce sia .H16.1 che H16.11)
      const hopperNameMatch = td.match(/\.?H16\.?\d+/i);
      if (!hopperNameMatch) return;
      
      // Normalizza il nome: rimuovi punto iniziale se presente
      let hopperName = hopperNameMatch[0].replace(/^\./, '');
      
      // Estrai contenuto dalla span
      const spanMatch = td.match(/<span class="span-silos-istruzioni"[^>]*>(.*?)<\/span>/is);
      if (!spanMatch) return;
      
      // Pulisci il contenuto HTML
      const content = spanMatch[1]
        .replace(/<BR>/gi, '\n')
        .replace(/<br>/gi, '\n')
        .replace(/&nbsp/gi, ' ')
        .replace(/;/gi, '')
        .trim();
      
      // Split in linee e processa ogni componente
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const components = [];
      
      lines.forEach((line) => {
        // Regex flessibile per diversi formati di componenti
        const match = line.match(/^(.+?)\s+(\d+)\s*%\s*\((.+?)\)$/);
        if (match) {
          const [, siloCode, percentage, description] = match;
          components.push({
            silo: "",  // Rimuovi il codice del silo
            percentage: parseInt(percentage),
            description: description.trim()
          });
        }
      });
      
      // Aggiungi hopper solo se ha componenti validi
      if (components.length > 0) {
        hopperData[hopperName] = components;
      }
    });

    return hopperData;
  } catch (error) {
    console.error('Errore parsing hopper:', error);
    return {};
  }
};

// 🎬 COMPONENTE ANIMAZIONE PALLINI MOBILI - CON CONTROLLO STATO MACCHINA
const HopperMovingDots = React.memo(({ isRunning = true }) => {
  const baseDelay = React.useMemo(() => Math.random() * 2.5, []);
  
  // Se la macchina non è in funzione, non renderizzare i pallini
  if (!isRunning) {
    return null;
  }
  
  return (
    <div className="hopper-moving-dots-container">
      <div className="hopper-moving-dots-wrapper">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="hopper-dot"
            style={{
              animationDelay: `${baseDelay + i * 1.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
});

HopperMovingDots.displayName = 'HopperMovingDots';

// 🎨 COMPONENTE SINGOLO HOPPER MODERNO - SENZA STYLED-JSX
const ModernHopperCard = React.memo(({ hopperName, components, isEmpty = false, isRunning = true }) => {
  // Funzione per determinare colore componente
  const getComponentColor = (percentage) => {
    if (percentage >= 70) return 'text-green-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  // Renderizza hopper vuoto
  if (isEmpty) {
    return (
      <Card className="h-full bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-slate-600/40 opacity-60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-3">
              <HopperIcon className="w-5 h-5 text-slate-400" />
              {hopperName}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Inattivo
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Factory className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-xs">Nessun materiale</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizza hopper attivo
  return (
    <Card className="h-full bg-gradient-to-br from-slate-900/40 to-slate-800/40 border-slate-700/50 hover:border-slate-600/60 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pt-2 pb-1">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          {/* Icona hopper + nome + pallino verde */}
          <span className="relative flex items-center gap-1">
            <HopperIcon className="w-7 h-7 text-blue-400 flex-shrink-0 -ml-2" />
            <span className="font-semibold" style={{fontSize: '1.14rem'}}>{hopperName}</span>
            <span className="ml-2">
              <span 
                className="hopper-status-dot" 
              />
            </span>
          </span>
        </CardTitle>
        <div className="border-b border-slate-600/40 mt-2" />
      </CardHeader>

      <CardContent className="p-2 space-y-2">
        <div className="space-y-1.5">
          {components.slice(0, 6).map((comp, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 truncate flex-1 mr-2 text-base">
                  <span className="text-[1rem]">{comp.description}</span>
                </span>
                <span className={`font-bold text-lg ${getComponentColor(comp.percentage)}`}> 
                  {comp.percentage}%
                </span>
              </div>
              
              {/* Progress bar con animazione pallini */}
              <div className="hopper-progress-container">
                <Progress 
                  value={comp.percentage} 
                  className="h-1.5 bg-slate-800/60 hopper-bar-translucent"
                />
                {/* Overlay pallini animati - solo se macchina in funzione */}
                <HopperMovingDots isRunning={isRunning} />
              </div>
            </div>
          ))}
          
          {/* Indicatore componenti aggiuntivi */}
          {components.length > 6 && (
            <div className="text-sm text-slate-400 text-center pt-0.5">
              +{components.length - 6} altri componenti
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ModernHopperCard.displayName = 'ModernHopperCard';

// 🎨 COMPONENTE PRINCIPALE HOPPER STATUS MODERNO - SENZA STYLED-JSX
const ModernHopperStatus = React.memo(({ 
  htmlString, 
  isCompleted = false, 
  machineName, 
  miscelaCode,
  isRunning = true 
}) => {
  // Normalizza nome macchina per lookup
  const normalizedMachineName = React.useMemo(() => 
    machineName?.toUpperCase().replace(/\s+/g, '') || '', 
    [machineName]
  );
  
  // Ottieni lista hopper per questa macchina
  const machineHoppers = React.useMemo(() => 
    MACHINE_HOPPER_MAP[normalizedMachineName] || [], 
    [normalizedMachineName]
  );
  
  // Parse dei dati HTML (memoizzato per performance)
  const hopperData = React.useMemo(() => 
    parseHopperHTML(htmlString), 
    [htmlString]
  );
  
  // Conta hopper attivi
  const activeHoppers = React.useMemo(() => 
    machineHoppers.filter(hopperName => hopperData[hopperName]).length,
    [machineHoppers, hopperData]
  );
  
  // Calcola layout responsive
  const getGridCols = React.useCallback(() => {
    switch (machineHoppers.length) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-2 xl:grid-cols-4';
      default: return 'grid-cols-1';
    }
  }, [machineHoppers.length]);

  // Se non ci sono hopper per questa macchina, non renderizzare nulla
  if (machineHoppers.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <Card className={`w-full h-80 bg-gradient-to-br from-slate-900/40 to-slate-800/40 border-slate-700/50 backdrop-blur-xl ${isCompleted ? 'opacity-60 grayscale' : ''}`}>
        <CardHeader className="pb-2 pt-1 min-h-0 h-2">
          {/* Header vuoto per consistenza layout */}
        </CardHeader>
        
        <CardContent>
          <div className={`grid gap-3 h-48 ${getGridCols()}`}>
            {machineHoppers.map((hopperName, index) => {
              const components = hopperData[hopperName];
              return (
                <ModernHopperCard
                  key={`${hopperName}-${index}`} // Key più stabile
                  hopperName={hopperName}
                  components={components}
                  isEmpty={!components}
                  isRunning={isRunning}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});

ModernHopperStatus.displayName = 'ModernHopperStatus';

export default ModernHopperStatus;
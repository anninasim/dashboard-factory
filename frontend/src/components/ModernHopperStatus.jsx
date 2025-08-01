import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/BadgeFixed';
import { Progress } from './ui/Progress';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/Tooltip';
import { Factory, Gauge, AlertCircle, CheckCircle, Info } from 'lucide-react';

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

// 🎨 COMPONENTE SINGOLO HOPPER MODERNO
const ModernHopperCard = ({ hopperName, components, isEmpty = false }) => {
  if (isEmpty) {
    return (
      <Card className="h-full bg-gradient-to-br from-slate-800/30 to-slate-700/30 border-slate-600/40 opacity-60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-300">{hopperName}</CardTitle>
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

  const getComponentColor = (percentage) => {
    if (percentage >= 70) return 'text-green-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <Card className="h-full bg-gradient-to-br from-slate-900/40 to-slate-800/40 border-slate-700/50 hover:border-slate-600/60 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pt-2 pb-1">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          {/* Pulsing dot for active hopper */}
          <span className="relative flex items-center">
            <span className="mr-2 font-semibold" style={{fontSize: '1.14rem'}}>{hopperName}</span>
            <span className="ml-1">
              <span className="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 6px 2px #22c55e55' }}></span>
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
              <Progress 
                value={comp.percentage} 
                className="h-1.5 bg-slate-800/60"
              />
            </div>
          ))}
          {components.length > 6 && (
            <div className="text-sm text-slate-400 text-center pt-0.5">
              +{components.length - 6} altri componenti
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 🎨 COMPONENTE PRINCIPALE HOPPER STATUS MODERNO
const ModernHopperStatus = ({ htmlString, isCompleted = false, machineName, miscelaCode }) => {
  // Normalizza nome macchina per lookup
  const normalizedMachineName = machineName?.toUpperCase().replace(/\s+/g, '') || '';
  
  // Ottieni lista hopper per questa macchina
  const machineHoppers = MACHINE_HOPPER_MAP[normalizedMachineName] || [];
  
  // Parse dei dati HTML
  const hopperData = parseHopperHTML(htmlString);
  
  // Conta hopper attivi
  const activeHoppers = machineHoppers.filter(hopperName => hopperData[hopperName]).length;
  
  // Calcola layout responsive
  const getGridCols = () => {
    switch (machineHoppers.length) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-2 xl:grid-cols-4';
      default: return 'grid-cols-1';
    }
  };

  return (
    <TooltipProvider>
      <Card className={`w-full h-80 bg-gradient-to-br from-slate-900/40 to-slate-800/40 border-slate-700/50 backdrop-blur-xl ${isCompleted ? 'opacity-60 grayscale' : ''}`}>
        <CardHeader className="pb-2 pt-1 min-h-0 h-2"></CardHeader>
        <CardContent>
          <div className={`grid gap-3 h-48 ${getGridCols()}`}>
            {machineHoppers.map((hopperName, index) => {
              const components = hopperData[hopperName];
              return (
                <ModernHopperCard
                  key={index}
                  hopperName={hopperName}
                  components={components}
                  isEmpty={!components}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ModernHopperStatus;
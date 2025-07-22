import React from 'react';

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

// 🎛️ LAYOUT GRIGLIA OTTIMALE PER NUMERO HOPPER
const getGridLayout = (hopperCount) => {
  switch (hopperCount) {
    case 1: return { columns: 1, rows: 1, class: 'grid-1x1' };
    case 2: return { columns: 2, rows: 1, class: 'grid-2x1' };
    case 3: return { columns: 3, rows: 1, class: 'grid-3x1' };
    case 4: return { columns: 2, rows: 2, class: 'grid-2x2' };
    default: return { columns: 1, rows: 1, class: 'grid-1x1' };
  }
};

// 🧠 PARSER HOPPER HTML MIGLIORATO - GESTISCE FORMATO REALE
const parseHopperHTML = (htmlString) => {
  if (!htmlString || !htmlString.trim()) {
    return {};
  }

  try {
    // 🎯 DEBUG: Log dell'HTML ricevuto
    console.log('🔍 HTML Hopper ricevuto:', htmlString.substring(0, 200) + '...');
    
    let cleanHtml = htmlString
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      .replace(/<table[^>]*>/gi, '')
      .replace(/<\/table>/gi, '')
      .replace(/<tr[^>]*>/gi, '')
      .replace(/<\/tr>/gi, '');

    const tdRegex = /<td[^>]*>.*?<\/td>/gi;
    const tdMatches = cleanHtml.match(tdRegex) || [];
    
    console.log('📦 TD trovati:', tdMatches.length);
    
    const hopperData = {};

    tdMatches.forEach((td, index) => {
      console.log(`🔧 Elaborando TD ${index + 1}:`, td.substring(0, 100) + '...');
      
      // 🆕 REGEX MIGLIORATO: Gestisce sia .H16.1 che H16.11
      const hopperNameMatch = td.match(/\.?H16\.?\d+/i);
      if (!hopperNameMatch) {
        console.log('❌ Nessun nome hopper trovato in questo TD');
        return;
      }
      
      // 🆕 NORMALIZZA IL NOME: rimuovi punto iniziale se presente
      let hopperName = hopperNameMatch[0].replace(/^\./, '');
      console.log('✅ Nome hopper trovato:', hopperName);
      
      // 🆕 REGEX COMPONENTI MIGLIORATO: Gestisce casi complessi
      const components = [];
      
      // Estrai tutto il contenuto dopo il nome hopper e prima della chiusura
      const contentMatch = td.match(/<span class="span-silos-istruzioni"[^>]*>(.*?)<\/span>/is);
      if (!contentMatch) {
        console.log('❌ Contenuto span non trovato');
        return;
      }
      
      const content = contentMatch[1]
        .replace(/<BR>/gi, '\n')
        .replace(/<br>/gi, '\n')
        .replace(/&nbsp/gi, ' ')
        .replace(/;/gi, '')
        .trim();
        
      console.log('📝 Contenuto estratto:', content);
      
      // 🆕 REGEX PIÙ FLESSIBILE per diversi formati:
      // - "S1 70 % (FF25 - FLEXIRENE FF 25)"
      // - "VL17.2 1 % (ANTIBLOCKING - VL17.2)"  
      // - "Magazzino TR 80 100 % (MATERBI - SACCONI)"
      const lines = content.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        // Regex più flessibile che cattura tutto prima della percentuale
        const match = line.match(/^(.+?)\s+(\d+)\s*%\s*\((.+?)\)$/);
        if (match) {
          const [, siloCode, percentage, description] = match;
          components.push({
            silo: siloCode.trim(),
            percentage: parseInt(percentage),
            description: description.trim()
          });
          console.log('✅ Componente trovato:', siloCode.trim(), percentage + '%');
        } else {
          console.log('❌ Linea non matchata:', line);
        }
      });
      
      if (components.length > 0) {
        hopperData[hopperName] = components;
        console.log(`🎯 Hopper ${hopperName} aggiunto con ${components.length} componenti`);
      } else {
        console.log(`❌ Nessun componente trovato per hopper ${hopperName}`);
      }
    });

    console.log('🏁 Risultato finale parsing:', Object.keys(hopperData));
    return hopperData;
  } catch (error) {
    console.error('❌ Errore parsing hopper:', error);
    return {};
  }
};

// 🎨 COMPONENTE SINGOLO HOPPER
const HopperBox = ({ hopperName, components, isEmpty = false }) => {
  if (isEmpty) {
    return (
      <div className="hopper-box hopper-box-empty">
        <div className="hopper-tag hopper-tag-inactive">{hopperName}</div>
        <div className="hopper-empty-state">
          <div className="hopper-empty-icon">🏭</div>
          <div className="hopper-empty-text">Inattivo</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hopper-box hopper-box-active">
      <div className="hopper-tag">{hopperName}</div>
      <div className="hopper-materials-compact">
        {components.map((comp, index) => (
          <div key={index} className="material-component-compact">
            <span className="material-name-compact">
              {comp.silo} - {comp.description}
            </span>
            <span className="material-percentage-compact">
              {comp.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎨 COMPONENTE PRINCIPALE HOPPER STATUS CON LAYOUT FISSO
const HopperStatus = ({ htmlString, isCompleted = false, machineName }) => {
  // Normalizza nome macchina per lookup
  const normalizedMachineName = machineName?.toUpperCase().replace(/\s+/g, '') || '';
  
  // Ottieni lista hopper per questa macchina
  const machineHoppers = MACHINE_HOPPER_MAP[normalizedMachineName] || [];
  
  // Parse dei dati HTML
  const hopperData = parseHopperHTML(htmlString);
  
  // Determina layout griglia
  const gridLayout = getGridLayout(machineHoppers.length);
  
  // Conta hopper attivi
  const activeHoppers = machineHoppers.filter(hopperName => hopperData[hopperName]).length;

  return (
    <div className={`hopper-status-section-fixed ${isCompleted ? 'completed' : ''}`}>
      {/* Header standardizzato */}
      <div className="hopper-header-fixed">
        <span className="hopper-icon">🏭</span>
        <span className="hopper-title">Stato Hopper</span>
        <span className="hopper-count">
          {activeHoppers}/{machineHoppers.length} attivi
        </span>
      </div>

      {/* Griglia hopper con dimensioni fisse */}
      <div className={`hopper-grid ${gridLayout.class}`}>
        {machineHoppers.map((hopperName, index) => {
          const components = hopperData[hopperName];
          return (
            <HopperBox
              key={index}
              hopperName={hopperName}
              components={components}
              isEmpty={!components}
            />
          );
        })}
      </div>

      {/* 🎨 CSS INTEGRATO PER LAYOUT FISSO */}
      <style>{`
        /* 📏 SEZIONE PRINCIPALE - DIMENSIONI FISSE PER TUTTE LE MACCHINE */
        .hopper-status-section-fixed {
          margin: 0.4rem 0 !important;
          padding: 0.6rem !important;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06)) !important;
          border: 1px solid #666 !important;
          border-radius: 0.4rem !important;
          backdrop-filter: blur(10px) !important;
          box-sizing: border-box !important;
          width: 100% !important;
          
          /* 🎯 DIMENSIONI FISSE - UGUALE PER TUTTE LE MACCHINE */
          min-height: 180px !important;
          max-height: 180px !important;
          height: 180px !important;
          
          overflow: visible !important;
          flex-shrink: 0 !important;
          transition: all 0.3s ease !important;
        }

        .hopper-status-section-fixed:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.09)) !important;
          border-color: #777 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.15) !important;
        }

        .hopper-status-section-fixed.completed {
          background: linear-gradient(135deg, rgba(102, 102, 102, 0.08), rgba(102, 102, 102, 0.12)) !important;
          border-color: #666666 !important;
          filter: grayscale(80%) !important;
          opacity: 0.6 !important;
        }

        /* 📋 HEADER COMPATTO */
        .hopper-header-fixed {
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          margin-bottom: 0.5rem !important;
          padding-bottom: 0.3rem !important;
          border-bottom: 1px solid #555 !important;
          box-sizing: border-box !important;
          height: 30px !important;
          flex-shrink: 0 !important;
        }

        .hopper-icon {
          font-size: 1.1rem !important;
          color: #00bcd4 !important;
          opacity: 0.9 !important;
        }

        .hopper-title {
          font-size: 1.1rem !important;
          font-weight: 600 !important;
          color: #ffffff !important;
          text-transform: uppercase !important;
          letter-spacing: 0.02rem !important;
          flex: 1 !important;
        }

        .hopper-count {
          font-size: 0.9rem !important;
          color: #4caf50 !important;
          background: rgba(76, 175, 80, 0.15) !important;
          padding: 0.2rem 0.4rem !important;
          border-radius: 0.2rem !important;
          font-weight: 600 !important;
          border: 1px solid rgba(76, 175, 80, 0.3) !important;
        }

        /* 🎛️ GRIGLIE HOPPER - LAYOUT RESPONSIVE */
        .hopper-grid {
          display: grid !important;
          gap: 0.4rem !important;
          width: 100% !important;
          height: calc(100% - 50px) !important; /* Sottrae header */
          box-sizing: border-box !important;
        }

        /* Layout 1x1 (TR80, TR100C, TR120B) */
        .hopper-grid.grid-1x1 {
          grid-template-columns: 1fr !important;
          grid-template-rows: 1fr !important;
        }

        /* Layout 2x1 (TR100A, TR100B, TR160) */
        .hopper-grid.grid-2x1 {
          grid-template-columns: 1fr 1fr !important;
          grid-template-rows: 1fr !important;
        }

        /* Layout 3x1 (TR120A) */
        .hopper-grid.grid-3x1 {
          grid-template-columns: 1fr 1fr 1fr !important;
          grid-template-rows: 1fr !important;
        }

        /* Layout 2x2 (COEX7S) */
        .hopper-grid.grid-2x2 {
          grid-template-columns: 1fr 1fr !important;
          grid-template-rows: 1fr 1fr !important;
        }

        /* 📦 SINGOLO HOPPER BOX */
        .hopper-box {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid #666 !important;
          border-radius: 0.3rem !important;
          padding: 0.4rem !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0.3rem !important;
          transition: all 0.3s ease !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
        }

        .hopper-box-active:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: #777 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.1) !important;
        }

        .hopper-box-empty {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px dashed #555 !important;
          opacity: 0.6 !important;
        }

        /* 🏷️ TAG HOPPER */
        .hopper-tag {
          font-size: 1rem !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          background: linear-gradient(135deg, #00bcd4, #0097a7) !important;
          padding: 0.2rem 0.4rem !important;
          border-radius: 0.2rem !important;
          text-align: center !important;
          flex-shrink: 0 !important;
          box-shadow: 0 0.1rem 0.2rem rgba(0, 188, 212, 0.3) !important;
        }

        .hopper-tag-inactive {
          background: linear-gradient(135deg, #666666, #555555) !important;
          color: #cccccc !important;
        }

        /* 🧪 MATERIALI COMPATTI */
        .hopper-materials-compact {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.2rem !important;
          flex: 1 !important;
          overflow-y: auto !important;
        }

        .material-component-compact {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 0.15rem 0.3rem !important;
          background: rgba(255, 255, 255, 0.03) !important;
          border-radius: 0.2rem !important;
          border-left: 2px solid #00bcd4 !important;
          font-size: 0.85rem !important;
        }

        .material-name-compact {
          color: #e0e0e0 !important;
          font-weight: 500 !important;
          flex: 1 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        .material-percentage-compact {
          color: #00bcd4 !important;
          font-weight: 700 !important;
          min-width: 2rem !important;
          text-align: right !important;
          flex-shrink: 0 !important;
        }

        /* 🚫 STATO VUOTO */
        .hopper-empty-state {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 1 !important;
          color: #888888 !important;
          font-style: italic !important;
        }

        .hopper-empty-icon {
          font-size: 1.2rem !important;
          margin-bottom: 0.2rem !important;
          opacity: 0.5 !important;
        }

        .hopper-empty-text {
          font-size: 0.8rem !important;
          text-align: center !important;
        }

        /* 📺 RESPONSIVE TV 4K - OTTIMIZZATO COME IL RESTO DEL DASHBOARD */
        @media (min-width: 3840px) {
          .hopper-status-section-fixed {
            min-height: 280px !important; /* 📺 ⬆️ AUMENTATO: da 220px a 280px */
            max-height: 280px !important;
            height: 280px !important;
            padding: 1.2rem !important; /* 📺 ⬆️ AUMENTATO: da 0.8rem a 1.2rem */
          }

          .hopper-header-fixed {
            height: 40px !important; /* 📺 ⬆️ AUMENTATO: da 30px a 40px */
            margin-bottom: 0.8rem !important;
          }

          .hopper-icon {
            font-size: 1.6rem !important; /* 📺 ⬆️ MOLTO AUMENTATO: da 1.1rem a 1.6rem */
          }

          .hopper-title {
            font-size: 1.8rem !important; /* 📺 ⬆️ MOLTO AUMENTATO: da 1.4rem a 1.8rem */
          }

          .hopper-count {
            font-size: 1.3rem !important; /* 📺 ⬆️ AUMENTATO: da 1.1rem a 1.3rem */
            padding: 0.4rem 0.6rem !important;
          }

          .hopper-tag {
            font-size: 1.5rem !important; /* 📺 ⬆️ MOLTO AUMENTATO: da 1.2rem a 1.5rem */
            padding: 0.4rem 0.6rem !important;
          }

          .material-component-compact {
            font-size: 1.3rem !important; /* 📺 ⬆️ MOLTO AUMENTATO: da 1rem a 1.3rem */
            padding: 0.3rem 0.5rem !important;
          }

          .material-name-compact {
            font-size: 1.3rem !important; /* 📺 ⬆️ ESPLICITO per 4K */
          }

          .material-percentage-compact {
            font-size: 1.4rem !important; /* 📺 ⬆️ MOLTO AUMENTATO per visibilità */
            min-width: 3rem !important;
          }

          .hopper-empty-text {
            font-size: 1.2rem !important; /* 📺 ⬆️ AUMENTATO per 4K */
          }

          .hopper-empty-icon {
            font-size: 2.2rem !important; /* 📺 ⬆️ MOLTO AUMENTATO per 4K */
          }

          .hopper-grid {
            gap: 0.6rem !important; /* 📺 ⬆️ Gap più grande per 4K */
          }
        }

        /* 💻 DESKTOP */
        @media (max-width: 3839px) and (min-width: 1200px) {
          .hopper-status-section-fixed {
            min-height: 160px !important;
            max-height: 160px !important;
            height: 160px !important;
          }

          .material-component-compact {
            font-size: 0.8rem !important;
          }
        }

        /* 📱 MOBILE */
        @media (max-width: 1199px) {
          .hopper-status-section-fixed {
            min-height: 140px !important;
            max-height: 140px !important;
            height: 140px !important;
          }

          /* Layout mobile: forza tutto a colonna singola per 3+ hopper */
          .hopper-grid.grid-3x1 {
            grid-template-columns: 1fr !important;
            grid-template-rows: repeat(3, 1fr) !important;
          }

          .hopper-grid.grid-2x2 {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: 1fr 1fr !important;
          }

          .material-component-compact {
            font-size: 0.75rem !important;
            padding: 0.1rem 0.2rem !important;
          }

          .hopper-tag {
            font-size: 0.85rem !important;
            padding: 0.15rem 0.3rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HopperStatus;
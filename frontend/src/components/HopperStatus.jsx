import React from 'react';

// 🧠 PARSER per stato_macchina_html
const parseHopperHTML = (htmlString) => {
  if (!htmlString || !htmlString.trim()) {
    return { hoppers: [], isEmpty: true };
  }

  try {
    // Pulizia HTML
    let cleanHtml = htmlString
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '')
      .replace(/<table[^>]*>/gi, '')
      .replace(/<\/table>/gi, '')
      .replace(/<tr[^>]*>/gi, '')
      .replace(/<\/tr>/gi, '');

    // Trova blocchi TD (ogni TD = 1 hopper)
    const tdRegex = /<td[^>]*>.*?<\/td>/gi;
    const tdMatches = cleanHtml.match(tdRegex) || [];
    
    if (tdMatches.length === 0) {
      return { hoppers: [], isEmpty: true };
    }

    // Estrai dati da ogni hopper
    const hoppers = tdMatches.map((td, index) => {
      // Nome hopper
      const hopperNameMatch = td.match(/\.?H16\.?\d+/i);
      const hopperName = hopperNameMatch ? hopperNameMatch[0] : `H${index + 1}`;
      
      // Componenti materiali
      const componentRegex = /([A-Z]+\d*(?:\.\d+)?|\w+\s+\w+\s+\w+)\s+(\d+)\s*%\s*\(([^)]+)\)/gi;
      let components = [];
      let match;
      
      while ((match = componentRegex.exec(td)) !== null) {
        const [, siloCode, percentage, description] = match;
        components.push({
          silo: siloCode.trim(),
          percentage: parseInt(percentage),
          description: description.trim()
        });
      }
      
      return {
        name: hopperName,
        components: components
      };
    });

    const validHoppers = hoppers.filter(hopper => hopper.components.length > 0);
    
    return {
      hoppers: validHoppers,
      isEmpty: validHoppers.length === 0,
      totalHoppers: validHoppers.length
    };

  } catch (error) {
    console.error('Errore parsing hopper:', error);
    return { hoppers: [], isEmpty: true };
  }
};

// 🎨 COMPONENTE VISUALIZZAZIONE COMPATTA (design ciano)
const HopperStatus = ({ htmlString, isCompleted = false }) => {
  const hopperData = parseHopperHTML(htmlString);

  return (
    <div className={`hopper-status-section ${isCompleted ? 'completed' : ''}`}>
      {/* Header */}
      <div className="hopper-header">
        <span className="hopper-icon">🏭</span>
        <span className="hopper-title">Stato Hopper</span>
        {!hopperData.isEmpty && (
          <span className="hopper-count">{hopperData.totalHoppers} attivi</span>
        )}
      </div>

{/* Contenuto */}
      {hopperData.isEmpty ? (
        <div className="hopper-empty">
          <div className="hopper-empty-icon">🏭</div>
          <div>Nessun materiale in lavorazione</div>
        </div>
      ) : (
        <div className="hopper-list">
          {hopperData.hoppers.map((hopper, index) => (
            <div key={index} className="hopper-item">
              {/* Nome hopper prominente */}
              <div className="hopper-name-row">
                <span className="hopper-tag">{hopper.name}</span>
              </div>
              
              {/* Materiali formattati professionalmente */}
              <div className="hopper-materials">
                {hopper.components.map((comp, compIndex) => (
                  <div key={compIndex} className="material-component">
                    <span className="material-name">
                      {comp.silo} - {comp.description}
                    </span>
                    <span className="material-percentage">
                      {comp.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default HopperStatus;
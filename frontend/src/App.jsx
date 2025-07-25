import { useEffect, useState } from 'react';
import './App.css';
import ProductionCard from './ProductionCard';
import FlowChartsPage from '../FlowChartsPage';
// import { useApiPolling } from './hooks/useApiPolling'; // Temporaneamente disabilitato

function App() {
  const [dati, setDati] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'flow-charts'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting' | 'connected' | 'error'

  // ⏱️ Intervallo di polling configurabile
  const POLLING_INTERVAL_MS = 30000; // 30 secondi per dashboard produzione

  // 🚀 IMPLEMENTAZIONE DIRETTA (TEMPORANEA) per risolvere errori
  // const {
  //   data: rawData,
  //   loading,
  //   error,
  //   lastUpdate,
  //   connectionStatus,
  //   refresh
  // } = useApiPolling(
  //   'http://localhost:3001/api/dashboard',
  // Parser minimale per estrusori da additivazione_html
  // Parser che estrae le coppie (lettera, miscela) per ogni estrusore
  const estrusoriMiscele = (html) => {
    if (!html || typeof html !== 'string') return [];
    // Trova tutte le righe <tr> (o sequenze di <td>)
    const righe = [];
    // Regex per trovare tutte le coppie <td> (lettera, miscela)
    const tdRegex = /<td[^>]*>\s*<b><font[^>]*size=["']5px["'][^>]*>([A-Z])<\/font><\/b><\/td>\s*<td[^>]*>\s*<b><font[^>]*size=["']2px["'][^>]*>([^<]+)<\/font><\/b><\/td>/gi;
    let match;
    while ((match = tdRegex.exec(html)) !== null) {
      righe.push({
        lettera: match[1],
        miscela: match[2].trim()
      });
    }
    return righe;
  };
  //   30000, // 30 secondi
  //   currentPage === 'dashboard' // Solo quando siamo nella dashboard
  // );

  // 🎯 FUNZIONE ORDINAMENTO PERSONALIZZATO per le card della dashboard
  const ordinaMacchine = (dati) => {
    // ⭐ Ordinamento personalizzato FISSO secondo la sequenza richiesta
    const ordinePersonalizzato = [
      'TR80',       // ← fnt_ordina: 1
      'TR100C',     // ← fnt_ordina: 2
      'TR160',      // ← fnt_ordina: 3
      'TR120A',     // ← fnt_ordina: 4
      'TR120B',     // ← fnt_ordina: 5
      'TR100B',     // ← fnt_ordina: 6
      'TR100A',     // ← fnt_ordina: 7
      'COEX7s'      // ← Non nella tabella, alla fine
    ];

    // Funzione helper per normalizzare i nomi delle macchine
    const normalizzaNome = (nome) => {
      return nome?.toString().trim().toUpperCase() || '';
    };

    return dati.sort((a, b) => {
      // Ottieni i nomi delle macchine dai dati (campo fnt_sigla) e normalizzali
      const nomeA = normalizzaNome(a.fnt_sigla);
      const nomeB = normalizzaNome(b.fnt_sigla);
      
      // Cerca le posizioni nell'ordinamento personalizzato (normalizzato)
      let posizioneA = ordinePersonalizzato.findIndex(nome => 
        normalizzaNome(nome) === nomeA
      );
      let posizioneB = ordinePersonalizzato.findIndex(nome => 
        normalizzaNome(nome) === nomeB
      );
      
      // Se una macchina non è nell'elenco personalizzato, la mette alla fine
      if (posizioneA === -1) posizioneA = ordinePersonalizzato.length;
      if (posizioneB === -1) posizioneB = ordinePersonalizzato.length;
      
      // Ordinamento per posizione nell'elenco fisso
      return posizioneA - posizioneB;
    });
  };

  // 🎯 Applica ordinamento ai dati (ora dati è già lo stato principale)
  // const dati = ordinaMacchine(rawData || []); // RIMOSSO: conflitto variabile

  useEffect(() => {
    // Fetch dati solo per la dashboard di produzione
    if (currentPage === 'dashboard') {
      const fetchData = async () => {
        try {
          setConnectionStatus('connecting');
          const res = await fetch('http://localhost:3001/api/dashboard');
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          
          // 🎯 APPLICA L'ORDINAMENTO PERSONALIZZATO
          const datiOrdinati = ordinaMacchine(data);
          setDati(datiOrdinati);
          setError(null);
          setConnectionStatus('connected');
          setLastUpdate(new Date());
          
          console.log(`✅ Dati aggiornati: ${data.length} macchine`, {
            timestamp: new Date().toLocaleTimeString(),
            macchine: data.map(d => d.fnt_sigla)
          });

          // DEBUG: Mostra esempio di additivazione_html
          if (data && data.length > 0) {
            console.log('Esempio additivazione_html:', data[0].additivazione_html);
          }
          
        } catch (err) {
              <ProductionCard 
                key={i} 
                data={riga} 
                estrusori={estraiEstrusori(riga.additivazione_html)} // Passa estrusori come prop
              />
          setError(err.message);
          setConnectionStatus('error');
        } finally {
          setLoading(false);
        }
      };

      fetchData(); // prima chiamata
      const interval = setInterval(fetchData, POLLING_INTERVAL_MS);
      return () => clearInterval(interval); // pulizia
    }
  }, [currentPage]);

  // Funzione refresh manuale
  const refresh = () => {
    setLoading(true);
    setError(null);
    // Triggera il re-fetch cambiando lo stato
    if (currentPage === 'dashboard') {
      window.location.reload(); // Fallback temporaneo
    }
  };

  // Renderizza la pagina corrente
  const renderCurrentPage = () => {
    // Loading state
    if (loading && currentPage === 'dashboard') {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Caricamento dati dashboard...</div>
        </div>
      );
    }

    // Error state
    if (error && currentPage === 'dashboard') {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">Errore connessione API</div>
          <div className="error-details">{error}</div>
          <button 
            onClick={refresh} 
            className="retry-button"
          >
            Riprova
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="dashboard-grid">
            {dati.map((riga, i) => (
              <ProductionCard 
                key={i} 
                data={riga} 
                estrusoriMiscele={estrusoriMiscele(riga.additivazione_html)}
              />
            ))}
          </div>
        );
      case 'flow-charts':
        return <FlowChartsPage />;
      default:
        return (
          <div className="dashboard-grid">
            {dati.map((riga, i) => (
              <ProductionCard 
                key={i} 
                data={riga} 
                estrusoriMiscele={estrusoriMiscele(riga.additivazione_html)}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* Toggle discreto nell'angolo */}
      <div className="page-toggle">
        <button 
          onClick={() => setCurrentPage(currentPage === 'dashboard' ? 'flow-charts' : 'dashboard')}
          className="toggle-button"
          title={currentPage === 'dashboard' ? 'Passa ai Grafici Portata' : 'Torna alla Dashboard'}
        >
          {currentPage === 'dashboard' ? '📊' : '🏭'}
        </button>
        <div className="toggle-label">
          {currentPage === 'dashboard' ? 'Grafici' : 'Dashboard'}
        </div>
      </div>

      {/* Contenuto principale */}
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      
      {/* CSS aggiuntivo per la nuova struttura */}
      <style>{`
        .app-container {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background-color: #1a1a1a;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }

        /* Toggle discreto nell'angolo */
        .page-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .toggle-button {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #00cc66, #00aa55);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 204, 102, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-button:hover {
          background: linear-gradient(135deg, #00aa55, #008844);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 204, 102, 0.4);
        }

        .toggle-button:active {
          transform: translateY(0);
        }

        .toggle-label {
          font-size: 0.8rem;
          color: #cccccc;
          background: rgba(0, 0, 0, 0.7);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
          text-align: center;
          min-width: 60px;
          backdrop-filter: blur(10px);
        }

        /* Dashboard-grid utilizza tutto lo spazio disponibile */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 1fr);
          width: 100%;
          height: 100vh; /* Ora utilizza tutto lo schermo */
          gap: 32px;
          padding: 32px;
          box-sizing: border-box;
          background-color: #1a1a1a;
        }

        /* Responsive per schermi più piccoli */
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(8, 1fr);
            gap: 16px;
            padding: 16px;
          }
        }

        /* Responsive per TV 4K */
        @media (min-width: 3840px) {
          .dashboard-grid {
            height: 100vh; /* Utilizza tutto lo schermo */
            gap: 48px;
            padding: 48px;
          }

          .page-toggle {
            top: 32px;
            right: 32px;
          }

          .toggle-button {
            width: 60px;
            height: 60px;
            font-size: 1.6rem;
          }

          .toggle-label {
            font-size: 1rem;
            padding: 6px 12px;
          }
        }

        /* Responsive per schermi piccoli */
        @media (max-width: 768px) {
          .page-toggle {
            top: 16px;
            right: 16px;
          }

          .toggle-button {
            width: 45px;
            height: 45px;
            font-size: 1.2rem;
          }

          .toggle-label {
            font-size: 0.75rem;
            padding: 3px 6px;
          }
        }

        /* ✨ NUOVI STILI: Status Header e Indicatori */
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(40, 40, 40, 0.9));
          border-bottom: 1px solid #333;
          backdrop-filter: blur(10px);
          color: white;
          font-size: 0.9rem;
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 0.8rem;
          color: #ccc;
        }

        .connection-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .connection-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .connection-dot.connected {
          background: #4caf50;
          box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
        }

        .connection-dot.connecting {
          background: #ff9800;
          box-shadow: 0 0 8px rgba(255, 152, 0, 0.6);
        }

        .connection-dot.error {
          background: #f44336;
          box-shadow: 0 0 8px rgba(244, 67, 54, 0.6);
          animation: blink 1s infinite;
        }

        .machine-count {
          background: rgba(0, 188, 212, 0.2);
          padding: 4px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0, 188, 212, 0.3);
          color: #00bcd4;
          font-weight: 600;
        }

        .last-update {
          color: #4caf50;
        }

        .auto-refresh {
          color: #00bcd4;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: white;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #333;
          border-top: 4px solid #00bcd4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .loading-text {
          font-size: 1.1rem;
          color: #ccc;
        }

        /* Error State */
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: white;
          text-align: center;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .error-text {
          font-size: 1.2rem;
          color: #f44336;
          margin-bottom: 8px;
        }

        .error-details {
          font-size: 0.9rem;
          color: #ccc;
          margin-bottom: 24px;
          max-width: 500px;
        }

        .retry-button {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          background: linear-gradient(135deg, #d32f2f, #c62828);
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0.3;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Status Header */
        @media (max-width: 768px) {
          .status-header {
            padding: 12px 16px;
            flex-direction: column;
            gap: 12px;
          }

          .status-left, .status-right {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
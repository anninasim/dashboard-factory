import { useEffect, useState } from 'react';
import './App.css';
import ProductionCard from './ProductionCard';
import FlowChartsPage from '../FlowChartsPage';

function App() {
  const [dati, setDati] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'flow-charts'

  // ⏱️ Intervallo di polling configurabile
  const POLLING_INTERVAL_MS = 30000; // 30 secondi per dashboard produzione

  // 🎯 FUNZIONE ORDINAMENTO PERSONALIZZATO per le card della dashboard
  const ordinaMacchine = (dati) => {
    // Ordinamento personalizzato secondo la sequenza richiesta
    const ordinePersonalizzato = [
      'TR100 A',
      'TR100 B', 
      'TR100 C',
      'TR 80',
      'TR120 A',
      'TR120 B',
      'TR160',
      'COEX 7s'
    ];

    return dati.sort((a, b) => {
      // Ottieni i nomi delle macchine dai dati (campo fnt_sigla)
      const nomeA = a.fnt_sigla || '';
      const nomeB = b.fnt_sigla || '';
      
      // Trova le posizioni nell'ordinamento personalizzato
      let posizioneA = ordinePersonalizzato.indexOf(nomeA);
      let posizioneB = ordinePersonalizzato.indexOf(nomeB);
      
      // Se una macchina non è nell'elenco personalizzato, la mette alla fine
      if (posizioneA === -1) posizioneA = ordinePersonalizzato.length;
      if (posizioneB === -1) posizioneB = ordinePersonalizzato.length;
      
      // Ordinamento per posizione
      if (posizioneA !== posizioneB) {
        return posizioneA - posizioneB;
      }
      
      // Se entrambe sono "fuori lista", ordina alfabeticamente
      return nomeA.localeCompare(nomeB);
    });
  };

  useEffect(() => {
    // Fetch dati solo per la dashboard di produzione
    if (currentPage === 'dashboard') {
      const fetchData = async () => {
        try {
          const res = await fetch('http://localhost:3001/api/dashboard');
          const data = await res.json();
          
          // 🎯 APPLICA L'ORDINAMENTO PERSONALIZZATO
          const datiOrdinati = ordinaMacchine(data);
          setDati(datiOrdinati);
        } catch (err) {
          console.error('Errore nel recupero dati:', err);
        }
      };

      fetchData(); // prima chiamata
      const interval = setInterval(fetchData, POLLING_INTERVAL_MS);
      return () => clearInterval(interval); // pulizia
    }
  }, [currentPage]);

  // Renderizza la pagina corrente
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="dashboard-grid">
            {dati.map((riga, i) => (
              <ProductionCard key={i} data={riga} />
            ))}
          </div>
        );
      
      case 'flow-charts':
        return <FlowChartsPage />;
      
      default:
        return (
          <div className="dashboard-grid">
            {dati.map((riga, i) => (
              <ProductionCard key={i} data={riga} />
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
      `}</style>
    </div>
  );
}

export default App;
import { useEffect, useState } from 'react';
import './App.css';
import ProductionCard from './ProductionCard';

function App() {
  const [dati, setDati] = useState([]);

  // ⏱️ Intervallo di polling configurabile
  const POLLING_INTERVAL_MS = 30000; // 30 secondi

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/dashboard');
        const data = await res.json();
        setDati(data);
      } catch (err) {
        console.error('Errore nel recupero dati:', err);
      }
    };

    fetchData(); // prima chiamata
    const interval = setInterval(fetchData, POLLING_INTERVAL_MS);
    return () => clearInterval(interval); // pulizia
  }, []);

  return (
    <div className="dashboard-grid">
      {dati.map((riga, i) => (
        <ProductionCard key={i} data={riga} />
      ))}
    </div>
  );
}

export default App;

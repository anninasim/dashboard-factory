import { useState, useEffect, useCallback } from 'react';

// Custom hook per gestire le chiamate API con polling
export const useApiPolling = (url, interval = 30000, enabled = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setConnectionStatus('connecting');
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const responseData = await res.json();
      setData(responseData);
      setError(null);
      setConnectionStatus('connected');
      setLastUpdate(new Date());
      
      console.log(`✅ Dati aggiornati: ${responseData.length} record`, {
        timestamp: new Date().toLocaleTimeString(),
        url: url
      });
      
    } catch (err) {
      console.error('❌ Errore nel fetch API:', err);
      setError(err.message);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  // Funzione per refresh manuale
  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enabled) return;

    fetchData(); // Prima chiamata
    
    const intervalId = setInterval(fetchData, interval);
    
    // Pulizia
    return () => clearInterval(intervalId);
  }, [fetchData, interval, enabled]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    connectionStatus,
    refresh
  };
};

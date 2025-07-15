import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FlowChartsPage = () => {
  const [flowData, setFlowData] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [updateCount, setUpdateCount] = useState(0);

  // Polling ogni 60 secondi
  const POLLING_INTERVAL_MS = 60000;

  useEffect(() => {
    const fetchFlowData = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsInitialLoading(true);
        } else {
          setIsUpdating(true);
        }
        
        setError(null);
        
        const url = selectedDate 
          ? `http://localhost:3001/api/flow-data?date=${selectedDate}`
          : 'http://localhost:3001/api/flow-data';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Smooth update - solo se ci sono cambiamenti
        const newData = result.machines || [];
        if (JSON.stringify(newData) !== JSON.stringify(flowData)) {
          setFlowData(newData);
          setUpdateCount(prev => prev + 1);
        }
        
        setLastUpdate(new Date());
        
      } catch (err) {
        setError(err.message);
        console.error('Errore nel recupero dati portata:', err);
      } finally {
        setIsInitialLoading(false);
        setIsUpdating(false);
      }
    };

    // Prima chiamata (con loading)
    fetchFlowData(true);
    
    // Polling successivo (smooth)
    const interval = setInterval(() => fetchFlowData(false), POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [selectedDate, flowData]);

  // Custom tooltip per i grafici
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#2a2a2a',
          border: '1px solid #555',
          borderRadius: '8px',
          padding: '12px',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
            {`Ora: ${label}`}
          </p>
          <p style={{ margin: 0, color: '#00cc66' }}>
            {`Portata: ${payload[0].value.toFixed(1)} m/min`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Genera tick per asse X (ogni 2 ore)
  const getXAxisTicks = () => {
    const ticks = [];
    for (let hour = 0; hour < 24; hour += 2) {
      ticks.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return ticks;
  };

  // Calcola statistiche per header
  const getTotalStats = () => {
    if (!flowData.length) return { machines: 0, totalPoints: 0, avgFlow: 0 };
    
    const totalPoints = flowData.reduce((sum, machine) => sum + machine.dataPoints, 0);
    const avgFlow = flowData.reduce((sum, machine) => sum + machine.stats.avg, 0) / flowData.length;
    
    return {
      machines: flowData.length,
      totalPoints,
      avgFlow: avgFlow.toFixed(1)
    };
  };

  const stats = getTotalStats();

  // Solo loading iniziale
  if (isInitialLoading) {
    return (
      <div className="flow-charts-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Caricamento grafici portata...</p>
        </div>
      </div>
    );
  }

  // Errore senza loading
  if (error) {
    return (
      <div className="flow-charts-page">
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Errore nel caricamento</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              🔄 Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-charts-page">
      {/* Header con controlli */}
      <div className="flow-header">
        <div className="header-left">
          <h1 className="page-title">
            📊 Monitoraggio Portata - Grafici Real-time
          </h1>
          <div className="header-stats">
            <span className="stat-item">
              🏭 {stats.machines} Macchine
            </span>
            <span className="stat-item">
              📈 {stats.totalPoints} Punti dati
            </span>
            <span className="stat-item">
              ⚡ Media: {stats.avgFlow} m/min
            </span>
            <span className={`stat-item ${isUpdating ? 'updating' : ''}`}>
              🕐 {lastUpdate.toLocaleTimeString('it-IT')}
              {isUpdating && <span className="update-dot">●</span>}
            </span>
          </div>
        </div>
        
        <div className="header-controls">
          <input
            type="date"
            value={selectedDate || new Date().toISOString().slice(0, 10)}
            onChange={(e) => {
              const newDate = e.target.value.replace(/-/g, '');
              setSelectedDate(newDate);
            }}
            className="date-picker"
          />
          <button
            onClick={() => window.location.reload()}
            className="refresh-button"
            disabled={isUpdating}
          >
            🔄 Aggiorna
          </button>
        </div>
      </div>

      {/* Griglia grafici */}
      <div className="charts-grid">
        {flowData.map((machine, index) => (
          <div key={machine.machine} className="chart-card" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Header della card */}
            <div className="chart-card-header">
              <div className="machine-info">
                <h2 className="machine-title">Macchina {machine.machine}</h2>
                <div className="machine-stats">
                  <span className="current-value smooth-update">
                    {machine.stats.latest ? `${machine.stats.latest.toFixed(1)} m/min` : '--'}
                  </span>
                  <div className="mini-stats">
                    <span>📊 {machine.dataPoints} punti</span>
                    <span>📈 Avg: {machine.stats.avg.toFixed(1)}</span>
                    <span>📉 Min: {machine.stats.min.toFixed(1)}</span>
                    <span>📈 Max: {machine.stats.max.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              {/* Indicatore di stato */}
              <div className="status-indicator">
                <div className={`status-dot ${isUpdating ? 'updating' : 'active'}`}></div>
                <span className="status-label">
                  {isUpdating ? 'AGGIORNAMENTO' : 'ATTIVA'}
                </span>
              </div>
            </div>

            {/* Grafico con assi e scala più grande */}
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={machine.data}
                  margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#444" 
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="time"
                    ticks={getXAxisTicks()}
                    tick={{ fontSize: 12, fill: '#cccccc' }}
                    axisLine={{ stroke: '#666' }}
                    tickLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    domain={['dataMin - 0.2', 'dataMax + 0.2']}
                    tick={{ fontSize: 12, fill: '#cccccc' }}
                    axisLine={{ stroke: '#666' }}
                    tickLine={{ stroke: '#666' }}
                    label={{ 
                      value: 'm/min', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#cccccc', fontSize: '12px' }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="flowRate" 
                    stroke="#00cc66" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 6, 
                      fill: '#00cc66',
                      stroke: '#ffffff',
                      strokeWidth: 3
                    }}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Styles con animazioni smooth */}
      <style>{`
        .flow-charts-page {
          background-color: #1a1a1a;
          color: #ffffff;
          min-height: 100vh;
          padding: 24px;
        }

        .flow-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding: 24px;
          background: linear-gradient(145deg, #2a2a2a, #333333);
          border-radius: 12px;
          border: 1px solid #444;
          transition: all 0.3s ease;
        }

        .header-left h1.page-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .header-stats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .stat-item {
          font-size: 1.1rem;
          color: #cccccc;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #555;
          transition: all 0.3s ease;
          position: relative;
        }

        .stat-item.updating {
          background: rgba(0, 204, 102, 0.1);
          border-color: #00cc66;
        }

        .update-dot {
          color: #00cc66;
          animation: pulse 1s infinite;
          margin-left: 8px;
        }

        .header-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .date-picker {
          padding: 12px;
          border: 1px solid #555;
          border-radius: 8px;
          background: #333;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .date-picker:focus {
          border-color: #00cc66;
          outline: none;
        }

        .refresh-button {
          padding: 12px 20px;
          background: linear-gradient(135deg, #00cc66, #00aa55);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00aa55, #008844);
          transform: translateY(-1px);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .chart-card {
          background: linear-gradient(145deg, #2a2a2a, #333333);
          border: 1px solid #444;
          border-radius: 12px;
          padding: 24px;
          height: 500px; /* Aumentata da 400px a 500px */
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease-out;
        }

        .chart-card:hover {
          border-color: #555;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-shrink: 0;
        }

        .machine-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #ffffff;
          transition: color 0.3s ease;
        }

        .current-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: #00cc66;
          display: block;
          margin-bottom: 8px;
        }

        .smooth-update {
          transition: all 0.5s ease;
        }

        .mini-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .mini-stats span {
          font-size: 0.85rem;
          color: #aaaaaa;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #00cc66;
          box-shadow: 0 0 10px #00cc6660;
          transition: all 0.3s ease;
        }

        .status-dot.active {
          animation: statusPulse 2s ease-in-out infinite;
        }

        .status-dot.updating {
          background: #ffa500;
          box-shadow: 0 0 10px #ffa50060;
          animation: updatePulse 1s ease-in-out infinite;
        }

        .status-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #00cc66;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }

        .chart-container {
          flex: 1;
          height: 350px; /* Aumentata da 280px a 350px */
          background: linear-gradient(
            135deg,
            rgba(0, 204, 102, 0.02) 0%,
            rgba(0, 204, 102, 0.05) 50%,
            rgba(0, 204, 102, 0.02) 100%
          );
          border-radius: 8px;
          border: 1px solid rgba(0, 204, 102, 0.1);
        }

        .loading-container, .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #333;
          border-top: 4px solid #00cc66;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .loading-text {
          font-size: 1.2rem;
          color: #cccccc;
        }

        .error-message {
          background: linear-gradient(145deg, #2a2a2a, #333333);
          padding: 32px;
          border-radius: 12px;
          border: 1px solid #666;
        }

        .retry-button {
          margin-top: 16px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #cc4444, #aa3333);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          background: linear-gradient(135deg, #aa3333, #882222);
        }

        /* Animazioni smooth */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes statusPulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes updatePulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(0.9);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive per schermi grandi */
        @media (min-width: 1920px) {
          .charts-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          
          .chart-card {
            height: 350px;
          }
        }

        /* Responsive per TV 4K */
        @media (min-width: 3840px) {
          .page-title {
            font-size: 3rem !important;
          }
          
          .charts-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
          }
          
          .chart-card {
            height: 450px;
          }
          
          .machine-title {
            font-size: 1.8rem !important;
          }
          
          .current-value {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FlowChartsPage;
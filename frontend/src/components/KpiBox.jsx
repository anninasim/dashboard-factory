import React from 'react';

function KpiBox({ label, value, unit, color = '#00bcd4', background = '#3a3a3a', border = '#616161' }) {
  // Funzione per formattare i numeri senza decimali inutili
  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0';
    
    // Se è un numero intero, mostralo senza decimali
    if (Number.isInteger(numValue)) {
      return numValue.toString();
    }
    
    // Se ha decimali, rimuovi gli zeri finali inutili
    return numValue.toString();
  };

  const boxStyle = {
    background,
    border: `2px solid ${border}`,
    borderRadius: '10px', /* ⭐ Leggermente più piccolo per compattezza */
    padding: '14px 12px', /* ⭐ Ridotto da 20px 16px per compattezza */
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.25)', /* ⭐ Ombra più sottile */
    flex: 1,
    margin: '0',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  // ⭐ Valore compatto ma ancora prominente
  const valueStyle = {
    fontSize: '3.5rem', /* ⭐ Ridotto da 3rem per compattezza */
    fontWeight: '800',
    color,
    lineHeight: '1',
    margin: '8px 0 6px 0', /* ⭐ Margini ridotti per compattezza */
    textShadow: 'none'
  };

  // ⭐ Label compatta
  const labelStyle = {
    fontSize: '0.8rem', /* ⭐ Leggermente ridotto da 0.9rem */
    textTransform: 'uppercase',
    letterSpacing: '1px', /* ⭐ Ridotto da 1.2px */
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: '6px', /* ⭐ Ridotto da 8px */
    color: '#e0e0e0'
  };

  // ⭐ Unità di misura proporzionalmente ridotta
  const unitStyle = {
    fontSize: '0.95rem', /* ⭐ Ridotto da 1.1rem */
    marginLeft: '5px', /* ⭐ Ridotto da 6px */
    color: '#ccc',
    fontWeight: '500',
    opacity: 0.8
  };

  return (
    <div style={boxStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>
        {formatNumber(value)}
        <span style={unitStyle}>{unit}</span>
      </div>
      
      {/* ⭐ Elemento decorativo più sottile per compattezza */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '2px', /* ⭐ Ridotto da 3px per compattezza */
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.4
      }} />

      {/* ⭐ CSS aggiornato per design compatto */}
      <style>{`
        /* Effetto hover per interattività */
        .kpi-box:hover {
          transform: translateY(-1px); /* ⭐ Movimento più sottile */
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35) !important; /* ⭐ Ombra proporzionata */
          border-color: ${color} !important;
        }

        /* Responsive per schermi piccoli */
        @media (max-width: 768px) {
          .kpi-value-main {
            font-size: 2rem !important; /* ⭐ Compatto per mobile */
          }
          
          .kpi-label-main {
            font-size: 0.75rem !important;
          }
          
          .kpi-unit-main {
            font-size: 0.85rem !important;
          }
        }

        /* Responsive per TV 4K */
        @media (min-width: 3840px) {
          .kpi-value-main {
            font-size: 3rem !important; /* ⭐ Proporzionalmente più grande su 4K */
          }
          
          .kpi-label-main {
            font-size: 1rem !important;
          }
          
          .kpi-unit-main {
            font-size: 1.2rem !important;
          }
        }

        /* Animazione pulita per i cambiamenti di valore */
        .kpi-value-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

export default KpiBox;
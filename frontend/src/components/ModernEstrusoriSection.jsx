import React from 'react';

// Sezione compatta e pulita per estrusori/miscele
function ModernEstrusoriSection({ estrusoriMiscele }) {
  if (!estrusoriMiscele || estrusoriMiscele.length === 0) return null;
  return (
    <div className="estrusori-miscele-section" style={{
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '6px 0 2px 0',
      background: 'rgba(10,37,64,0.10)',
      borderTop: '1px solid #222',
      marginTop: '8px'
    }}>
      {estrusoriMiscele.map((item, idx) => (
        <div key={idx} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(0,255,208,0.08)',
          borderRadius: '6px',
          padding: '2px 10px',
          fontSize: '0.98rem',
          fontWeight: 500,
          color: '#00ffd0',
          boxShadow: '0 1px 4px rgba(0,255,208,0.04)'
        }}>
          <span style={{
            fontWeight: 700,
            color: '#00eaff',
            fontSize: '1.08rem',
            marginRight: '4px',
            letterSpacing: '0.08em'
          }}>{item.lettera}</span>
          <span style={{
            color: '#fff',
            fontWeight: 400,
            fontSize: '0.97rem',
            opacity: 0.92
          }}>{item.miscela}</span>
        </div>
      ))}
    </div>
  );
}

export default ModernEstrusoriSection;

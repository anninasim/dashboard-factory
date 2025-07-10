import React from 'react';

function KpiBox({ label, value, unit, color = '#00bcd4', background = '#3a3a3a', border = '#616161' }) {
  const boxStyle = {
    background,
    border: `2px solid ${border}`,
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    flex: 1,
    margin: '4px'
  };

  const valueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color,
  };

  const labelStyle = {
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    opacity: 0.8
  };

  return (
    <div style={boxStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>
        {value}<span style={{ fontSize: '1rem', marginLeft: '4px', color: '#ccc' }}>{unit}</span>
      </div>
    </div>
  );
}

export default KpiBox;

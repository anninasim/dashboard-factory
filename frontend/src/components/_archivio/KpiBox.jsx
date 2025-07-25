import React from 'react';
import AnimatedCounter from './AnimatedCounter'; // 🆕 IMPORT del nuovo componente

function KpiBox({ label, value, unit, icon, color = '#00bcd4', background = '#3a3a3a', border = '#616161' }) {
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
    border: `1px solid ${border}`,
    borderRadius: '0.4rem',
    padding: '0.5rem 0.3rem', // RIDOTTO: da 0.6rem a 0.5rem/0.3rem
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
    flex: 1,
    margin: '0',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'visible',
    minHeight: '3rem', // RIDOTTO: da 3.5rem a 3rem
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box'
  };

  // 📺 Label ottimizzata per fit CON ICONA
  const labelStyle = {
    fontSize: '0.6rem', // RIDOTTO: da 0.65rem a 0.6rem
    textTransform: 'uppercase',
    letterSpacing: '0.02rem',
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: '0.1rem', // RIDOTTO: da 0.2rem a 0.1rem
    color: '#e0e0e0',
    textAlign: 'center',
    width: '100%',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem' // RIDOTTO: da 0.4rem a 0.3rem
  };

  // 📺 Unità di misura ottimizzata per fit  
  const unitStyle = {
    fontSize: '0.8rem', // 📺 Proporzionata per fit
    marginLeft: '0.3rem',
    color: '#ccc',
    fontWeight: '500',
    opacity: 0.8
  };

  // 🆕 STILE ICONA INDUSTRIALE - INGRANDITA
  const iconStyle = {
    fontSize: '1rem', // RIDOTTO: da 1.2rem a 1rem
    opacity: 0.8, // 📺 ⬆️ AUMENTATO: da 0.7 a 0.8 per più visibilità
    filter: 'grayscale(10%)', // 📺 ⬇️ RIDOTTO: da 20% a 10% per più colore
  };

  // 🆕 STILE PER ANIMATED COUNTER
  const animatedValueStyle = {
    fontSize: '2rem', // RIDOTTO: da 2.3rem a 2rem
    fontWeight: '600',
    color,
    lineHeight: '1',
    margin: '0.1rem 0', // RIDOTTO: da 0.2rem a 0.1rem
    textShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    overflow: 'visible',
    whiteSpace: 'nowrap',
    width: '100%',
    textAlign: 'center'
  };

  return (
    <div style={boxStyle} className="kpi-box-fit-screen">
      {/* 🆕 LABEL CON ICONA */}
      <div style={labelStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <span>{label}</span>
      </div>
      
      {/* 🆕 ANIMATED COUNTER - SOSTITUISCE IL VALORE STATICO */}
      <AnimatedCounter
        value={value}
        unit={unit}
        formatNumber={formatNumber}
        style={animatedValueStyle}
        className="kpi-value-fit-screen"
        duration={0.5} // 🎯 Animazione di 0.5s - professionale
        ease="easeOut"
      />
      
      {/* 📺 Elemento decorativo compatto */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.4
      }} />

      {/* 📺 CSS OTTIMIZZATO PER FIT PERFETTO SCHERMO CON ICONE */}
      <style>{`
        /* 📺 BASE - FIT SCREEN DESIGN */
        .kpi-box-fit-screen {
          overflow: visible !important;
          min-height: 3rem !important;
          height: auto !important;
          max-height: none !important;
          box-sizing: border-box !important;
        }

        .kpi-value-fit-screen {
          overflow: visible !important;
          line-height: 1 !important;
          font-size: 1.5rem !important;         /* RIDOTTO: da 1.6rem a 1.5rem */
          text-align: center !important;
          width: 100% !important;
          white-space: nowrap !important;
          margin: 0 !important;                 /* RIDOTTO: eliminato il margine */
        }

        /* 📺 TV 4K - Scaling up mantenendo fit */
        @media (min-width: 3840px) {
          .kpi-box-fit-screen {
            min-height: 5rem !important;        /* RIDOTTO: da 5rem a 4rem */
            padding: 0.8rem 0.5rem !important;  /* RIDOTTO: da 1rem a 0.8rem */
            border-radius: 0.6rem !important;
          }
          
          .kpi-value-fit-screen {
            font-size: 2.4rem !important;       /* RIDOTTO: da 2.5rem a 2.2rem */
            margin: 0.2rem 0 !important;        /* RIDOTTO: da 0.3rem a 0.2rem */
          }
          
          .kpi-box-fit-screen .kpi-value-fit-screen span {
            font-size: 1.6rem !important;
            margin-left: 0.4rem !important;
          }

          .kpi-box-fit-screen div:first-child {
            font-size: 1rem !important;
            margin-bottom: 0.5rem !important;
          }

          /* 🆕 ICONA PIÙ GRANDE SU 4K */
          .kpi-box-fit-screen div:first-child span:first-child {
            font-size: 1.2rem !important; /* 📺 ⬆️ INGRANDITO: da 1.1rem a 1.6rem */
          }
        }

        /* 💻 DESKTOP - Scale down per fit */
        @media (max-width: 3839px) and (min-width: 1200px) {
          .kpi-box-fit-screen {
            min-height: 3rem !important;
            padding: 0.5rem 0.3rem !important;
          }
          
          .kpi-value-fit-screen {
            font-size: 1.5rem !important;
          }
          
          .kpi-box-fit-screen .kpi-value-fit-screen span {
            font-size: 0.7rem !important;
            margin-left: 0.2rem !important;
          }

          .kpi-box-fit-screen div:first-child {
            font-size: 0.6rem !important;
            margin-bottom: 0.1rem !important;
          }

          /* 🆕 ICONA DESKTOP */
          .kpi-box-fit-screen div:first-child span:first-child {
            font-size: 1rem !important; /* 📺 ⬆️ INGRANDITO: da 0.7rem a 1rem */
          }
        }

        /* 📱 MOBILE - Scale down molto per fit */
        @media (max-width: 1199px) {
          .kpi-box-fit-screen {
            min-height: 2.5rem !important;
            padding: 0.4rem 0.2rem !important;
            border-radius: 0.3rem !important;
          }
          
          .kpi-value-fit-screen {
            font-size: 1.1rem !important;
            margin: 0.1rem 0 !important;
          }
          
          .kpi-box-fit-screen .kpi-value-fit-screen span {
            font-size: 0.6rem !important;
            margin-left: 0.2rem !important;
          }

          .kpi-box-fit-screen div:first-child {
            font-size: 0.55rem !important;
            margin-bottom: 0.1rem !important;
          }

          /* 🆕 ICONA MOBILE */
          .kpi-box-fit-screen div:first-child span:first-child {
            font-size: 0.9rem !important; /* 📺 ⬆️ INGRANDITO: da 0.6rem a 0.9rem */
          }
        }

        /* Animazione pulita per i cambiamenti di valore */
        .kpi-value-fit-screen {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Fix finale per assicurarsi che niente venga mai tagliato */
        .kpi-box-fit-screen,
        .kpi-box-fit-screen *,
        .kpi-value-fit-screen,
        .kpi-value-fit-screen * {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
}

export default KpiBox;
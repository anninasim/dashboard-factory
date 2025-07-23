import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AnimatedCounter - Counter animato professionale per dashboard industriale
 * 
 * @param {number|string} value - Valore da mostrare
 * @param {string} unit - Unità di misura (opzionale)
 * @param {object} style - Stili CSS personalizzati
 * @param {number} duration - Durata animazione (default: 0.4s)
 * @param {string} ease - Easing animazione (default: "easeOut")
 * @param {function} formatNumber - Funzione custom per formattare il numero
 */
const AnimatedCounter = ({ 
  value, 
  unit = '', 
  style = {}, 
  duration = 0.4,
  ease = "easeOut",
  formatNumber = null,
  className = ""
}) => {
  
  // Funzione di default per formattare i numeri
  const defaultFormatNumber = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '0';
    
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(numValue)) return '0';
    
    // Se è un numero intero, mostralo senza decimali
    if (Number.isInteger(numValue)) {
      return numValue.toString();
    }
    
    // Se ha decimali, rimuovi gli zeri finali inutili
    return numValue.toString();
  };

  // Usa formatNumber custom se fornito, altrimenti quello di default
  const formatter = formatNumber || defaultFormatNumber;
  const formattedValue = formatter(value);

  return (
    <div style={style} className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={formattedValue} // 🎯 Key cambia quando il valore cambia
          initial={{ 
            opacity: 0, 
            y: -8 // Slide da sopra - molto discreto
          }}
          animate={{ 
            opacity: 1, 
            y: 0 
          }}
          exit={{ 
            opacity: 0, 
            y: 8 // Slide verso il basso - molto discreto
          }}
          transition={{ 
            duration, 
            ease,
            // 🏭 Easing professionale - non bouncy
            type: "tween"
          }}
          style={{
            display: 'inline-block',
            // 🎯 Mantiene layout stabile durante animazione
            minWidth: 'fit-content'
          }}
        >
          {formattedValue}
          {unit && (
            <motion.span
              style={{
                opacity: 0.8,
                marginLeft: '0.2rem'
              }}
            >
              {unit}
            </motion.span>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedCounter;
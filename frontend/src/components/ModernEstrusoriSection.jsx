
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { FlaskRound } from 'lucide-react';

// Sezione compatta e pulita per estrusori/miscele

function ModernEstrusoriSection({ estrusoriMiscele, isCompleted }) {
  if (!estrusoriMiscele || estrusoriMiscele.length === 0) return null;
  const colClass = estrusoriMiscele.length <= 4 ? 'grid-cols-1' : 'grid-cols-2';
  // Pastel color palette for extruder badges
  const pastelColors = [
    'bg-cyan-100 text-cyan-700 border-cyan-200',
    'bg-pink-100 text-pink-700 border-pink-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-yellow-100 text-yellow-700 border-yellow-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-orange-100 text-orange-700 border-orange-200',
  ];
  // Stile grigio per stato completato
  const completedStyle = isCompleted
    ? {
        color: '#b0b0b0',
        filter: 'grayscale(0.7)',
        opacity: 0.7,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #232323 60%, #2d2d2d 100%)',
      }
    : {};
  return (
    <Card className="w-full h-56 bg-slate-900/40 border-slate-700/50 backdrop-blur-xl" style={isCompleted ? { ...completedStyle } : {}}>
      <CardHeader className="pb-2 pt-2">
        <CardTitle
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: isCompleted ? '#b0b0b0' : '#fff', lineHeight: 1.1 }}
        >
          <FlaskRound className="w-5 h-5" style={{ color: isCompleted ? '#b0b0b0' : '#f472b6' }} />
          DOSAGGIO ADDITIVI
        </CardTitle>
        <div className="border-b border-slate-600/40 mt-2" />
      </CardHeader>
      <CardContent className={`pt-2 pb-1 grid ${colClass} gap-2`}>
        {(() => {
          // Column-major order: fill columns vertically, then next column
          const n = estrusoriMiscele.length;
          const cols = colClass === 'grid-cols-2' ? 2 : 1;
          const rows = Math.ceil(n / cols);
          const items = [];
          for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
              const idx = row + col * rows;
              if (idx < n) {
                const item = estrusoriMiscele[idx];
                items.push(
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-800/60 rounded-md px-2 py-1 min-w-[80px] shadow-sm border border-slate-700/30"
                    style={{ fontSize: '0.92rem', minHeight: '30px', borderWidth: '1px' }}
                  >
                    <Badge
                      variant="secondary"
                      className={`font-extrabold px-2 py-0.5 mr-1 border ${pastelColors[idx % pastelColors.length]}`}
                      style={{ fontSize: '1.05rem', transition: 'background 0.2s' }}
                    >
                      {item.lettera}
                    </Badge>
                    <span className="text-slate-100 font-medium tracking-tight" style={{ fontSize: '0.92rem' }}>
                      {item.miscela}
                    </span>
                  </div>
                );
              }
            }
          }
          return items;
        })()}
      </CardContent>
    </Card>
  );
}

export default ModernEstrusoriSection;

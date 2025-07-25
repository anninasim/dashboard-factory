import ModernMixCardDemo from './components/_demo/ModernMixCardDemo';
import MixDemoPage from './MixDemoPage';
import { useState } from 'react';

export default function MixDemoPage() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'flow-charts' | 'mix-demo'

  return (
    <>
      <div className="page-toggle">
        {/* ...esistente... */}
        <button
          onClick={() => setCurrentPage('mix-demo')}
          className="toggle-button"
          title="Vai alla Demo Mix"
        >
          🧪
        </button>
        <div className="toggle-label">Demo Mix</div>
      </div>
      <ModernMixCardDemo />
    </>
  );
}

import React from 'react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const pages = [
    {
      id: 'dashboard',
      label: 'Dashboard Produzione',
      icon: '🏭',
      description: 'Monitoraggio stati macchine e ordini'
    },
    {
      id: 'flow-charts',
      label: 'Grafici Portata',
      icon: '📊',
      description: 'Andamento portata real-time'
    }
  ];

  return (
    <div className="navigation-container">
      <div className="nav-header">
        <h1 className="nav-title">🏭 Sistema Industriale OptimusNT</h1>
        <div className="nav-subtitle">Dashboard di Monitoraggio e Controllo</div>
      </div>
      
      <div className="nav-tabs">
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => setCurrentPage(page.id)}
            className={`nav-tab ${currentPage === page.id ? 'active' : ''}`}
          >
            <span className="nav-tab-icon">{page.icon}</span>
            <div className="nav-tab-content">
              <span className="nav-tab-label">{page.label}</span>
              <span className="nav-tab-description">{page.description}</span>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .navigation-container {
          background: linear-gradient(145deg, #2a2a2a, #333333);
          border-bottom: 2px solid #444;
          padding: 20px 32px;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .nav-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .nav-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .nav-subtitle {
          font-size: 1.1rem;
          color: #cccccc;
          font-weight: 500;
        }

        .nav-tabs {
          display: flex;
          justify-content: center;
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: linear-gradient(145deg, #404040, #4a4a4a);
          border: 2px solid #555;
          border-radius: 12px;
          color: #cccccc;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 220px;
          text-align: left;
        }

        .nav-tab:hover {
          background: linear-gradient(145deg, #4a4a4a, #555555);
          border-color: #666;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #00cc66, #00aa55);
          border-color: #00cc66;
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(0, 204, 102, 0.3);
        }

        .nav-tab-icon {
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .nav-tab-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-tab-label {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.2;
        }

        .nav-tab-description {
          font-size: 0.85rem;
          opacity: 0.8;
          line-height: 1.3;
        }

        .nav-tab.active .nav-tab-description {
          opacity: 0.9;
        }

        /* Responsive per schermi più piccoli */
        @media (max-width: 768px) {
          .nav-tabs {
            flex-direction: column;
            align-items: center;
          }
          
          .nav-tab {
            width: 100%;
            max-width: 400px;
          }
          
          .nav-title {
            font-size: 1.8rem !important;
          }
        }

        /* Responsive per TV 4K */
        @media (min-width: 3840px) {
          .navigation-container {
            padding: 32px 48px;
          }
          
          .nav-title {
            font-size: 3rem !important;
          }
          
          .nav-subtitle {
            font-size: 1.4rem !important;
          }
          
          .nav-tab {
            padding: 24px 32px;
            min-width: 280px;
          }
          
          .nav-tab-icon {
            font-size: 2.2rem !important;
          }
          
          .nav-tab-label {
            font-size: 1.4rem !important;
          }
          
          .nav-tab-description {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Navigation;
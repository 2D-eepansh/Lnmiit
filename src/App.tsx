import { useEffect, useState, lazy, Suspense } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnimatedCryptoBackground } from './components/AnimatedCryptoBackground';
import { NetworkHealth } from './components/NetworkHealth';
import { PriceStability } from './components/PriceStability';
import { RiskSummary } from './components/RiskSummary';
import { BlockTimeChart } from './components/BlockTimeChart';
import { PriceChart } from './components/PriceChart';
import { TxVolumeChart } from './components/TxVolumeChart';
const KYAModal = lazy(() => import('./components/KYAModal').then(mod => ({ default: mod.KYAModal })));
import { AboutSection } from './components/AboutSection';
import { FAQ } from './components/FAQ';
import { RefreshCw, BookOpen, AlertCircle, Wifi, WifiOff, Info } from 'lucide-react';
import './App.css';

function AppContent() {
  const {
    error,
    lastUpdated, 
    apiHealthy, 
    usingMockData, 
    refreshData,
    setKyaShown,
  } = useApp();
  
  const [kyaModalOpen, setKyaModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAboutClick = () => {
    const el = document.getElementById('about-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleKYAClick = () => {
    setKyaModalOpen(true);
    setKyaShown(true);
  };

  return (
    <div className="app">
      <AnimatedCryptoBackground />
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">Σ</div>
              <div>
                <h1>Ergo Stability Dashboard</h1>
                <p className="tagline">Know Your Assumptions • Transparency First</p>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <button 
              className="about-button" 
              onClick={handleAboutClick}
              aria-label="Scroll to About section"
            >
              <Info size={18} />
              <span>About</span>
            </button>

            <button 
              className="kya-button" 
              onClick={handleKYAClick}
              aria-label="Open Know Your Assumptions modal"
            >
              <BookOpen size={20} />
              <span>KYA</span>
            </button>
            
            <button 
              className={`refresh-button ${isRefreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh data"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            {apiHealthy ? (
              <>
                <Wifi size={16} className="status-icon status-online" />
                <span>API Online</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="status-icon status-offline" />
                <span>API Offline</span>
              </>
            )}
          </div>
          
          {usingMockData && (
            <div className="status-item status-warning">
              <AlertCircle size={16} className="status-icon" />
              <span>Using Mock Data</span>
            </div>
          )}
          
          {lastUpdated && (
            <div className="status-item">
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="app-main">
        {/* Top Metrics Row */}
        <div className="metrics-row">
          <div className="reveal"><NetworkHealth /></div>
          <div className="reveal reveal-slow"><PriceStability /></div>
        </div>

        {/* Risk Summary */}
        <div className="full-width reveal">
          <RiskSummary />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="reveal"><BlockTimeChart /></div>
          <div className="reveal reveal-slow"><PriceChart /></div>
          <div className="reveal"><TxVolumeChart /></div>
        </div>

        {/* Info & FAQs */}
        <div className="info-grid">
          <div className="reveal"><AboutSection onOpenKYA={handleKYAClick} /></div>
          <div className="reveal reveal-slow"><FAQ /></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Built for the Ergo ecosystem with transparency and education in mind. 
            <button className="footer-link" onClick={handleKYAClick}>
              Read our KYA statement
            </button>
          </p>
          <p className="footer-disclaimer">
            Not financial advice. For educational purposes only. DYOR.
          </p>
        </div>
      </footer>

      {/* KYA Modal */}
      <Suspense fallback={null}>
        <KYAModal isOpen={kyaModalOpen} onClose={() => setKyaModalOpen(false)} />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

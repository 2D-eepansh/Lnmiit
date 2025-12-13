import { useEffect, useState, lazy, Suspense } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TopNav } from './components/Navigation/TopNav';
import { Home } from './pages/Home';
import { Methodology } from './pages/Methodology';
import { Assumptions } from './pages/Assumptions';
import { FAQPage } from './pages/FAQPage';
const KYAModal = lazy(() => import('./components/KYAModal').then(mod => ({ default: mod.KYAModal })));
import { AlertCircle } from 'lucide-react';
import './App.css';

function AppContent() {
  const {
    error,
    refreshData,
    setKyaShown,
  } = useApp();
  
  const [kyaModalOpen, setKyaModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const renderPage = () => {
    switch (currentPage) {
      case 'methodology':
        return <Methodology />;
      case 'assumptions':
        return <Assumptions />;
      case 'faq':
        return <FAQPage />;
      default:
        return <Home onOpenKYA={handleKYAClick} />;
    }
  };

  return (
    <div className="app">
      {/* KYA Modal - Positioned at Top */}
      <Suspense fallback={null}>
        <KYAModal isOpen={kyaModalOpen} onClose={() => setKyaModalOpen(false)} />
      </Suspense>

      {/* Top Navigation */}
      <TopNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenKYA={handleKYAClick}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Page Content */}
      {renderPage()}

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
          <p className="footer-links">
            <a className="footer-link" href="https://github.com/ergo-pad/ergo-stability-dashboard" target="_blank" rel="noreferrer">GitHub repository</a>
            <span className="footer-separator">•</span>
            <a className="footer-link" href="https://explorer.ergoplatform.com/" target="_blank" rel="noreferrer">Ergo Explorer (data)</a>
            <span className="footer-separator">•</span>
            <a className="footer-link" href="https://www.coingecko.com/en/coins/ergo" target="_blank" rel="noreferrer">Price feed source</a>
          </p>
        </div>
      </footer>
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

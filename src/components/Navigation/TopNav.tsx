import { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import { Wifi, WifiOff, AlertCircle, Menu, X, RefreshCw, Moon, Sun } from 'lucide-react';
import './TopNav.css';

interface TopNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenKYA: () => void;
  onRefresh: () => Promise<void>;
  isRefreshing?: boolean;
}

export function TopNav({ currentPage, onNavigate, onOpenKYA, onRefresh, isRefreshing = false }: TopNavProps) {
  const { apiHealthy, lastUpdated, usingMockData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Set dark theme by default on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'assumptions', label: 'Assumptions' },
    { id: 'faq', label: 'FAQs' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <div className="nav-branding">
          <h1>Ergo Stability Dashboard</h1>
          <p className="nav-subtitle">A read-only, observational view of Ergo network stability</p>
        </div>

        <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {pages.map((page) => (
            <button
              key={page.id}
              className={`nav-link ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => handleNavClick(page.id)}
            >
              {page.label}
            </button>
          ))}
          <button className="nav-kya-btn" onClick={onOpenKYA}>
            KYA
          </button>
          <button
            className="nav-icon-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh data"
          >
            <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
          </button>
          <button
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="nav-status-bar">
        <div className="status-items">
          <div className="status-item">
            {apiHealthy ? (
              <>
                <Wifi size={16} className="status-icon online" />
                <span>API: Online</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="status-icon offline" />
                <span>API: Offline</span>
              </>
            )}
          </div>

          {usingMockData && (
            <div className="status-item warning">
              <AlertCircle size={16} className="status-icon" />
              <span>Mock Data</span>
            </div>
          )}

          {lastUpdated && (
            <div className="status-item">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

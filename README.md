# Ergo Stability Dashboard

A **transparent, read-only analytics platform** for the Ergo blockchain. Monitor network health, block production consistency, price volatility, and overall stability in real-time with zero wallet connections.

## 🎯 Problem Statement

The Ergo ecosystem lacks transparent, real-time stability metrics accessible to all stakeholders. Users, developers, and traders need clear, unbiased data about network health and ERG price signals—without making speculative investment decisions.

## ✨ Features (Ranked by Impact)

### 🥇 High Impact
- **Stability Score (0-100)**: Composite metric blending block time consistency (50%), difficulty stability (30%), and network activity (20%)
- **Network Health Card**: Real-time block height, difficulty, hash rate, block time trends
- **Price Stability Card**: Live ERG/USD price, 7-day trend, daily volatility
- **Block Time Chart**: Last 50 blocks with millisecond precision, smooth monotone curves
- **Risk Factor Breakdown**: Detailed sub-scores explaining what drives overall stability

### 🥈 Medium Impact
- **KYA Modal** (Know Your Assumptions): 4-section disclosure of methodology, data sources, limitations, ethical notes
- **FAQs**: Quick answers to 5 common questions
- **About Section**: Clear platform purpose and transparency values
- **Status Indicators**: Real-time API health, mock data fallback notification
- **Price Chart**: 7-day ERG trend with tooltip detail
- **Tx Volume Chart**: Network activity trends

### 🥉 Lower Impact (Nice-to-Have)
- Graceful degradation with mock data
- Lazy-loaded KYA modal (faster initial load)
- Responsive mobile design
- Smooth animations and neon theme
- Error boundaries for stability
- Custom polling + caching strategy

## 🏗️ Architecture

```
React 19 + TypeScript + Vite
    ↓
  Components (NetworkHealth, PriceStability, RiskSummary, Charts, KYA, About, FAQ)
    ↓
  AppContext (Global State) + useApp Hook
    ↓
  API Layer (ergo.ts, price.ts) + Health Check
    ↓
  Public APIs (Ergo Explorer, CoinGecko)
```

**Utilities:**
- `normalize.ts`: Raw API → typed data structures
- `risk.ts`: Stability scoring engine

## 📊 Stability Scoring Methodology

**Overall Score = 50% Block Time + 30% Difficulty + 20% Network Activity**

### Block Time Consistency (50%)
Coefficient of Variation (CV = std dev / mean) of block times:
- CV < 0.15 → Score: 70-100 (Stable)
- CV 0.15-0.35 → Score: 40-69 (Caution)
- CV > 0.35 → Score: 0-39 (Volatile)

### Difficulty Stability (30%)
% change in network difficulty over last 50 blocks:
- Change < 2% → Score: 70-100
- Change 2-5% → Score: 40-69
- Change > 5% → Score: 0-39

### Network Activity (20%)
Average transactions per block:
- Avg > 8 tx/block → Score: 70-100 (Active)
- Avg 4-8 tx/block → Score: 40-69 (Moderate)
- Avg < 4 tx/block → Score: 0-39 (Low)

## ⚠️ Limitations

- **Data Freshness**: ~2-minute latency (Ergo block time + 1-min cache)
- **Historical Scope**: Last 100 blocks only (~3.3 hours)
- **Price ≠ Network Stability**: ERG volatility ≠ blockchain health
- **Thresholds**: Use predefined ranges, not live percentiles
- **API Dependency**: External unavailability → mock data fallback
- **No Predictions**: Metrics only; zero investment advice

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn

### Installation
```bash
git clone https://github.com/yourusername/ergo-stability-dashboard.git
cd ergo-stability-dashboard
npm install
npm run dev
# Opens at http://localhost:5173/
```

### Build & Deploy
```bash
npm run build          # Creates dist/
npm run preview        # Test production build locally

# Deploy to Netlify (recommended)
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Or Vercel
vercel --prod

# Or Cloudflare Pages (connect GitHub repo)
```

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, TypeScript 5.9 |
| **Bundler** | Vite 7 (fast builds) |
| **State** | React Context + useCallback |
| **Charts** | Recharts (responsive, accessible) |
| **Icons** | Lucide React |
| **Styling** | Pure CSS (custom design system) |
| **Quality** | ESLint + TypeScript strict mode |

## 📂 Project Structure

```
src/
├── App.tsx                          # Root layout, header, nav
├── components/
│   ├── NetworkHealth.tsx            # Block height, difficulty, hash rate
│   ├── PriceStability.tsx           # ERG price, volatility
│   ├── RiskSummary.tsx              # Composite score + factors
│   ├── BlockTimeChart.tsx           # Last 50 blocks
│   ├── PriceChart.tsx               # 7-day ERG trend
│   ├── TxVolumeChart.tsx            # Network activity
│   ├── KYAModal.tsx                 # Transparency disclosure (lazy)
│   ├── AboutSection.tsx             # What this site is
│   ├── FAQ.tsx                      # Collapsible Q&A
│   └── [*.css]                      # Scoped styles
├── context/
│   ├── AppContext.tsx               # Global state provider
│   └── useApp.ts                    # Custom hook
├── api/
│   ├── ergo.ts                      # Ergo Explorer client
│   └── price.ts                     # CoinGecko client
└── utils/
    ├── normalize.ts                 # Data transformation
    ├── risk.ts                      # Scoring algorithms
    └── __tests__/                   # Test stubs
```

## 🧪 Testing

Test stubs in place for normalization and risk scoring:
```bash
npm run test  # (when configured)
```

## 🔐 Security & Privacy

✅ **No wallet connections** (zero private key exposure)  
✅ **Read-only analytics** (no blockchain writes)  
✅ **Public APIs only** (rate-limit friendly)  
✅ **HTTPS always** (secure data in transit)  
✅ **No tracking** (no analytics or user data collection)

## 📈 Performance

- **Bundle**: 604 KB (gzipped: 182 KB)
- **First Paint**: <1s
- **KYA Modal**: Lazy-loaded (~7 KB gzipped)
- **Cache**: 1-minute TTL
- **Refresh**: Auto-update every 2 minutes

## 🤝 Contributing

Welcome! Future enhancements:

1. **Anomaly Radar**: Highlight outlier block times and difficulty jumps
2. **Shareable Snapshots**: Freeze current metrics into a URL
3. **Export Reports**: PDF or markdown snapshot generation
4. **Theme Toggle**: Dark/light/neon variants
5. **Keyboard Shortcuts**: K (KYA), R (refresh), A (about)
6. **Candlestick Charts**: OHLCV data for deeper analysis
7. **Historical Trends**: Extend beyond 100 blocks
8. **Alerts**: Email/webhook notifications

### Dev Workflow
```bash
git checkout -b feature/name
npm run dev                # Test locally
npm run build && npm run preview  # QA
npm run lint              # Check code
git commit -m "feat: describe change"
git push origin feature/name
# Open PR on GitHub
```

## 📜 License

MIT – See LICENSE for details.

## 🙏 Acknowledgments

- **Ergo Team** for the stable blockchain and public APIs
- **Ergo Community** for transparency principles
- **Recharts** for accessible charting
- **React & Vite** teams for excellent tooling

## 📞 Support

- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for ideas
- **KYA**: Review app's built-in KYA modal for limitations

---

**Built with ❤️ for the Ergo ecosystem. Know Your Assumptions.**

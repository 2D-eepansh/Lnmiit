import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import './FAQPage.css';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: 'Is this financial advice?',
    answer: (
      <div>
        <p>
          <strong>No, absolutely not.</strong> This dashboard is an educational tool for observing Ergo network behavior
          and market conditions.
        </p>
        <p>
          It does not recommend buying, selling, or holding ERG. It does not predict prices or network outcomes. Always do
          your own research and consult qualified financial advisors before making investment decisions.
        </p>
      </div>
    ),
  },
  {
    question: 'Do I need a wallet or cryptocurrency to use this?',
    answer: (
      <div>
        <p>
          <strong>No.</strong> This is a read-only, observational dashboard. You do not need to own any ERG, have a wallet,
          or be a developer.
        </p>
        <p>
          Anyone can visit and view public blockchain and market data. No connection to your wallet or exchange is required
          or possible.
        </p>
      </div>
    ),
  },
  {
    question: 'What happens if the API goes down?',
    answer: (
      <div>
        <p>
          If the Ergo Explorer API is unavailable, the dashboard will show an offline status. Historical cached data may
          still be visible, but real-time metrics will be frozen until the API recovers.
        </p>
        <p className="note">
          We use public APIs provided by the Ergo community. Downtime is rare but possible. Always check the status bar at
          the top of the page.
        </p>
      </div>
    ),
  },
  {
    question: 'How often is data refreshed?',
    answer: (
      <div>
        <p>
          Data refreshes automatically every 30–60 seconds (configurable). You can also manually refresh by clicking the
          Refresh button in the top-right corner.
        </p>
        <p>
          The "Last Updated" timestamp shows when the most recent data was fetched. Keep in mind that Explorer data may
          lag the actual blockchain by 1–2 blocks.
        </p>
      </div>
    ),
  },
  {
    question: 'Which metrics matter most?',
    answer: (
      <div>
        <p>
          <strong>There is no single "most important" metric.</strong> All metrics provide different types of information:
        </p>
        <ul>
          <li>
            <strong>Block Time Consistency:</strong> Shows if block production is regular. Fast changes indicate miner
            activity changes.
          </li>
          <li>
            <strong>Network Difficulty:</strong> Reflects total mining power. Increasing difficulty = more competition.
          </li>
          <li>
            <strong>Transaction Volume:</strong> Indicates network usage. Higher volume = more on-chain activity.
          </li>
          <li>
            <strong>Availability:</strong> Observational measure of block production consistency.
          </li>
          <li>
            <strong>Price Volatility:</strong> Shows ERG price swings, not network quality.
          </li>
        </ul>
        <p>
          Interpret all metrics together, not individually. Read the Methodology page to understand what each metric actually
          measures.
        </p>
      </div>
    ),
  },
  {
    question: 'Can this dashboard be used for trading?',
    answer: (
      <div>
        <p>
          <strong>We strongly discourage using this dashboard for trading decisions.</strong>
        </p>
        <p>
          This dashboard is designed for understanding Ergo network behavior, not predicting price or market movements. Using
          it as a trading signal carries significant financial risk. Crypto markets are highly volatile and speculative; many
          factors outside this dashboard's scope drive price.
        </p>
        <p className="note">
          If you choose to trade, do so with funds you can afford to lose, use risk management strategies, and never rely on a
          single data source.
        </p>
      </div>
    ),
  },
  {
    question: 'What if I disagree with an anomaly classification?',
    answer: (
      <div>
        <p>
          Anomaly detection is statistical and heuristic. Different choices in window size, thresholds, or baselines can
          produce different flags.
        </p>
        <p>
          If you believe a flag is incorrect:
        </p>
        <ul>
          <li>Check the Methodology page to understand how anomalies are detected</li>
          <li>Verify the raw data in Ergo Explorer</li>
          <li>Engage with the community on Discord or forums to discuss</li>
          <li>Consider opening an issue on GitHub with your feedback</li>
        </ul>
        <p>
          We welcome constructive criticism and are open to refining the algorithm based on community feedback.
        </p>
      </div>
    ),
  },
  {
    question: 'Is the source code open?',
    answer: (
      <div>
        <p>
          <strong>Yes.</strong> This dashboard is open-source. You can review the code, suggest improvements, or fork it for
          your own use.
        </p>
        <p>
          See the GitHub repository link in the footer. We believe transparency in code is essential for trustworthiness.
        </p>
      </div>
    ),
  },
  {
    question: 'How do I interpret anomalies responsibly?',
    answer: (
      <div>
        <p>
          <strong>Anomalies are observations, not diagnoses.</strong> A flagged block means it deviated from recent norms,
          nothing more.
        </p>
        <p>
          To interpret responsibly:
        </p>
        <ul>
          <li>Look at the baseline and observed value—understand the magnitude of deviation</li>
          <li>Check if multiple anomalies are clustered (suggesting a systematic issue) or isolated (likely noise)</li>
          <li>Consider external factors: mining pool changes, network upgrades, hashrate fluctuations</li>
          <li>Do not assume anomalies indicate protocol failure—they usually reflect normal variance</li>
          <li>Ask: "Does this change how I should think about Ergo?" Only if the answer is yes, dig deeper</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'What if I find a bug or have suggestions?',
    answer: (
      <div>
        <p>
          We appreciate community feedback. You can:
        </p>
        <ul>
          <li>Open an issue on GitHub (see footer link)</li>
          <li>Reach out on the Ergo Discord or forums</li>
          <li>Email the team directly (contact info in README)</li>
        </ul>
        <p>
          Please include specific details (what you observed, when, what you expected) to help us improve the dashboard.
        </p>
      </div>
    ),
  },
];

export function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <main className="faq-page">
      <div className="page-content">
        <h1>Frequently Asked Questions</h1>
        <p className="intro-text">
          Questions and answers about the Ergo Stability Dashboard, how to use it, and what it can (and cannot) do.
        </p>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${expandedIndex === index ? 'expanded' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <span>{item.question}</span>
                {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {expandedIndex === index && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="faq-section info-box">
          <h3>Still have questions?</h3>
          <p>
            Check the <strong>Methodology</strong> and <strong>Assumptions</strong> pages for deeper explanations.
            If you have feedback or find an issue, please reach out on GitHub or the Ergo community channels.
          </p>
        </section>
      </div>
    </main>
  );
}

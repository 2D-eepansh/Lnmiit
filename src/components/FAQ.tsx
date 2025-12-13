import './FAQ.css';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

type FAQItem = { question: string; answer: string };

const faqs: FAQItem[] = [
  {
    question: 'Is this financial advice?',
    answer: 'No. This dashboard is educational only. It provides read-only analytics and makes no investment recommendations.',
  },
  {
    question: 'Do I need a wallet or to connect funds?',
    answer: 'No. There are zero wallet connections or write operations. All data is public and read-only.',
  },
  {
    question: 'What happens if the API is down?',
    answer: 'The app automatically switches to clearly labeled mock data so the UI stays usable while upstream recovers.',
  },
  {
    question: 'How often is data refreshed?',
    answer: 'Every ~2 minutes with light caching to reduce load on public APIs. You can force-refresh anytime.',
  },
  {
    question: 'Which metrics are most important?',
    answer: 'Block time consistency (CV), difficulty trend, network activity, and price volatility. The Risk Summary blends these into a 0-100 stability score.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-card" id="faq">
      <div className="faq-header">
        <HelpCircle size={22} className="faq-icon" />
        <div>
          <h3>FAQs</h3>
          <p className="faq-subtitle">Fast answers to common questions.</p>
        </div>
      </div>

      <div className="faq-list">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {isOpen && <p className="faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

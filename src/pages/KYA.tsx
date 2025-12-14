import './KYA.css';

export function KYA() {
  return (
    <div className="kya-page">
      <header className="kya-header">
        <h1>Know Your Assumptions</h1>
        <p className="kya-subtitle">
          Understanding what this tool does, what it assumes, and what it cannot know.
        </p>
      </header>

      <section className="kya-section">
        <h2>What This Tool Assumes</h2>
        <div className="kya-content">
          <p>
            This system operates on specific assumptions that shape how information is presented:
          </p>
          <ul>
            <li>
              <strong>Historical data reflects past behavior, not future guarantees.</strong> Price movements 
              shown in Market Reality are observational records, not patterns that will repeat.
            </li>
            <li>
              <strong>Simplified inputs are abstractions, not complete models.</strong> Risk appetite and 
              time horizon are reduced representations of complex personal circumstances.
            </li>
            <li>
              <strong>Market behavior is influenced by external factors that are not modeled.</strong> 
              Regulatory changes, technological developments, and macroeconomic conditions exist outside 
              the scope of this tool.
            </li>
            <li>
              <strong>User intent and constraints are unknown to the system.</strong> Individual financial 
              situations, goals, and risk tolerances cannot be inferred from simple inputs.
            </li>
            <li>
              <strong>Uncertainty is fundamental, not temporary.</strong> More data or better models will 
              not eliminate the inherent unpredictability of complex adaptive systems.
            </li>
          </ul>
        </div>
      </section>

      <section className="kya-section">
        <h2>What This Tool Does Not Know</h2>
        <div className="kya-content">
          <p>
            This system explicitly does not know, and cannot predict:
          </p>
          <ul>
            <li>Future price movements or market direction</li>
            <li>Timing or magnitude of market crashes or rallies</li>
            <li>Macroeconomic shocks or policy changes</li>
            <li>Regulatory developments or legal restrictions</li>
            <li>Technological breakthroughs or protocol failures</li>
            <li>Geopolitical events or systemic risks</li>
            <li>Individual user circumstances or financial capacity</li>
            <li>Optimal entry or exit points for any asset</li>
          </ul>
          <p className="kya-emphasis">
            These limitations are not gaps to be filled — they reflect the fundamental nature of 
            uncertainty in complex systems.
          </p>
        </div>
      </section>

      <section className="kya-section">
        <h2>What This Tool Does Not Do</h2>
        <div className="kya-content">
          <p>
            To prevent misinterpretation, this system intentionally does not:
          </p>
          <ul>
            <li>Provide financial advice or investment recommendations</li>
            <li>Suggest buying, selling, or holding any asset</li>
            <li>Predict future prices or calculate expected returns</li>
            <li>Generate profit targets or loss estimates</li>
            <li>Rank assets by potential or performance</li>
            <li>Optimize strategies or allocations</li>
            <li>Automate decisions or execute trades</li>
            <li>Create urgency or pressure to act</li>
          </ul>
          <p className="kya-emphasis">
            This tool presents context and historical patterns. It does not prescribe action.
          </p>
        </div>
      </section>

      <section className="kya-section">
        <h2>Common Misinterpretations</h2>
        <div className="kya-content">
          <p>
            Users sometimes misunderstand what the system is communicating. Here are clarifications:
          </p>
          <div className="misinterpretation-grid">
            <div className="misinterpretation-item">
              <p className="misinterpretation-wrong">
                <strong>Misinterpretation:</strong> Uncertainty indicators are recommendations.
              </p>
              <p className="misinterpretation-correct">
                <strong>Reality:</strong> They describe the range of possible outcomes, not which outcome to expect or prefer.
              </p>
            </div>
            <div className="misinterpretation-item">
              <p className="misinterpretation-wrong">
                <strong>Misinterpretation:</strong> Higher risk appetite implies higher expected returns.
              </p>
              <p className="misinterpretation-correct">
                <strong>Reality:</strong> It indicates tolerance for outcome variability, not a prediction of gain.
              </p>
            </div>
            <div className="misinterpretation-item">
              <p className="misinterpretation-wrong">
                <strong>Misinterpretation:</strong> Historical patterns shown in Market Reality will repeat.
              </p>
              <p className="misinterpretation-correct">
                <strong>Reality:</strong> Past volatility shows what has happened, not what will happen.
              </p>
            </div>
            <div className="misinterpretation-item">
              <p className="misinterpretation-wrong">
                <strong>Misinterpretation:</strong> Simulator outputs represent probabilities or likelihoods.
              </p>
              <p className="misinterpretation-correct">
                <strong>Reality:</strong> They are qualitative descriptions of uncertainty, not quantitative forecasts.
              </p>
            </div>
            <div className="misinterpretation-item">
              <p className="misinterpretation-wrong">
                <strong>Misinterpretation:</strong> The tool is conservative or cautious.
              </p>
              <p className="misinterpretation-correct">
                <strong>Reality:</strong> The tool is neutral. It presents uncertainty without advocating action or inaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="kya-section">
        <h2>Why We Avoid Predictions</h2>
        <div className="kya-content">
          <p>
            This system intentionally does not provide predictions, price targets, or probability estimates. 
            This is not a limitation — it is a design choice based on the following reasoning:
          </p>
          <ul>
            <li>
              <strong>Complex adaptive systems cannot be reliably forecast with simple models.</strong> 
              Markets are influenced by countless interacting factors, feedback loops, and emergent behaviors 
              that resist reduction to tractable equations.
            </li>
            <li>
              <strong>Numeric precision often creates false confidence.</strong> Displaying specific 
              percentages or price targets can imply certainty where none exists, leading users to 
              overweight unreliable information.
            </li>
            <li>
              <strong>Overconfidence increases harm more than acknowledged uncertainty.</strong> Decisions 
              made with excessive confidence in flawed predictions often result in greater losses than 
              decisions made with appropriate caution.
            </li>
            <li>
              <strong>Transparency about limits builds trust over time.</strong> Systems that admit what 
              they cannot know are more credible than systems that pretend to know everything.
            </li>
          </ul>
          <p className="kya-emphasis">
            By avoiding predictions, this tool prioritizes long-term understanding over short-term reassurance.
          </p>
        </div>
      </section>

      <section className="kya-section">
        <h2>User Responsibility</h2>
        <div className="kya-content">
          <p>
            This system is designed to support understanding, not to replace judgment. The following 
            responsibilities remain entirely with the user:
          </p>
          <ul>
            <li>
              <strong>All decisions are made by the user.</strong> This tool provides context and historical 
              observations. It does not decide, recommend, or advise.
            </li>
            <li>
              <strong>Users must evaluate their own circumstances.</strong> Financial capacity, risk tolerance, 
              goals, and constraints are personal and cannot be inferred from system inputs.
            </li>
            <li>
              <strong>The system does not replace professional guidance.</strong> Complex financial situations 
              often require consultation with qualified professionals who understand individual contexts.
            </li>
            <li>
              <strong>Interpreting uncertainty is a user responsibility.</strong> The system describes ranges 
              and possibilities, but users must decide how to weight this information against other factors.
            </li>
            <li>
              <strong>No tool eliminates risk or guarantees outcomes.</strong> Markets remain uncertain regardless 
              of how much information is gathered or how carefully decisions are made.
            </li>
          </ul>
          <p className="kya-emphasis">
            This tool is educational and contextual. It exists to inform, not to direct. Autonomy and 
            responsibility remain with the user at all times.
          </p>
        </div>
      </section>

      <footer className="kya-footer">
        <p>
          CryptoNanny is designed to reduce harm caused by misinterpretation, not to influence outcomes. 
          It introduces friction, reflection, and context — avoiding urgency, persuasion, and emotional amplification.
        </p>
      </footer>
    </div>
  );
}

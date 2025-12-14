import './NoteFromTeam.css';

export function NoteFromTeam() {
  return (
    <main className="note-page">
      <div className="note-container">
        <header className="note-header">
          <h1>Note from the Team</h1>
          <h2>On Responsibility, Context, and Financial Literacy</h2>
        </header>

        <section className="note-section">
          <p className="note-paragraph">
            This project exists because we repeatedly observed that most financial mistakes in volatile markets are not caused by a lack of intelligence or effort, but by a <strong>lack of context at the moment a decision is made</strong>.
          </p>
          <p className="note-paragraph">
            Markets move faster than human judgment. When prices rise or fall rapidly, decisions are often driven by incomplete information, emotional pressure, or misinterpretation of short-term signals. Over time, this pattern leads to outcomes that users did not fully anticipate or understand.
          </p>
        </section>

        <section className="note-section">
          <h3>Perspective on Financial Literacy</h3>
          <p className="note-paragraph">
            Financial literacy is often framed as the ability to predict outcomes or identify winning opportunities. We intentionally reject that framing.
          </p>
          <p className="note-paragraph">
            We view financial literacy as the ability to:
          </p>
          <ul className="note-list">
            <li>understand uncertainty,</li>
            <li>recognize assumptions,</li>
            <li>interpret risk without oversimplification,</li>
            <li>and distinguish long-term structure from short-term noise.</li>
          </ul>
          <p className="note-paragraph">
            This perspective aligns closely with the design principles we observed in the Ergo ecosystem: conservative assumptions, transparency over promises, and systems that remain robust under uncertainty rather than optimized for short-term outcomes.
          </p>
          <p className="note-emphasis">
            Responsible systems do not remove risk.<br />
            They make risk visible and harder to misunderstand.
          </p>
        </section>

        <section className="note-section">
          <h3>Influence of Ergo's Design Philosophy</h3>
          <p className="note-paragraph">
            One of the strongest inspirations for this project came from observing how the Ergo ecosystem approaches system design and economic modeling.
          </p>
          <p className="note-paragraph">
            Ergo consistently emphasizes:
          </p>
          <ul className="note-list">
            <li>explicit assumptions,</li>
            <li>resistance to hidden complexity,</li>
            <li>long-term sustainability over short-term incentives,</li>
            <li>and user responsibility over automation of judgment.</li>
          </ul>
          <p className="note-paragraph">
            CryptoNanny adopts these same principles at the user-interface and decision-context level. Instead of abstracting risk away, it exposes uncertainty directly and avoids presenting false precision where none exists.
          </p>
        </section>

        <section className="note-section">
          <h3>What This Tool Will Not Do</h3>
          <p className="note-paragraph">
            CryptoNanny does not:
          </p>
          <ul className="note-list">
            <li>tell users what to buy or sell,</li>
            <li>predict future prices,</li>
            <li>optimize returns,</li>
            <li>rank assets,</li>
            <li>or encourage urgency or action.</li>
          </ul>
          <p className="note-paragraph">
            Any system that claims certainty in complex, adaptive markets should be treated with skepticism. Where uncertainty is high, CryptoNanny prefers to say <em>"we do not know"</em> rather than provide misleading precision.
          </p>
        </section>

        <section className="note-section">
          <h3>Intent</h3>
          <p className="note-paragraph">
            The intent of this project is not to discourage participation in financial or crypto markets. It is to encourage <strong>informed participation</strong>.
          </p>
          <p className="note-paragraph">
            By slowing down moments of decision and reintroducing historical and structural context, this tool aims to support more deliberate and responsible engagement — an approach that reflects the broader values of open, resilient, and sustainability-focused systems such as those championed by Ergo.
          </p>
          <p className="note-emphasis">
            Sometimes, the most responsible feature a system can offer is the ability to pause.
          </p>
        </section>

        <footer className="note-footer">
          <p>Inspired by principles of transparency, explicit assumptions, and long-term sustainability found in the Ergo ecosystem.</p>
        </footer>
      </div>
    </main>
  );
}

import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className="hero-grid">
      <div className="hero-copy panel panel-accent">
        <div className="eyebrow">Modern hotel billing</div>
        <h1>Professional order management for your hotel desk</h1>
        <p>
          A clean, multi-page interface for taking orders, generating bills, and reviewing billing
          history without clutter.
        </p>

        <div className="hero-actions">
          <Link to="/bill" className="primary-action">
            Start billing
          </Link>
          <Link to="/history" className="secondary-action">
            View history
          </Link>
        </div>
      </div>

      <div className="feature-stack">
        <article className="feature-card panel">
          <span className="feature-kicker">Billing</span>
          <h2>Generate bills fast</h2>
          <p>Select multiple items, enter the customer name, and create a bill in one step.</p>
        </article>

        <article className="feature-card panel">
          <span className="feature-kicker">History</span>
          <h2>Track every order</h2>
          <p>Review previous bills and clear the history whenever you want a fresh start.</p>
        </article>

        <article className="feature-card panel">
          <span className="feature-kicker">Deployment</span>
          <h2>Vercel + Render ready</h2>
          <p>The frontend is ready for Vercel and the backend is ready for Render with MySQL.</p>
        </article>
      </div>
    </section>
  );
}

export default HomePage;
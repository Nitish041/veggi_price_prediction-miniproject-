import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CloudSun,
  Database,
  Leaf,
  MapPin,
  Menu,
  Sprout,
  TrendingUp,
  X,
} from 'lucide-react';
import './Landing.css';

const features = [
  {
    icon: TrendingUp,
    title: 'AI price prediction',
    description:
      'Explore price estimates from the project’s Random Forest model and available market data.',
    tone: 'violet',
  },
  {
    icon: CloudSun,
    title: 'Weather context',
    description:
      'See current weather and rainfall information alongside your market planning.',
    tone: 'blue',
  },
  {
    icon: MapPin,
    title: 'Market dashboard',
    description:
      'Browse market and weather information for Bangalore, Mangalore and Mysore.',
    tone: 'green',
  },
  {
    icon: BarChart3,
    title: 'Price trends',
    description:
      'Explore historical monthly price information through clear visualizations.',
    tone: 'orange',
  },
  {
    icon: Database,
    title: 'Data insights',
    description:
      'Review available seasonal and monthly information from the project dataset.',
    tone: 'pink',
  },
];

const steps = [
  {
    number: '01',
    title: 'Choose a market and vegetable',
    description: 'Select an available location and the vegetable you want to explore.',
  },
  {
    number: '02',
    title: 'Set the prediction details',
    description: 'Choose a month and date. Expected rainfall is filled from available data.',
  },
  {
    number: '03',
    title: 'Explore your results',
    description: 'View the generated estimate alongside the available price trend insights.',
  },
];

function MarketIllustration() {
  return (
    <div className="landing-illustration" aria-label="Illustration of a fresh produce market">
      <div className="illustration-glow" />
      <svg
        className="market-art"
        viewBox="0 0 620 500"
        role="img"
        aria-labelledby="market-art-title"
      >
        <title id="market-art-title">A neighborhood produce stand with fresh vegetables</title>
        <defs>
          <linearGradient id="marketSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#edf1ff" />
            <stop offset="1" stopColor="#f8f4ff" />
          </linearGradient>
          <linearGradient id="awning" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#667eea" />
            <stop offset="1" stopColor="#8154bd" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#4c4381" floodOpacity=".15" />
          </filter>
        </defs>
        <rect x="18" y="14" width="584" height="466" rx="40" fill="url(#marketSky)" />
        <circle cx="482" cy="111" r="53" fill="#ffe5a6" opacity=".82" />
        <path d="M35 300c89-80 153-51 232-22 94 35 152 35 317-31v186H35z" fill="#dce8ff" />
        <path d="M35 345c114-59 176-35 254-8 96 33 181 31 295-22v118H35z" fill="#d9eddf" />

        <g filter="url(#softShadow)">
          <path d="M155 172h315l-24 54H179z" fill="url(#awning)" />
          <path d="M177 172h42l-10 54h-42zM260 172h42l-3 54h-42zM344 172h42l4 54h-42zM428 172h42l15 54h-42z" fill="#fff" opacity=".92" />
          <path d="M180 226h291v14H180z" fill="#51437f" opacity=".12" />
          <path d="M190 226v116M449 226v116" stroke="#7658ac" strokeWidth="10" strokeLinecap="round" />
          <path d="M170 338h299l-18 29H188z" fill="#8a5a42" />
          <path d="M195 367h248l-11 65H207z" fill="#c17d51" />
          <path d="M214 384h211M211 402h239M208 420h243" stroke="#e3a271" strokeWidth="5" opacity=".8" />

          <g>
            <ellipse cx="237" cy="321" rx="31" ry="26" fill="#e65354" />
            <ellipse cx="280" cy="319" rx="31" ry="27" fill="#f06b56" />
            <ellipse cx="324" cy="322" rx="32" ry="25" fill="#d94c52" />
            <ellipse cx="365" cy="320" rx="29" ry="26" fill="#ee6457" />
            <path d="M230 294l7-12 8 11 10-7-3 13M274 292l8-12 6 12 11-5-5 13M317 297l7-13 8 12 10-5-5 13M359 293l8-12 7 12 10-5-5 13" fill="#43845a" />
          </g>
          <g>
            <path d="M393 303c13-23 30-28 48-17-3 20-18 33-43 36z" fill="#81ad53" />
            <path d="M417 301c9-26 24-34 43-27 1 20-11 37-35 44z" fill="#5f9c59" />
            <path d="M399 322c17-20 37-22 51-8-8 19-25 28-49 26z" fill="#75a748" />
          </g>
          <g>
            <path d="M188 329c-2-30 3-52 16-70 9 25 10 46 2 67z" fill="#f0a44e" />
            <path d="M199 267l-2-18 11 15 12-14-5 20" fill="#598e5c" />
            <path d="M443 332c-2-29 4-50 17-68 8 24 9 45 1 66z" fill="#ed9744" />
            <path d="M455 270l-2-18 11 15 12-14-5 20" fill="#598e5c" />
          </g>
        </g>
        <path d="M85 434c35-17 63-17 91 0M470 444c24-13 44-14 67-3" stroke="#9fc9a3" strokeWidth="7" strokeLinecap="round" />
        <circle cx="113" cy="113" r="7" fill="#a88bdb" />
        <circle cx="526" cy="273" r="9" fill="#f0a44e" />
        <path d="M90 185c13-11 25-11 37 0-11 14-24 17-37 0z" fill="#83b77e" />
      </svg>

      <div className="illustration-note note-top">
        <span className="note-icon"><Sprout size={18} /></span>
        <span><strong>Fresh market insights</strong><small>Grounded in available data</small></span>
      </div>
      <div className="illustration-note note-bottom">
        <span className="note-chart"><TrendingUp size={18} /></span>
        <span><strong>Plan with context</strong><small>Prices · seasons · weather</small></span>
      </div>
    </div>
  );
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="landing-page" id="top">
      <header className="landing-nav-wrap">
        <nav className="landing-nav" aria-label="Main navigation">
          <a className="landing-brand" href="#top" onClick={closeMenu}>
            <span className="brand-mark"><Leaf size={21} strokeWidth={2.4} /></span>
            <span>Veggie <strong>Price Predictor</strong></span>
          </a>

          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

          <div className={`landing-nav-links${menuOpen ? ' is-open' : ''}`}>
            <a href="#top" onClick={closeMenu}>Home</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <div className="landing-nav-actions">
              <Link className="landing-login-link" to="/login" onClick={closeMenu}>Login</Link>
              <Link className="landing-button nav-register" to="/register" onClick={closeMenu}>Register</Link>
            </div>
          </div>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> AGRICULTURE, WITH MORE INSIGHT</div>
            <h1 id="hero-title">Predict Vegetable Prices <span>Before They Change.</span></h1>
            <p className="hero-subtitle">
              Make smarter agricultural decisions with AI-powered vegetable price forecasting,
              weather insights and market trends.
            </p>
            <div className="hero-actions">
              <Link className="landing-button" to="/register">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link className="landing-button landing-button-light" to="/login">Login</Link>
            </div>
            <div className="hero-proof">
              <span className="proof-check"><CheckCircle2 size={17} /></span>
              <span>Explore market data for three Karnataka cities</span>
            </div>
          </div>
          <MarketIllustration />
        </div>
      </section>

      <div className="market-strip" aria-label="Available markets">
        <div className="landing-shell market-strip-inner">
          <span className="market-strip-label">Markets in view</span>
          <span className="market-pill"><MapPin size={15} /> Bangalore</span>
          <span className="market-pill"><MapPin size={15} /> Mangalore</span>
          <span className="market-pill"><MapPin size={15} /> Mysore</span>
        </div>
      </div>

      <section className="landing-section about-section" id="about">
        <div className="landing-shell about-grid">
          <div className="section-heading about-heading">
            <span className="section-kicker">ABOUT THE PROJECT</span>
            <h2>Clearer context for everyday market decisions.</h2>
          </div>
          <p className="about-copy">
            Veggie Price Predictor is an AI-powered platform designed to help users understand
            and forecast vegetable market prices. By combining historical price information,
            machine learning and weather insights, the platform helps users make more informed decisions.
          </p>
        </div>
      </section>

      <section className="landing-section features-section" id="features">
        <div className="landing-shell">
          <div className="section-heading centered-heading">
            <span className="section-kicker">WHAT YOU CAN EXPLORE</span>
            <h2>Useful insights, all in one place.</h2>
            <p>Bring historical prices, weather context and market information together.</p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, description, tone }) => (
              <article className="feature-card" key={title}>
                <div className={`feature-icon ${tone}`}><Icon size={22} strokeWidth={2} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="feature-rule" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section how-section" id="how-it-works">
        <div className="landing-shell how-grid">
          <div className="section-heading how-heading">
            <span className="section-kicker">HOW IT WORKS</span>
            <h2>From a market question to a useful estimate.</h2>
            <p>Start with the details you know. The app brings together the available data.</p>
            <Link className="text-link" to="/register">Try a prediction <ArrowRight size={17} /></Link>
          </div>
          <div className="steps-list">
            {steps.map((step) => (
              <article className="step-item" key={step.number}>
                <div className="step-number">{step.number}</div>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta-section">
        <div className="landing-shell">
          <div className="landing-cta">
            <div className="cta-decoration cta-decoration-one" />
            <div className="cta-decoration cta-decoration-two" />
            <div className="cta-content">
              <span className="cta-kicker"><Sprout size={16} /> VEGGIE PRICE PREDICTOR</span>
              <h2>Start Making Smarter Market Decisions.</h2>
              <p>Explore vegetable price forecasting and market insights with Veggie Price Predictor.</p>
              <div className="cta-actions">
                <Link className="landing-button cta-primary" to="/register">Create Free Account <ArrowRight size={18} /></Link>
                <Link className="cta-login" to="/login">Already Have an Account? Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-shell footer-main">
          <div className="footer-brand-block">
            <a className="landing-brand footer-brand" href="#top">
              <span className="brand-mark"><Leaf size={20} strokeWidth={2.4} /></span>
              <span>Veggie <strong>Price Predictor</strong></span>
            </a>
            <p>AI-powered vegetable price forecasting with market and weather context.</p>
          </div>
          <div className="footer-links-block">
            <span className="footer-links-title">Explore</span>
            <a href="#top">Home</a>
            <a href="#about">About</a>
            <a href="#features">Features</a>
          </div>
          <Link className="footer-top-link" to="/login">Open the app <ArrowRight size={16} /></Link>
        </div>
        <div className="landing-shell footer-bottom">
          <span>© {new Date().getFullYear()} Veggie Price Predictor</span>
          <span>Made for more informed market decisions.</span>
        </div>
      </footer>
    </main>
  );
}

export default Landing;

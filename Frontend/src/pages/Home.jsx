import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CloudSun,
  Globe,
  Leaf,
  Menu,
  ShieldCheck,
  Sprout,
  Wheat,
} from "lucide-react";
import "../styles/Public.css";

const services = [
  {
    icon: Globe,
    title: "Parcel-specific information",
    description:
      "Use your farm parcel information as the starting point for more relevant agricultural guidance.",
  },
  {
    icon: CloudSun,
    title: "Weather and climate guidance",
    description:
      "Understand weather information and possible climate risks that may affect farming activities.",
  },
  {
    icon: Sprout,
    title: "Crop suitability",
    description:
      "Explore crop options by considering parcel conditions and documented crop requirements.",
  },
  {
    icon: BrainCircuit,
    title: "AI agricultural assistant",
    description:
      "Get agricultural explanations informed by trusted knowledge and the available parcel context.",
  },
];

export default function Home() {
  return (
    <div className="public-site">
      <header className="public-header">
        <Link className="brand" to="/" aria-label="AgriNova home">
          <span className="brand-mark">
            <Sprout size={25} />
          </span>
          <span>
            Agri<span>Nova</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <Link className="nav-login" to="/login">
            Log in
          </Link>
          <Link className="button button-small" to="/register">
            Create farmer account
          </Link>
        </div>
        <button
          className="mobile-nav-button"
          aria-label="Navigation menu"
          onClick={() =>
            document
              .querySelector(".main-nav")
              ?.classList.toggle("main-nav-open")
          }
        >
          <Menu size={23} />
        </button>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <Leaf size={15} /> SMART FARMER RWANDA
            </div>
            <h1>
              Better farming decisions begin with{" "}
              <em>understanding your land.</em>
            </h1>
            <p>
              AgriNova brings together parcel information, soil knowledge,
              weather insights and agricultural expertise to help farmers make
              more informed decisions.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/register">
                Get started <ArrowRight size={17} />
              </Link>
              <a className="text-link" href="#services">
                Explore our services
              </a>
            </div>
            <div className="hero-note">
              <ShieldCheck size={17} /> Guidance designed around farm conditions
              and trusted agricultural information.
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85"
              alt="Green agricultural fields across a rural landscape"
            />
            <div className="visual-caption">
              <span className="caption-icon">
                <Wheat size={19} />
              </span>
              <span>
                <strong>Know your parcel</strong>
                <small>Make informed farming decisions</small>
              </span>
            </div>
          </div>
        </section>

        <section className="intro-section" id="about">
          <div className="section-kicker">ABOUT AGRINOVA</div>
          <div className="intro-grid">
            <h2>One platform. More informed agricultural decisions.</h2>
            <p>
              Farmers work with different land conditions, even within the same
              community. AgriNova aims to make agricultural guidance more
              relevant by bringing together information about a farmer's parcel,
              soil, weather and crop requirements. The platform is being
              developed for Rwanda, with accessible ways to receive information.
            </p>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <div className="section-kicker">WHAT THE PLATFORM OFFERS</div>
            <h2>Tools to support your farming journey</h2>
            <p>Explore the services AgriNova is being designed to provide.</p>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, title, description }) => (
              <article className="service-card" key={title}>
                <div className="service-icon">
                  <Icon size={24} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="service-arrow">
                  <ArrowRight size={17} />
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-copy">
            <div className="section-kicker">HOW IT WORKS</div>
            <h2>From parcel information to practical guidance</h2>
            <p>
              AgriNova is designed to bring several information sources
              together. The system can use available parcel details, soil
              information and weather data to support assessments. Agricultural
              knowledge helps explain the results, while uncertain cases should
              be referred to a qualified agricultural specialist.
            </p>
            <Link className="button button-outline" to="/register">
              Join AgriNova <ArrowRight size={17} />
            </Link>
          </div>
          <div className="steps-list">
            <div className="how-step">
              <span>01</span>
              <div>
                <strong>Create or access an account</strong>
                <p>
                  Register as a farmer or log in with your existing account.
                </p>
              </div>
            </div>
            <div className="how-step">
              <span>02</span>
              <div>
                <strong>Connect your farm parcel</strong>
                <p>
                  Provide the parcel details needed to understand your farm
                  context.
                </p>
              </div>
            </div>
            <div className="how-step">
              <span>03</span>
              <div>
                <strong>Explore agricultural guidance</strong>
                <p>
                  Review available weather information, crop assessments and
                  explanations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="access-section">
          <div>
            <div className="section-kicker">ACCESS FOR FARMERS</div>
            <h2>Use the channel that works for you.</h2>
            <p>
              AgriNova is planned to support a website experience and selected
              services through USSD, so farmers with basic phones can also
              access information.
            </p>
          </div>
          <div className="access-pills">
            <span>Web platform</span>
            <span>USSD (planned)</span>
            <span>Kinyarwanda support</span>
          </div>
        </section>

        <section className="cta-section" id="contact">
          <div>
            <h2>Start exploring AgriNova</h2>
            <p>Create a farmer account or sign in to continue.</p>
          </div>
          <div className="hero-actions">
            <Link className="button button-light" to="/register">
              Create an account
            </Link>
            <Link className="button button-ghost" to="/login">
              Log in
            </Link>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <Link className="brand footer-brand" to="/">
          <span className="brand-mark">
            <Sprout size={22} />
          </span>
          <span>
            Agri<span>Nova</span>
          </span>
        </Link>
        <p>Smart Farmer Rwanda · Innovating Agriculture, Empowering Farmers.</p>
        <span>© 2026 AgriNova</span>
      </footer>
    </div>
  );
}

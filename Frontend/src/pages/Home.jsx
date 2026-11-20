import { useState } from "react";
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
  X,
} from "lucide-react";

import "../styles/Public.css";

const translations = {
  rw: {
    nav: {
      about: "Ibyerekeye AgriNova",
      services: "Serivisi",
      how: "Uko bikora",
      contact: "Twandikire",
      login: "Injira",
      register: "Fungura konti y'umuhinzi",
      openMenu: "Fungura menu",
      closeMenu: "Funga menu",
    },
    hero: {
      eyebrow: "UBUHINZI BW'UBWENGE MU RWANDA",
      title:
        "Gufata ibyemezo byiza mu buhinzi bitangirira ku kumenya ubutaka bwawe.",
      description:
        "AgriNova ihuza amakuru y'ikibanza cy'ubuhinzi, ubumenyi ku butaka, amakuru y'ikirere n'ubumenyi mu buhinzi kugira ngo ifashe abahinzi gufata ibyemezo bishingiye ku makuru.",
      getStarted: "Tangira",
      explore: "Reba serivisi zacu",
      note: "Amakuru agenewe gufasha umuhinzi hashingiwe ku miterere y'ubutaka n'ubumenyi bwizewe mu buhinzi.",
      captionTitle: "Menya ikibanza cyawe",
      captionDescription: "Fata ibyemezo bishingiye ku makuru",
    },
    about: {
      kicker: "IBYEREKEYE AGRINOVA",
      title: "Urubuga rumwe. Ibyemezo byiza mu buhinzi.",
      description:
        "Abahinzi bakorera ku butaka bufite imiterere itandukanye, ndetse no mu gace kamwe. AgriNova igamije gutuma inama z'ubuhinzi zijyana n'imiterere y'ubutaka bw'umuhinzi, ihuza amakuru y'ikibanza, ubutaka, ikirere n'ibyo ibihingwa bikenera. Uru rubuga rurimo gutegurirwa abahinzi bo mu Rwanda, hakoreshejwe uburyo bworohereza abantu kubona amakuru.",
    },
    services: {
      kicker: "IBYO URUBUGA RUTANGA",
      title: "Ibikoresho bigufasha mu rugendo rw'ubuhinzi",
      description: "Reba serivisi AgriNova igamije gutanga.",
      items: [
        {
          title: "Amakuru yihariye ku kibanza",
          description:
            "Koresha amakuru y'ikibanza cyawe nk'intangiriro yo kubona inama zijyanye n'imiterere y'ubuhinzi bwawe.",
        },
        {
          title: "Amakuru y'ikirere n'imihindagurikire yacyo",
          description:
            "Sobanukirwa n'amakuru y'ikirere n'ingaruka zishobora kugira ku bikorwa by'ubuhinzi.",
        },
        {
          title: "Guhitamo ibihingwa bikwiriye",
          description:
            "Menya ibihingwa bishobora gukura neza hashingiwe ku miterere y'ikibanza n'ibyo ibihingwa bikenera.",
        },
        {
          title: "Umufasha w'ubuhinzi ukoresha AI",
          description:
            "Bona ibisobanuro ku buhinzi bishingiye ku bumenyi bwizewe no ku makuru ahari yerekeye ikibanza cyawe.",
        },
      ],
    },
    how: {
      kicker: "UKO BIKORA",
      title: "Kuva ku makuru y'ikibanza kugera ku nama zifatika",
      description:
        "AgriNova igamije guhuza amakuru aturuka ahantu hatandukanye. Sisitemu ishobora gukoresha amakuru y'ikibanza, ubutaka n'ikirere kugira ngo ifashe mu isesengura. Ubumenyi mu buhinzi bufasha gusobanura ibyavuye mu isesengura, kandi aho amakuru adahagije, umuhinzi agomba koherezwa ku muhanga mu buhinzi ubifitiye ubumenyi.",
      join: "Iyandikishe kuri AgriNova",
      steps: [
        {
          title: "Fungura konti cyangwa winjire",
          description:
            "Iyandikishe nk'umuhinzi cyangwa winjire ukoresheje konti usanganywe.",
        },
        {
          title: "Huza konti yawe n'ikibanza cy'ubuhinzi",
          description:
            "Tanga amakuru y'ikibanza akenewe kugira ngo sisitemu imenye imiterere y'ubuhinzi bwawe.",
        },
        {
          title: "Reba inama zijyanye n'ubuhinzi",
          description:
            "Reba amakuru y'ikirere ahari, isesengura ry'ibihingwa n'ibisobanuro byaryo.",
        },
      ],
    },
    access: {
      kicker: "UBURYO ABAHINZI BAKORESHA URUBUGA",
      title: "Koresha uburyo bukubereye.",
      description:
        "AgriNova irateganyirizwa gukorera kuri murandasi no gutanga serivisi zimwe na zimwe binyuze kuri USSD, kugira ngo n'abahinzi bafite telefoni zisanzwe babashe kubona amakuru.",
      web: "Urubuga rwa murandasi",
      ussd: "USSD (birateganywa)",
      language: "Urubuga mu Kinyarwanda",
    },
    cta: {
      title: "Tangira gukoresha AgriNova",
      description:
        "Fungura konti y'umuhinzi cyangwa winjire kugira ngo ukomeze.",
      register: "Fungura konti",
      login: "Injira",
    },
    footer: {
      description:
        "Ubuhinzi bw'ubwenge mu Rwanda · Guhanga udushya mu buhinzi, guteza imbere abahinzi.",
    },
  },

  en: {
    nav: {
      about: "About",
      services: "Services",
      how: "How it works",
      contact: "Contact",
      login: "Log in",
      register: "Create farmer account",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
    },
    hero: {
      eyebrow: "SMART FARMER RWANDA",
      title: "Better farming decisions begin with understanding your land.",
      description:
        "AgriNova brings together parcel information, soil knowledge, weather insights and agricultural expertise to help farmers make more informed decisions.",
      getStarted: "Get started",
      explore: "Explore our services",
      note: "Guidance designed around farm conditions and trusted agricultural information.",
      captionTitle: "Know your parcel",
      captionDescription: "Make informed farming decisions",
    },
    about: {
      kicker: "ABOUT AGRINOVA",
      title: "One platform. More informed agricultural decisions.",
      description:
        "Farmers work with different land conditions, even within the same community. AgriNova aims to make agricultural guidance more relevant by bringing together information about a farmer's parcel, soil, weather and crop requirements. The platform is being developed for Rwanda, with accessible ways to receive information.",
    },
    services: {
      kicker: "WHAT THE PLATFORM OFFERS",
      title: "Tools to support your farming journey",
      description:
        "Explore the services AgriNova is being designed to provide.",
      items: [
        {
          title: "Parcel-specific information",
          description:
            "Use your farm parcel information as the starting point for more relevant agricultural guidance.",
        },
        {
          title: "Weather and climate guidance",
          description:
            "Understand weather information and possible climate risks that may affect farming activities.",
        },
        {
          title: "Crop suitability",
          description:
            "Explore crop options by considering parcel conditions and documented crop requirements.",
        },
        {
          title: "AI agricultural assistant",
          description:
            "Get agricultural explanations informed by trusted knowledge and the available parcel context.",
        },
      ],
    },
    how: {
      kicker: "HOW IT WORKS",
      title: "From parcel information to practical guidance",
      description:
        "AgriNova is designed to bring several information sources together. The system can use available parcel details, soil information and weather data to support assessments. Agricultural knowledge helps explain the results, while uncertain cases should be referred to a qualified agricultural specialist.",
      join: "Join AgriNova",
      steps: [
        {
          title: "Create or access an account",
          description:
            "Register as a farmer or log in with your existing account.",
        },
        {
          title: "Connect your farm parcel",
          description:
            "Provide the parcel details needed to understand your farm context.",
        },
        {
          title: "Explore agricultural guidance",
          description:
            "Review available weather information, crop assessments and explanations.",
        },
      ],
    },
    access: {
      kicker: "ACCESS FOR FARMERS",
      title: "Use the channel that works for you.",
      description:
        "AgriNova is planned to support a website experience and selected services through USSD, so farmers with basic phones can also access information.",
      web: "Web platform",
      ussd: "USSD (planned)",
      language: "Kinyarwanda support",
    },
    cta: {
      title: "Start exploring AgriNova",
      description: "Create a farmer account or sign in to continue.",
      register: "Create an account",
      login: "Log in",
    },
    footer: {
      description:
        "Smart Farmer Rwanda · Innovating Agriculture, Empowering Farmers.",
    },
  },
};

const serviceIcons = [Globe, CloudSun, Sprout, BrainCircuit];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Kinyarwanda is the default language for first-time visitors.
  // The same key is used by the Admin Dashboard.
  const [language, setLanguage] = useState(
    () => localStorage.getItem("agrinova-language") || "rw",
  );

  const t = translations[language] || translations.rw;

  function changeLanguage(event) {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);
    localStorage.setItem("agrinova-language", selectedLanguage);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

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

        <nav
          className={`main-nav ${menuOpen ? "main-nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#about" onClick={closeMenu}>
            {t.nav.about}
          </a>
          <a href="#services" onClick={closeMenu}>
            {t.nav.services}
          </a>
          <a href="#how-it-works" onClick={closeMenu}>
            {t.nav.how}
          </a>
          <a href="#contact" onClick={closeMenu}>
            {t.nav.contact}
          </a>
        </nav>

        <div className="header-actions">
          <select
            className="language-select"
            value={language}
            onChange={changeLanguage}
            aria-label="Choose language"
          >
            <option value="rw">🇷🇼 Kinyarwanda</option>
            <option value="en">🇬🇧 English</option>
          </select>

          <Link className="nav-login" to="/login">
            {t.nav.login}
          </Link>

          <Link className="button button-small" to="/register">
            {t.nav.register}
          </Link>
        </div>

        <button
          type="button"
          className="mobile-nav-button"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <Leaf size={15} /> {t.hero.eyebrow}
            </div>

            <h1>
              {language === "rw" ? (
                <>
                  Gufata ibyemezo byiza mu buhinzi bitangirira ku{" "}
                  <em>kumenya ubutaka bwawe.</em>
                </>
              ) : (
                <>
                  Better farming decisions begin with{" "}
                  <em>understanding your land.</em>
                </>
              )}
            </h1>

            <p>{t.hero.description}</p>

            <div className="hero-actions">
              <Link className="button" to="/register">
                {t.hero.getStarted} <ArrowRight size={17} />
              </Link>

              <a className="text-link" href="#services">
                {t.hero.explore}
              </a>
            </div>

            <div className="hero-note">
              <ShieldCheck size={17} />
              {t.hero.note}
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
                <strong>{t.hero.captionTitle}</strong>
                <small>{t.hero.captionDescription}</small>
              </span>
            </div>
          </div>
        </section>

        <section className="intro-section" id="about">
          <div className="section-kicker">{t.about.kicker}</div>

          <div className="intro-grid">
            <h2>{t.about.title}</h2>
            <p>{t.about.description}</p>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <div className="section-kicker">{t.services.kicker}</div>
            <h2>{t.services.title}</h2>
            <p>{t.services.description}</p>
          </div>

          <div className="service-grid">
            {t.services.items.map((service, index) => {
              const Icon = serviceIcons[index];

              return (
                <article className="service-card" key={service.title}>
                  <div className="service-icon">
                    <Icon size={24} />
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <span className="service-arrow">
                    <ArrowRight size={17} />
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-copy">
            <div className="section-kicker">{t.how.kicker}</div>

            <h2>{t.how.title}</h2>

            <p>{t.how.description}</p>

            <Link className="button button-outline" to="/register">
              {t.how.join} <ArrowRight size={17} />
            </Link>
          </div>

          <div className="steps-list">
            {t.how.steps.map((step, index) => (
              <div className="how-step" key={step.title}>
                <span>0{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="access-section">
          <div>
            <div className="section-kicker">{t.access.kicker}</div>
            <h2>{t.access.title}</h2>
            <p>{t.access.description}</p>
          </div>

          <div className="access-pills">
            <span>{t.access.web}</span>
            <span>{t.access.ussd}</span>
            <span>{t.access.language}</span>
          </div>
        </section>

        <section className="cta-section" id="contact">
          <div>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.description}</p>
          </div>

          <div className="hero-actions">
            <Link className="button button-light" to="/register">
              {t.cta.register}
            </Link>

            <Link className="button button-ghost" to="/login">
              {t.cta.login}
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

        <p>{t.footer.description}</p>

        <span>© 2026 AgriNova</span>
      </footer>
    </div>
  );
}

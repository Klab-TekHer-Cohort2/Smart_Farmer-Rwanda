import { useState } from "react";
import { Link } from "react-router-dom";

import { ArrowLeft, Eye, EyeOff, Leaf, LockKeyhole } from "lucide-react";

import "../styles/Public.css";

const translations = {
  rw: {
    brand: "AgriNova",
    eyebrow: "UBUHINZI BW'UBWENGE MU RWANDA",
    welcome: "Murakaza neza kuri serivisi z'ubuhinzi bw'ubwenge.",
    sideDescription:
      "Injira muri konti yawe ya AgriNova ukomeze gukoresha serivisi z'ubuhinzi zihari.",
    slogan: "Guhanga udushya mu buhinzi, guteza imbere abahinzi.",
    backHome: "Subira ku rupapuro rw'itangiriro",
    account: "KONTI YAWE YA AGRINOVA",
    login: "Injira",
    description:
      "Koresha imeri cyangwa nimero ya telefoni wandikishije hamwe n'ijambo ry'ibanga.",
    identifier: "Imeli cyangwa nimero ya telefoni",
    identifierPlaceholder: "Andika imeli cyangwa nimero ya telefoni",
    password: "Ijambo ry'ibanga",
    passwordPlaceholder: "Andika ijambo ry'ibanga",
    showPassword: "Erekana ijambo ry'ibanga",
    hidePassword: "Hisha ijambo ry'ibanga",
    continue: "Komeza",
    message:
      "Ifishi yo kwinjira irateguye, ariko kugenzura konti ntibirahuzwa na sisitemu. Itsinda rishinzwe backend rigomba kubanza gushyiraho uburyo bwo kwemeza abakoresha mbere yuko binjira.",
    newUser: "Ntabwo uragira konti ya AgriNova?",
    createAccount: "Fungura konti y'umuhinzi",
    preview: "IGERAGEZA RY'ITERAMBERE",
    previewDescription:
      "Urupapuro rw'ubuyobozi rushobora kurebwa mu gihe cyo gukora no kugerageza urubuga ukoresheje amahuza ari hepfo. Aya mahuza ntabwo arinzwe kandi ntagomba gukoreshwa nk'uburyo bwo kwinjira muri sisitemu nyayo.",
    adminPreview: "Reba urupapuro rw'ubuyobozi",
    farmerPreview: "Reba urupapuro rw'umuhinzi",
    language: "Hitamo ururimi",
  },

  en: {
    brand: "AgriNova",
    eyebrow: "SMART FARMER RWANDA",
    welcome: "Welcome back to smarter farming.",
    sideDescription:
      "Access your AgriNova account and continue exploring the agricultural services available to you.",
    slogan: "Innovating Agriculture, Empowering Farmers.",
    backHome: "Back to homepage",
    account: "YOUR AGRINOVA ACCOUNT",
    login: "Log in",
    description:
      "Use your registered email address or phone number and password.",
    identifier: "Email address or phone number",
    identifierPlaceholder: "Enter email or phone number",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    continue: "Continue",
    message:
      "The login interface is ready, but account verification is not connected yet. The backend team must implement authentication before users can sign in.",
    newUser: "New to AgriNova?",
    createAccount: "Create a farmer account",
    preview: "DEVELOPMENT PREVIEW",
    previewDescription:
      "The administrator dashboard can be viewed during development using the preview links below. These are not secure login methods and must not be used for production access.",
    adminPreview: "Open admin dashboard preview",
    farmerPreview: "Open farmer dashboard preview",
    language: "Choose language",
  },
};

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Use the shared language preference.
  // Kinyarwanda is the default for first-time visitors.
  const [language, setLanguage] = useState(
    () => localStorage.getItem("agrinova-language") || "rw",
  );

  const t = translations[language] || translations.rw;

  function changeLanguage(event) {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);
    localStorage.setItem("agrinova-language", selectedLanguage);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(t.message);
  }

  return (
    <div className="auth-page">
      <div className="auth-side-panel">
        <Link className="brand auth-brand" to="/">
          <span className="brand-mark">
            <Leaf size={24} />
          </span>

          <span>
            Agri<span>Nova</span>
          </span>
        </Link>

        <div className="auth-side-copy">
          <div className="section-kicker">{t.eyebrow}</div>

          <h1>{t.welcome}</h1>

          <p>{t.sideDescription}</p>
        </div>

        <span className="auth-side-foot">{t.slogan}</span>
      </div>

      <main className="auth-main">
        <div className="auth-top-actions">
          <Link className="back-home" to="/">
            <ArrowLeft size={17} />
            {t.backHome}
          </Link>

          <select
            className="language-select"
            value={language}
            onChange={changeLanguage}
            aria-label={t.language}
          >
            <option value="rw">🇷🇼 Kinyarwanda</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>

        <div className="auth-card">
          <div className="auth-icon">
            <LockKeyhole size={24} />
          </div>

          <div className="section-kicker">{t.account}</div>

          <h2>{t.login}</h2>

          <p className="auth-description">{t.description}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="login-identifier">{t.identifier}</label>

            <input
              id="login-identifier"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t.identifierPlaceholder}
              required
            />

            <label htmlFor="login-password">{t.password}</label>

            <div className="password-field">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button className="button auth-submit" type="submit">
              {t.continue}
            </button>
          </form>

          {message && (
            <div className="form-notice" role="status">
              {message}
            </div>
          )}

          <p className="auth-switch">
            {t.newUser} <Link to="/register">{t.createAccount}</Link>
          </p>

          <div className="auth-divider">
            <span>{t.preview}</span>
          </div>

          <p className="preview-note">{t.previewDescription}</p>

          <Link className="preview-link" to="/admin/dashboard-preview">
            {t.adminPreview}
          </Link>

          <Link className="preview-link" to="/farmer/dashboard-preview">
            {t.farmerPreview}
          </Link>
        </div>
      </main>
    </div>
  );
}

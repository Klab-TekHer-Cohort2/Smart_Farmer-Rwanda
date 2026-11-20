import { useState } from "react";
import { Link } from "react-router-dom";

import { ArrowLeft, Eye, EyeOff, Leaf } from "lucide-react";

import "../styles/Public.css";

const translations = {
  rw: {
    language: "Hitamo ururimi",
    eyebrow: "IYANDIKISHE KURI AGRINOVA",
    welcome: "Huza amakuru y'ubuhinzi bwawe ahantu hamwe.",
    sideDescription:
      "Fungura konti y'umuhinzi kugira ngo utangire guhuza ikibanza cyawe n'amakuru y'ubuhinzi aboneka kuri AgriNova.",
    slogan: "Guhanga udushya mu buhinzi, guteza imbere abahinzi.",
    backHome: "Subira ku rupapuro rw'itangiriro",
    registration: "IYANDIKISHE NK'UMUHINZI",
    title: "Fungura konti yawe",
    description:
      "Andika amakuru yawe kugira ngo utegure konti yawe y'umuhinzi.",
    name: "Amazina yawe yose",
    namePlaceholder: "Andika amazina yawe yose",
    phone: "Nimero ya telefoni",
    phonePlaceholder: "07...",
    email: "Imeli (si ngombwa)",
    emailPlaceholder: "name@example.com",
    preferredLanguage: "Ururimi ukunda gukoresha",
    password: "Shyiraho ijambo ry'ibanga",
    passwordPlaceholder: "Nibura inyuguti n'imibare 8",
    confirmPassword: "Ongera wandike ijambo ry'ibanga",
    confirmPlaceholder: "Ongera wandike ijambo ry'ibanga",
    showPassword: "Erekana ijambo ry'ibanga",
    hidePassword: "Hisha ijambo ry'ibanga",
    submit: "Fungura konti y'umuhinzi",
    passwordError:
      "Ijambo ry'ibanga rigomba kuba rigizwe nibura n'inyuguti cyangwa imibare 8.",
    mismatchError: "Amagambo y'ibanga ntabwo ahuye. Ongera uyagenzure.",
    success:
      "Amakuru watanze yemewe. Gufungura konti nyirizina ntibirahuzwa na sisitemu. Itsinda rya backend rigomba gushyiraho uburyo bwizewe bwo kwiyandikisha no kwemeza nimero ya telefoni cyangwa imeli.",
    alreadyRegistered: "Usanzwe ufite konti?",
    login: "Injira",
    adminNote:
      "Umuyobozi wa sisitemu ashobora no gufungurira umuhinzi konti akoresheje urupapuro rw'ubuyobozi. Konti z'abayobozi ntizifungurirwa kuri iyi fishi ikoreshwa n'abantu bose.",
  },

  en: {
    language: "Choose language",
    eyebrow: "JOIN AGRINOVA",
    welcome: "Bring your farm information together.",
    sideDescription:
      "Create a farmer account to begin connecting your farm parcel with the agricultural information available through AgriNova.",
    slogan: "Innovating Agriculture, Empowering Farmers.",
    backHome: "Back to homepage",
    registration: "FARMER REGISTRATION",
    title: "Create your account",
    description: "Enter your details to prepare your farmer account.",
    name: "Full name",
    namePlaceholder: "Enter your full name",
    phone: "Phone number",
    phonePlaceholder: "07...",
    email: "Email (optional)",
    emailPlaceholder: "name@example.com",
    preferredLanguage: "Preferred language",
    password: "Create password",
    passwordPlaceholder: "At least 8 characters",
    confirmPassword: "Confirm password",
    confirmPlaceholder: "Enter your password again",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Create farmer account",
    passwordError: "Please use a password with at least 8 characters.",
    mismatchError:
      "The passwords do not match. Please check them and try again.",
    success:
      "Your registration form is valid. Account creation is not connected yet; the backend team must implement secure registration and phone/email verification.",
    alreadyRegistered: "Already registered?",
    login: "Log in",
    adminNote:
      "An administrator may also create a farmer account through the administration dashboard. Administrator accounts are not created through this public form.",
  },
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    language: "rw",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

    // Keep the preferred language field in the form synchronized.
    setForm((current) => ({
      ...current,
      language: selectedLanguage,
    }));

    setError("");
    setMessage("");
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (form.password.length < 8) {
      setError(t.passwordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t.mismatchError);
      return;
    }

    setMessage(t.success);
  }

  return (
    <div className="auth-page register-page">
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

        <div className="auth-card register-card">
          <div className="auth-icon">
            <Leaf size={24} />
          </div>

          <div className="section-kicker">{t.registration}</div>

          <h2>{t.title}</h2>

          <p className="auth-description">{t.description}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="register-name">{t.name}</label>

            <input
              id="register-name"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder={t.namePlaceholder}
              autoComplete="name"
              required
            />

            <div className="form-two-columns">
              <div>
                <label htmlFor="register-phone">{t.phone}</label>

                <input
                  id="register-phone"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder={t.phonePlaceholder}
                  autoComplete="tel"
                  required
                />
              </div>

              <div>
                <label htmlFor="register-email">{t.email}</label>

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                />
              </div>
            </div>

            <label htmlFor="register-language">{t.preferredLanguage}</label>

            <select
              id="register-language"
              name="language"
              value={form.language}
              onChange={updateField}
            >
              <option value="rw">🇷🇼 Kinyarwanda</option>
              <option value="en">🇬🇧 English</option>
            </select>

            <label htmlFor="register-password">{t.password}</label>

            <div className="password-field">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={updateField}
                placeholder={t.passwordPlaceholder}
                autoComplete="new-password"
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

            <label htmlFor="register-confirm-password">
              {t.confirmPassword}
            </label>

            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateField}
              placeholder={t.confirmPlaceholder}
              autoComplete="new-password"
              required
            />

            <button className="button auth-submit" type="submit">
              {t.submit}
            </button>
          </form>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="form-notice" role="status">
              {message}
            </div>
          )}

          <p className="auth-switch">
            {t.alreadyRegistered} <Link to="/login">{t.login}</Link>
          </p>

          <p className="preview-note">{t.adminNote}</p>
        </div>
      </main>
    </div>
  );
}

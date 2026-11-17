import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Leaf } from "lucide-react";
import "../styles/Public.css";

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

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (form.password.length < 8) {
      setError("Please use a password with at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("The passwords do not match. Please check them and try again.");
      return;
    }
    setMessage(
      "Your registration form is valid. Account creation is not connected yet; the backend team must implement secure registration and phone/email verification.",
    );
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
          <div className="section-kicker">JOIN AGRINOVA</div>
          <h1>Bring your farm information together.</h1>
          <p>
            Create a farmer account to begin connecting your farm parcel with
            the agricultural information available through AgriNova.
          </p>
        </div>
        <span className="auth-side-foot">
          Innovating Agriculture, Empowering Farmers.
        </span>
      </div>

      <main className="auth-main">
        <Link className="back-home" to="/">
          <ArrowLeft size={17} /> Back to homepage
        </Link>
        <div className="auth-card register-card">
          <div className="auth-icon">
            <Leaf size={24} />
          </div>
          <div className="section-kicker">FARMER REGISTRATION</div>
          <h2>Create your account</h2>
          <p className="auth-description">
            Enter your details to prepare your farmer account.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

            <div className="form-two-columns">
              <div>
                <label htmlFor="register-phone">Phone number</label>
                <input
                  id="register-phone"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="07..."
                  autoComplete="tel"
                  required
                />
              </div>
              <div>
                <label htmlFor="register-email">Email (optional)</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <label htmlFor="register-language">Preferred language</label>
            <select
              id="register-language"
              name="language"
              value={form.language}
              onChange={updateField}
            >
              <option value="rw">Kinyarwanda</option>
              <option value="en">English</option>
            </select>

            <label htmlFor="register-password">Create password</label>
            <div className="password-field">
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={updateField}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label htmlFor="register-confirm-password">Confirm password</label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateField}
              placeholder="Enter your password again"
              autoComplete="new-password"
              required
            />

            <button className="button auth-submit" type="submit">
              Create farmer account
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
            Already registered? <Link to="/login">Log in</Link>
          </p>
          <p className="preview-note">
            An administrator may also create a farmer account through the
            administration dashboard. Administrator accounts are not created
            through this public form.
          </p>
        </div>
      </main>
    </div>
  );
}

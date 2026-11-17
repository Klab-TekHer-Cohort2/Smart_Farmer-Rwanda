import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Leaf, LockKeyhole } from "lucide-react";
import "../styles/Public.css";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage(
      "The login interface is ready, but account verification is not connected yet. The backend team must implement authentication before users can sign in.",
    );
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
          <div className="section-kicker">SMART FARMER RWANDA</div>
          <h1>Welcome back to smarter farming.</h1>
          <p>
            Access your AgriNova account and continue exploring the agricultural
            services available to you.
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
        <div className="auth-card">
          <div className="auth-icon">
            <LockKeyhole size={24} />
          </div>
          <div className="section-kicker">YOUR AGRINOVA ACCOUNT</div>
          <h2>Log in</h2>
          <p className="auth-description">
            Use your registered email address or phone number and password.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="login-identifier">
              Email address or phone number
            </label>
            <input
              id="login-identifier"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or phone number"
              required
            />

            <label htmlFor="login-password">Password</label>
            <div className="password-field">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

            <button className="button auth-submit" type="submit">
              Continue
            </button>
          </form>

          {message && (
            <div className="form-notice" role="status">
              {message}
            </div>
          )}

          <p className="auth-switch">
            New to AgriNova? <Link to="/register">Create a farmer account</Link>
          </p>
          <div className="auth-divider">
            <span>Development preview</span>
          </div>
          <p className="preview-note">
            The administrator dashboard can be viewed during development using
            this preview link. It is not a secure login and must not be used as
            a production access method.
          </p>
          <Link className="preview-link" to="/admin/dashboard-preview">
            Open admin dashboard preview
          </Link>
        </div>
      </main>
    </div>
  );
}

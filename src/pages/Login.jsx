import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a0a12;
    background-image:
      radial-gradient(ellipse at 15% 55%, rgba(160, 40, 80, 0.55) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 15%, rgba(120, 20, 55, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse at 55% 90%, rgba(90, 10, 40, 0.4) 0%, transparent 50%);
    font-family: 'DM Sans', sans-serif;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  /* Soft noise texture overlay */
  .login-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

  /* Ambient glow blobs */
  .login-root::after {
    content: '';
    position: absolute;
    bottom: -120px;
    right: -80px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(200, 50, 100, 0.18);
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    /* Cream/ivory card — high contrast against deep maroon bg */
    background: rgba(255, 248, 244, 0.97);
    border: 1px solid rgba(255, 220, 220, 0.6);
    border-radius: 24px;
    padding: 48px 44px;
    box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(160, 30, 70, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    animation: fadeSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    position: relative;
    z-index: 1;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 14px;
    animation: fadeSlideUp 0.55s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .login-eyebrow-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(160, 50, 80, 0.35));
  }

  .login-eyebrow-line.right {
    background: linear-gradient(to left, transparent, rgba(160, 50, 80, 0.35));
  }

  .login-eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c0475f, #8b2040);
    box-shadow: 0 0 0 3px rgba(192, 71, 95, 0.2);
  }

  .login-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 500;
    /* Deep wine — strong contrast on cream */
    color: #3d0e1e;
    text-align: center;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 6px;
    animation: fadeSlideUp 0.55s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .login-subheading {
    text-align: center;
    font-size: 0.82rem;
    color: #8a5060;
    font-weight: 300;
    letter-spacing: 0.04em;
    margin-bottom: 36px;
    animation: fadeSlideUp 0.55s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .login-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(220, 38, 38, 0.06);
    border: 1px solid rgba(220, 38, 38, 0.2);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.83rem;
    color: #c0392b;
    margin-bottom: 20px;
    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97);
  }

  @keyframes shake {
    10%, 90% { transform: translateX(-2px); }
    20%, 80% { transform: translateX(3px); }
    30%, 50%, 70% { transform: translateX(-3px); }
    40%, 60% { transform: translateX(3px); }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    animation: fadeSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .login-field:nth-child(1) { animation-delay: 0.18s; }
  .login-field:nth-child(2) { animation-delay: 0.23s; }

  .login-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b3344;
  }

  .login-input {
    width: 100%;
    box-sizing: border-box;
    /* Light warm-tinted bg, clear dark border for definition */
    background: #fff5f7;
    border: 1.5px solid #e8c0c8;
    border-radius: 12px;
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    color: #2d0a14;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .login-input::placeholder {
    color: #c49aa5;
    font-weight: 300;
  }

  .login-input:focus {
    border-color: #b04060;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(176, 64, 96, 0.15);
  }

  .login-btn {
    margin-top: 8px;
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    /* Rich deep rose — punchy against cream card */
    background: linear-gradient(135deg, #c04060 0%, #8b2040 60%, #6b1530 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 20px rgba(139, 32, 64, 0.45);
    animation: fadeSlideUp 0.55s 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .login-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .login-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(192, 64, 96, 0.5);
  }

  .login-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 12px rgba(139, 32, 64, 0.35);
  }

  .login-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 0.82rem;
    color: #8a5060;
    font-weight: 300;
    animation: fadeSlideUp 0.55s 0.33s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .login-footer a {
    color: #9b2a45;
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px solid rgba(155, 42, 69, 0.4);
    transition: color 0.15s, border-color 0.15s;
  }

  .login-footer a:hover {
    color: #6b1530;
    border-color: #6b1530;
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/packs');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-card">
          <div className="login-eyebrow">
            <span className="login-eyebrow-line" />
            <span className="login-eyebrow-dot" />
            <span className="login-eyebrow-line right" />
          </div>

          <h2 className="login-heading">Welcome back</h2>
          <p className="login-subheading">Sign in to continue</p>

          {error && (
            <div className="login-error">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="#c0392b" strokeWidth="1"/>
                <path d="M7 4v3.5M7 9.5v.5" stroke="#c0392b" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{' '}
            <a href="/register">Create one</a>
          </p>
        </div>
      </div>
    </>
  );
}
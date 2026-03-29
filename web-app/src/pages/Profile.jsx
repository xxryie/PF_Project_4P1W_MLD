import { useState, useEffect } from 'react';
import { resourceApi } from '../api/axios';
import { useAuth } from '../auth/AuthContext';

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

  .login-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

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
    color: #3d0e1e;
    text-align: center;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 6px;
    animation: fadeSlideUp 0.55s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* Profile specific additions */
  .profile-stat-box {
    padding: 20px;
    background: #fff5f7;
    border: 1.5px solid #e8c0c8;
    border-radius: 12px;
    text-align: center;
    animation: fadeSlideUp 0.55s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .profile-stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #b04060;
  }
  .profile-stat-label {
    color: #8a5060;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 8px;
    font-weight: 500;
  }
  .profile-row {
    margin-top: 15px;
    padding: 15px;
    background: #fff5f7;
    border: 1px solid #e8c0c8;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    color: #3d0e1e;
    font-size: 0.95rem;
    animation: fadeSlideUp 0.55s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
`;

export default function Profile() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await resourceApi.get('/api/profile/progress');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div className="login-heading" style={{ color: '#fff' }}>Loading profile...</div>
            </div>
        </>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div className="login-card" style={{ maxWidth: '500px', padding: '48px 44px' }}>
                    <div className="login-eyebrow">
                        <span className="login-eyebrow-line" />
                        <span className="login-eyebrow-dot" />
                        <span className="login-eyebrow-line right" />
                    </div>

                    <h1 className="login-heading">Player Profile</h1>
                    
                    <div style={{ textAlign: 'center', marginBottom: '36px', animation: 'fadeSlideUp 0.55s 0.12s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                        <h2 style={{ color: '#8b2040', fontSize: '1.4rem', fontWeight: '500', margin: '0 0 4px 0' }}>{user?.email}</h2>
                        <span style={{ color: '#8a5060', fontSize: '0.9rem', fontWeight: '300' }}>Role: {user?.role}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '10px' }}>
                        <div className="profile-stat-box">
                            <div className="profile-stat-value">
                                {stats?.totalScore || 0}
                            </div>
                            <div className="profile-stat-label">Total Score</div>
                        </div>

                        <div className="profile-stat-box">
                            <div className="profile-stat-value">
                                {stats?.totalSolved || 0}
                            </div>
                            <div className="profile-stat-label">Puzzles Solved</div>
                        </div>
                    </div>

                    <div className="profile-row">
                        <span style={{ fontWeight: '500' }}>Total Attempts:</span>
                        <span style={{ fontWeight: '600', color: '#8b2040' }}>{stats?.totalAttempts || 0}</span>
                    </div>

                    <div className="profile-row" style={{ animationDelay: '0.25s' }}>
                        <span style={{ fontWeight: '500' }}>Accuracy:</span>
                        <span style={{ fontWeight: '600', color: '#8b2040' }}>
                            {stats?.totalAttempts > 0
                                ? Math.round((stats.totalSolved / stats.totalAttempts) * 100)
                                : 0}%
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

import { useState, useEffect } from 'react';
import { resourceApi } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap');

  .packs-root {
    --rose:        #B24268;
    --rose-light:  #C9587F;
    --rose-dark:   #8C2F50;
    --rose-pale:   #F7E8EE;
    --rose-mid:    #E8C4D0;
    --rose-muted:  #9E6070;
    --cream:       #FDF6F0;
    --text:        #2E1520;
    --text-muted:  #7A4A57;

    min-height: 100vh;
    padding: 48px 24px 80px;
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
    color: var(--cream);
    background: #1a0a12;
    background-image:
      radial-gradient(ellipse at 15% 55%, rgba(160, 40, 80, 0.55) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 15%, rgba(120, 20, 55, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse at 55% 90%, rgba(90, 10, 40, 0.4) 0%, transparent 50%);
    position: relative;
    overflow-x: hidden;
  }

  .packs-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

  .packs-root::after {
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

  .packs-inner {
    max-width: 860px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    animation: fadeSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .packs-header {
    margin-bottom: 40px;
    position: relative;
  }

  .packs-eyebrow {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #e8c0c8;
    margin-bottom: 10px;
  }

  .packs-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 5vw, 3rem);
    font-weight: 500;
    line-height: 1.1;
    color: var(--cream);
    margin: 0 0 6px;
  }

  .packs-title span {
    color: var(--rose-light);
  }

  .packs-divider {
    width: 56px;
    height: 3px;
    background: linear-gradient(90deg, var(--rose-light), var(--rose));
    border-radius: 2px;
    margin-top: 16px;
  }

  .packs-loading {
    font-family: 'DM Sans', sans-serif;
    color: var(--rose-mid);
    text-align: center;
    padding: 80px 24px;
    font-size: 1rem;
    letter-spacing: 0.05em;
  }

  .packs-empty {
    background: rgba(255, 248, 244, 0.97);
    border: 1px solid rgba(255, 220, 220, 0.6);
    border-radius: 24px;
    padding: 56px 32px;
    text-align: center;
    color: #8a5060;
    font-size: 0.95rem;
    box-shadow: 0 4px 16px rgba(160, 30, 70, 0.3);
  }

  .packs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .pack-card {
    background: rgba(255, 248, 244, 0.97);
    border: 1px solid rgba(255, 220, 220, 0.6);
    border-radius: 24px;
    padding: 28px 26px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.3),
      0 4px 16px rgba(160, 30, 70, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    animation: fadeSlideUp 0.55s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .pack-card:nth-child(2) { animation-delay: 0.15s; }
  .pack-card:nth-child(3) { animation-delay: 0.2s; }
  .pack-card:nth-child(4) { animation-delay: 0.25s; }

  .pack-card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(160, 30, 70, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    border-color: #b04060;
  }

  .pack-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: #3d0e1e;
    margin: 0;
    line-height: 1.2;
  }

  .pack-description {
    font-size: 0.875rem;
    color: #8a5060;
    line-height: 1.6;
    margin: 0;
    flex: 1;
  }

  .pack-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 14px;
    border-top: 1px solid rgba(160, 50, 80, 0.15);
  }

  .pack-count {
    font-size: 0.8rem;
    font-weight: 500;
    color: #9e6070;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .pack-count-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c0475f, #8b2040);
    display: inline-block;
  }

  .pack-btn {
    background: linear-gradient(135deg, #c04060 0%, #8b2040 60%, #6b1530 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 9px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 12px rgba(139, 32, 64, 0.3);
  }

  .pack-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(192, 64, 96, 0.4);
  }

  .pack-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(139, 32, 64, 0.3);
  }

  .pack-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    box-shadow: none;
  }

  .pack-accent {
    position: absolute;
    bottom: -24px;
    right: -24px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(200, 50, 100, 0.08);
    pointer-events: none;
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .pack-card:hover .pack-accent {
    transform: scale(1.5);
    background: rgba(200, 50, 100, 0.12);
  }
`;

export default function Packs() {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadPacks();
    }, []);

    const loadPacks = async () => {
        try {
            const res = await resourceApi.get('/api/packs?random=true');
            setPacks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="packs-root">
                <div className="packs-inner">
                    <div className="packs-header">
                        <p className="packs-eyebrow">Puzzle Collection</p>
                        <h1 className="packs-title">Choose a <span>Pack</span></h1>
                        <div className="packs-divider" />
                    </div>

                    {loading ? (
                        <div className="packs-loading">Loading packs…</div>
                    ) : packs.length === 0 ? (
                        <div className="packs-empty">
                            No packs available right now. Check back later!
                        </div>
                    ) : (
                        <div className="packs-grid">
                            {packs.map(pack => (
                                <div key={pack.id} className="pack-card">
                                    <div className="pack-accent" />
                                    <h3 className="pack-name">{pack.name}</h3>
                                    <p className="pack-description">{pack.description}</p>
                                    <div className="pack-footer">
                                        <span className="pack-count">
                                            <span className="pack-count-dot" />
                                            {pack.puzzleCount} Puzzles
                                        </span>
                                        <button
                                            className="pack-btn"
                                            onClick={() => navigate(`/play/${pack.id}`)}
                                            disabled={pack.puzzleCount === 0}
                                        >
                                            Play
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
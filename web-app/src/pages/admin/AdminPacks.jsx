import { useState, useEffect } from 'react';
import { resourceApi } from '../../api/axios';

export default function AdminPacks() {
    const [packs, setPacks] = useState([]);
    const [puzzles, setPuzzles] = useState([]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // For managing pack puzzles
    const [activePackId, setActivePackId] = useState(null);
    const [puzzleToAdd, setPuzzleToAdd] = useState('');

    useEffect(() => {
        loadPacks();
        loadPuzzles();
    }, []);

    const loadPacks = async () => {
        const res = await resourceApi.get('/cms/packs');
        setPacks(res.data);
    };

    const loadPuzzles = async () => {
        const res = await resourceApi.get('/cms/puzzles');
        setPuzzles(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await resourceApi.post('/cms/packs', { name, description });
            setName('');
            setDescription('');
            loadPacks();
        } catch (err) {
            alert("Failed to create pack");
        }
    };

    const togglePublish = async (id) => {
        try {
            await resourceApi.post(`/cms/packs/${id}/publish`);
            loadPacks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete pack?")) return;
        await resourceApi.delete(`/cms/packs/${id}`);
        loadPacks();
    };

    const addPuzzleToPack = async (e) => {
        e.preventDefault();
        if (!activePackId || !puzzleToAdd) return;
        try {
            await resourceApi.post(`/cms/packs/${activePackId}/puzzles/${puzzleToAdd}`);
            loadPacks();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to add puzzle");
        }
    };

    const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

  .admin-root {
    min-height: 100vh;
    background: #1a0a12;
    background-image:
      radial-gradient(ellipse at 15% 55%, rgba(160, 40, 80, 0.55) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 15%, rgba(120, 20, 55, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse at 55% 90%, rgba(90, 10, 40, 0.4) 0%, transparent 50%);
    font-family: 'DM Sans', sans-serif;
    padding: 40px 20px;
    position: relative;
    overflow-x: hidden;
    color: #fff5f7;
  }

  .admin-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

  .admin-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .admin-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 500;
    color: #fff5f7;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;
  }

  .admin-card {
    background: rgba(255, 248, 244, 0.95);
    border: 1px solid rgba(255, 220, 220, 0.6);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    color: #3d0e1e;
    transition: transform 0.2s;
  }

  .admin-btn {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #c04060 0%, #8b2040 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: 0 4px 15px rgba(139, 32, 64, 0.4);
    white-space: nowrap;
  }
  .admin-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(192, 64, 96, 0.5); }
  .admin-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  
  .admin-btn-danger {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    box-shadow: 0 4px 15px rgba(192, 57, 43, 0.4);
  }
  .admin-btn-danger:hover { box-shadow: 0 6px 20px rgba(231, 76, 60, 0.5); }

  .admin-btn-success {
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4);
  }
  .admin-btn-success:hover { box-shadow: 0 6px 20px rgba(39, 174, 96, 0.5); }

  .admin-btn-outline {
    background: transparent;
    border: 1px solid #8b2040;
    color: #8b2040;
    box-shadow: none;
  }
  .admin-btn-outline:hover { background: rgba(139, 32, 64, 0.1); transform: translateY(-2px); }

  .admin-input {
    background: #fff5f7;
    border: 1.5px solid #e8c0c8;
    border-radius: 8px;
    padding: 10px 14px;
    color: #2d0a14;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .admin-input:focus { border-color: #b04060; }
`;

    return (
        <>
        <style>{styles}</style>
        <div className="admin-root">
            <div className="admin-content">
                <h1 className="admin-heading">Manage Packs</h1>

                <div className="admin-card" style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: '15px', color: '#8a5060' }}>Create New Pack</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Pack Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <button type="submit" className="admin-btn" style={{ gridColumn: 'span 2' }}>
                            Create Pack
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {packs.map(pack => (
                        <div key={pack.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: '#3d0e1e', margin: 0 }}>{pack.name}</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => togglePublish(pack.id)}
                                        className={`admin-btn ${pack.isPublished ? 'admin-btn-success' : 'admin-btn-outline'}`}
                                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                    >
                                        {pack.isPublished ? 'Published' : 'Draft'}
                                    </button>
                                    <button className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleDelete(pack.id)}>Delete</button>
                                </div>
                            </div>

                            <p style={{ color: '#8a5060', fontSize: '0.95rem' }}>{pack.description}</p>
                            <p style={{ color: '#6b1530', fontWeight: '500' }}>Puzzles in Pack: {pack.puzzleCount}</p>

                            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #e8c0c8' }}>
                                <h4 style={{ color: '#3d0e1e', marginBottom: '10px' }}>Add Puzzle to Pack</h4>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setActivePackId(pack.id);
                                        addPuzzleToPack(e);
                                    }}
                                    style={{ display: 'flex', gap: '10px' }}
                                >
                                    <select
                                        className="admin-input"
                                        style={{ flexGrow: 1 }}
                                        value={activePackId === pack.id ? puzzleToAdd : ''}
                                        onChange={(e) => {
                                            setActivePackId(pack.id);
                                            setPuzzleToAdd(e.target.value);
                                        }}
                                    >
                                        <option value="">Select a puzzle...</option>
                                        {puzzles.map(p => (
                                            <option key={p.id} value={p.id}>{p.answerWord}</option>
                                        ))}
                                    </select>
                                    <button type="submit" className="admin-btn" disabled={!puzzleToAdd || activePackId !== pack.id}>Add</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}

import { useState, useEffect } from 'react';
import { resourceApi } from '../../api/axios';

export default function AdminPuzzles() {
    const [puzzles, setPuzzles] = useState([]);
    const [images, setImages] = useState([]);

    // Form State
    const [answerWord, setAnswerWord] = useState('');
    const [hint, setHint] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [selectedImageIds, setSelectedImageIds] = useState([]); // Up to 4

    useEffect(() => {
        loadPuzzles();
        loadImages();
    }, []);

    const loadPuzzles = async () => {
        const res = await resourceApi.get('/cms/puzzles');
        setPuzzles(res.data);
    };

    const loadImages = async () => {
        const res = await resourceApi.get('/cms/images');
        setImages(res.data);
    };

    const toggleImage = (id) => {
        if (selectedImageIds.includes(id)) {
            setSelectedImageIds(selectedImageIds.filter(x => x !== id));
        } else {
            if (selectedImageIds.length < 4) {
                setSelectedImageIds([...selectedImageIds, id]);
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (selectedImageIds.length !== 4) {
            alert("Please select exactly 4 images.");
            return;
        }

        // Map to API DTO: [ {imageId, position} ]
        const payloadImages = selectedImageIds.map((id, index) => ({
            imageId: id,
            position: index + 1
        }));

        try {
            await resourceApi.post('/cms/puzzles', {
                answerWord,
                hint,
                difficulty,
                images: payloadImages
            });

            setAnswerWord('');
            setHint('');
            setDifficulty('medium');
            setSelectedImageIds([]);
            loadPuzzles();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to create puzzle");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete puzzle?")) return;
        await resourceApi.delete(`/cms/puzzles/${id}`);
        loadPuzzles();
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
                <h1 className="admin-heading">Manage Puzzles</h1>

                <div className="admin-card" style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: '15px', color: '#8a5060' }}>Create New Puzzle</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gap: '15px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input
                                type="text"
                                className="admin-input"
                                placeholder="Answer Word"
                                value={answerWord}
                                onChange={e => setAnswerWord(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="admin-input"
                                placeholder="Hint (optional)"
                                value={hint}
                                onChange={e => setHint(e.target.value)}
                            />
                        </div>
                        <select className="admin-input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <div style={{ marginTop: '10px' }}>
                            <h4 style={{ color: '#3d0e1e', marginBottom: '10px' }}>Select 4 Images ({selectedImageIds.length}/4)</h4>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px 0', maxHeight: '200px', overflowY: 'auto' }}>
                                {images.map(img => (
                                    <div
                                        key={img.id}
                                        onClick={() => toggleImage(img.id)}
                                        style={{
                                            minWidth: '100px',
                                            height: '100px',
                                            backgroundImage: `url(${img.url})`,
                                            backgroundSize: 'cover',
                                            borderRadius: '8px',
                                            border: selectedImageIds.includes(img.id) ? '4px solid #c04060' : '1px solid #e8c0c8',
                                            cursor: 'pointer',
                                            opacity: (!selectedImageIds.includes(img.id) && selectedImageIds.length === 4) ? 0.3 : 1,
                                            transition: 'all 0.2s',
                                            transform: selectedImageIds.includes(img.id) ? 'scale(0.95)' : 'scale(1)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="admin-btn" disabled={selectedImageIds.length !== 4}>
                            Create Puzzle
                        </button>
                    </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {puzzles.map(p => (
                        <div key={p.id} className="admin-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'DM Sans', fontWeight: 'bold', margin: 0 }}>{p.answerWord}</h3>
                                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</button>
                            </div>

                            <p style={{ color: '#8a5060', marginBottom: '15px', fontSize: '0.9rem' }}>
                                <strong>Hint:</strong> {p.hint || 'None'} <br />
                                <strong>Difficulty:</strong> <span style={{ textTransform: 'capitalize' }}>{p.difficulty}</span>
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {p.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            aspectRatio: '1',
                                            backgroundImage: `url(${img.url})`,
                                            backgroundSize: 'cover',
                                            borderRadius: '6px',
                                            border: '1px solid #e8c0c8'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}

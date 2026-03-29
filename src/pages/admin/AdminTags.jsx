import { useState, useEffect } from 'react';
import { resourceApi } from '../../api/axios';

export default function AdminTags() {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const res = await resourceApi.get('/cms/tags');
            setTags(res.data);
        } catch (err) {
            console.error("Failed to load tags", err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTag.trim()) return;
        try {
            await resourceApi.post('/cms/tags', { name: newTag });
            setNewTag('');
            loadTags();
        } catch (err) {
            console.error("Failed to create tag", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete tag?")) return;
        try {
            await resourceApi.delete(`/cms/tags/${id}`);
            loadTags();
        } catch (err) {
            console.error("Failed to delete tag", err);
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
            <div className="admin-content" style={{ maxWidth: '800px' }}>
                <h1 className="admin-heading">Manage Tags</h1>

                <div className="admin-card" style={{ marginBottom: '30px' }}>
                    <form onSubmit={handleCreate} style={{ display: 'flex', gap: '15px' }}>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="New Tag Name"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                        />
                        <button type="submit" className="admin-btn">Add Tag</button>
                    </form>
                </div>

                <div className="admin-card">
                    <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: '20px', color: '#8a5060' }}>Existing Tags</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {tags.map(tag => (
                            <div
                                key={tag.id}
                                style={{
                                    background: '#8b2040',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 4px 10px rgba(139,32,64,0.3)'
                                }}>
                                <span>{tag.name}</span>
                                <button
                                    onClick={() => handleDelete(tag.id)}
                                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', padding: 0, fontSize: '1.2rem', lineHeight: 1, cursor: 'pointer' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        {tags.length === 0 && <p style={{ color: '#8a5060', fontStyle: 'italic' }}>No tags found.</p>}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

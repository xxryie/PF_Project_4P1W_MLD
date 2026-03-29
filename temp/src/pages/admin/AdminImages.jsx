import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceApi } from '../../api/axios';

export default function AdminImages() {
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [activeTagMap, setActiveTagMap] = useState({}); // imageId -> tagId to add
    const [filterTagId, setFilterTagId] = useState('');
    const [uploadTagId, setUploadTagId] = useState('');
    const [addUrlTagId, setAddUrlTagId] = useState('');

    useEffect(() => {
        loadImages();
    }, [filterTagId]);

    useEffect(() => {
        loadTags();
    }, []);

    const loadImages = async () => {
        const params = filterTagId ? { tagId: filterTagId } : {};
        const res = await resourceApi.get('/cms/images', { params });
        setImages(res.data);
    };

    const loadTags = async () => {
        const res = await resourceApi.get('/cms/tags');
        setTags(res.data);
    };

    const handleUploadFile = async (e) => {
        e.preventDefault();
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await resourceApi.post('/cms/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (uploadTagId) {
                try { await resourceApi.post(`/cms/images/${res.data.id}/tags/${uploadTagId}`); } catch (e) { }
            }
            setFile(null);
            setUploadTagId('');
            loadImages();
        } catch (err) {
            alert(err.response?.data?.error || "Upload failed");
        }
    };

    const handleAddUrl = async (e) => {
        e.preventDefault();
        if (!url) return;
        try {
            const res = await resourceApi.post('/cms/images/url', { url, fileName: url.split('/').pop() });
            if (addUrlTagId) {
                try { await resourceApi.post(`/cms/images/${res.data.id}/tags/${addUrlTagId}`); } catch (e) { }
            }
            setUrl('');
            setAddUrlTagId('');
            loadImages();
        } catch (err) {
            alert("Add URL failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete image?")) return;
        await resourceApi.delete(`/cms/images/${id}`);
        loadImages();
    };

    const addTagToImg = async (imageId, tagId) => {
        if (!tagId) return;
        try {
            await resourceApi.post(`/cms/images/${imageId}/tags/${tagId}`);
            loadImages();
        } catch (err) {
            alert("Tag could not be added");
        }
    };

    const removeTagFromImg = async (imageId, tagId) => {
        try {
            await resourceApi.delete(`/cms/images/${imageId}/tags/${tagId}`);
            loadImages();
        } catch (err) {
            console.error(err);
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
  }
  .admin-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(192, 64, 96, 0.5); }
  .admin-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h1 className="admin-heading" style={{ borderBottom: 'none', marginBottom: 0 }}>Manage Images</h1>
                        <Link to="/admin/tags" className="admin-btn" style={{ textDecoration: 'none' }}>
                            + Add New Category
                        </Link>
                    </div>
                    <div>
                        <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#e8c0c8' }}>Filter by Tag:</label>
                        <select
                            className="admin-input"
                            style={{ width: 'auto' }}
                            value={filterTagId}
                            onChange={e => setFilterTagId(e.target.value)}
                        >
                            <option value="">All Images</option>
                            {tags.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="admin-card">
                        <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: '15px', color: '#8a5060' }}>Upload File</h3>
                        <form onSubmit={handleUploadFile} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            <select className="admin-input" style={{ width: 'auto' }} value={uploadTagId} onChange={e => setUploadTagId(e.target.value)}>
                                <option value="">No Auto-Tag</option>
                                {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <input type="file" className="admin-input" style={{ flexGrow: 1 }} onChange={e => setFile(e.target.files[0])} />
                            <button type="submit" className="admin-btn">Upload</button>
                        </form>
                    </div>

                    <div className="admin-card">
                        <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', marginBottom: '15px', color: '#8a5060' }}>Add via URL</h3>
                        <form onSubmit={handleAddUrl} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            <select className="admin-input" style={{ width: 'auto' }} value={addUrlTagId} onChange={e => setAddUrlTagId(e.target.value)}>
                                <option value="">No Auto-Tag</option>
                                {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <input type="url" className="admin-input" placeholder="Image URL" value={url} onChange={e => setUrl(e.target.value)} style={{ flexGrow: 1 }} />
                            <button type="submit" className="admin-btn">Add</button>
                        </form>
                    </div>
                </div>

                {filterTagId ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {images.map(img => <ImageCard key={img.id} img={img} />)}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {images.filter(img => img.tags.length === 0).length > 0 && (
                            <div>
                                <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: '20px', color: '#e8c0c8' }}>Untagged</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                    {images.filter(img => img.tags.length === 0).map(img => <ImageCard key={img.id} img={img} />)}
                                </div>
                            </div>
                        )}

                        {tags.map(tag => {
                            const tagImages = images.filter(img => img.tags.some(t => t.id === tag.id));
                            if (tagImages.length === 0) return null;
                            return (
                                <div key={tag.id}>
                                    <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', marginBottom: '20px', color: '#fff5f7', textTransform: 'capitalize' }}>{tag.name}</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                        {tagImages.map(img => <ImageCard key={img.id} img={img} />)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
        </>
    );

    function ImageCard({ img }) {
        return (
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '1',
                        backgroundImage: `url(${img.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '8px',
                        border: '1px solid #e8c0c8',
                        marginBottom: '15px'
                    }}
                />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flexGrow: 1, marginBottom: '15px' }}>
                    {img.tags.map(t => (
                        <span key={t.id} style={{ background: '#8b2040', color: 'white', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {t.name} <span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => removeTagFromImg(img.id, t.id)}>✕</span>
                        </span>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '5px', marginTop: 'auto' }}>
                    <select
                        className="admin-input"
                        style={{ padding: '6px', fontSize: '0.8rem', flexGrow: 1 }}
                        value={activeTagMap[img.id] || ""}
                        onChange={e => setActiveTagMap({ ...activeTagMap, [img.id]: e.target.value })}
                    >
                        <option value="">Add Tag...</option>
                        {tags.filter(t => !img.tags.some(it => it.id === t.id)).map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <button
                        className="admin-btn"
                        style={{ padding: '6px 12px' }}
                        onClick={() => addTagToImg(img.id, activeTagMap[img.id])}
                    >
                        +
                    </button>
                    <button className="admin-btn admin-btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(img.id)}>✕</button>
                </div>
            </div>
        );
    }
}

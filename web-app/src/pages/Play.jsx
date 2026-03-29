import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceApi } from '../api/axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap');

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

  .play-card {
    width: 100%;
    max-width: 600px;
    background: rgba(255, 248, 244, 0.97);
    border: 1px solid rgba(255, 220, 220, 0.6);
    border-radius: 24px;
    padding: 36px 32px;
    box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(160, 30, 70, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    animation: fadeSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
    position: relative;
    z-index: 1;
    text-align: center;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-btn {
    background: linear-gradient(135deg, #c04060 0%, #8b2040 60%, #6b1530 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 12px rgba(139, 32, 64, 0.3);
    margin-top: 10px;
  }

  .login-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(192, 64, 96, 0.4);
  }
  
  .login-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 600;
    color: #3d0e1e;
    text-align: center;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 20px;
  }
`;

export default function Play() {
    const { packId } = useParams();
    const navigate = useNavigate();

    const [puzzle, setPuzzle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [nextAvailable, setNextAvailable] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [answerSlots, setAnswerSlots] = useState([]);
    const [poolLetters, setPoolLetters] = useState([]);
    const [hintUsed, setHintUsed] = useState(false);

    useEffect(() => {
        loadNextPuzzle();
    }, [packId]);

    useEffect(() => {
        if (answerSlots.length > 0 && answerSlots.every(s => s !== null) && !feedback) {
            handleSubmit();
        }
    }, [answerSlots, feedback]);

    const loadNextPuzzle = async () => {
        try {
            setLoading(true);
            setFeedback(null);
            setGuess('');
            setHintUsed(false);

            const res = await resourceApi.get(`/api/puzzles/next?packId=${packId}`);
            if (res.data.message === "Pack completed!") {
                setCompleted(true);
            } else {
                setPuzzle(res.data);
                if (res.data.answerLength && res.data.scrambledLetters) {
                    setAnswerSlots(Array(res.data.answerLength).fill(null));
                    setPoolLetters(res.data.scrambledLetters.split('').map((char, index) => ({ char, id: index, used: false })));
                }
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                setCompleted(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePoolLetterClick = (letterObj) => {
        if (letterObj.used || feedback?.correct) return;
        
        const firstEmptyIndex = answerSlots.findIndex(slot => slot === null);
        if (firstEmptyIndex === -1) return;
        
        const newSlots = [...answerSlots];
        newSlots[firstEmptyIndex] = letterObj;
        setAnswerSlots(newSlots);
        
        const newPool = poolLetters.map(p => p.id === letterObj.id ? { ...p, used: true } : p);
        setPoolLetters(newPool);
    };

    const handleSlotClick = (slotIndex) => {
        if (feedback?.correct) return;
        const slot = answerSlots[slotIndex];
        if (!slot) return;
        
        const newSlots = [...answerSlots];
        newSlots[slotIndex] = null;
        setAnswerSlots(newSlots);
        
        const newPool = poolLetters.map(p => p.id === slot.id ? { ...p, used: false } : p);
        setPoolLetters(newPool);
    };

    const handleHint = () => {
        if (hintUsed || feedback?.correct || !puzzle?.answerWord) return;
        
        for (let i = 0; i < puzzle.answerWord.length; i++) {
            const correctChar = puzzle.answerWord[i];
            const currentSlot = answerSlots[i];
            
            if (!currentSlot || currentSlot.char !== correctChar) {
                const newSlots = [...answerSlots];
                const newPool = [...poolLetters];
                
                if (currentSlot) {
                    const poolItem = newPool.find(p => p.id === currentSlot.id);
                    if (poolItem) poolItem.used = false;
                    newSlots[i] = null;
                }
                
                let poolIndex = newPool.findIndex(p => !p.used && p.char === correctChar);
                
                if (poolIndex === -1) {
                   const wrongSlotIndex = newSlots.findIndex((s, idx) => idx > i && s?.char === correctChar);
                   if (wrongSlotIndex !== -1) {
                       const movingLetter = newSlots[wrongSlotIndex];
                       newSlots[wrongSlotIndex] = null;
                       poolIndex = newPool.findIndex(p => p.id === movingLetter.id);
                   }
                }
                
                if (poolIndex !== -1) {
                    const letterObj = newPool[poolIndex];
                    letterObj.used = true;
                    newSlots[i] = letterObj;
                    setAnswerSlots(newSlots);
                    setPoolLetters(newPool);
                    setHintUsed(true);
                    return;
                }
            }
        }
    };

    const handleShuffle = () => {
        if (feedback?.correct || poolLetters.length === 0) return;
        const shuffled = [...poolLetters].sort(() => Math.random() - 0.5);
        setPoolLetters(shuffled);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        const currentGuess = answerSlots.map(s => s ? s.char : '').join('');
        if (!puzzle || currentGuess.length !== puzzle.answerLength) return;

        try {
            const res = await resourceApi.post('/api/game/submit', {
                puzzleId: puzzle.puzzleId,
                guess: currentGuess
            });

            setFeedback(res.data);
            setNextAvailable(res.data.nextAvailable);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div style={{ color: '#fff' }}>Loading puzzle...</div>
            </div>
        </>
    );

    if (completed) return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div className="play-card">
                    <h1 className="login-heading" style={{ color: '#c04060' }}>🎉 Pack Completed! 🎉</h1>
                    <p style={{ margin: '20px 0', color: '#8a5060' }}>You have solved all puzzles in this pack.</p>
                    <button className="login-btn" onClick={() => navigate('/packs')}>
                        Choose Another Pack
                    </button>
                </div>
            </div>
        </>
    );

    if (!puzzle) return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div style={{ color: '#c0392b' }}>Error loading puzzle.</div>
            </div>
        </>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="login-root">
                <div className="play-card">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <span style={{ color: '#8a5060', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Difficulty: {puzzle.difficulty}
                        </span>
                    </div>

                    <div style={{ 
                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', 
                        padding: '12px', background: '#fff5f7', borderRadius: '16px', 
                        marginBottom: '20px', boxShadow: '0 8px 24px rgba(139,32,64,0.15)',
                        border: '1px solid #e8c0c8'
                    }}>
                        {puzzle.images.map(img => (
                            <div
                                key={img.imageId}
                                style={{
                                    aspectRatio: '1/1',
                                    backgroundImage: `url(${img.url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '10px'
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '0 20px' }}>
                        <button 
                            onClick={handleHint}
                            disabled={hintUsed || feedback?.correct}
                            title="Reveal Letter"
                            style={{ 
                                width: '50px', height: '50px',
                                background: '#3d0e1e', 
                                border: 'none', borderRadius: '50%',
                                fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 0 #1a0a12, 0 8px 10px rgba(0,0,0,0.3)',
                                opacity: hintUsed ? 0.5 : 1, cursor: hintUsed ? 'not-allowed' : 'pointer',
                                transform: hintUsed ? 'translateY(4px)' : 'none',
                                color: 'white'
                            }}
                        >
                            💡
                        </button>
                        
                        <button 
                            onClick={handleShuffle}
                            disabled={feedback?.correct}
                            title="Shuffle Letters"
                            style={{ 
                                width: '50px', height: '50px',
                                background: '#c04060', 
                                border: 'none', borderRadius: '50%',
                                fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 0 #8b2040, 0 8px 10px rgba(0,0,0,0.3)',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                            🔀
                        </button>
                    </div>
                    {puzzle.hint && (
                        <div style={{ marginBottom: '15px', color: '#8a5060', fontSize: '0.9rem', fontStyle: 'italic' }}>
                            {puzzle.hint}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                        {answerSlots.map((slot, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleSlotClick(idx)}
                                style={{
                                    width: '44px', height: '44px',
                                    background: slot ? '#8b2040' : '#4a1525',
                                    border: '2px solid #3d0e1e',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '1.5rem', fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: slot && !feedback?.correct ? 'pointer' : 'default',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {slot ? slot.char : ''}
                            </div>
                        ))}
                    </div>

                    <div style={{ 
                        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', 
                        maxWidth: '380px', margin: '0 auto', marginBottom: '20px',
                        padding: '18px', background: '#fff5f7', borderRadius: '16px',
                        border: '1px solid #e8c0c8'
                    }}>
                        {poolLetters.map((letter) => (
                            <button
                                key={letter.id}
                                onClick={() => handlePoolLetterClick(letter)}
                                disabled={letter.used || feedback?.correct}
                                style={{
                                    padding: '12px 0',
                                    background: letter.used ? 'transparent' : '#c04060',
                                    border: letter.used ? 'none' : '1px solid #e8c0c8',
                                    borderRadius: '8px',
                                    color: letter.used ? 'transparent' : 'white',
                                    fontSize: '1.5rem', fontWeight: 'bold',
                                    cursor: letter.used || feedback?.correct ? 'default' : 'pointer',
                                    boxShadow: letter.used ? 'none' : '0 4px 0 #8b2040',
                                    textTransform: 'uppercase',
                                    transform: (letter.used || feedback?.correct) ? 'translateY(4px)' : 'none',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                {letter.char}
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            borderRadius: '12px',
                            background: feedback.correct ? 'rgba(0, 245, 212, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                            border: `1px solid ${feedback.correct ? '#00f5d4' : '#ff4d4d'}`
                        }}>
                            <h3 style={{ color: feedback.correct ? '#00bbf9' : '#c0392b' }}>
                                {feedback.correct ? 'Correct! ✅' : 'Incorrect ❌'}
                            </h3>
                            <p style={{ color: '#3d0e1e', marginTop: '8px' }}>{feedback.message}</p>
                            {feedback.correct && (
                                <p style={{ marginTop: '5px', color: '#c04060', fontWeight: 'bold' }}>
                                    +{feedback.scoreDelta} points!
                                </p>
                            )}

                            {feedback.correct && (
                                <div style={{ marginTop: '15px' }}>
                                    {nextAvailable ? (
                                        <button className="login-btn" onClick={loadNextPuzzle}>
                                            Next Puzzle
                                        </button>
                                    ) : (
                                        <button className="login-btn" onClick={() => setCompleted(true)}>
                                            Finish Pack
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

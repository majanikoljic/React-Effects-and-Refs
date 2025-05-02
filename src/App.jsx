import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import './App.css'

function App(){
    const [deckId, setDeckId] = useState(null)
    const [cards, setCards] = useState([])
    const [remaining, setRemaining] = useState(52)
    const [isAutoDrawing, setIsAutoDrawing] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        async function getDeck() {
          const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
          setDeckId(res.data.deck_id);
          setRemaining(res.data.remaining);
        }
        getDeck();
        
    }, []);
    
    useEffect(() => {
        if (isAutoDrawing && !timerRef.current) {
          timerRef.current = setInterval(drawCard, 1000);
        }
    
        return () => {
          clearInterval(timerRef.current);
          timerRef.current = null;
        };
    }, [isAutoDrawing]);
    
      async function drawCard() {
        if (remaining === 0) {
          setIsAutoDrawing(false);
          alert('Error: no cards remaining!');
          return;
        }
    
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        if (res.data.success) {
          setCards(cards => [...cards, res.data.cards[0]]);
          setRemaining(res.data.remaining);
        }
    }
    
    async function shuffleDeck() {
        await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        setRemaining(52);
        setCards([]);
    }
    
    return (
        <div className="App">
          <h1>Card Drawer</h1>
          <p>{remaining} cards remaining</p>
          <div>
            <button onClick={drawCard} disabled={remaining === 0 || isAutoDrawing}>Draw Card</button>
            <button onClick={shuffleDeck} disabled={isAutoDrawing}>Shuffle Deck</button>
            <button onClick={() => setIsAutoDrawing(auto => !auto)} disabled={remaining === 0}>
              {isAutoDrawing ? 'Stop Drawing' : 'Start Drawing'}
            </button>
        </div>
        <div className="card-area">
            {cards.map((card, index) => (
            <img
            key={card.code}
            src={card.image}
            alt={card.code}
            style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${Math.random() * 90 - 45}deg)`,
        }}
        />
    ))}
    </div>
    </div>
)};
    

export default App

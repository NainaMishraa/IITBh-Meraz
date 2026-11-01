import React, { useEffect, useRef, useState } from 'react';

const ROWS = 6, COLS = 7;
type Card = { suit: string; rank: string; faceUp: boolean; id: number };

function makeFreecellDeck(): Card[] {
  const suits = ['♠','♥','♦','♣'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const deck: Card[] = [];
  let id = 0;
  suits.forEach(suit => ranks.forEach(rank => deck.push({ suit, rank, faceUp: true, id: id++ })));
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function FreeCell() {
  const deck = makeFreecellDeck();
  const cols: Card[][] = Array(8).fill(null).map(() => []);
  deck.forEach((card, i) => cols[i % 8].push(card));

  const [tableau, setTableau] = useState(cols);
  const isRed = (c: Card) => c.suit === '♥' || c.suit === '♦';

  return (
    <div style={{ background: '#176117', padding: '8px', height: '100%', fontFamily: 'Arial', fontSize: '12px', overflow: 'auto' }}>
      <div style={{ color: '#fff', textAlign: 'center', marginBottom: '8px' }}>
        <strong>FreeCell</strong>
        <span style={{ fontSize: '10px', color: '#aaa', marginLeft: '12px' }}>
          "I have 4 free cells in my mind: Bitcoin, anonymity, math, and crackers." — S
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {tableau.map((col, colIdx) => (
          <div key={colIdx} style={{ minWidth: '64px', minHeight: '100px', position: 'relative' }}>
            {col.length === 0 && (
              <div style={{ width: 60, height: 84, border: '2px dashed #3a8a3a', borderRadius: 4, background: 'rgba(0,0,0,0.2)' }} />
            )}
            {col.map((card, cardIdx) => (
              <div key={card.id} style={{
                position: 'absolute',
                top: cardIdx * 22,
                width: 60, height: 84,
                background: '#fff',
                border: '1px solid #333',
                borderRadius: 4,
                padding: '2px 4px',
                fontSize: 13, fontWeight: 'bold',
                color: isRed(card) ? '#c00' : '#000',
                userSelect: 'none',
                cursor: 'default',
                zIndex: cardIdx,
              }}>
                {card.rank}{card.suit}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '12px', color: '#aaa', fontSize: '11px' }}>
        FreeCell: 99.999% of deals are solvable. Like Bitcoin. Almost all problems have solutions.
      </div>
    </div>
  );
}

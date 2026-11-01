import React, { useState } from 'react';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  faceUp: boolean;
}

function createDeck(): Card[] {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranks: [Rank, number][] = [
    ['A', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7],
    ['8', 8], ['9', 9], ['10', 10], ['J', 11], ['Q', 12], ['K', 13]
  ];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const [rank, value] of ranks) {
      deck.push({ suit, rank, value, faceUp: false });
    }
  }
  return shuffle(deck);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isRed(card: Card) { return card.suit === '♥' || card.suit === '♦'; }

function initKlondike() {
  const deck = createDeck();
  const tableaux: Card[][] = Array(7).fill(null).map(() => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      tableaux[col].push({ ...deck[idx], faceUp: row === col });
      idx++;
    }
  }
  const stock = deck.slice(idx).map(c => ({ ...c, faceUp: false }));
  const waste: Card[] = [];
  const foundations: Card[][] = [[], [], [], []];
  return { tableaux, stock, waste, foundations, score: 0, moves: 0 };
}

export function Solitaire() {
  const [game, setGame] = useState(initKlondike);
  const [selected, setSelected] = useState<{ source: string; cards: Card[] } | null>(null);
  const [won, setWon] = useState(false);

  const newGame = () => { setGame(initKlondike()); setSelected(null); setWon(false); };

  const drawStock = () => {
    setGame(g => {
      const g2 = { ...g, stock: [...g.stock], waste: [...g.waste] };
      if (g2.stock.length === 0) {
        g2.stock = g2.waste.reverse().map(c => ({ ...c, faceUp: false }));
        g2.waste = [];
      } else {
        const card = { ...g2.stock.pop()!, faceUp: true };
        g2.waste.push(card);
      }
      g2.moves = g.moves + 1;
      return g2;
    });
    setSelected(null);
  };

  const handleWasteClick = () => {
    if (!game.waste.length) return;
    const top = game.waste[game.waste.length - 1];
    if (selected?.source === 'waste') { setSelected(null); return; }
    setSelected({ source: 'waste', cards: [top] });
  };

  const handleTableauClick = (col: number, cardIdx: number) => {
    const col_ = game.tableaux[col];
    const card = col_[cardIdx];
    if (!card.faceUp) return;

    if (selected) {
      // Try to place
      const targetTop = col_.length > 0 ? col_[col_.length - 1] : null;
      const src = selected.cards[0];
      const canPlace = !targetTop
        ? src.value === 13
        : (isRed(src) !== isRed(targetTop)) && (src.value === targetTop.value - 1);
      if (canPlace) {
        setGame(g => {
          const g2 = deepClone(g);
          // Remove from source
          removeSelected(g2, selected);
          // Add to tableau
          selected.cards.forEach(c => g2.tableaux[col].push({ ...c, faceUp: true }));
          // Flip exposed card
          const t = g2.tableaux[col];
          const srcT = g2.tableaux[col];
          // Flip top of each tableau
          g2.tableaux.forEach(tc => {
            if (tc.length > 0 && !tc[tc.length-1].faceUp) tc[tc.length-1].faceUp = true;
          });
          g2.moves = g.moves + 1;
          g2.score = g.score + 5;
          return g2;
        });
        setSelected(null);
        return;
      }
      setSelected(null);
    }

    const cards = col_.slice(cardIdx);
    setSelected({ source: `tableau-${col}`, cards });
  };

  const handleFoundationClick = (fIdx: number) => {
    if (!selected) return;
    const card = selected.cards[0];
    const foundation = game.foundations[fIdx];
    const topF = foundation[foundation.length - 1];
    const canPlace = !topF
      ? card.value === 1
      : card.suit === topF.suit && card.value === topF.value + 1;
    if (canPlace && selected.cards.length === 1) {
      setGame(g => {
        const g2 = deepClone(g);
        removeSelected(g2, selected!);
        g2.foundations[fIdx].push({ ...card, faceUp: true });
        g2.tableaux.forEach(tc => {
          if (tc.length > 0 && !tc[tc.length-1].faceUp) tc[tc.length-1].faceUp = true;
        });
        g2.moves = g.moves + 1;
        g2.score = g.score + 10;
        if (g2.foundations.every(f => f.length === 13)) setWon(true);
        return g2;
      });
      setSelected(null);
    }
  };

  function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }

  function removeSelected(g: ReturnType<typeof initKlondike>, sel: { source: string; cards: Card[] }) {
    if (sel.source === 'waste') {
      g.waste.pop();
    } else if (sel.source.startsWith('tableau-')) {
      const col = parseInt(sel.source.split('-')[1]);
      g.tableaux[col] = g.tableaux[col].slice(0, -sel.cards.length);
    }
  }

  const cardStyle = (card: Card, isSelected: boolean): React.CSSProperties => ({
    width: 60, height: 84,
    border: '1px solid #333',
    borderRadius: 4,
    background: isSelected ? '#e0e0ff' : '#fff',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
    padding: '2px 4px',
    fontSize: 13, fontWeight: 'bold',
    color: isRed(card) ? '#c00' : '#000',
    cursor: 'default',
    userSelect: 'none',
    boxShadow: isSelected ? '0 0 4px #00f' : '1px 1px 2px rgba(0,0,0,0.3)',
    flexShrink: 0,
    position: 'relative',
  });

  const backStyle: React.CSSProperties = {
    width: 60, height: 84, border: '1px solid #333', borderRadius: 4,
    background: 'linear-gradient(135deg, #00f 25%, #004 25%, #004 50%, #00f 50%, #00f 75%, #004 75%)',
    backgroundSize: '10px 10px',
    cursor: 'default', flexShrink: 0,
  };

  const emptySlot: React.CSSProperties = {
    width: 60, height: 84, border: '2px dashed #666', borderRadius: 4,
    background: 'rgba(0,0,0,0.1)', flexShrink: 0,
  };

  return (
    <div style={{ background: '#176117', padding: '8px', height: '100%', overflow: 'auto', fontFamily: 'Arial' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '12px' }}>Score: {game.score} | Moves: {game.moves}</span>
        <button onClick={newGame} style={{ padding: '2px 10px', fontSize: '11px', cursor: 'pointer', marginLeft: 'auto' }}>New Game</button>
      </div>

      {/* Top row: Stock, Waste, Foundations */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'flex-start' }}>
        {/* Stock */}
        <div onClick={drawStock} style={game.stock.length ? backStyle : { ...emptySlot, cursor: 'pointer' }} />
        {/* Waste */}
        <div onClick={handleWasteClick} style={game.waste.length ? cardStyle(game.waste[game.waste.length-1], selected?.source === 'waste') : emptySlot}>
          {game.waste.length > 0 && (
            <>
              <span>{game.waste[game.waste.length-1].rank}</span>
              <span style={{ fontSize: 11, marginLeft: 2 }}>{game.waste[game.waste.length-1].suit}</span>
            </>
          )}
        </div>
        <div style={{ flex: 1 }} />
        {/* Foundations */}
        {game.foundations.map((f, i) => (
          <div key={i} onClick={() => handleFoundationClick(i)}
            style={f.length ? cardStyle(f[f.length-1], false) : { ...emptySlot, cursor: 'pointer' }}>
            {f.length ? <><span>{f[f.length-1].rank}</span><span style={{ fontSize: 11, marginLeft: 2 }}>{f[f.length-1].suit}</span></> : <span style={{ color: '#666', fontSize: 18, padding: '20px' }}>A</span>}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        {game.tableaux.map((col, colIdx) => (
          <div key={colIdx} style={{ position: 'relative', minHeight: 84, width: 60 }}>
            {col.length === 0 && (
              <div style={emptySlot} onClick={() => { if (selected) handleTableauClick(colIdx, 0); }} />
            )}
            {col.map((card, cardIdx) => (
              <div key={cardIdx}
                onClick={() => handleTableauClick(colIdx, cardIdx)}
                style={{
                  ...(!card.faceUp ? backStyle : cardStyle(card, selected?.source === `tableau-${colIdx}` && cardIdx >= col.length - selected.cards.length)),
                  position: 'absolute',
                  top: cardIdx * 20,
                  zIndex: cardIdx,
                  ...(card.faceUp ? {} : {}),
                }}>
                {card.faceUp && (
                  <><span>{card.rank}</span><span style={{ fontSize: 11, marginLeft: 2 }}>{card.suit}</span></>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {won && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ color: '#ff0', fontSize: '28px', fontWeight: 'bold' }}>🃏 YOU WIN!</div>
          <div style={{ color: '#fff', fontSize: '14px' }}>Score: {game.score}</div>
          <div style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', maxWidth: 300 }}>
            "I spent 4 years solving a harder game.<br/>It's called the double-spending problem." — S
          </div>
          <button onClick={newGame} style={{ padding: '6px 20px', fontSize: '14px', cursor: 'pointer' }}>New Game</button>
        </div>
      )}
    </div>
  );
}

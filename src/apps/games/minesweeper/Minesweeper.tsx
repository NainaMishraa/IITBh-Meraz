import React, { useState, useRef, useEffect } from 'react';

type Cell = {
  bomb: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
};

const ROWS = 16, COLS = 16, BOMBS = 40;

function initBoard(): Cell[][] {
  const board: Cell[][] = Array(ROWS).fill(null).map(() =>
    Array(COLS).fill(null).map(() => ({ bomb: false, revealed: false, flagged: false, count: 0 }))
  );
  let placed = 0;
  while (placed < BOMBS) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].bomb) { board[r][c].bomb = true; placed++; }
  }
  // Count neighbors
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].bomb) continue;
      let cnt = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (r+dr >= 0 && r+dr < ROWS && c+dc >= 0 && c+dc < COLS) {
          if (board[r+dr][c+dc].bomb) cnt++;
        }
      }
      board[r][c].count = cnt;
    }
  }
  return board;
}

const NUM_COLORS = ['', '#0000ff','#006b00','#ff0000','#00007f','#7f0000','#008080','#000','#808080'];

export function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(initBoard);
  const [gameOver, setGameOver] = useState<'none' | 'win' | 'lose'>('none');
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (started && gameOver === 'none') {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, gameOver]);

  const reset = () => {
    setBoard(initBoard());
    setGameOver('none');
    setFlags(0);
    setTime(0);
    setStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reveal = (r: number, c: number, b: Cell[][]) => {
    if (b[r][c].revealed || b[r][c].flagged) return;
    b[r][c].revealed = true;
    if (b[r][c].count === 0 && !b[r][c].bomb) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (r+dr >= 0 && r+dr < ROWS && c+dc >= 0 && c+dc < COLS) {
          reveal(r+dr, c+dc, b);
        }
      }
    }
  };

  const handleClick = (r: number, c: number) => {
    if (gameOver !== 'none') return;
    if (!started) setStarted(true);
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    if (nb[r][c].bomb) {
      nb[r][c].revealed = true;
      // Reveal all bombs
      for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) {
        if (nb[i][j].bomb) nb[i][j].revealed = true;
      }
      setBoard(nb);
      setGameOver('lose');
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    reveal(r, c, nb);
    setBoard(nb);
    // Check win
    const won = nb.every(row => row.every(cell => cell.bomb || cell.revealed));
    if (won) { setGameOver('win'); if (timerRef.current) clearInterval(timerRef.current); }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver !== 'none' || board[r][c].revealed) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setFlags(f => nb[r][c].flagged ? f + 1 : f - 1);
    setBoard(nb);
  };

  const face = gameOver === 'win' ? '😎' : gameOver === 'lose' ? '😵' : started ? '😐' : '🙂';
  const remaining = Math.max(0, BOMBS - flags);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px', background: '#c0c0c0', height: '100%' }}>
      {/* Header */}
      <div style={{
        border: '4px solid', borderColor: '#808080 #fff #fff #808080',
        background: '#c0c0c0', padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: '16px',
        marginBottom: '8px', width: '100%', boxSizing: 'border-box',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: '22px', color: '#f00', background: '#000', padding: '2px 6px', minWidth: '52px', textAlign: 'right' }}>
          {String(remaining).padStart(3, '0')}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <button onClick={reset} style={{
            fontSize: '20px', cursor: 'pointer', background: '#c0c0c0',
            border: '3px solid', borderColor: '#fff #808080 #808080 #fff',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {face}
          </button>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '22px', color: '#f00', background: '#000', padding: '2px 6px', minWidth: '52px', textAlign: 'right' }}>
          {String(Math.min(999, time)).padStart(3, '0')}
        </div>
      </div>

      {/* Board */}
      <div style={{ border: '4px solid', borderColor: '#808080 #fff #fff #808080' }}>
        {board.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((cell, c) => (
              <div
                key={c}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                style={{
                  width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 'bold', cursor: 'default',
                  userSelect: 'none',
                  background: cell.revealed ? (cell.bomb ? '#f00' : '#c0c0c0') : '#c0c0c0',
                  border: cell.revealed
                    ? '1px solid #808080'
                    : '2px solid', 
                  borderColor: cell.revealed
                    ? '#808080'
                    : '#fff #808080 #808080 #fff',
                  color: cell.revealed && !cell.bomb ? NUM_COLORS[cell.count] : '#000',
                }}
              >
                {cell.revealed
                  ? cell.bomb ? '💣' : (cell.count > 0 ? cell.count : '')
                  : cell.flagged ? '🚩' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameOver !== 'none' && (
        <div style={{ marginTop: '12px', textAlign: 'center', fontFamily: 'Arial', fontSize: '13px' }}>
          {gameOver === 'win'
            ? '🎉 You won! (Satoshi also wins. Eventually.)'
            : '💥 GAME OVER\n"Fatal exception: Blockchain not found"\n\nPress 🙂 to play again.'}
        </div>
      )}

      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666', fontFamily: 'monospace', textAlign: 'center' }}>
        The mines represent the challenges of decentralized consensus.
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_W = 20, GRID_H = 20, CELL = 20;
const DIRS = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };

type Pos = [number, number];

function initSnake(): { snake: Pos[], dir: Pos, food: Pos, alive: boolean, score: number } {
  return {
    snake: [[10, 10], [9, 10], [8, 10]],
    dir: [1, 0],
    food: [15, 10],
    alive: true,
    score: 0,
  };
}

function randomFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = [Math.floor(Math.random() * GRID_W), Math.floor(Math.random() * GRID_H)];
  } while (snake.some(([x, y]) => x === pos[0] && y === pos[1]));
  return pos;
}

export function Snake() {
  const [state, setState] = useState(initSnake);
  const dirRef = useRef<Pos>([1, 0]);
  const gameRef = useRef(state);
  gameRef.current = state;
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const tick = useCallback(() => {
    const { snake, food, alive, score } = gameRef.current;
    if (!alive) return;
    const [dx, dy] = dirRef.current;
    const head: Pos = [snake[0][0] + dx, snake[0][1] + dy];
    // Wall collision
    if (head[0] < 0 || head[0] >= GRID_W || head[1] < 0 || head[1] >= GRID_H) {
      setState(s => ({ ...s, alive: false }));
      return;
    }
    // Self collision
    if (snake.some(([x, y]) => x === head[0] && y === head[1])) {
      setState(s => ({ ...s, alive: false }));
      return;
    }
    const ateFood = head[0] === food[0] && head[1] === food[1];
    const newSnake = ateFood ? [head, ...snake] : [head, ...snake.slice(0, -1)];
    const newFood = ateFood ? randomFood(newSnake) : food;
    const newScore = ateFood ? score + 10 : score;
    if (newScore > highScore) setHighScore(newScore);
    setState({ snake: newSnake, dir: dirRef.current, food: newFood, alive: true, score: newScore });
  }, [highScore]);

  useEffect(() => {
    if (!started || !state.alive) return;
    const interval = setInterval(tick, 130);
    return () => clearInterval(interval);
  }, [started, state.alive, tick]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!started) { setStarted(true); }
    const mapping: Record<string, Pos> = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
      w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    };
    const newDir = mapping[e.key];
    if (newDir) {
      const [dx, dy] = dirRef.current;
      if (newDir[0] !== -dx || newDir[1] !== -dy) {
        dirRef.current = newDir;
      }
      e.preventDefault();
    }
  }, [started]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const reset = () => {
    const init = initSnake();
    setState(init);
    dirRef.current = [1, 0];
    setStarted(false);
  };

  const snakeSet = new Set(state.snake.map(([x, y]) => `${x},${y}`));

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '12px', background: '#c0c0c0', height: '100%', gap: '8px',
    }}>
      <div style={{ fontFamily: 'Arial', fontSize: '13px', display: 'flex', gap: '24px' }}>
        <span>Score: <strong>{state.score}</strong></span>
        <span>Best: <strong>{highScore}</strong></span>
      </div>

      {/* Canvas */}
      <div style={{
        border: '4px solid', borderColor: '#808080 #fff #fff #808080',
        background: '#000',
        width: GRID_W * CELL,
        height: GRID_H * CELL,
        position: 'relative',
        cursor: 'none',
      }}>
        {/* Grid lines (subtle) */}
        {Array.from({ length: GRID_W * GRID_H }).map((_, idx) => {
          const gx = idx % GRID_W, gy = Math.floor(idx / GRID_W);
          const key = `${gx},${gy}`;
          const isHead = state.snake[0][0] === gx && state.snake[0][1] === gy;
          const isSnake = snakeSet.has(key);
          const isFood = state.food[0] === gx && state.food[1] === gy;
          return (
            <div key={key} style={{
              position: 'absolute',
              left: gx * CELL,
              top: gy * CELL,
              width: CELL - 1,
              height: CELL - 1,
              background: isHead ? '#00ff00'
                : isSnake ? '#008800'
                : isFood ? '#ff4444'
                : 'transparent',
              borderRadius: isFood ? '50%' : isHead ? '3px' : '0',
              boxShadow: isHead ? '0 0 4px #00ff00' : undefined,
            }} />
          );
        })}

        {!started && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '8px', color: '#0f0', fontFamily: 'monospace',
          }}>
            <div style={{ fontSize: '16px' }}>🐍 SNAKE</div>
            <div style={{ fontSize: '12px' }}>Press any arrow key to start</div>
            <div style={{ fontSize: '10px', color: '#666' }}>Use WASD or arrow keys</div>
          </div>
        )}

        {!state.alive && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '8px', color: '#f00', fontFamily: 'monospace',
          }}>
            <div style={{ fontSize: '16px' }}>GAME OVER</div>
            <div style={{ fontSize: '12px', color: '#fff' }}>Score: {state.score}</div>
            <div style={{ fontSize: '10px', color: '#888' }}>
              "I also hit a wall once. <br/> That wall was the global banking system." — S
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={reset} style={{ padding: '4px 16px', cursor: 'pointer', fontFamily: 'Arial', fontSize: '12px' }}>
          New Game
        </button>
        {!started && !state.alive && (
          <button onClick={() => { reset(); setStarted(true); }} style={{ padding: '4px 16px', cursor: 'pointer', fontFamily: 'Arial', fontSize: '12px' }}>
            Play Again
          </button>
        )}
      </div>

      <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace', textAlign: 'center' }}>
        The food represents Satoshi's rare interaction with the physical world.
      </div>

      {/* On-screen controls for mobile */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
        <button onPointerDown={() => dirRef.current = [0,-1]} style={{ width: '36px', height: '30px', cursor: 'pointer' }}>▲</button>
        <div style={{ display: 'flex', gap: '2px' }}>
          <button onPointerDown={() => dirRef.current = [-1,0]} style={{ width: '36px', height: '30px', cursor: 'pointer' }}>◀</button>
          <button onPointerDown={() => { if (!started) setStarted(true); }} style={{ width: '36px', height: '30px', cursor: 'pointer', fontSize: '10px' }}>▶▶</button>
          <button onPointerDown={() => dirRef.current = [1,0]} style={{ width: '36px', height: '30px', cursor: 'pointer' }}>▶</button>
        </div>
        <button onPointerDown={() => dirRef.current = [0,1]} style={{ width: '36px', height: '30px', cursor: 'pointer' }}>▼</button>
      </div>
    </div>
  );
}

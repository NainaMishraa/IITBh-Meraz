import React, { useEffect, useRef, useState, useCallback } from 'react';

const CANVAS_W = 600, CANVAS_H = 360;
const PADDLE_W = 12, PADDLE_H = 60;
const BALL_SIZE = 10;
const BALL_SPEED = 4;
const BRICK_ROWS = 5, BRICK_COLS = 10;
const BRICK_W = 54, BRICK_H = 18;

type Brick = { x: number; y: number; alive: boolean; color: string };

const COLORS = ['#ff4444','#ff8800','#ffff00','#44ff44','#4444ff'];

function initBricks(): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: 10 + c * (BRICK_W + 4),
        y: 40 + r * (BRICK_H + 4),
        alive: true,
        color: COLORS[r],
      });
    }
  }
  return bricks;
}

export function Pinball() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ball: { x: CANVAS_W / 2, y: CANVAS_H - 80, vx: BALL_SPEED, vy: -BALL_SPEED },
    paddle: { x: CANVAS_W / 2 - PADDLE_W / 2 },
    bricks: initBricks(),
    score: 0,
    lives: 3,
    started: false,
    gameOver: false,
    won: false,
  });
  const [display, setDisplay] = useState({ score: 0, lives: 3, gameOver: false, won: false, started: false });
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | undefined>(undefined);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const s = stateRef.current;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Bricks
    s.bricks.forEach(b => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, BRICK_W, BRICK_H);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, BRICK_W, BRICK_H);
    });

    // Paddle
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(s.paddle.x, CANVAS_H - 20, PADDLE_W * 6, PADDLE_H / 6);

    // Ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    if (!s.started) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🎯 PINBALL (Space Cadet Style)', CANVAS_W / 2, 150);
      ctx.font = '14px monospace';
      ctx.fillText('Press SPACE or click to start', CANVAS_W / 2, 185);
      ctx.fillText('← → to move paddle', CANVAS_W / 2, 210);
    }

    if (s.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#f00';
      ctx.font = '28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_W / 2, 160);
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`Score: ${s.score}`, CANVAS_W / 2, 195);
      ctx.fillText('"Like my diet. Crashed and burned." — S', CANVAS_W / 2, 225);
    }

    if (s.won) {
      ctx.fillStyle = 'rgba(0,0,100,0.8)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = '#0ff';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 YOU WIN!', CANVAS_W / 2, 150);
      ctx.fillStyle = '#fff';
      ctx.font = '13px monospace';
      ctx.fillText('The blockchain is complete.', CANVAS_W / 2, 185);
      ctx.fillText(`Score: ${s.score}`, CANVAS_W / 2, 210);
    }
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.started || s.gameOver || s.won) { draw(); return; }

    // Paddle movement
    const PADDLE_SPEED = 6;
    if (keysRef.current.has('ArrowLeft')) s.paddle.x = Math.max(0, s.paddle.x - PADDLE_SPEED);
    if (keysRef.current.has('ArrowRight')) s.paddle.x = Math.min(CANVAS_W - PADDLE_W * 6, s.paddle.x + PADDLE_SPEED);

    // Ball movement
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;

    // Wall collisions
    if (s.ball.x <= BALL_SIZE / 2 || s.ball.x >= CANVAS_W - BALL_SIZE / 2) s.ball.vx = -s.ball.vx;
    if (s.ball.y <= BALL_SIZE / 2) s.ball.vy = -s.ball.vy;

    // Paddle collision
    const paddleY = CANVAS_H - 20;
    if (s.ball.y >= paddleY - BALL_SIZE / 2 && s.ball.y <= paddleY + 5 &&
        s.ball.x >= s.paddle.x && s.ball.x <= s.paddle.x + PADDLE_W * 6) {
      s.ball.vy = -Math.abs(s.ball.vy);
      const hit = (s.ball.x - s.paddle.x) / (PADDLE_W * 6) - 0.5;
      s.ball.vx = hit * 8;
    }

    // Ball falls below
    if (s.ball.y > CANVAS_H + 20) {
      s.lives--;
      if (s.lives <= 0) {
        s.gameOver = true;
        setDisplay(d => ({ ...d, gameOver: true, lives: 0 }));
      } else {
        s.ball = { x: CANVAS_W / 2, y: CANVAS_H - 80, vx: BALL_SPEED, vy: -BALL_SPEED };
        setDisplay(d => ({ ...d, lives: s.lives }));
      }
    }

    // Brick collisions
    s.bricks.forEach(b => {
      if (!b.alive) return;
      if (s.ball.x > b.x - BALL_SIZE && s.ball.x < b.x + BRICK_W + BALL_SIZE &&
          s.ball.y > b.y - BALL_SIZE && s.ball.y < b.y + BRICK_H + BALL_SIZE) {
        b.alive = false;
        s.ball.vy = -s.ball.vy;
        s.score += 10;
        setDisplay(d => ({ ...d, score: s.score }));
      }
    });

    // Win check
    if (s.bricks.every(b => !b.alive)) {
      s.won = true;
      setDisplay(d => ({ ...d, won: true, score: s.score }));
    }

    draw();
  }, [draw]);

  useEffect(() => {
    const loop = () => {
      gameLoop();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [gameLoop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === ' ' || e.key === 'Enter') stateRef.current.started = true;
      e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKeyUp); };
  }, []);

  const reset = () => {
    stateRef.current = {
      ball: { x: CANVAS_W / 2, y: CANVAS_H - 80, vx: BALL_SPEED, vy: -BALL_SPEED },
      paddle: { x: CANVAS_W / 2 - PADDLE_W / 2 },
      bricks: initBricks(),
      score: 0, lives: 3, started: false, gameOver: false, won: false,
    };
    setDisplay({ score: 0, lives: 3, gameOver: false, won: false, started: false });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px', background: '#c0c0c0', height: '100%', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '20px', fontFamily: 'Arial', fontSize: '13px', alignItems: 'center' }}>
        <span>Score: <strong>{display.score}</strong></span>
        <span>Lives: {'❤️'.repeat(Math.max(0, display.lives))}</span>
        <button onClick={reset} style={{ padding: '2px 12px', cursor: 'pointer', fontSize: '12px' }}>New Game</button>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ border: '4px solid', borderColor: '#808080 #fff #fff #808080', cursor: 'none' }}
        onClick={() => { stateRef.current.started = true; }}
        onMouseMove={(e) => {
          const rect = canvasRef.current!.getBoundingClientRect();
          stateRef.current.paddle.x = Math.max(0, Math.min(CANVAS_W - PADDLE_W * 6, e.clientX - rect.left - PADDLE_W * 3));
        }}
      />
      <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>
        Break all the blocks. "Just like the existing financial system." — S
      </div>
    </div>
  );
}

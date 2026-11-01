import React, { useRef, useState, useEffect } from 'react';

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '12px', fontFamily: 'Arial' }}>
      <div style={{ 
        background: '#c0c0c0', 
        padding: '4px', 
        borderBottom: '2px solid #808080',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => setTool('brush')}
          style={{ 
            background: tool === 'brush' ? '#000080' : '#c0c0c0',
            color: tool === 'brush' ? '#fff' : '#000',
            padding: '4px 8px',
            border: '2px solid',
            borderColor: '#fff #808080 #808080 #fff',
            cursor: 'pointer'
          }}
        >
          🖌️ Brush
        </button>
        <button 
          onClick={() => setTool('eraser')}
          style={{ 
            background: tool === 'eraser' ? '#000080' : '#c0c0c0',
            color: tool === 'eraser' ? '#fff' : '#000',
            padding: '4px 8px',
            border: '2px solid',
            borderColor: '#fff #808080 #808080 #fff',
            cursor: 'pointer'
          }}
        >
          🧹 Eraser
        </button>
        <div style={{ width: '1px', height: '20px', background: '#808080' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Color:
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '30px', height: '20px', cursor: 'pointer' }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Size:
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ width: '60px' }}
          />
          {brushSize}px
        </label>
        <div style={{ flex: 1 }} />
        <button 
          onClick={clearCanvas}
          style={{ 
            padding: '4px 12px',
            border: '2px solid',
            borderColor: '#fff #808080 #808080 #fff',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', background: '#808080', padding: '4px' }}>
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ 
            background: '#fff', 
            cursor: 'crosshair',
            display: 'block'
          }}
        />
      </div>
      <div style={{ 
        background: '#c0c0c0', 
        padding: '4px 8px', 
        borderTop: '2px solid #fff',
        fontSize: '11px',
        color: '#000'
      }}>
        MS Paint (Win98 Edition) - Draw your masterpiece. Warning: Save not implemented (it's 1998, what did you expect?)
      </div>
    </div>
  );
}

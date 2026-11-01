import React, { useState } from 'react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const [satoshiMode, setSatoshiMode] = useState(false);

  const append = (val: string) => {
    setDisplay(d => {
      if (fresh) { setFresh(false); return val; }
      if (d === '0' && val !== '.') return val;
      if (val === '.' && d.includes('.')) return d;
      return d.length < 13 ? d + val : d;
    });
  };

  const operate = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op) {
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
      
      // Easter egg: If result is 21000000 or 21,000,000
      if (result === 21000000) {
        setSatoshiMode(true);
        setTimeout(() => setSatoshiMode(false), 4000);
      }
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const equals = () => {
    if (prev === null || !op) return;
    const current = parseFloat(display);
    const result = calculate(prev, current, op);
    
    if (isNaN(result) || !isFinite(result)) {
      setDisplay('ERROR: Cannot divide by zero\n(Like you cannot spend what you do not own.\nThis is the double-spend problem.)');
      setSatoshiMode(true);
      setPrev(null); setOp(null); setFresh(true);
      return;
    }
    
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
    
    if (result === 21000000) setSatoshiMode(true);
  };

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setFresh(true); setSatoshiMode(false); };

  const btn = (label: string, action: () => void, color?: string) => (
    <button
      onClick={action}
      style={{
        height: '32px',
        background: color || '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #808080 #808080 #fff',
        fontFamily: 'Arial',
        fontSize: '13px',
        fontWeight: color ? 'bold' : 'normal',
        cursor: 'pointer',
        color: color === '#cc0000' ? '#fff' : '#000',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: '8px', background: '#c0c0c0', display: 'flex', flexDirection: 'column', gap: '4px', userSelect: 'none' }}>
      {satoshiMode && (
        <div style={{ background: '#ffe', border: '1px solid #cc0', padding: '4px 6px', fontSize: '10px', fontFamily: 'monospace', color: '#440' }}>
          🔮 {display === '21000000' || parseFloat(display) === 21000000
            ? 'You found the magic number. The maximum supply of Bitcoin is 21,000,000 BTC.\nCoincidence? Satoshi says no. — S'
            : 'Division by zero is not permitted.\nNeither is spending Bitcoin you do not own.\nThis is not a coincidence.'}
        </div>
      )}

      {/* Display */}
      <div style={{
        background: '#e8ffe8',
        border: '2px inset #808080',
        padding: '4px 8px',
        fontFamily: '"Courier New", monospace',
        textAlign: 'right',
        minHeight: '28px',
        overflow: 'hidden',
        wordBreak: 'break-all',
        fontSize: display.length > 13 ? '10px' : '16px',
      }}>
        {display}
      </div>

      {/* Memory indicator */}
      <div style={{ display: 'flex', gap: '4px', fontSize: '10px' }}>
        {['MC', 'MR', 'MS', 'M+'].map(m => (
          <button key={m} style={{ flex: 1, padding: '2px', background: '#c0c0c0', border: '1px solid #808080', fontSize: '10px', cursor: 'pointer', color: '#666' }}>{m}</button>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px' }}>
        {btn('Back', () => setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0'))}
        {btn('CE', clear)}
        {btn('C', clear, '#c0a000')}
        {btn('±', () => setDisplay(d => String(-parseFloat(d))))}
        {btn('√', () => setDisplay(d => String(Math.sqrt(parseFloat(d)))))}

        {btn('7', () => append('7'))}
        {btn('8', () => append('8'))}
        {btn('9', () => append('9'))}
        {btn('/', () => operate('/'), '#ddd')}
        {btn('%', () => setDisplay(d => String(parseFloat(d) / 100)))}

        {btn('4', () => append('4'))}
        {btn('5', () => append('5'))}
        {btn('6', () => append('6'))}
        {btn('*', () => operate('*'), '#ddd')}
        {btn('1/x', () => setDisplay(d => String(1 / parseFloat(d))))}

        {btn('1', () => append('1'))}
        {btn('2', () => append('2'))}
        {btn('3', () => append('3'))}
        {btn('-', () => operate('-'), '#ddd')}
        <div style={{ gridRow: 'span 2' }}>
          {btn('=', equals, '#00aa00')}
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          {btn('0', () => append('0'))}
        </div>
        {btn('.', () => append('.'))}
        {btn('+', () => operate('+'), '#ddd')}
      </div>

      <div style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace', textAlign: 'center', marginTop: '4px' }}>
        Tip: Type 21000000 = for a surprise
      </div>
    </div>
  );
}

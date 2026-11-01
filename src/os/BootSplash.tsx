import React, { useEffect, useState } from 'react';
import { useOSStore } from '../store/osStore';

export function BootSplash() {
  const setBootStage = useOSStore((s) => s.setBootStage);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [10, 25, 40, 55, 68, 79, 88, 95, 100];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        setTimeout(() => setBootStage('login'), 400);
        return;
      }
      setProgress(steps[i++]);
      setTimeout(tick, 280);
    };
    setTimeout(tick, 200);
  }, [setBootStage]);

  return (
    <div style={{
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '32px',
    }}>
      {/* Windows 98 logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {/* 4-color Windows flag */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', width: '72px', height: '72px' }}>
          <div style={{ background: '#f00', borderRadius: '2px 0 0 0' }} />
          <div style={{ background: '#0f0', borderRadius: '0 2px 0 0' }} />
          <div style={{ background: '#00f', borderRadius: '0 0 0 2px' }} />
          <div style={{ background: '#ff0', borderRadius: '0 0 2px 0' }} />
        </div>
        <div style={{
          color: '#fff',
          fontFamily: '"Microsoft Sans Serif", Arial, sans-serif',
          fontSize: '28px',
          fontWeight: 'normal',
          letterSpacing: '1px',
        }}>
          Windows<span style={{ fontSize: '14px', verticalAlign: 'super', marginLeft: '4px' }}>98</span>
        </div>
        <div style={{ color: '#aaa', fontSize: '12px', fontFamily: 'serif', fontStyle: 'italic' }}>
          Second Edition
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '220px',
        height: '10px',
        border: '1px solid #555',
        background: '#111',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(to right, #00f, #44f)',
          transition: 'width 0.25s ease',
        }} />
      </div>

      <div style={{ color: '#555', fontSize: '11px', fontFamily: 'monospace' }}>
        Starting Windows 98...
      </div>
    </div>
  );
}

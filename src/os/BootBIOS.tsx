import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/osStore';

const BIOS_LINES = [
  'Award Software BIOS v4.51PG',
  'Copyright (C) 1984-1998, Award Software Inc.',
  '',
  'ASUS P2B BIOS v1.06',
  'Checking NVRAM...',
  '',
  'Pentium II Processor at 233MHz',
  'Memory Test: 65536K OK',
  '',
  'IDE Primary Master : ST310014A (10GB)',
  'IDE Primary Slave  : None',
  'IDE Secondary Master: GENERIC CD-ROM 32X',
  '',
  'Detecting HDD Primary Master ... LBA, UDMA 2, 10245MB OK',
  '',
  'Loading... Windows 98 Second Edition',
  '',
  '⚠  WARNING: Blockchain partition detected.',
  '⚠  This partition is not supported.',
  '⚠  Booting anyway because we are brave.',
  '',
  'Press DEL to enter SETUP',
  '(nobody presses DEL here)',
];

const BIOS_SPEEDS = [
  30, 30, 10, 30, 20, 20, 30, 30, 10,
  30, 20, 20, 10, 30, 10, 30, 10, 30, 20, 20, 10, 30, 20,
];

export function BootBIOS() {
  const setBootStage = useOSStore((s) => s.setBootStage);
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const addLine = () => {
      if (i >= BIOS_LINES.length) {
        timer = setTimeout(() => setBootStage('splash'), 500);
        return;
      }
      const line = BIOS_LINES[i];
      setLines((prev) => [...prev, line]);
      const delay = BIOS_SPEEDS[i] || 80;
      i++;
      timer = setTimeout(addLine, delay);
    };
    timer = setTimeout(addLine, 300);

    // Skip boot on any key press for demo
    const handleSkip = () => {
      setBootStage('splash');
    };
    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [setBootStage]);

  return (
    <div style={{
      background: '#000',
      color: '#aaa',
      fontFamily: 'monospace',
      fontSize: '14px',
      padding: '24px',
      height: '100vh',
      boxSizing: 'border-box',
      overflowY: 'hidden',
    }}>
      {lines.map((line, idx) => (
        <div key={idx} style={{
          color: line.startsWith('⚠') ? '#ff0' : line.startsWith('Award') || line.startsWith('ASUS') ? '#fff' : '#aaa',
          marginBottom: '1px',
        }}>
          {line}
        </div>
      ))}
      <span style={{ animation: 'blink 1s step-start infinite', color: '#aaa' }}>_</span>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useOSStore } from '../store/osStore';
import { StartMenu } from './StartMenu';

const CLIPPY_MESSAGES = [
  "It looks like you're inventing money. Would you like help hiding your identity?",
  "It looks like you're being judged. Want help losing? I've seen judges; I know what they like.",
  "It looks like you're opening too many windows. Have you considered becoming anonymous?",
  "Hello! I see you found this PC. The owner won't be back. Probably.",
  "It looks like you're reading a diary. That's okay. The diary reader is the real Satoshi.",
  "It looks like you're procrastinating. Same. That's how Bitcoin was invented, actually.",
  "Did you try turning it off and on again? No? Good. Don't.",
  "It looks like you need help. Don't worry. So does the global financial system.",
  "Your GPA and your mining yield have something in common: both approaching zero.",
  "Fun fact: The genesis block was mined at 18:15:05 UTC on January 3, 2009. You're welcome.",
];

function TrayItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div title={label} style={{
      padding: '0 6px',
      fontSize: '11px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'default',
      borderLeft: '1px solid #808080',
    }}>
      {children}
    </div>
  );
}

export function Taskbar() {
  const {
    windows, startOpen, setStartOpen, focusWindow, minimizeWindow,
    openWindow, showClipy, clippyVisible,
  } = useOSStore();

  const [time, setTime] = useState(new Date());
  const [btc, setBtc] = useState('$0.00');
  const [clippyRotation, setClippyRotation] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Fake BTC price that "fluctuates" around $0.00 humorously
  useEffect(() => {
    const prices = [
      '$0.00', '$0.00', '$0.00', '$0.00', '$0.00',
      '$0.01', '$0.00', '$0.00', '$0.00', '$0.00',
      '$0.00', '$0.00', '$0.00', '-$0.01', '$0.00',
    ];
    let i = 0;
    const tick = setInterval(() => {
      setBtc(prices[i % prices.length]);
      i++;
    }, 3000);
    return () => clearInterval(tick);
  }, []);

  // Clippy random appearances
  useEffect(() => {
    const show = () => {
      const msg = CLIPPY_MESSAGES[Math.floor(Math.random() * CLIPPY_MESSAGES.length)];
      showClipy(msg);
      setClippyRotation(r => r + 360);
    };
    const initial = setTimeout(show, 8000);
    const recurring = setInterval(show, 45000);
    return () => { clearTimeout(initial); clearInterval(recurring); };
  }, [showClipy]);

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
      <div
        id="taskbar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          background: '#c0c0c0',
          borderTop: '2px solid #fff',
          display: 'flex',
          alignItems: 'center',
          zIndex: 10000,
          gap: '2px',
          padding: '0 2px',
        }}
      >
        {/* Start Button */}
        <button
          id="start-button"
          onClick={() => setStartOpen(!startOpen)}
          style={{
            height: '26px',
            padding: '0 8px',
            background: startOpen ? '#a0a0a0' : '#c0c0c0',
            border: '2px solid',
            borderColor: startOpen ? '#808080 #fff #fff #808080' : '#fff #808080 #808080 #fff',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', width: '16px', height: '16px' }}>
            <div style={{ background: '#f00', borderRadius: '1px 0 0 0' }} />
            <div style={{ background: '#0f0', borderRadius: '0 1px 0 0' }} />
            <div style={{ background: '#00f', borderRadius: '0 0 0 1px' }} />
            <div style={{ background: '#ff0', borderRadius: '0 0 1px 0' }} />
          </div>
          <strong>Start</strong>
        </button>

        {/* Separator */}
        <div style={{ width: '2px', height: '22px', background: '#808080', borderRight: '1px solid #fff', marginRight: '2px' }} />

        {/* Window buttons */}
        <div style={{ display: 'flex', gap: '2px', flex: 1, overflowX: 'auto', alignItems: 'center' }}>
          {windows.map((win) => (
            <button
              key={win.id}
              title={win.title}
              onClick={() => {
                if (win.minimized) focusWindow(win.id);
                else if (win.focused) minimizeWindow(win.id);
                else focusWindow(win.id);
              }}
              style={{
                height: '26px',
                minWidth: '120px',
                maxWidth: '180px',
                padding: '0 8px',
                background: win.focused && !win.minimized ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: win.focused && !win.minimized
                  ? '#808080 #fff #fff #808080'
                  : '#fff #808080 #808080 #fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {win.title}
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '28px',
          border: '2px inset #808080',
          background: '#c0c0c0',
          padding: '0 4px',
          gap: '4px',
          flexShrink: 0,
          fontSize: '11px',
          fontFamily: 'Arial, sans-serif',
        }}>
          {/* BTC ticker */}
          <TrayItem label="Bitcoin Price (1998)">
            <span style={{
              fontFamily: 'monospace',
              color: btc === '$0.00' || btc === '-$0.01' ? '#666' : '#008000',
              fontWeight: 'bold',
            }}>
              ₿ {btc}
            </span>
          </TrayItem>

          {/* Speaker icon */}
          <TrayItem label="Volume">🔊</TrayItem>

          {/* Network */}
          <TrayItem label="Dial-up Connection">🌐</TrayItem>

          {/* Clock */}
          <TrayItem label={time.toLocaleDateString()}>
            <span style={{ fontFamily: 'Arial', fontSize: '11px' }}>{timeStr}</span>
          </TrayItem>
        </div>
      </div>

      {/* Start Menu */}
      {startOpen && <StartMenu />}
    </>
  );
}

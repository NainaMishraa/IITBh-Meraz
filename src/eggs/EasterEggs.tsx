import React, { useEffect, useRef, useState } from 'react';
import { useOSStore } from '../store/osStore';

// All Easter egg components and system overlays

// BSOD
export function BSOD() {
  const { dismissBSOD } = useOSStore();
  const [rebooting, setRebooting] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!rebooting) {
        setRebooting(true);
        setTimeout(() => dismissBSOD(), 2500);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [rebooting, dismissBSOD]);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0000AA', color: '#fff',
      fontFamily: '"Lucida Console", monospace', fontSize: '14px',
      padding: '40px', zIndex: 99999, overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <p style={{ background: '#aaa', color: '#0000AA', padding: '4px 8px', display: 'inline-block', fontSize: '16px', fontWeight: 'bold' }}>
          Windows
        </p>
        <br /><br />

        <p>A fatal exception <strong>0E</strong> has occurred at <strong>0028:C0011E36</strong> in VxD
        <strong> BLOCKCHAIN(01) + 00010E36</strong>. The current application will be terminated.</p>

        <br />
        <p>* Press any key to terminate the current application.</p>
        <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
        <br />
        <p style={{ color: '#ff8' }}>Press any key to continue <span style={{ animation: 'blink 1s step-start infinite' }}>_</span></p>

        <br /><br />
        <div style={{ border: '1px solid #aaa', padding: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '12px' }}>
          <strong>Error Details:</strong><br />
          Exception: 0x0000DEAD — BLOCKCHAIN_NOT_FOUND<br />
          Module: SATOSHI.EXE version 0.0.1 (alpha)<br />
          Description: The mining operation encountered an unrecoverable state.<br />
          <br />
          Probable cause: No one else is running this software.<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(The network needs more nodes.)<br />
          <br />
          Additional info: Your GPA was also found corrupted during scan.<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21,000,000 fragments defragmented.<br />
          <br />
          🤔 Technical note from Satoshi: "This is fine. The protocol will recover.<br />
          &nbsp;&nbsp;&nbsp;Bitcoin is more fault-tolerant than this dialog implies.<br />
          &nbsp;&nbsp;&nbsp;Trust the math."
        </div>

        {rebooting && (
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '16px', color: '#ff0' }}>
            Rebooting... Please stand by...<br />
            <span style={{ fontSize: '12px', color: '#aaa' }}>
              (Satoshi will return. He always returns. That's the whole thing.)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Clippy - Satoshi-bot
export function Clippy() {
  const { clippyVisible, clippyMessage, hideClipy, openWindow, showClipy } = useOSStore();
  const [position, setPosition] = useState({ x: window.innerWidth - 200, y: window.innerHeight - 180 });
  const [typing, setTyping] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (clippyVisible && clippyMessage) {
      setDone(false);
      setTyping('');
      let i = 0;
      const interval = setInterval(() => {
        setTyping(clippyMessage.slice(0, i + 1));
        i++;
        if (i >= clippyMessage.length) { clearInterval(interval); setDone(true); }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [clippyVisible, clippyMessage]);

  if (!clippyVisible) return null;

  return (
    <div style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 50000 }}>
      {/* Speech bubble */}
      <div style={{
        background: '#ffffd0',
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '10px 12px',
        maxWidth: '260px',
        fontSize: '12px',
        fontFamily: 'Arial',
        boxShadow: '3px 3px 8px rgba(0,0,0,0.3)',
        position: 'relative',
        marginBottom: '8px',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#000080' }}>💡 Satoshi-bot</div>
        <div style={{ lineHeight: 1.4 }}>{typing}</div>
        {done && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={hideClipy}
              style={{ padding: '2px 8px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Arial' }}
            >
              Yes, please!
            </button>
            <button
              onClick={hideClipy}
              style={{ padding: '2px 8px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Arial' }}
            >
              No thanks
            </button>
            <button
              onClick={() => {
                showClipy("It looks like you dismissed me. Don't worry. I'll be back. I'm like Bitcoin. Hard to get rid of.");
              }}
              style={{ padding: '2px 8px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Arial' }}
            >
              Go away forever
            </button>
          </div>
        )}
        {/* Bubble tail */}
        <div style={{
          position: 'absolute', bottom: '-12px', left: '20px',
          width: 0, height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '12px solid #333',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10px', left: '21px',
          width: 0, height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: '11px solid #ffffd0',
        }} />
      </div>

      {/* Clippy character - ASCII art paperclip */}
      <div style={{
        fontSize: '36px', textAlign: 'center', cursor: 'move',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))',
        userSelect: 'none',
      }}
        title="Satoshi-bot (It's not Clippy. Clippy is trademarked.)"
      >
        📎
      </div>
    </div>
  );
}

// Mining Screensaver
export function Screensaver() {
  const { setScreensaver } = useOSStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [btcMined, setBtcMined] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '0123456789abcdef';
    const hashes: Array<{ x: number; y: number; speed: number; hash: string; opacity: number }> = [];

    for (let i = 0; i < 80; i++) {
      hashes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 3,
        hash: Array(64).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(''),
        opacity: 0.3 + Math.random() * 0.7,
      });
    }

    const tick = setInterval(() => {
      setBtcMined(b => b + 0.00000001);
    }, 100);

    let raf: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hashes.forEach(h => {
        h.y += h.speed;
        if (h.y > canvas.height + 20) { h.y = -20; h.x = Math.random() * canvas.width; }
        h.hash = Array(64).fill(0).map((_, i) =>
          Math.random() < 0.03 ? chars[Math.floor(Math.random() * chars.length)] : h.hash[i]
        ).join('');

        ctx.fillStyle = `rgba(0, 255, 0, ${h.opacity})`;
        ctx.font = '11px monospace';
        ctx.fillText(h.hash.slice(0, 16) + '...', h.x, h.y);
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); clearInterval(tick); };
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99998, background: '#000', cursor: 'none' }}
      onClick={() => setScreensaver(false)}
      onMouseMove={() => setScreensaver(false)}
      onKeyDown={() => setScreensaver(false)}
      tabIndex={0}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      <div style={{
        position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
        color: '#0f0', fontFamily: 'monospace', fontSize: '16px', textAlign: 'center',
        textShadow: '0 0 10px #0f0',
      }}>
        <div>⛏ Mining BTC... Block #0 in progress</div>
        <div style={{ fontSize: '13px', marginTop: '4px' }}>
          Mined: {btcMined.toFixed(8)} BTC (${(btcMined * 0).toFixed(2)})
        </div>
        <div style={{ fontSize: '11px', marginTop: '8px', color: '#666' }}>
          Move mouse or click to wake
        </div>
      </div>
    </div>
  );
}

// Virus popup
export function VirusPopup({ id, onClose }: { id: string; onClose: () => void }) {
  const { addVirusPopup } = useOSStore();
  const [pos] = useState({
    x: 100 + Math.random() * 400,
    y: 100 + Math.random() * 200,
  });

  const handleClose = () => {
    // Spawn 2 more!
    addVirusPopup(`virus-${Date.now()}-a`);
    addVirusPopup(`virus-${Date.now()}-b`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      left: pos.x, top: pos.y,
      background: '#c0c0c0',
      border: '2px solid', borderColor: '#fff #808080 #808080 #fff',
      boxShadow: '4px 4px 0 #000',
      zIndex: 60000,
      width: '320px',
      fontFamily: 'Arial',
    }}>
      <div style={{ background: 'linear-gradient(to right, #000080, #1084d0)', color: '#fff', padding: '3px 6px', fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
        <span>🎉 Congratulations!</span>
        <button onClick={handleClose} style={{ background: '#c0c0c0', border: '1px solid', borderColor: '#fff #808080 #808080 #fff', width: '16px', height: '14px', fontSize: '10px', cursor: 'pointer', lineHeight: '12px' }}>✕</button>
      </div>
      <div style={{ padding: '12px', fontSize: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '20px', marginBottom: '8px' }}>🏆🎊</div>
        <div style={{ fontWeight: 'bold', color: '#cc0000', marginBottom: '4px' }}>
          YOU ARE THE 1,000,000TH VISITOR!
        </div>
        <div style={{ marginBottom: '8px' }}>
          You have been selected to receive <strong>50 BTC</strong>!<br />
          <span style={{ fontSize: '10px', color: '#666' }}>(Bitcoin does not exist yet but we are very confident)</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={handleClose} style={{ padding: '4px 12px', cursor: 'pointer', background: '#00a000', color: '#fff', border: '2px solid', borderColor: '#00c000 #005000 #005000 #00c000', fontWeight: 'bold' }}>
            CLAIM 50 BTC!!!
          </button>
          <button onClick={handleClose} style={{ padding: '4px 12px', cursor: 'pointer' }}>
            Close
          </button>
        </div>
        <div style={{ fontSize: '9px', color: '#888', marginTop: '6px' }}>
          Closing this window spawns more windows. That's the joke.
        </div>
      </div>
    </div>
  );
}

// Konami Code celebration
export function GenesisBlock() {
  const { setKonami } = useOSStore();

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', zIndex: 88888,
      fontFamily: 'monospace', color: '#0f0',
    }}
      onClick={() => setKonami(false)}
    >
      <div style={{ fontSize: '24px', marginBottom: '16px', textShadow: '0 0 20px #0f0' }}>
        🧬 GENESIS BLOCK FOUND
      </div>
      <div style={{ fontSize: '13px', maxWidth: '600px', textAlign: 'left', lineHeight: '1.8' }}>
        <div>Block: #0</div>
        <div>Hash: 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f</div>
        <div>Time: 2009-01-03 18:15:05 UTC</div>
        <div>Coinbase: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"</div>
        <div>Reward: 50 BTC (value: $0.00)</div>
        <div style={{ marginTop: '16px', color: '#0a0' }}>Miner: Anonymous</div>
        <div style={{ color: '#0a0' }}>Identity: [REDACTED BY CHOICE]</div>
        <div style={{ color: '#0a0' }}>Alias: Satoshi Nakamoto</div>
        <div style={{ color: '#0a0' }}>Real name: ¯\_(ツ)_/¯</div>
        <br />
        <div style={{ color: '#ff0', marginTop: '8px' }}>
          identity_reveal.txt found! Opening...
        </div>
        <div style={{ marginTop: '8px', background: 'rgba(0,0,0,0.5)', padding: '12px', border: '1px solid #0f0' }}>
          <strong>IDENTITY REVEALED:</strong><br />
          Satoshi Nakamoto is...<br />
          <br />
          ...a person.<br />
          <br />
          A person who invented Bitcoin.<br />
          <br />
          That is all we know.<br />
          <br />
          Thank you for entering the Konami code.<br />
          You have earned nothing except this message.<br />
          Which is, in the spirit of Bitcoin, enough.
        </div>
      </div>
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Click anywhere to close
      </div>
    </div>
  );
}

// Run Dialog
export function RunDialog() {
  const { openWindow, triggerBSOD, setScreensaver, showClipy, closeWindow } = useOSStore();
  const [cmd, setCmd] = useState('');
  const [winId] = useState(() => '');

  const RUN_SECRETS: Record<string, () => void> = {
    hack: () => {
      setScreensaver(true);
    },
    latent: () => {
      showClipy("Latent command activated. Latently. You won't notice anything happening. That's the point. — S");
    },
    bitcoin: () => {
      openWindow('notepad', 'bitcoin.exe — Output', {
        content: `C:\\> bitcoin.exe
Initializing Bitcoin protocol...
Loading genesis block...
Connecting to network...
Peers found: 0
Peers connected: 0

Note: You are the only node.
This is technically a blockchain.
It is also technically useless.
But it is YOURS.

Run this in 2009 and try again.
The network will be bigger then.
I promise.

-- S

Process exited with code: 0 (success)
(Moral success, anyway.)`
      }, 440, 280);
    },
    satoshi: () => {
      openWindow('notepad', 'Who is Satoshi?', {
        content: `WHO IS SATOSHI NAKAMOTO?
=========================

Theories:
1. A Japanese cryptographer
2. A European programmer
3. Nick Szabo (he denies it)
4. Hal Finney (he denies it)
5. Adam Back (he denies it)
6. Wei Dai (he denies it)
7. A team of people
8. An AI from the future

Evidence pointing to identity: None.
Evidence pointing away from identity: Also none.

Most likely answer: It doesn't matter.
Bitcoin works without knowing who built it.
That was the whole point.

"I am Satoshi Nakamoto." — Everyone has said this
"I am not Satoshi Nakamoto." — Satoshi has said this
"I am not going to say either way." — Also Satoshi

Conclusion: 🤷`
      }, 480, 320);
    },
    hodl: () => {
      openWindow('notepad', 'HODL.txt', {
        content: `HOLD ON FOR DEAR LIFE
=====================
(Origin of "HODL": 2013 Bitcoin forum post, typo of "HOLD")
(Satoshi never used this word. He left before 2013.)
(He would have appreciated the typo though.)

Current portfolio value: $0.00
Coins held: ~1,000,000 BTC
Strategy: HODL
Alternative: Sell for pizza (10,000 BTC for 2 pizzas)

Decision: HODL
Reasoning: The math is correct.
The world will catch up to the math.
Eventually.

Predicted timeline:
2009: First real transaction
2010: Pizza (too expensive in retrospect)  
2011: $1 parity (wow)
2017: $20,000 (no one expected this)
2021: $60,000 (no one expected this either)
2???: Nobody knows

-- S (written in ~2001, found in drafts)`
      }, 440, 340);
    },
    pizza: () => {
      openWindow('notepad', 'pizza.txt', {
        content: `PIZZA INCIDENT ANALYSIS
========================
Date: May 22, 2010 (not yet occurred as of this writing)

Someone (not me) will eventually trade 10,000 BTC
for two pizzas.

Current value of 10,000 BTC: $0.00
Value of two pizzas: ~$25.00

This will be the first real-world Bitcoin transaction.
It will be celebrated as "Bitcoin Pizza Day."
The pizzas will be delicious.
The financial hangover will be historic.

I have a draft email in my Sent folder where I 
almost offered 10,000 BTC for pizza.
I deleted it.
I had crackers instead.

In hindsight: correct decision.
In hindsight from 2021: very correct decision.

Current status of my pizza fund: Crackers only.
-- S`
      }, 440, 340);
    },
    iitbhilai: () => {
      openWindow('notepad', 'IIT Bhilai Secret', {
        content: `IIT BHILAI SECRET MESSAGE
===========================

Congratulations on finding this Easter egg.
You have demonstrated:
✓ Curiosity
✓ Persistence  
✓ A willingness to type things into a fake OS
✓ Excellent taste in hackathons

Satoshi Nakamoto would have attended IIT Bhilai
had it existed in 1997.

He would have majored in:
- CSE (obviously)
- Minor in "Not telling anyone what you're working on"

He would have won the hackathon.
He would have submitted anonymously.
The judges would have been confused.
He would have been okay with that.

Go win. — S

P.S. The Gandhi Hackathon is aptly named.
"Be the change you want to see in the blockchain."
-- also Gandhi (paraphrased)`
      }, 500, 380);
    },
    crash: () => {
      triggerBSOD();
    },
    matrix: () => {
      setScreensaver(true);
    },
  };

  const run = () => {
    const normalized = cmd.toLowerCase().trim();
    const secret = RUN_SECRETS[normalized];
    if (secret) {
      secret();
    } else if (normalized === 'cmd' || normalized === 'command') {
      openWindow('notepad', 'MS-DOS Prompt', {
        content: `Microsoft(R) Windows 98 Command Prompt
Copyright (C) Microsoft Corp 1981-1998.

C:\\WINDOWS>

This is a fake command prompt.
You can't actually type commands here.
This is a metaphor for decentralization:
you think you have control, but the system
was designed without a central authority.

C:\\WINDOWS> dir /s
Volume in drive C has no label.
Files: 21,000,000
Folders: 1 (the blockchain)
Hidden files: your identity

C:\\WINDOWS> _`
      }, 520, 360);
    } else if (normalized === 'winver') {
      openWindow('about', 'About Windows', {}, 340, 200);
    } else if (normalized) {
      openWindow('notepad', `Error: ${cmd}`, {
        content: `Windows cannot find '${cmd}'.

Make sure you typed the name correctly, and then try again.
To search for a file, click the Start button, and then click Find.

Error code: 0x00000404 — NOT_SATOSHI_APPROVED

Try one of these instead:
• bitcoin
• satoshi  
• hodl
• pizza
• hack
• crash
• iitbhilai`
      }, 380, 280);
    }
  };

  return (
    <div style={{ padding: '12px', fontFamily: 'Arial', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '28px' }}>▶️</div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Run</div>
          <div style={{ color: '#444', fontSize: '11px' }}>
            Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <label>Open:</label>
        <input
          value={cmd}
          onChange={e => setCmd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          autoFocus
          style={{
            flex: 1, padding: '2px 6px', fontSize: '12px',
            border: '2px inset #808080',
          }}
          placeholder="Try: bitcoin, satoshi, hodl, pizza, crash..."
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={run} style={{ padding: '3px 16px', cursor: 'pointer', fontSize: '12px' }}>OK</button>
        <button style={{ padding: '3px 16px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
        <button style={{ padding: '3px 16px', cursor: 'pointer', fontSize: '12px' }}>Browse...</button>
      </div>
    </div>
  );
}

// Task Manager
export function TaskManager() {
  return (
    <div style={{ fontFamily: 'Arial', fontSize: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid #808080', padding: '2px 4px', display: 'flex', gap: '12px', background: '#c0c0c0' }}>
        {['File', 'Options', 'View', 'Help'].map(m => (
          <span key={m} style={{ cursor: 'default', padding: '1px 4px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
            {m}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #808080' }}>
        {['Applications', 'Processes', 'Performance'].map((t, i) => (
          <div key={t} style={{
            padding: '4px 12px', cursor: 'default',
            background: i === 1 ? '#fff' : '#c0c0c0',
            border: '1px solid #808080',
            borderBottom: i === 1 ? 'none' : '1px solid #808080',
          }}>{t}</div>
        ))}
      </div>

      {/* Process list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#c0c0c0' }}>
              <th style={{ padding: '3px 8px', textAlign: 'left', borderBottom: '1px solid #808080' }}>Process Name</th>
              <th style={{ padding: '3px 8px', textAlign: 'right', borderBottom: '1px solid #808080' }}>PID</th>
              <th style={{ padding: '3px 8px', textAlign: 'right', borderBottom: '1px solid #808080' }}>CPU</th>
              <th style={{ padding: '3px 8px', textAlign: 'right', borderBottom: '1px solid #808080' }}>Mem Usage</th>
              <th style={{ padding: '3px 8px', textAlign: 'left', borderBottom: '1px solid #808080' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Overthinking.exe', pid: 1337, cpu: '94%', mem: '58,992K', status: 'Running (uncontrolled)' },
              { name: 'Anonymity.exe', pid: 2001, cpu: '3%', mem: '2,048K', status: 'Running (critically important)' },
              { name: 'Sleep.exe', pid: 0, cpu: '0%', mem: '0K', status: 'Not found (missing since 1997)' },
              { name: 'Bitcoin.exe', pid: 8008, cpu: '2%', mem: '1,024K', status: 'Alpha (not ready)' },
              { name: 'SocialLife.exe', pid: 404, cpu: '0%', mem: '256K', status: 'Suspended indefinitely' },
              { name: 'Eating.exe', pid: 100, cpu: '0%', mem: '512K', status: 'Occasional (crackers only)' },
              { name: 'DistractedByMath.exe', pid: 9999, cpu: '45%', mem: '32,768K', status: 'Always running' },
              { name: 'Mom_Guilt.exe', pid: 3001, cpu: '1%', mem: '8,192K', status: 'Background thread' },
              { name: 'Paranoia.sys', pid: 6969, cpu: '12%', mem: '16,384K', status: 'Running (healthy)' },
              { name: 'TrustNoOne.dll', pid: 1984, cpu: '8%', mem: '4,096K', status: 'Loaded by kernel' },
              { name: 'IdentityConceal.exe', pid: 0, cpu: '0%', mem: '0K', status: 'Invisible (working perfectly)' },
              { name: 'Whitepaper.doc', pid: 2008, cpu: '0%', mem: '128K', status: 'Draft (for 10 years)' },
              { name: 'Explorer.exe', pid: 1003, cpu: '1%', mem: '12,288K', status: 'Running' },
              { name: 'SATOSHI.EXE', pid: 21000000, cpu: '??%', mem: '??K', status: 'SYSTEM — do not terminate' },
            ].map((proc, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f5f5f5' }}>
                <td style={{ padding: '2px 8px', fontFamily: 'monospace', fontWeight: proc.name.includes('SATOSHI') ? 'bold' : 'normal', color: proc.status.includes('Not found') ? '#800' : proc.name.includes('SATOSHI') ? '#00a' : '#000' }}>{proc.name}</td>
                <td style={{ padding: '2px 8px', textAlign: 'right', fontFamily: 'monospace' }}>{proc.pid}</td>
                <td style={{ padding: '2px 8px', textAlign: 'right', color: proc.cpu === '94%' ? '#c00' : '#000' }}>{proc.cpu}</td>
                <td style={{ padding: '2px 8px', textAlign: 'right' }}>{proc.mem}</td>
                <td style={{ padding: '2px 8px', color: '#444', fontSize: '10px' }}>{proc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ borderTop: '2px inset #808080', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Processes: 14 | CPU Usage: 94% (mostly overthinking) | Mem: 64MB / 64MB</span>
        <button style={{ padding: '2px 12px', cursor: 'pointer', fontSize: '11px', color: '#800' }}>End Task</button>
      </div>
    </div>
  );
}

// Shutdown dialog
export function ShutdownDialog() {
  const { triggerBSOD, closeWindow, windows } = useOSStore();

  const handleShutdown = () => {
    const id = windows.find(w => w.appId === 'shutdown')?.id;
    if (id) closeWindow(id);
    setTimeout(() => triggerBSOD(), 500);
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'Arial', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '36px' }}>💻</div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>What do you want the computer to do?</div>
          <div style={{ color: '#666', fontSize: '11px' }}>
            (Satoshi's computer never actually shuts down. This is a known issue.)
          </div>
        </div>
      </div>

      <select style={{ padding: '4px', fontFamily: 'Arial', fontSize: '12px', border: '2px inset #808080' }}>
        <option>Shut down</option>
        <option>Restart</option>
        <option>Restart in MS-DOS mode</option>
        <option>Shut down and cry a little (Satoshi mode)</option>
      </select>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button onClick={handleShutdown} style={{ padding: '4px 20px', cursor: 'pointer', fontFamily: 'Arial', fontSize: '12px' }}>OK</button>
        <button onClick={() => { const id = windows.find(w => w.appId === 'shutdown')?.id; if (id) closeWindow(id); }} style={{ padding: '4px 20px', cursor: 'pointer', fontFamily: 'Arial', fontSize: '12px' }}>Cancel</button>
        <button style={{ padding: '4px 20px', cursor: 'pointer', fontFamily: 'Arial', fontSize: '12px' }}>Help</button>
      </div>

      <div style={{ fontSize: '10px', color: '#888', textAlign: 'center', fontFamily: 'monospace' }}>
        ⚠ Shutting down will trigger a BSOD. This is intentional. Trust the process.
      </div>
    </div>
  );
}

// About Windows
export function AboutWindows() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '48px', height: '48px', marginBottom: '8px' }}>
        <div style={{ background: '#f00', borderRadius: '2px 0 0 0' }} />
        <div style={{ background: '#0f0', borderRadius: '0 2px 0 0' }} />
        <div style={{ background: '#00f', borderRadius: '0 0 0 2px' }} />
        <div style={{ background: '#ff0', borderRadius: '0 0 2px 0' }} />
      </div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Microsoft Windows 98</div>
      <div>Second Edition</div>
      <div style={{ fontSize: '11px', color: '#666' }}>Version 4.10.2222 A</div>
      <hr style={{ width: '100%', border: 'none', borderTop: '1px solid #808080' }} />
      <div style={{ fontSize: '11px' }}>
        This product is licensed to:<br />
        <strong>Satoshi Nakamoto</strong><br />
        Anonymous Innovator<br />
        Serial #: 21-000-000-BTC
      </div>
      <div style={{ fontSize: '11px', color: '#666' }}>
        Physical Memory Available: 64 MB<br />
        Processor: Intel Pentium II 233MHz<br />
        Status: Overthinking things
      </div>
      <div style={{ fontSize: '10px', color: '#888', marginTop: '4px', fontFamily: 'monospace' }}>
        © 1981-1999 Microsoft Corporation. All rights reserved.
        (Bitcoin © Nobody. That's the point.)
      </div>
    </div>
  );
}

// Control Panel
export function ControlPanel() {
  const { wallpaper, setWallpaper, toggleCrt, crtMode } = useOSStore();

  const wallpapers = [
    { id: 'teal', label: 'Teal (Default)', color: '#008080' },
    { id: 'bitcoin', label: 'Bitcoin Orange', color: '#ff8c00' },
    { id: 'black', label: 'Matrix Black', color: '#001100' },
    { id: 'purple', label: 'Cypherpunk Purple', color: '#330033' },
    { id: 'navy', label: 'Deep Navy', color: '#000033' },
  ];

  return (
    <div style={{ padding: '12px', fontFamily: 'Arial', fontSize: '12px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>⚙️ Control Panel</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { icon: '🖥️', label: 'Display' },
          { icon: '🔊', label: 'Sounds' },
          { icon: '🖱️', label: 'Mouse' },
          { icon: '⌨️', label: 'Keyboard' },
          { icon: '📅', label: 'Date/Time' },
          { icon: '🌐', label: 'Internet' },
          { icon: '🔒', label: 'Passwords' },
          { icon: '📡', label: 'Modems' },
          { icon: '🖨️', label: 'Printers' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px', cursor: 'pointer', border: '1px solid transparent' }}
            onMouseEnter={e => (e.currentTarget.style.border = '1px dotted #000080', e.currentTarget.style.background = '#e0e8ff')}
            onMouseLeave={e => (e.currentTarget.style.border = '1px solid transparent', e.currentTarget.style.background = '')}>
            <div style={{ fontSize: '28px' }}>{item.icon}</div>
            <div style={{ fontSize: '11px', textAlign: 'center' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #808080' }} />

      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>🎨 Wallpaper / Desktop Color</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {wallpapers.map(w => (
            <div key={w.id}
              onClick={() => setWallpaper(w.id)}
              style={{
                width: '48px', height: '36px',
                background: w.color,
                border: wallpaper === w.id ? '3px solid #000080' : '2px solid #808080',
                cursor: 'pointer',
                borderRadius: '2px',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                paddingBottom: '2px',
              }}
              title={w.label}
            >
              {wallpaper === w.id && <span style={{ fontSize: '10px', color: '#fff' }}>✓</span>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
          Current: {wallpapers.find(w => w.id === wallpaper)?.label}
        </div>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>📺 Display Effects</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={crtMode} onChange={toggleCrt} />
          CRT Scanline Effect (authentic 1998 monitor simulation)
        </label>
        {crtMode && <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Scanlines enabled. Your eyes hurt slightly. This is authentic.</div>}
      </div>

      <div style={{ fontSize: '10px', color: '#888', fontFamily: 'monospace', marginTop: '12px' }}>
        System: SATOSHI-PC | Windows 98 SE 4.10.2222 A | 64MB RAM | Pentium II 233MHz
      </div>
    </div>
  );
}

// System Properties
export function SystemProperties() {
  return (
    <div style={{ fontFamily: 'Arial', fontSize: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #808080' }}>
        {['General', 'Device Manager', 'Hardware Profiles', 'Performance'].map((t, i) => (
          <div key={t} style={{ padding: '4px 12px', cursor: 'default', background: i === 0 ? '#c0c0c0' : '#a0a0a0', border: '1px solid #808080', borderBottom: i === 0 ? 'none' : '' }}>
            {t}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ fontSize: '48px' }}>💻</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>System:</div>
            <div>Microsoft Windows 98 Second Edition</div>
            <div style={{ fontSize: '11px', color: '#666' }}>4.10.2222 A</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #c0c0c0', paddingTop: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Registered to:</div>
          <div>Satoshi Nakamoto</div>
          <div style={{ color: '#666', fontSize: '11px' }}>Anonymous Innovator | Est. ????, ???</div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888' }}>Product ID: 21000-000-0000000-21000</div>
        </div>

        <div style={{ borderTop: '1px solid #c0c0c0', paddingTop: '12px', marginTop: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Computer:</div>
          <table style={{ fontSize: '11px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ paddingRight: '16px', paddingBottom: '4px' }}>Processor:</td><td>Intel Pentium II 233MHz</td></tr>
              <tr><td style={{ paddingRight: '16px', paddingBottom: '4px' }}>RAM:</td><td>64MB (all used by Overthinking.exe)</td></tr>
              <tr><td style={{ paddingRight: '16px', paddingBottom: '4px' }}>Hard Drive:</td><td>10GB (8.9GB used by drafts)</td></tr>
              <tr><td style={{ paddingRight: '16px', paddingBottom: '4px' }}>Blockchain:</td><td>1 block (the genesis block, mining solo)</td></tr>
              <tr><td style={{ paddingRight: '16px', paddingBottom: '4px' }}>Network:</td><td>56k dial-up (line often busy)</td></tr>
              <tr><td style={{ paddingRight: '16px' }}>GPA:</td><td>Classified. Definitely above 0.</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '12px', background: '#ffffd0', border: '1px solid #c0c000', padding: '6px 10px', fontSize: '11px' }}>
          ⚠ <strong>Warning:</strong> This system contains a revolutionary monetary protocol in draft form.
          Do not delete. Do not share. Do not tell anyone. But also... don't hide it forever.
          — S (note to self, 2001)
        </div>
      </div>
    </div>
  );
}

// Media Player (fake)
export function MediaPlayer() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [progress, setProgress] = useState(0);

  const tracks = [
    { name: 'Backstreet Boys - I Want It That Way.mp3', duration: '3:33' },
    { name: 'Mambo No. 5.mp3', duration: '3:52' },
    { name: 'Blockchain_Meditation_432hz.mp3', duration: '∞' },
    { name: 'Dial_Up_Handshake_Remix.wav', duration: '0:48' },
    { name: 'Hash_Of_The_Times.mp3', duration: '4:12' },
  ];

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 0.5);
    }, 300);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1a1a2e', color: '#0f0', fontFamily: 'monospace' }}>
      {/* Visualization */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: '48px', filter: playing ? 'drop-shadow(0 0 20px #0f0)' : 'none' }}>🎵</div>
        {playing && (
          <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '3px', alignItems: 'flex-end' }}>
            {Array(20).fill(0).map((_, i) => (
              <div key={i} style={{ width: '6px', background: '#0f0', height: `${8 + Math.random() * 32}px`, opacity: 0.8, transition: 'height 0.3s' }} />
            ))}
          </div>
        )}
      </div>

      {/* Track info */}
      <div style={{ padding: '6px 10px', background: '#0d0d1a', fontSize: '11px' }}>
        <div style={{ color: '#0f0', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tracks[track].name}
        </div>
        <div style={{ background: '#333', height: '4px', borderRadius: '2px' }}>
          <div style={{ background: '#0f0', height: '100%', width: `${progress}%`, borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '8px', background: '#0d0d1a', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => setTrack(t => (t - 1 + tracks.length) % tracks.length)} style={{ background: 'none', color: '#0f0', border: '1px solid #0f0', padding: '4px 10px', cursor: 'pointer', fontFamily: 'monospace' }}>⏮</button>
        <button onClick={() => { setPlaying(p => !p); setProgress(0); }} style={{ background: '#0f0', color: '#000', border: 'none', padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={() => setTrack(t => (t + 1) % tracks.length)} style={{ background: 'none', color: '#0f0', border: '1px solid #0f0', padding: '4px 10px', cursor: 'pointer', fontFamily: 'monospace' }}>⏭</button>
      </div>

      {/* Playlist */}
      <div style={{ background: '#0a0a1a', borderTop: '1px solid #0f0', maxHeight: '120px', overflow: 'auto' }}>
        {tracks.map((t, i) => (
          <div key={i} onDoubleClick={() => { setTrack(i); setPlaying(true); setProgress(0); }}
            style={{ padding: '3px 8px', cursor: 'default', background: track === i ? '#002200' : 'transparent', color: track === i ? '#0f0' : '#666', fontSize: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{i + 1}. {t.name}</span>
            <span style={{ marginLeft: '8px' }}>{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Image Viewer (placeholder with fun message)
export function ImageViewer({ filename }: { filename?: string }) {
  const IMAGES: Record<string, { desc: string; note: string }> = {
    'titanic_1997.jpg': { desc: 'RMS Titanic - Movie Poster 1997', note: 'Watched this 3 times. Cried once. Will deny it. — S' },
    'world_cup_1998.jpg': { desc: 'France vs Brazil - World Cup Final 1998', note: 'France won. The host country always wins. This is suspicious. — S' },
    'Y2K_countdown.jpg': { desc: 'Y2K Countdown Clock — 999 days to go', note: 'The irony of Y2K: civilization feared computers would fail at midnight. Meanwhile I was building a financial system ON computers. — S' },
    'tamagotchi_rip.jpg': { desc: 'My Tamagotchi. RIP. Age: 4 days.', note: 'I forgot to feed it. I was distracted by the Byzantine Generals problem. This is probably a metaphor.' },
    'NOT_me.jpg': { desc: '[Image corrupted or classified]', note: 'This is not a photo of me.\nI do not take photos.\nPhotos create records.\nRecords compromise anonymity.\n— S' },
    'me_before_the_internet.jpg': { desc: '[Recycle Bin — me_before_the_internet.jpg]', note: 'Filed for deletion: a photo of a person before they spent 4 years alone inventing money. The internet changed me. Mostly for the better.' },
  };

  const img = filename ? IMAGES[filename] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#808080', alignItems: 'center', justifyContent: 'center', padding: '12px', gap: '12px' }}>
      {/* Fake image display */}
      <div style={{ width: '280px', height: '200px', background: '#c0c0c0', border: '2px inset #808080', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '48px' }}>
          {filename?.includes('NOT_me') || filename?.includes('me_before') ? '🔲' : '🖼️'}
        </div>
        <div style={{ fontFamily: 'Arial', fontSize: '11px', textAlign: 'center', color: '#444', padding: '0 12px' }}>
          {img?.desc || filename || 'No image selected'}
        </div>
      </div>

      {img?.note && (
        <div style={{ background: '#ffffd0', border: '1px solid #808080', padding: '8px 12px', maxWidth: '320px', fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.4' }}>
          📝 <em>{img.note}</em>
        </div>
      )}

      <div style={{ fontFamily: 'Arial', fontSize: '11px', color: '#333' }}>
        {filename || 'Untitled'} | 640×480 | 24-bit color
      </div>
    </div>
  );
}

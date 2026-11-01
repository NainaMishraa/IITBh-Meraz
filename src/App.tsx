import React, { useEffect, useState, useRef } from 'react';
import { useOSStore, AppId } from './store/osStore';
import { Win98Window } from './os/Win98Window';
import { Desktop } from './os/Desktop';
import { Taskbar } from './os/Taskbar';
import { BootBIOS } from './os/BootBIOS';
import { BootSplash } from './os/BootSplash';
import { LoginDialog } from './os/LoginDialog';
import { Explorer } from './apps/explorer/Explorer';
import { Notepad } from './apps/notepad/Notepad';
import { Calculator } from './apps/calculator/Calculator';
import { Paint } from './apps/paint/Paint';
import { IExplorer } from './apps/ie/IExplorer';
import { Outlook } from './apps/outlook/Outlook';
import { Minesweeper } from './apps/games/minesweeper/Minesweeper';
import { Snake } from './apps/games/snake/Snake';
import { Pinball } from './apps/games/pinball/Pinball';
import { Solitaire } from './apps/games/solitaire/Solitaire';
import { FreeCell } from './apps/games/solitaire/FreeCell';
import {
  BSOD, Clippy, Screensaver, VirusPopup, GenesisBlock,
  RunDialog, TaskManager, ShutdownDialog, AboutWindows,
  ControlPanel, SystemProperties, MediaPlayer, ImageViewer,
  DialupDialog, Scandisk
} from './eggs/EasterEggs';
import '98.css';

// Konami code detector
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

function AppContent({ appId, props }: { appId: AppId; props?: Record<string, unknown> }) {
  switch (appId) {
    case 'explorer': return <Explorer {...(props as any)} />;
    case 'notepad': return <Notepad {...(props as any)} />;
    case 'paint': return <Paint />;
    case 'calculator': return <Calculator />;
    case 'ie': return <IExplorer />;
    case 'outlook': return <Outlook />;
    case 'minesweeper': return <Minesweeper />;
    case 'snake': return <Snake />;
    case 'pinball': return <Pinball />;
    case 'solitaire': return <Solitaire />;
    case 'freecell': return <FreeCell />;
    case 'taskmanager': return <TaskManager />;
    case 'run': return <RunDialog />;
    case 'shutdown': return <ShutdownDialog />;
    case 'about': return <AboutWindows />;
    case 'controlpanel': return <ControlPanel />;
    case 'systemprops': return <SystemProperties />;
    case 'mediaplayer': return <MediaPlayer />;
    case 'imageviewer': return <ImageViewer {...(props as any)} />;
    case 'scandisk': return <Scandisk />;
    case 'dialup': return <DialupDialog />;
    default: return <Notepad content={`App "${appId}" is not yet installed.\n\nError: Module not found.\n\n(This is also a metaphor.)`} />;
  }
}

export default function App() {
  const {
    bootStage, windows, bsodActive, clippyVisible,
    virusPopups, removeVirusPopup, konami, setKonami,
    screensaverActive, crtMode, wallpaper, openWindow,
    setStartOpen, startOpen,
  } = useOSStore();

  const konamiRef = useRef<string[]>([]);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setScreensaver, screensaverActive: ss } = useOSStore();

  // Konami code detection
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => konamiRef.current[i] === k)) {
        setKonami(true);
        konamiRef.current = [];
      }

      // Ctrl+Alt+Del → Task Manager
      if (e.ctrlKey && e.altKey && e.key === 'Delete') {
        e.preventDefault();
        openWindow('taskmanager', 'Windows Task Manager', {}, 600, 400);
      }

      // Reset idle timer
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => setScreensaver(true), 90000); // 90 seconds idle
    };

    const resetIdle = () => {
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => setScreensaver(true), 90000);
    };

    window.addEventListener('keydown', handler);
    window.addEventListener('mousemove', resetIdle);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('mousemove', resetIdle);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [openWindow, setKonami, setScreensaver]);

  // Mobile detection Easter egg
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // Click outside to close start menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = e.target as Element;
      if (!el.closest('#start-button') && !el.closest('[data-startmenu]')) {
        setStartOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setStartOpen]);

  const wallpaperColor: Record<string, string> = {
    lightgrey: '#d0d0d0',
    teal: '#008080',
    bitcoin: '#ff8c00',
    black: '#001100',
    purple: '#330033',
    navy: '#000033',
  };

  // Boot stages
  if (bootStage === 'bios') return <BootBIOS />;
  if (bootStage === 'splash') return <BootSplash />;
  if (bootStage === 'login') return <LoginDialog />;

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      background: wallpaperColor[wallpaper] || '#008080',
      position: 'relative',
    }}>
      {/* CRT scanline effect */}
      {crtMode && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Mobile Easter egg */}
      {isMobile && (
        <div style={{
          position: 'fixed', inset: 0, background: '#c0c0c0', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          gap: '16px', fontFamily: 'Arial', padding: '32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px' }}>🖱️</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Windows 98 does not support touchscreens.</div>
          <div style={{ fontSize: '14px' }}>Please buy a mouse.</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
            (This is not a bug. This is the year 1998.)<br/>
            (Touchscreens don't exist yet.)<br/>
            (You are either from the future or lost.)
          </div>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 20px', marginTop: '8px', cursor: 'pointer', fontSize: '14px' }}>
            Try anyway (not recommended)
          </button>
        </div>
      )}

      {/* Desktop */}
      <Desktop />

      {/* Windows */}
      {windows.map(win => (
        <Win98Window key={win.id} window={win}>
          <AppContent appId={win.appId} props={win.props} />
        </Win98Window>
      ))}

      {/* Taskbar */}
      <Taskbar />

      {/* Easter Eggs */}
      {bsodActive && <BSOD />}
      {clippyVisible && <Clippy />}
      {screensaverActive && <Screensaver />}
      {konami && <GenesisBlock />}
      {virusPopups.map(id => (
        <VirusPopup key={id} id={id} onClose={() => removeVirusPopup(id)} />
      ))}
    </div>
  );
}

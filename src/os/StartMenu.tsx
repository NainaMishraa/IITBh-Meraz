import React, { useState, useEffect, useRef } from 'react';
import { useOSStore, AppId } from '../store/osStore';

type MenuItem = {
  label: string;
  icon?: string;
  action?: () => void;
  submenu?: MenuItem[];
  separator?: boolean;
  disabled?: boolean;
};

export function StartMenu() {
  const { setStartOpen, openWindow, triggerBSOD, setScreensaver } = useOSStore();
  const close = () => setStartOpen(false);

  const openApp = (id: AppId, title: string, props?: Record<string, unknown>, w?: number, h?: number) => {
    openWindow(id, title, props, w, h);
    close();
  };

  const items: MenuItem[] = [
    {
      label: 'Programs',
      icon: '📁',
      submenu: [
        {
          label: 'Accessories',
          icon: '📁',
          submenu: [
            { label: 'Calculator', icon: '🧮', action: () => openApp('calculator', 'Calculator', {}, 240, 300) },
            { label: 'Notepad', icon: '📝', action: () => openApp('notepad', 'Notepad', {}, 500, 380) },
            { label: 'Paint', icon: '🎨', action: () => openApp('paint', 'Paint', {}, 600, 480) },
            { label: 'WordPad', icon: '📄', action: () => openApp('notepad', 'WordPad', {}, 600, 460) },
          ],
        },
        {
          label: 'Games',
          icon: '🎮',
          submenu: [
            { label: 'Minesweeper', icon: '💣', action: () => openApp('minesweeper', 'Minesweeper', {}, 400, 440) },
            { label: 'Solitaire', icon: '🃏', action: () => openApp('solitaire', 'Solitaire', {}, 700, 540) },
            { label: 'Snake', icon: '🐍', action: () => openApp('snake', 'Snake', {}, 440, 500) },
            { label: 'Pinball (Space Cadet)', icon: '🎯', action: () => openApp('pinball', 'Pinball', {}, 640, 420) },
            { label: 'FreeCell', icon: '🎴', action: () => openApp('freecell', 'FreeCell', {}, 700, 520) },
            { separator: true, label: '' },
            { label: 'Counter-Strike 1.6', icon: '🔫', action: () => openApp('notepad', 'Counter-Strike Launcher', { content: 'ERROR: cs.exe has encountered a fatal exception.\nThe game will now minimize.\n\nActually: Steam not installed.\nActually²: Steam not invented yet.\nIt\'s 1999.\n\nPlease be patient. Valve will get to it.' }, 400, 200) },
            { label: 'Age of Empires II', icon: '⚔️', action: () => openApp('notepad', 'Age of Empires II', { content: 'LOADING AGE OF EMPIRES II...\n\n[=====     ] 47%\n\nLoading civilizations...\nLoading economy...\nLoading inevitable betrayal of trust...\n\nERROR: Not enough RAM\n(You have 64MB. The game wants 128MB.\nThe game is greedy. Like the feudal lords it depicts.)' }, 420, 220) },
            { label: 'Need for Speed III', icon: '🏎️', action: () => openApp('notepad', 'Need for Speed III', { content: 'NEED FOR SPEED III\n\nStarting engine...\nVroom.\nVROOM.\n\n[NO LAMBORGHINI DETECTED]\n\nInsert disc 1 of 2.\n\nNote from Satoshi: I put a Lambo in my budget spreadsheet.\nI deleted the file. It\'s in the Recycle Bin if you need it.' }, 420, 240) },
          ],
        },
        {
          label: 'Internet Explorer 5.0',
          icon: '🌐',
          action: () => openApp('ie', 'Internet Explorer', {}, 800, 580),
        },
        {
          label: 'Outlook Express',
          icon: '📧',
          action: () => openApp('outlook', 'Outlook Express', {}, 760, 540),
        },
        {
          label: 'Windows Explorer',
          icon: '📂',
          action: () => openApp('explorer', 'Windows Explorer', {}, 640, 460),
        },
        {
          label: 'Media Player',
          icon: '🎵',
          action: () => openApp('mediaplayer', 'Windows Media Player', {}, 520, 380),
        },
      ],
    },
    {
      label: 'Documents',
      icon: '📄',
      submenu: [
        { label: 'ecash_ideas.txt', icon: '📝', action: () => openApp('notepad', 'ecash_ideas.txt', { path: ['My Documents', 'ecash_ideas.txt'] }) },
        { label: 'bitcoin_v0.0.1_DRAFT.doc', icon: '📝', action: () => openApp('notepad', 'bitcoin_v0.0.1_DRAFT.doc', { path: ['My Documents', 'bitcoin_v0.0.1_DRAFT.doc'] }) },
        { label: 'diary.txt', icon: '📓', action: () => openApp('notepad', 'diary.txt', { path: ['My Documents', 'diary.txt'] }) },
      ],
    },
    {
      label: 'Settings',
      icon: '⚙️',
      submenu: [
        { label: 'Control Panel', icon: '🖥️', action: () => openApp('controlpanel', 'Control Panel', {}, 560, 420) },
        { label: 'Taskbar & Start Menu...', icon: '📋', action: () => openApp('notepad', 'Taskbar Settings', { content: 'Taskbar settings:\n\nShow clock: YES\nShow BTC price ticker: YES\nShow "Start" button: YES\nHide anxieties: IN PROGRESS\n\nAll settings are read-only.\nLike most things in life.' }, 380, 200) },
        { label: 'Screensaver', icon: '💫', action: () => { setScreensaver(true); close(); } },
      ],
    },
    {
      label: 'Find',
      icon: '🔍',
      submenu: [
        {
          label: 'Files or Folders...',
          icon: '📁',
          action: () => openApp('explorer', 'Find: All Files', { mode: 'search' }, 500, 360)
        },
        {
          label: 'On the Internet...',
          icon: '🌐',
          action: () => openApp('ie', 'Find on Internet', {}, 800, 580)
        },
      ],
    },
    { label: 'Help', icon: '❓', action: () => openApp('notepad', 'Windows Help', { content: 'WINDOWS 98 HELP\n\n1. Have you tried turning it off and on again?\n2. If that doesn\'t work, the problem is between the keyboard and chair.\n3. For advanced issues, consult a mystical cypherpunk.\n\nFor Bitcoin-related help: you\'re on your own.\nEverybody is on their own. That\'s the whole point.\n\n-- S' }, 400, 300) },
    { label: 'Run...', icon: '▶️', action: () => openApp('run', 'Run', {}, 380, 130) },
    { separator: true, label: '' },
    {
      label: 'Shut Down...',
      icon: '🔴',
      action: () => {
        close();
        openApp('shutdown', 'Shut Down Windows', {}, 360, 200);
      }
    },
  ];

  return (
    <StartMenuPanel items={items} onClose={close} topLevel />
  );
}

interface PanelProps {
  items: MenuItem[];
  onClose: () => void;
  topLevel?: boolean;
  style?: React.CSSProperties;
}

function StartMenuPanel({ items, onClose, topLevel, style }: PanelProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [submenuPos, setSubmenuPos] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        bottom: topLevel ? '34px' : undefined,
        left: topLevel ? '0' : undefined,
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #808080 #808080 #fff',
        boxShadow: '4px 4px 0 #000',
        minWidth: topLevel ? '220px' : '200px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: topLevel ? 'row' : 'column',
        ...style,
      }}
    >
      {/* Side banner for top-level */}
      {topLevel && (
        <div style={{
          background: 'linear-gradient(to top, #000080, #1084d0)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: '#fff',
          fontSize: '18px',
          fontFamily: '"Times New Roman", serif',
          fontWeight: 'bold',
          padding: '8px 4px',
          letterSpacing: '2px',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          minWidth: '28px',
        }}>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>Windows</span>
          <span>98</span>
        </div>
      )}

      <div style={{ flex: 1 }}>
        {items.map((item, idx) => {
          if (item.separator) {
            return <div key={idx} style={{ height: '1px', background: '#808080', margin: '2px 4px', boxShadow: '0 1px 0 #fff' }} />;
          }
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 16px 4px 8px',
                gap: '8px',
                cursor: 'default',
                background: isHovered ? '#000080' : 'transparent',
                color: isHovered ? '#fff' : '#000',
                position: 'relative',
                fontSize: '13px',
                fontFamily: 'Arial, sans-serif',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                setHoveredIdx(idx);
                const rect = e.currentTarget.getBoundingClientRect();
                setSubmenuPos({ x: rect.right, y: rect.top });
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => {
                if (item.action) { item.action(); onClose(); }
              }}
            >
              <span style={{ width: '20px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.submenu && <span style={{ fontSize: '10px' }}>▶</span>}

              {/* Submenu */}
              {item.submenu && isHovered && (
                <StartMenuPanel
                  items={item.submenu}
                  onClose={onClose}
                  style={{
                    position: 'fixed',
                    left: submenuPos.x,
                    top: submenuPos.y,
                    bottom: undefined,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

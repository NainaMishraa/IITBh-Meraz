import React, { useState, useRef, useCallback } from 'react';
import { useOSStore } from '../store/osStore';

const DESKTOP_ICONS = [
  { id: 'mycomputer', label: 'My Computer', emoji: '💻', appId: 'explorer' as const, props: { root: true } },
  { id: 'mydocs', label: 'My Documents', emoji: '📁', appId: 'explorer' as const, props: { path: ['My Documents'] } },
  { id: 'recyclebin', label: 'Recycle Bin', emoji: '🗑️', appId: 'explorer' as const, props: { mode: 'recycle' } },
  { id: 'ie', label: 'Internet Explorer', emoji: '🌐', appId: 'ie' as const, props: {} },
  { id: 'network', label: 'Network\nNeighborhood', emoji: '🖧', appId: 'notepad' as const, props: { content: 'NETWORK NEIGHBORHOOD\n\nComputers found: 0\n\nThis machine is on a dial-up connection.\nSpeed: 56Kbps (theoretical)\nActual speed: less.\nMuch less.\n\nConnecting...\n...\n...\nLine busy.\n\nRetrying...\n...\nLine still busy.\n\nMaybe try the internet later.\nSatoshi is busy downloading something.' } },
  { id: 'outlook', label: 'Outlook Express', emoji: '📧', appId: 'outlook' as const, props: {} },
];

export function Desktop() {
  const { openWindow, windows } = useOSStore();
  const [clickTimes, setClickTimes] = useState<Record<string, number>>({});
  const [rightMenuPos, setRightMenuPos] = useState<{ x: number; y: number; icon?: string } | null>(null);
  const [iconPos, setIconPos] = useState<Record<string, { x: number; y: number }>>({});
  const draggingIcon = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleIconClick = (id: string, appId: string, props: Record<string, unknown>) => {
    const now = Date.now();
    if (clickTimes[id] && now - clickTimes[id] < 500) {
      // Double-click
      openWindow(appId as any, DESKTOP_ICONS.find(i => i.id === id)?.label.replace('\n', ' ') || appId, props);
    }
    setClickTimes(t => ({ ...t, [id]: now }));
  };

  const handleIconMouseDown = (e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return;
    const pos = iconPos[id] || { x: 0, y: 0 };
    draggingIcon.current = { id, startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
    const onMove = (me: MouseEvent) => {
      if (!draggingIcon.current) return;
      const dx = me.clientX - draggingIcon.current.startX;
      const dy = me.clientY - draggingIcon.current.startY;
      setIconPos(p => ({
        ...p,
        [id]: { x: draggingIcon.current!.origX + dx, y: draggingIcon.current!.origY + dy }
      }));
    };
    const onUp = () => {
      draggingIcon.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleRightClick = (e: React.MouseEvent, iconId?: string) => {
    e.preventDefault();
    setRightMenuPos({ x: e.clientX, y: e.clientY, icon: iconId });
  };

  const dismissRightMenu = () => setRightMenuPos(null);

  return (
    <div
      id="desktop"
      style={{
        position: 'fixed',
        inset: 0,
        bottom: '32px',
        background: '#008080',
        overflow: 'hidden',
      }}
      onClick={dismissRightMenu}
      onContextMenu={(e) => handleRightClick(e)}
    >
      {/* Desktop Icons */}
      {DESKTOP_ICONS.map((icon, idx) => {
        const defaultX = 16;
        const defaultY = 16 + idx * 80;
        const pos = iconPos[icon.id] || { x: defaultX, y: defaultY };

        return (
          <div
            key={icon.id}
            id={`desktop-icon-${icon.id}`}
            style={{
              position: 'absolute',
              left: pos.x + defaultX,
              top: pos.y + defaultY - (iconPos[icon.id] ? defaultY : 0),
              width: '72px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'default',
              userSelect: 'none',
              zIndex: 1,
              padding: '4px',
            }}
            onClick={(e) => { e.stopPropagation(); handleIconClick(icon.id, icon.appId, icon.props); }}
            onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
            onContextMenu={(e) => { e.stopPropagation(); handleRightClick(e, icon.id); }}
          >
            <div style={{ fontSize: '32px', lineHeight: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              {icon.emoji}
            </div>
            <div style={{
              color: '#fff',
              fontSize: '11px',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              textShadow: '1px 1px 2px #000',
              lineHeight: '1.2',
              whiteSpace: 'pre-line',
            }}>
              {icon.label}
            </div>
          </div>
        );
      })}

      {/* Right-click context menu */}
      {rightMenuPos && (
        <ContextMenu
          x={rightMenuPos.x}
          y={rightMenuPos.y}
          iconId={rightMenuPos.icon}
          onClose={dismissRightMenu}
        />
      )}
    </div>
  );
}

function ContextMenu({ x, y, iconId, onClose }: { x: number; y: number; iconId?: string; onClose: () => void }) {
  const { openWindow } = useOSStore();

  const menuItems = iconId ? [
    { label: 'Open', action: () => { const icon = DESKTOP_ICONS.find(i => i.id === iconId); if (icon) openWindow(icon.appId as any, icon.label.replace('\n', ' '), icon.props); } },
    { label: 'Explore', action: () => openWindow('explorer', 'Windows Explorer', {}) },
    null,
    { label: 'Send To ▶', action: () => {} },
    null,
    { label: 'Cut', action: () => {} },
    { label: 'Copy', action: () => {} },
    null,
    { label: 'Create Shortcut', action: () => {} },
    { label: 'Delete', action: () => alert('You cannot delete this. It is eternal.') },
    { label: 'Rename', action: () => alert('Rename denied. This icon has existed since 1998.') },
    null,
    { label: 'Properties', action: () => openWindow('notepad', `${iconId} Properties`, { content: `Properties: ${iconId}\n\nType: System Icon\nSize: Immeasurable\nCreated: 1998\nModified: Never\nAttributes: [✓] Hidden ✗ Modifiable ✗ Deletable\n\nSecurity: Classified.\nClearance required: Satoshi-level.\nYou do not have clearance.` }) },
  ] : [
    { label: 'Active Desktop ▶', action: () => {} },
    null,
    { label: 'Arrange Icons ▶', action: () => {} },
    { label: 'Line Up Icons', action: () => {} },
    null,
    { label: 'Refresh', action: () => window.location.reload() },
    null,
    { label: 'New ▶', action: () => {} },
    null,
    { label: 'Properties', action: () => openWindow('controlpanel', 'Display Properties', {}) },
    null,
    { label: '💡 Feeling lost? Check the diary.', action: () => openWindow('notepad', 'diary.txt', { path: ['My Documents', 'diary.txt'] }) },
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #808080 #808080 #fff',
        boxShadow: '4px 4px 0 #000',
        zIndex: 99999,
        minWidth: '180px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
      }}
    >
      {menuItems.map((item, idx) =>
        !item ? (
          <div key={idx} style={{ height: '1px', background: '#808080', margin: '2px 4px', boxShadow: '0 1px 0 #fff' }} />
        ) : (
          <div
            key={idx}
            style={{ padding: '4px 20px', cursor: 'default' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}
            onClick={() => { item.action(); onClose(); }}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  );
}

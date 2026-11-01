import React, { useState } from 'react';
import { useOSStore } from '../../store/osStore';
import { FSItem } from '../../fs/virtualFS';

export function Explorer() {
  const { fs, recycleBin, openWindow } = useOSStore();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [mode, setMode] = useState<'normal' | 'recycle' | 'search'>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Get items at current path
  const getItems = (): Record<string, FSItem> => {
    if (mode === 'recycle') return recycleBin;

    let current: Record<string, FSItem> = fs;
    for (const segment of currentPath) {
      const item = current[segment];
      if (item && item.type === 'folder' && item.children) {
        current = item.children;
      } else {
        return {};
      }
    }
    return current;
  };

  const items = getItems();

  const navigate = (name: string, item: FSItem) => {
    if (item.protected) {
      const pw = prompt(`⚠️ This folder is password protected.\n\nHint: ${item.passwordHint || 'No hint available'}\n\nEnter password:`);
      if (pw?.toLowerCase() !== 'genesis') {
        alert('Access Denied.\n\n"genesis" was not entered.\nWell. The hint is in the diary. Go read it.\n\n-- S');
        return;
      }
    }
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, name]);
      setSelectedItem(null);
    } else {
      openFile(name, item);
    }
  };

  const openFile = (name: string, item: FSItem) => {
    if (item.content === 'IMAGE_FILE') {
      openWindow('imageviewer', name, { filename: name }, 400, 360);
    } else if (item.content === 'AUDIO_FILE') {
      openWindow('mediaplayer', name, { filename: name }, 520, 380);
    } else if (item.content === 'EXECUTABLE') {
      openWindow('notepad', name, { content: `Running ${name}...\n\nProcess terminated.\nReason: Y2K compliance check failed.\nAlso: no one is supposed to run this yet.\n\n-- S` }, 380, 200);
    } else {
      openWindow('notepad', name, { path: [...currentPath, name] }, 600, 440);
    }
  };

  const pathStr = mode === 'recycle' ? 'Recycle Bin' :
    ['C:\\', ...currentPath].join('\\');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      {/* Menu bar */}
      <div style={{ borderBottom: '1px solid #808080', padding: '2px 4px', display: 'flex', gap: '16px' }}>
        {['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'].map(m => (
          <span key={m} style={{ cursor: 'default', padding: '1px 4px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
            {m}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ borderBottom: '1px solid #808080', padding: '2px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          disabled={currentPath.length === 0 && mode === 'normal'}
          onClick={() => {
            if (mode === 'recycle') { setMode('normal'); } else { setCurrentPath(p => p.slice(0, -1)); }
          }}
          style={{ padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
        >⬅ Back</button>
        <button onClick={() => { setMode('normal'); setCurrentPath([]); }} style={{ padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}>🏠</button>
        <div style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '8px' }}>
          <span>Address:</span>
          <div style={{
            flex: 1, border: '2px inset #808080', padding: '1px 4px',
            background: '#fff', fontSize: '12px',
          }}>
            {pathStr}
          </div>
        </div>
      </div>

      {/* Tree + Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left panel - folder tree */}
        <div style={{
          width: '160px',
          borderRight: '1px solid #808080',
          overflow: 'auto',
          padding: '4px',
          fontSize: '11px',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Folders</div>
          <div onClick={() => { setMode('normal'); setCurrentPath([]); }}
            style={{ cursor: 'default', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
            💻 My Computer
          </div>
          <div style={{ paddingLeft: '12px' }}>
            {Object.entries(fs).map(([name, item]) => item.type === 'folder' && (
              <div key={name}
                onClick={() => { setMode('normal'); setCurrentPath([name]); setSelectedItem(null); }}
                style={{ cursor: 'default', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
                📁 {name}
              </div>
            ))}
          </div>
          <div onClick={() => { setMode('recycle'); setCurrentPath([]); }}
            style={{ cursor: 'default', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
            🗑️ Recycle Bin
          </div>
        </div>

        {/* Right panel - file list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px' }}>
          {mode === 'recycle' && (
            <div style={{ padding: '4px 8px', background: '#ffffd0', border: '1px solid #d0d000', marginBottom: '8px', fontSize: '11px' }}>
              📋 These files are awaiting deletion. Some contain financial instruments worth... well. It's complicated.
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '4px' }}>
            {Object.entries(items).length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic', padding: '20px' }}>
                This folder is empty.<br />
                <span style={{ fontSize: '11px' }}>(Like my social calendar. — S)</span>
              </div>
            )}
            {Object.entries(items).map(([name, item]) => (
              <div
                key={name}
                onClick={() => setSelectedItem(name)}
                onDoubleClick={() => navigate(name, item)}
                style={{
                  width: '72px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 4px',
                  cursor: 'default',
                  background: selectedItem === name ? '#000080' : 'transparent',
                  color: selectedItem === name ? '#fff' : '#000',
                  borderRadius: '2px',
                  userSelect: 'none',
                }}
              >
                <div style={{ fontSize: '28px' }}>
                  {item.type === 'folder'
                    ? (item.protected ? '🔒' : '📁')
                    : item.icon === 'image' ? '🖼️'
                    : name.endsWith('.txt') ? '📄'
                    : name.endsWith('.doc') ? '📝'
                    : name.endsWith('.mp3') || name.endsWith('.m3u') ? '🎵'
                    : name.endsWith('.exe') ? '⚙️'
                    : name.endsWith('.xls') ? '📊'
                    : name.endsWith('.dat') ? '💾'
                    : '📄'}
                </div>
                <div style={{
                  fontSize: '10px', textAlign: 'center', wordBreak: 'break-word',
                  lineHeight: '1.2', maxWidth: '70px',
                }}>
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        borderTop: '2px inset #808080', padding: '2px 8px',
        fontSize: '11px', color: '#444',
      }}>
        {Object.keys(items).length} object(s) | 
        Disk space: 9.2 GB used, 0.8 GB free | 
        <span style={{ color: '#666' }}> (most of it is "bitcoin_FINAL" drafts)</span>
      </div>
    </div>
  );
}

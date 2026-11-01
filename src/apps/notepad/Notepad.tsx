import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/osStore';
import { FSItem } from '../../fs/virtualFS';

interface Props {
  path?: string[];
  content?: string;
}

export function Notepad({ path, content: initialContent }: Props) {
  const { fs } = useOSStore();
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('Untitled');
  const [wordWrap, setWordWrap] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (path && path.length > 0) {
      // Resolve path in FS
      let current: Record<string, FSItem> | FSItem = fs;
      for (const seg of path) {
        if ('children' in current && current.children) {
          current = current.children as Record<string, FSItem>;
        }
        if (typeof current === 'object' && seg in (current as any)) {
          current = (current as any)[seg];
        }
      }
      if ('content' in current && typeof current.content === 'string') {
        setText(current.content);
        setFilename(path[path.length - 1]);
      }
    } else if (initialContent !== undefined) {
      setText(initialContent);
      setFilename('Untitled');
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu */}
      <div style={{
        borderBottom: '1px solid #808080',
        padding: '2px 4px',
        display: 'flex',
        gap: '12px',
        fontFamily: 'Arial',
        fontSize: '12px',
        background: '#c0c0c0',
      }}>
        {['File', 'Edit', 'Search', 'Help'].map(m => (
          <span key={m} style={{ cursor: 'default', padding: '1px 4px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#000080', e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '', e.currentTarget.style.color = '')}>
            {m}
          </span>
        ))}
        <span
          style={{ cursor: 'default', padding: '1px 4px', marginLeft: 'auto', fontSize: '10px', color: '#666' }}
          title="Word Wrap"
          onClick={() => setWordWrap(w => !w)}
        >
          {wordWrap ? '↩ Wrap ON' : '→ Wrap OFF'}
        </span>
      </div>

      {/* Text area */}
      <textarea
        ref={textRef}
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '4px',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '13px',
          lineHeight: '1.4',
          background: '#fff',
          color: '#000',
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowX: wordWrap ? 'hidden' : 'auto',
          overflowY: 'auto',
        }}
        spellCheck={false}
      />

      {/* Status bar */}
      <div style={{
        borderTop: '2px inset #808080',
        padding: '2px 8px',
        fontSize: '11px',
        fontFamily: 'Arial',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>Ln {text.substring(0, textRef.current?.selectionStart || 0).split('\n').length}, Col 1</span>
        <span style={{ color: '#666' }}>
          {filename === 'diary.txt' ? '🔒 Private document — please show yourself out' :
           filename.includes('bitcoin') ? '⚠ DRAFT — Do not publish yet. Seriously.' :
           'Ready'}
        </span>
      </div>
    </div>
  );
}

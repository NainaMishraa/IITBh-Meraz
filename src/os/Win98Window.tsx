import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useOSStore, WindowState } from '../store/osStore';

interface Props {
  window: WindowState;
  children: React.ReactNode;
}

export function Win98Window({ window: win, children }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, moveWindow, resizeWindow } = useOSStore();
  const dragging = useRef(false);
  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, wx: 0, wy: 0, ww: 0, wh: 0 });

  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return;
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y, ww: win.width, wh: win.height };
    focusWindow(win.id);
    e.preventDefault();
  }, [win, focusWindow]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return;
    resizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY, wx: win.x, wy: win.y, ww: win.width, wh: win.height };
    e.preventDefault();
    e.stopPropagation();
  }, [win]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        moveWindow(win.id, startPos.current.wx + dx, startPos.current.wy + dy);
      }
      if (resizing.current) {
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        resizeWindow(win.id,
          Math.max(200, startPos.current.ww + dx),
          Math.max(150, startPos.current.wh + dy)
        );
      }
    };
    const onUp = () => { dragging.current = false; resizing.current = false; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [win.id, moveWindow, resizeWindow]);

  const style: React.CSSProperties = win.maximized
    ? { position: 'fixed', left: 0, top: 0, width: '100vw', height: 'calc(100vh - 32px)', zIndex: win.zIndex }
    : {
      position: 'fixed',
      left: win.x,
      top: win.y,
      width: win.width,
      height: win.height,
      zIndex: win.zIndex,
    };

  if (win.minimized) return null;

  return (
    <div
      className={`win98-window ${win.focused ? 'focused' : ''}`}
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title Bar */}
      <div
        className={`win98-title-bar ${win.focused ? 'active' : 'inactive'}`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        <div className="win98-title-bar-text">{win.title}</div>
        <div className="win98-title-bar-controls">
          <button
            aria-label="Minimize"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
          />
          <button
            aria-label="Maximize"
            onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
          />
          <button
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="win98-window-body" style={{ height: 'calc(100% - 33px)', overflow: 'auto' }}>
        {children}
      </div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '12px',
            height: '12px',
            cursor: 'nwse-resize',
            zIndex: 10,
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}

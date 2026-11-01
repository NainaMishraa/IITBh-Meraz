import { create } from 'zustand';
import { FSItem, loadFS, saveFS, loadRecycleBin, saveRecycleBin } from '../fs/virtualFS';

export type AppId =
  | 'explorer' | 'notepad' | 'paint' | 'calculator'
  | 'ie' | 'outlook' | 'controlpanel' | 'systemprops'
  | 'minesweeper' | 'solitaire' | 'snake' | 'pinball' | 'freecell'
  | 'taskmanager' | 'scandisk' | 'mediaplayer' | 'imageviewer'
  | 'run' | 'shutdown' | 'about' | 'password' | 'dialup';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  focused: boolean;
  props?: Record<string, unknown>;
}

export interface OSStore {
  // Boot
  bootStage: 'bios' | 'splash' | 'login' | 'desktop';
  setBootStage: (s: OSStore['bootStage']) => void;
  loggedIn: boolean;
  login: () => void;

  // Windows
  windows: WindowState[];
  nextZ: number;
  openWindow: (appId: AppId, title: string, props?: Record<string, unknown>, w?: number, h?: number) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, w: number, h: number) => void;

  // Start menu
  startOpen: boolean;
  setStartOpen: (v: boolean) => void;

  // FS
  fs: Record<string, FSItem>;
  recycleBin: Record<string, FSItem>;
  setFS: (fs: Record<string, FSItem>) => void;
  setRecycleBin: (rb: Record<string, FSItem>) => void;

  // Desktop
  wallpaper: string;
  setWallpaper: (w: string) => void;

  // Easter eggs
  bsodActive: boolean;
  triggerBSOD: () => void;
  dismissBSOD: () => void;
  clippyVisible: boolean;
  clippyMessage: string;
  showClipy: (msg: string) => void;
  hideClipy: () => void;
  virusPopups: string[];
  addVirusPopup: (id: string) => void;
  removeVirusPopup: (id: string) => void;
  konami: boolean;
  setKonami: (v: boolean) => void;
  crtMode: boolean;
  toggleCrt: () => void;
  dialupActive: boolean;
  setDialup: (v: boolean) => void;
  screensaverActive: boolean;
  setScreensaver: (v: boolean) => void;
}

let windowCounter = 0;

export const useOSStore = create<OSStore>((set, get) => ({
  bootStage: 'bios',
  setBootStage: (s) => set({ bootStage: s }),
  loggedIn: false,
  login: () => set({ loggedIn: true, bootStage: 'desktop' }),

  windows: [],
  nextZ: 100,
  openWindow: (appId, title, props, w = 640, h = 480) => {
    const id = `win-${++windowCounter}`;
    const { windows, nextZ } = get();
    // Cascade position
    const offset = (windows.length % 10) * 20;
    const newWindow: WindowState = {
      id,
      appId,
      title,
      x: 60 + offset,
      y: 60 + offset,
      width: w,
      height: h,
      minimized: false,
      maximized: false,
      zIndex: nextZ,
      focused: true,
      props,
    };
    set((state) => ({
      windows: [...state.windows.map(w => ({ ...w, focused: false })), newWindow],
      nextZ: state.nextZ + 1,
    }));

    // BSOD trigger: too many windows
    if (windows.length >= 8) {
      setTimeout(() => {
        get().triggerBSOD();
      }, 2000);
    }
    return id;
  },
  closeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),
  focusWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, zIndex: state.nextZ, focused: true }
          : { ...w, focused: false }
      ),
      nextZ: state.nextZ + 1,
    })),
  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true, focused: false } : w
      ),
    })),
  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    })),
  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),
  resizeWindow: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    })),

  startOpen: false,
  setStartOpen: (v) => set({ startOpen: v }),

  fs: loadFS(),
  recycleBin: loadRecycleBin(),
  setFS: (fs) => { saveFS(fs); set({ fs }); },
  setRecycleBin: (rb) => { saveRecycleBin(rb); set({ recycleBin: rb }); },

  wallpaper: 'lightgrey',
  setWallpaper: (w) => set({ wallpaper: w }),

  bsodActive: false,
  triggerBSOD: () => set({ bsodActive: true }),
  dismissBSOD: () => set({ bsodActive: false, windows: [] }),

  clippyVisible: false,
  clippyMessage: '',
  showClipy: (msg) => set({ clippyVisible: true, clippyMessage: msg }),
  hideClipy: () => set({ clippyVisible: false }),

  virusPopups: [],
  addVirusPopup: (id) => set((s) => ({ virusPopups: [...s.virusPopups, id] })),
  removeVirusPopup: (id) => set((s) => ({ virusPopups: s.virusPopups.filter((v) => v !== id) })),

  konami: false,
  setKonami: (v) => set({ konami: v }),

  crtMode: false,
  toggleCrt: () => set((s) => ({ crtMode: !s.crtMode })),

  dialupActive: false,
  setDialup: (v) => set({ dialupActive: v }),

  screensaverActive: false,
  setScreensaver: (v) => set({ screensaverActive: v }),
}));

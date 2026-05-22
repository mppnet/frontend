interface Window {
  MPP: Record<string, unknown>;
  i18nextify: { i18next: { t: (key: string, options?: Record<string, unknown>) => string; language: string; isInitialized: boolean; on: (event: string, cb: () => void) => void; changeLanguage: (lng: string) => Promise<void>; }; init: (opts: Record<string, unknown>) => { start: () => void }; forceRerender: () => void; };
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
  mozRequestAnimationFrame: typeof requestAnimationFrame;
  msRequestAnimationFrame: typeof requestAnimationFrame;
  requestAnimFrame: (cb: FrameRequestCallback) => number;
  setBackgroundColor: (hex: string, hex2?: string) => void;
  setBackgroundColorToDefault: () => void;
  gKnowsYouCanUseKeyboardTimeout: ReturnType<typeof setTimeout> | undefined;
  gKnowsYouCanUseKeyboardNotification: { close: () => void } | undefined;
  gHasBeenHereBefore: boolean;
  changeClientSettingsTab: (evt: { currentTarget: Element }, tabName: string) => void;
}

declare let i18nextify: Window['i18nextify'];

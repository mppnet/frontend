/// <reference types="jquery" />

declare function require(module: string): any;

interface Window {
  MPP: any;
  i18nextify: any;
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
  mozRequestAnimationFrame: typeof requestAnimationFrame;
  msRequestAnimationFrame: typeof requestAnimationFrame;
  requestAnimFrame: (cb: FrameRequestCallback) => number;
  setBackgroundColor: (hex: string, hex2?: string) => void;
  setBackgroundColorToDefault: () => void;
  gKnowsYouCanUseKeyboardTimeout: any;
  gKnowsYouCanUseKeyboardNotification: any;
  gHasBeenHereBefore: any;
  changeClientSettingsTab: (evt: any, tabName: string) => void;
}

declare var i18nextify: any;

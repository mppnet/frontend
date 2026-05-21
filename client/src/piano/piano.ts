import { CanvasRenderer } from './renderer';
import { AudioEngineWeb } from './audio';
import { settings } from '../modules/settings/settings';
import { state } from '../util/state';

declare const $: any;

export class PianoKey {
  note: string;
  baseNote: string;
  octave: number;
  sharp: boolean;
  loaded: boolean = false;
  timeLoaded: number = 0;
  domElement: HTMLElement | null = null;
  timePlayed: number = 0;
  blips: Array<{ time: number; color: string }> = [];
  spatial: number = 0;
  rect: any = null;

  constructor(note: string, octave: number) {
    this.note = note + octave;
    this.baseNote = note;
    this.octave = octave;
    this.sharp = note.indexOf('s') !== -1;
  }
}

export class Piano {
  rootElement: HTMLElement;
  keys: Record<string, PianoKey> = {};
  renderer: CanvasRenderer;
  audio: AudioEngineWeb;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;

    let white_spatial = 0;
    let black_spatial = 0;
    let black_it = 0;
    const black_lut = [2, 1, 2, 1, 1];

    const addKey = (note: string, octave: number) => {
      const key = new PianoKey(note, octave);
      this.keys[key.note] = key;
      if (key.sharp) {
        key.spatial = black_spatial;
        black_spatial += black_lut[black_it % 5];
        ++black_it;
      } else {
        key.spatial = white_spatial;
        ++white_spatial;
      }
    };
    if (settings.testMode) {
      addKey('c', 2);
    } else {
      addKey('a', -1);
      addKey('as', -1);
      addKey('b', -1);
      const notes = 'c cs d ds e f fs g gs a as b'.split(' ');
      for (let oct = 0; oct < 7; oct++) {
        for (const n of notes) addKey(n, oct);
      }
      addKey('c', 7);
    }

    this.renderer = new CanvasRenderer().init(this);
    window.addEventListener('resize', () => { this.renderer.resize(); });

    window.AudioContext = window.AudioContext || (window as any).webkitAudioContext || undefined;
    this.audio = new AudioEngineWeb().init();
  }

  play(note: string, vol: number, participant: any, delay_ms: number, lyric?: any): void {
    if (!this.keys.hasOwnProperty(note) || !participant) return;
    const key = this.keys[note];
    if (key.loaded) this.audio.play(key.note, vol, delay_ms, participant.id);
    if (state.midiOutTest) state.midiOutTest(key.note, vol * 100, delay_ms, participant.id);
    setTimeout(() => {
      this.renderer.visualize(key, participant.color);
      const jq_namediv = $(participant.nameDiv);
      jq_namediv.addClass('play');
      setTimeout(() => { jq_namediv.removeClass('play'); }, 30);
    }, delay_ms || 0);
  }

  stop(note: string, participant: any, delay_ms: number): void {
    if (!this.keys.hasOwnProperty(note)) return;
    const key = this.keys[note];
    if (key.loaded) this.audio.stop(key.note, delay_ms, participant.id);
    if (state.midiOutTest) state.midiOutTest(key.note, 0, delay_ms, participant.id);
  }
}

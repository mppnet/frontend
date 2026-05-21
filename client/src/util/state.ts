import type { Client } from '../libs/Client';
import type { NoteQuota } from '../libs/NoteQuota';

export interface Piano {
  rootElement: HTMLElement;
  keys: Record<string, any>;
  renderer: any;
  audio: any;
  play(note: string, vol: number, participant: any, delay_ms: number, lyric?: any): void;
  stop(note: string, participant: any, delay_ms: number): void;
}

export const state = {
  client: null as Client | null,
  piano: null as Piano | null,
  noteQuota: null as NoteQuota | null,
  soundSelector: null as any,
  chat: null as any,
  midiOutTest: null as ((note: string, vel: number, delay: number, partId: string) => void) | null,
  enableSynth: false,
  synthVoice: null as (new (note: string, time: number) => any) | null,
  mouseY: 0,
};

export function getClient(): Client {
  if (!state.client) throw new Error('Client not initialized');
  return state.client;
}

export function getPiano(): Piano {
  if (!state.piano) throw new Error('Piano not initialized');
  return state.piano;
}

export function getNoteQuota(): NoteQuota {
  if (!state.noteQuota) throw new Error('NoteQuota not initialized');
  return state.noteQuota;
}

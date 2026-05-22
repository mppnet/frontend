import type { Client } from '../libs/Client';
import type { NoteQuota } from '../libs/NoteQuota';
import type { CanvasRenderer } from '../piano/renderer';
import type { AudioEngineWeb } from '../piano/audio';
import type { PianoKey } from '../piano/piano';
import { SoundSelector } from 'src/libs/SoundSelector';

export interface Piano {
  rootElement: HTMLElement;
  keys: Record<string, PianoKey>;
  renderer: CanvasRenderer;
  audio: AudioEngineWeb;
  play(note: string, vol: number, participant: { id: string | undefined; color: string; nameDiv?: HTMLElement }, delay_ms: number, lyric?: string): void;
  stop(note: string, participant: { id: string }, delay_ms: number): void;
}

export interface Chat {
  startDM(part: { _id: string; name: string }): void;
  endDM(): void;
  startReply(part: { _id: string; name: string }, id: string, msg?: string): void;
  startDmReply(part: { _id: string; name: string }, id: string): void;
  cancelReply(part: { _id: string; name: string }): void;
  show(): void;
  hide(): void;
  clear(): void;
  scrollToBottom(): void;
  blur(): void;
  send(message: string): void;
  receive(msg: Record<string, unknown>): void;
}

export const state = {
  client: null as Client | null,
  piano: null as Piano | null,
  noteQuota: null as NoteQuota | null,
  soundSelector: null as SoundSelector | null,
  chat: null as Chat | null,
  midiOutTest: null as ((note: string, vel: number, delay: number, partId: string) => void) | null,
  enableSynth: false,
  synthVoice: null as (new (note: string, time: number) => { stop: (time: number) => void }) | null,
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

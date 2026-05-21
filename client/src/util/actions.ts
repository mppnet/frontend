import { state, getClient, getNoteQuota, getPiano } from './state';
import { DEFAULT_VELOCITY } from './constants';

let autoSustain = false;
let sustain = false;
const heldNotes: Record<string, boolean> = {};
const sustainedNotes: Record<string, boolean> = {};

function defaultPress(id: string, vol?: number): void {
  const client = getClient();
  const noteQuota = getNoteQuota();
  const piano = getPiano();
  if (!client.preventsPlaying() && noteQuota.spend(1)) {
    heldNotes[id] = true;
    sustainedNotes[id] = true;
    piano.play(id, vol !== undefined ? vol : DEFAULT_VELOCITY, client.getOwnParticipant(), 0);
    client.startNote(id, vol);
  }
}

function defaultRelease(id: string): void {
  if (heldNotes[id]) {
    heldNotes[id] = false;
    if ((autoSustain || sustain) && !state.enableSynth) {
      sustainedNotes[id] = true;
    } else {
      const noteQuota = getNoteQuota();
      if (noteQuota.spend(1)) {
        const client = getClient();
        const piano = getPiano();
        piano.stop(id, client.getOwnParticipant(), 0);
        client.stopNote(id);
        sustainedNotes[id] = false;
      }
    }
  }
}

function defaultPressSustain(): void {
  sustain = true;
}

function defaultReleaseSustain(): void {
  sustain = false;
  if (!autoSustain) {
    for (const id in sustainedNotes) {
      if (sustainedNotes.hasOwnProperty(id) && sustainedNotes[id] && !heldNotes[id]) {
        sustainedNotes[id] = false;
        const noteQuota = getNoteQuota();
        if (noteQuota.spend(1)) {
          const client = getClient();
          const piano = getPiano();
          piano.stop(id, client.getOwnParticipant(), 0);
          client.stopNote(id);
        }
      }
    }
  }
}
let _press = defaultPress;
let _release = defaultRelease;
let _pressSustain = defaultPressSustain;
let _releaseSustain = defaultReleaseSustain;

export function press(id: string, vol?: number): void { _press(id, vol); }
export function release(id: string): void { _release(id); }
export function pressSustain(): void { _pressSustain(); }
export function releaseSustain(): void { _releaseSustain(); }

export function setPress(fn: typeof defaultPress) { _press = fn; }
export function setRelease(fn: typeof defaultRelease) { _release = fn; }
export function setPressSustain(fn: typeof defaultPressSustain) { _pressSustain = fn; }
export function setReleaseSustain(fn: typeof defaultReleaseSustain) { _releaseSustain = fn; }

export function getAutoSustain(): boolean { return autoSustain; }
export function setAutoSustain(v: boolean): void { autoSustain = v; }
export function getSustain(): boolean { return sustain; }
export function getHeldNotes(): Record<string, boolean> { return heldNotes; }
export function getSustainedNotes(): Record<string, boolean> { return sustainedNotes; }

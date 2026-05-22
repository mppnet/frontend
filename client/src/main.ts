import { settings } from './modules/settings/settings';
import { state } from './util/state';
import { Piano } from './piano/piano';
import { SoundSelector } from './libs/SoundSelector';
import { initConnection } from './modules/connection';
import { initKeyboard, captureKeyboard } from './modules/keyboard';
import { initRooms } from './modules/rooms';
import { initChat } from './modules/chat';
import { initMidi } from './piano/midi';
import { initSynth } from './piano/synth';
import { initSettingsUI } from './modules/settings/settings-ui';
import { initConfetti } from './modules/confetti';
import { Notification } from './libs/Notification';
import { press, release, pressSustain, releaseSustain, setPress, setRelease, setPressSustain, setReleaseSustain } from './util/actions';
import { start } from './util/translations';

if (location.host === 'multiplayerpiano.com') {
  const url = new URL('https://multiplayerpiano.net/' + location.search);
  if (localStorage.token) url.searchParams.set('token', localStorage.token);
  location.replace(url.toString());
  throw new Error('Redirecting to multiplayerpiano.net');
}

if (location.host === 'multiplayerpiano.net') {
  const url = new URL(location.href);
  const token = url.searchParams.get('token');
  if (token) {
    localStorage.token = token;
    url.searchParams.delete('token');
    location.replace(url.toString());
    throw new Error('Finalizing redirect.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  start();

  console.log('%cMPP Developer Console', 'color: #0066ff; font-size:20px;');
  console.log(
    '%cCheck out the client source: https://github.com/mppnet/frontend/tree/main/client\nGuide for developers: https://docs.google.com/document/d/1OrxwdLD1l1TE8iau6ToETVmnLuLXyGBhA0VfAY1Lf14/edit?usp=sharing',
    'color:gray; font-size:12px;',
  );

  const piano = new Piano(document.getElementById('piano')!);
  state.piano = piano;

  const soundSelector = new SoundSelector(piano);
  soundSelector.addPacks([
    '/sounds/Emotional/', '/sounds/Emotional_2.0/', '/sounds/GreatAndSoftPiano/',
    '/sounds/HardAndToughPiano/', '/sounds/HardPiano/', '/sounds/Harp/',
    '/sounds/Harpsicord/', '/sounds/LoudAndProudPiano/', '/sounds/MLG/',
    '/sounds/Music_Box/', '/sounds/NewPiano/', '/sounds/Orchestra/',
    '/sounds/Piano2/', '/sounds/PianoSounds/', '/sounds/Rhodes_MK1/',
    '/sounds/SoftPiano/', '/sounds/Steinway_Grand/', '/sounds/Untitled/',
    '/sounds/Vintage_Upright/', '/sounds/Vintage_Upright_Soft/',
  ]);
  soundSelector.init();
  state.soundSelector = soundSelector;

  const client = initConnection();
  initKeyboard();
  initRooms();
  const chat = initChat();
  initMidi();
  initSynth();
  initSettingsUI();
  initConfetti();

  (window as any).MPP = {
    get press() { return press; },
    set press(fn: any) { setPress(fn); },
    get release() { return release; },
    set release(fn: any) { setRelease(fn); },
    get pressSustain() { return pressSustain; },
    set pressSustain(fn: any) { setPressSustain(fn); },
    get releaseSustain() { return releaseSustain; },
    set releaseSustain(fn: any) { setReleaseSustain(fn); },
    piano,
    client,
    chat,
    noteQuota: state.noteQuota,
    soundSelector,
    Notification,
  };
});

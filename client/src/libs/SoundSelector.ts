import { Notification } from './Notification';
import type { Piano } from '../piano';

declare const $: any;

const soundDomain = window.location.hostname === 'localhost'
  ? `http://${location.host}`
  : 'https://multiplayerpiano.net';

export class SoundSelector {
  initialized: boolean = false;
  keys: Record<string, any>;
  loading: Record<string, boolean> = {};
  notification: any;
  packs: any[] = [];
  piano: Piano;
  soundSelection: string;

  constructor(piano: Piano) {
    this.keys = piano.keys;
    this.piano = piano;
    this.soundSelection = localStorage.soundSelection || 'mppclassic';
    this.addPack({
      name: 'MPP Classic',
      keys: Object.keys(this.piano.keys),
      ext: '.mp3',
      url: '/sounds/mppclassic/',
    });
  }

  addPack(pack: any, load?: boolean): void {
    this.loading[pack.url || pack] = true;
    const self = this;

    function add(obj: any) {
      for (let i = 0; i < self.packs.length; i++) {
        if (obj.name === self.packs[i].name) return console.warn('Sounds already added!!');
      }
      if (obj.url.substr(obj.url.length - 1) !== '/') obj.url = obj.url + '/';
      const html = document.createElement('li') as any;
      html.classList = 'pack';
      html.innerText = obj.name + ' (' + obj.keys.length + ' keys)';
      html.onclick = () => { self.loadPack(obj.name); self.notification.close(); };
      obj.html = html;
      self.packs.push(obj);
      self.packs.sort((a: any, b: any) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
      if (load) self.loadPack(obj.name);
      delete self.loading[obj.url];
    }

    if (typeof pack === 'string') {
      let useDomain = true;
      if (pack.match(/^(http|https):\/\//i)) useDomain = false;
      $.getJSON((useDomain ? soundDomain : '') + pack + '/info.json').done((json: any) => {
        json.url = pack;
        add(json);
      });
    } else add(pack);
  }
  addPacks(packs: any[]): void {
    for (const p of packs) this.addPack(p);
  }

  init(): void {
    if (this.initialized) return console.warn('Sound selector already initialized!') as any;
    if (Object.keys(this.loading).length) {
      setTimeout(() => { this.init(); }, 250);
      return;
    }
    const self = this;
    $('#sound-btn').on('click', () => {
      if (document.getElementById('Notification-Sound-Selector') != null) return self.notification.close();
      const html = document.createElement('ul');
      for (let i = 0; i < self.packs.length; i++) {
        const pack = self.packs[i];
        pack.html.classList = pack.name === self.soundSelection ? 'pack enabled' : 'pack';
        pack.html.setAttribute('translated', '');
        html.appendChild(pack.html);
      }
      self.notification = new Notification({ title: 'Sound Selector', html, id: 'Sound-Selector', duration: -1, target: '#sound-btn' });
    });
    this.initialized = true;
    this.loadPack(this.soundSelection, true);
  }

  loadPack(name: string, force?: boolean): void {
    let pack: any = name;
    for (let i = 0; i < this.packs.length; i++) {
      if (this.packs[i].name === name) { pack = this.packs[i]; break; }
    }
    if (typeof pack === 'string') {
      console.warn('Sound pack does not exist! Loading default pack...');
      return this.loadPack('MPP Classic');
    }
    if (pack.name === this.soundSelection && !force) return;
    if (pack.keys.length !== Object.keys(this.piano.keys).length) {
      this.piano.keys = {} as any;
      for (let i = 0; i < pack.keys.length; i++) (this.piano.keys as any)[pack.keys[i]] = this.keys[pack.keys[i]];
      this.piano.renderer.resize();
    }
    for (const i in this.piano.keys) {
      if (!this.piano.keys.hasOwnProperty(i)) continue;
      const key = (this.piano.keys as any)[i];
      key.loaded = false;
      let useDomain = true;
      if (pack.url.match(/^(http|https):\/\//i)) useDomain = false;
      this.piano.audio.load(key.note, (useDomain ? soundDomain : '') + pack.url + key.note + pack.ext, () => {
        key.loaded = true;
        key.timeLoaded = Date.now();
      });
    }
    if (localStorage) localStorage.soundSelection = pack.name;
    this.soundSelection = pack.name;
  }

  removePack(name: string): void {
    for (let i = 0; i < this.packs.length; i++) {
      if (this.packs[i].name === name) {
        this.packs.splice(i, 1);
        if (name === this.soundSelection) this.loadPack(this.packs[0].name);
        return;
      }
    }
    console.warn('Sound pack not found!');
  }
}

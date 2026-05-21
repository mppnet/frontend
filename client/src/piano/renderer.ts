import { Rect } from '../libs/Rect';
import { DEFAULT_VELOCITY, BASIC_PIANO_SCALES } from '../util/constants';
import { settings } from '../modules/settings/settings';
import { press, release } from '../util/actions';

declare const $: any;

export class Renderer {
  piano: any;
  width: number = 0;
  height: number = 0;

  init(piano: any): this {
    this.piano = piano;
    this.resize();
    return this;
  }

  resize(width?: number, height?: number): void {
    if (width === undefined) width = $(this.piano.rootElement).width();
    if (height === undefined) height = Math.floor(width! * 0.2);
    $(this.piano.rootElement).css({
      height: height + 'px',
      marginTop: Math.floor($(window).height() / 2 - height / 2) + 'px',
    });
    this.width = width! * window.devicePixelRatio;
    this.height = height * window.devicePixelRatio;
  }

  visualize(_key: any, _color: string): void {}
}

export class CanvasRenderer extends Renderer {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  whiteKeyWidth: number = 0;
  whiteKeyHeight: number = 0;
  blackKeyWidth: number = 0;
  blackKeyHeight: number = 0;
  blackKeyOffset: number = 0;
  keyMovement: number = 0;
  whiteBlipWidth: number = 0;
  whiteBlipHeight: number = 0;
  whiteBlipX: number = 0;
  whiteBlipY: number = 0;
  blackBlipWidth: number = 0;
  blackBlipHeight: number = 0;
  blackBlipX: number = 0;
  blackBlipY: number = 0;
  whiteKeyRender!: HTMLCanvasElement;
  blackKeyRender!: HTMLCanvasElement;
  shadowRender: HTMLCanvasElement[] = [];
  noteLyrics: any = {};
  init(piano: any): this {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    piano.rootElement.appendChild(this.canvas);
    super.init(piano);

    const self = this;
    const render = () => { self.redraw(); requestAnimationFrame(render); };
    requestAnimationFrame(render);

    let mouse_down = false;
    let last_key: any = null;
    $(piano.rootElement).mousedown((event: any) => {
      mouse_down = true;
      if (!settings.noPreventDefault) event.preventDefault();
      const pos = CanvasRenderer.translateMouseEvent(event);
      const hit = self.getHit(pos.x, pos.y);
      if (hit) { press(hit.key.note, hit.v); last_key = hit.key; }
    });
    piano.rootElement.addEventListener('touchstart', (event: any) => {
      mouse_down = true;
      if (!settings.noPreventDefault) event.preventDefault();
      for (const i in event.changedTouches) {
        const pos = CanvasRenderer.translateMouseEvent(event.changedTouches[i]);
        const hit = self.getHit(pos.x, pos.y);
        if (hit) { press(hit.key.note, hit.v); last_key = hit.key; }
      }
    }, false);
    $(window).mouseup((_event: any) => {
      if (last_key) release(last_key.note);
      mouse_down = false;
      last_key = null;
    });
    return this;
  }
  resize(width?: number, height?: number): void {
    super.resize(width, height);
    if (this.width < 52 * 2) this.width = 52 * 2;
    if (this.height < this.width * 0.2) this.height = Math.floor(this.width * 0.2);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = this.width / window.devicePixelRatio + 'px';
    this.canvas.style.height = this.height / window.devicePixelRatio + 'px';

    this.whiteKeyWidth = Math.floor(this.width / 52);
    this.whiteKeyHeight = Math.floor(this.height * 0.9);
    this.blackKeyWidth = Math.floor(this.whiteKeyWidth * 0.75);
    this.blackKeyHeight = Math.floor(this.height * 0.5);
    this.blackKeyOffset = Math.floor(this.whiteKeyWidth - this.blackKeyWidth / 2);
    this.keyMovement = Math.floor(this.whiteKeyHeight * 0.015);

    this.whiteBlipWidth = Math.floor(this.whiteKeyWidth * 0.7);
    this.whiteBlipHeight = Math.floor(this.whiteBlipWidth * 0.8);
    this.whiteBlipX = Math.floor((this.whiteKeyWidth - this.whiteBlipWidth) / 2);
    this.whiteBlipY = Math.floor(this.whiteKeyHeight - this.whiteBlipHeight * 1.2);
    this.blackBlipWidth = Math.floor(this.blackKeyWidth * 0.7);
    this.blackBlipHeight = Math.floor(this.blackBlipWidth * 0.8);
    this.blackBlipY = Math.floor(this.blackKeyHeight - this.blackBlipHeight * 1.2);
    this.blackBlipX = Math.floor((this.blackKeyWidth - this.blackBlipWidth) / 2);

    this.prerenderKeys();
    this.prerenderShadows();
    this.updateKeyRects();
  }

  private prerenderKeys(): void {
    this.whiteKeyRender = document.createElement('canvas');
    this.whiteKeyRender.width = this.whiteKeyWidth;
    this.whiteKeyRender.height = this.height + 10;
    let ctx = this.whiteKeyRender.getContext('2d')!;
    if (ctx.createLinearGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.whiteKeyHeight);
      gradient.addColorStop(0, '#eee');
      gradient.addColorStop(0.75, '#fff');
      gradient.addColorStop(1, '#dad4d4');
      ctx.fillStyle = gradient;
    } else { ctx.fillStyle = '#fff'; }
    ctx.strokeStyle = '#000';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
    ctx.lineWidth = 4;
    ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);

    this.blackKeyRender = document.createElement('canvas');
    this.blackKeyRender.width = this.blackKeyWidth + 10;
    this.blackKeyRender.height = this.blackKeyHeight + 10;
    ctx = this.blackKeyRender.getContext('2d')!;
    if (ctx.createLinearGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.blackKeyHeight);
      gradient.addColorStop(0, '#000');
      gradient.addColorStop(1, '#444');
      ctx.fillStyle = gradient;
    } else { ctx.fillStyle = '#000'; }
    ctx.strokeStyle = '#222';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 8;
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
    ctx.lineWidth = 4;
    ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
  }
  private prerenderShadows(): void {
    this.shadowRender = [];
    const y = -this.canvas.height * 2;
    for (let j = 0; j < 2; j++) {
      const canvas = document.createElement('canvas');
      this.shadowRender[j] = canvas;
      canvas.width = this.canvas.width;
      canvas.height = this.canvas.height;
      const ctx = canvas.getContext('2d')!;
      const sharp = j ? true : false;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 1;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = this.keyMovement * 3;
      ctx.shadowOffsetY = -y + this.keyMovement;
      if (sharp) { ctx.shadowOffsetX = this.keyMovement; }
      else { ctx.shadowOffsetX = 0; ctx.shadowOffsetY = -y + this.keyMovement; }
      for (const i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i)) continue;
        const key = this.piano.keys[i];
        if (key.sharp !== sharp) continue;
        if (key.sharp) {
          ctx.fillRect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2, y + ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
        } else {
          ctx.fillRect(this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2, y + ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
        }
      }
    }
  }

  private updateKeyRects(): void {
    for (const i in this.piano.keys) {
      if (!this.piano.keys.hasOwnProperty(i)) continue;
      const key = this.piano.keys[i];
      if (key.sharp) {
        key.rect = new Rect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial, 0, this.blackKeyWidth, this.blackKeyHeight);
      } else {
        key.rect = new Rect(this.whiteKeyWidth * key.spatial, 0, this.whiteKeyWidth, this.whiteKeyHeight);
      }
    }
  }

  visualize(key: any, color: string): void {
    key.timePlayed = Date.now();
    key.blips.push({ time: key.timePlayed, color });
  }
  redraw(): void {
    const now = Date.now();
    const timeLoadedEnd = now - 1000;
    const timePlayedEnd = now - 100;
    const timeBlipEnd = now - 1000;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let j = 0; j < 2; j++) {
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.shadowRender[j], 0, 0);
      const sharp = j ? true : false;
      for (const i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i)) continue;
        const key = this.piano.keys[i];
        if (key.sharp !== sharp) continue;

        if (!key.loaded) { this.ctx.globalAlpha = 0.2; }
        else if (key.timeLoaded > timeLoadedEnd) { this.ctx.globalAlpha = ((now - key.timeLoaded) / 1000) * 0.8 + 0.2; }
        else { this.ctx.globalAlpha = 1.0; }

        let y = 0;
        if (key.timePlayed > timePlayedEnd) {
          y = Math.floor(this.keyMovement - ((now - key.timePlayed) / 100) * this.keyMovement);
        }
        let x = Math.floor(key.sharp ? this.blackKeyOffset + this.whiteKeyWidth * key.spatial : this.whiteKeyWidth * key.spatial);
        const image = key.sharp ? this.blackKeyRender : this.whiteKeyRender;
        this.ctx.drawImage(image, x, y);

        let keyName = key.baseNote[0].toUpperCase();
        if (sharp) keyName += '#';
        keyName += key.octave + 1;

        if (settings.showPianoNotes) {
          this.ctx.font = `${(key.sharp ? this.blackKeyWidth : this.whiteKeyWidth) / 2}px Arial`;
          this.ctx.fillStyle = key.sharp ? 'white' : 'black';
          this.ctx.textAlign = 'center';
          if (keyName.includes('#')) {
            this.ctx.fillText(keyName, x + (key.sharp ? this.blackKeyWidth : this.whiteKeyWidth) / 2, y + (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight) - 30 - this.ctx.lineWidth);
          }
          keyName = keyName.replace('C#', 'D♭').replace('D#', 'E♭').replace('F#', 'G♭').replace('G#', 'A♭').replace('A#', 'B♭');
          this.ctx.fillText(keyName, x + (key.sharp ? this.blackKeyWidth : this.whiteKeyWidth) / 2, y + (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight) - 10 - this.ctx.lineWidth);
        }

        const highlightScale = BASIC_PIANO_SCALES[settings.highlightScaleNotes || ''];
        if (highlightScale && key.loaded) {
          keyName = keyName.replace('C#', 'D♭').replace('D#', 'E♭').replace('F#', 'G♭').replace('G#', 'A♭').replace('A#', 'B♭');
          const keynameNoOctave = keyName.slice(0, -1);
          if (highlightScale.includes(keynameNoOctave)) {
            const prev = this.ctx.globalAlpha;
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = '#0f0';
            if (key.sharp) this.ctx.fillRect(x, y, this.blackKeyWidth, this.blackKeyHeight);
            else this.ctx.fillRect(x, y, this.whiteKeyWidth, this.whiteKeyHeight);
            this.ctx.globalAlpha = prev;
          }
        }

        if (key.blips.length) {
          const alpha = this.ctx.globalAlpha;
          let w: number, h: number;
          if (key.sharp) { x += this.blackBlipX; y = this.blackBlipY; w = this.blackBlipWidth; h = this.blackBlipHeight; }
          else { x += this.whiteBlipX; y = this.whiteBlipY; w = this.whiteBlipWidth; h = this.whiteBlipHeight; }
          for (let b = 0; b < key.blips.length; b++) {
            const blip = key.blips[b];
            if (blip.time > timeBlipEnd) {
              this.ctx.fillStyle = blip.color;
              this.ctx.globalAlpha = alpha - ((now - blip.time) / 1000) * alpha;
              this.ctx.fillRect(x, y, w, h);
            } else { key.blips.splice(b, 1); --b; }
            y -= Math.floor(h * 1.1);
          }
        }
      }
    }
    this.ctx.restore();
  }
  getHit(x: number, y: number): { key: any; v: number } | null {
    for (let j = 0; j < 2; j++) {
      const sharp = j ? false : true;
      for (const i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i)) continue;
        const key = this.piano.keys[i];
        if (key.sharp !== sharp) continue;
        if (key.rect.contains(x, y)) {
          let v = y / (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight);
          v += 0.25;
          v *= DEFAULT_VELOCITY;
          if (v > 1.0) v = 1.0;
          return { key, v };
        }
      }
    }
    return null;
  }

  static isSupported(): boolean {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }

  static translateMouseEvent(evt: any): { x: number; y: number } {
    let element = evt.target;
    let offx = 0;
    let offy = 0;
    do {
      if (!element) break;
      offx += element.offsetLeft;
      offy += element.offsetTop;
    } while ((element = element.offsetParent));
    return {
      x: (evt.pageX - offx) * window.devicePixelRatio,
      y: (evt.pageY - offy) * window.devicePixelRatio,
    };
  }
}

import { Notification } from '../libs/Notification';
import { state } from '../util/state';

export class AudioEngine {
  volume: number = 0.6;
  sounds: Record<string, any> = {};
  paused: boolean = true;

  init(): this {
    return this;
  }

  load(_id: string, _url: string, _cb?: () => void): void {}
  play(_id: string, _vol: number, _delay_ms: number, _part_id: string): void {}
  stop(_id: string, _delay_ms: number, _part_id: string): void {}

  setVolume(vol: number): void {
    this.volume = vol;
  }

  resume(): void {
    this.paused = false;
  }
}

export class AudioEngineWeb extends AudioEngine {
  threshold: number = 0;
  worker: Worker;
  context!: AudioContext;
  masterGain!: GainNode;
  limiterNode!: DynamicsCompressorNode;
  pianoGain!: GainNode;
  synthGain!: GainNode;
  playings: Record<string, any> = {};

  constructor() {
    super();
    this.worker = new Worker('/workerTimer.js');
    this.worker.onmessage = (event) => {
      if (event.data.args) {
        if (event.data.args.action === 0) {
          this.actualPlay(event.data.args.id, event.data.args.vol, event.data.args.time, event.data.args.part_id);
        } else {
          this.actualStop(event.data.args.id, event.data.args.time, event.data.args.part_id);
        }
      }
    };
  }
  init(): this {
    super.init();
    this.context = new AudioContext({ latencyHint: 'interactive' });
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.masterGain.gain.value = this.volume;

    this.limiterNode = this.context.createDynamicsCompressor();
    this.limiterNode.threshold.value = -10;
    this.limiterNode.knee.value = 0;
    this.limiterNode.ratio.value = 20;
    this.limiterNode.attack.value = 0;
    this.limiterNode.release.value = 0.1;
    this.limiterNode.connect(this.masterGain);

    this.pianoGain = this.context.createGain();
    this.pianoGain.gain.value = 0.5;
    this.pianoGain.connect(this.limiterNode);
    this.synthGain = this.context.createGain();
    this.synthGain.gain.value = 0.5;
    this.synthGain.connect(this.limiterNode);

    this.playings = {};
    return this;
  }

  load(id: string, url: string, cb?: () => void): void {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.responseType = 'arraybuffer';
    req.addEventListener('readystatechange', () => {
      if (req.readyState !== 4) return;
      try {
        this.context.decodeAudioData(req.response, (buffer) => {
          this.sounds[id] = buffer;
          if (cb) cb();
        });
      } catch (e) {
        new Notification({
          id: 'audio-download-error',
          title: 'Problem',
          text: 'For some reason, an audio download failed with a status of ' + req.status + '. ',
          target: '#piano',
          duration: 10000,
        });
      }
    });
    req.send();
  }

  actualPlay(id: string, vol: number, time: number, part_id: string): void {
    if (this.paused) return;
    if (!this.sounds.hasOwnProperty(id)) return;
    const source = this.context.createBufferSource();
    source.buffer = this.sounds[id];
    const gain = this.context.createGain();
    gain.gain.value = vol;
    source.connect(gain);
    gain.connect(this.pianoGain);
    source.start(time);
    if (this.playings[id]) {
      const playing = this.playings[id];
      playing.gain.gain.setValueAtTime(playing.gain.gain.value, time);
      playing.gain.gain.linearRampToValueAtTime(0.0, time + 0.2);
      playing.source.stop(time + 0.21);
      if (state.enableSynth && playing.voice) {
        playing.voice.stop(time);
      }
    }
    this.playings[id] = { source, gain, part_id };
    if (state.enableSynth && state.synthVoice) {
      this.playings[id].voice = new state.synthVoice(id, time);
    }
  }
  play(id: string, vol: number, delay_ms: number, part_id: string): void {
    if (!this.sounds.hasOwnProperty(id)) return;
    const time = this.context.currentTime + delay_ms / 1000;
    const delay = delay_ms - this.threshold;
    if (delay <= 0) this.actualPlay(id, vol, time, part_id);
    else {
      this.worker.postMessage({
        delay,
        args: { action: 0, id, vol, time, part_id },
      });
    }
  }

  actualStop(id: string, time: number, part_id: string): void {
    if (this.playings.hasOwnProperty(id) && this.playings[id] && this.playings[id].part_id === part_id) {
      const gain = this.playings[id].gain.gain;
      gain.setValueAtTime(gain.value, time);
      gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16);
      gain.linearRampToValueAtTime(0.0, time + 0.4);
      this.playings[id].source.stop(time + 0.41);
      if (this.playings[id].voice) {
        this.playings[id].voice.stop(time);
      }
      this.playings[id] = null;
    }
  }

  stop(id: string, delay_ms: number, part_id: string): void {
    const time = this.context.currentTime + delay_ms / 1000;
    const delay = delay_ms - this.threshold;
    if (delay <= 0) this.actualStop(id, time, part_id);
    else {
      this.worker.postMessage({
        delay,
        args: { action: 1, id, time, part_id },
      });
    }
  }

  setVolume(vol: number): void {
    super.setVolume(vol);
    this.masterGain.gain.value = this.volume;
  }

  resume(): void {
    this.paused = false;
    this.context.resume();
  }
}

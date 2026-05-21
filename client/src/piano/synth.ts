import { mixin, Knob } from '../util/util';
import { Notification } from '../libs/Notification';
import { state, getPiano } from '../util/state';
import { MIDI_KEY_NAMES, MIDI_TRANSPOSE } from '../util/constants';

declare const $: any;

export function initSynth(): void {
  const piano = getPiano();
  const audio = piano.audio;
  const context = piano.audio.context;
  const synth_gain = context.createGain();
  synth_gain.gain.value = 0.05;
  synth_gain.connect(audio.synthGain);

  const osc_types = ['sine', 'square', 'sawtooth', 'triangle'];
  let osc_type_index = 1;
  let osc1_type = 'square';
  let osc1_attack = 0;
  let osc1_decay = 0.2;
  let osc1_sustain = 0.5;
  let osc1_release = 2.0;

  function SynthVoice(this: any, note_name: string, time: number) {
    const note_number = MIDI_KEY_NAMES.indexOf(note_name) + 9 - MIDI_TRANSPOSE;
    const freq = Math.pow(2, (note_number - 69) / 12) * 440.0;
    this.osc = context.createOscillator();
    this.osc.type = osc1_type;
    this.osc.frequency.value = freq;
    this.gain = context.createGain();
    this.gain.gain.value = 0;
    this.osc.connect(this.gain);
    this.gain.connect(synth_gain);
    this.osc.start(time);
    this.gain.gain.setValueAtTime(0, time);
    this.gain.gain.linearRampToValueAtTime(1, time + osc1_attack);
    this.gain.gain.linearRampToValueAtTime(osc1_sustain, time + osc1_attack + osc1_decay);
  }
  SynthVoice.prototype.stop = function (time: number) {
    this.gain.gain.linearRampToValueAtTime(0, time + osc1_release);
    this.osc.stop(time + osc1_release);
  };

  state.enableSynth = false;
  state.synthVoice = SynthVoice as any;
  const button = document.getElementById('synth-btn')!;
  let notification: any = null;

  button.addEventListener('click', () => {
    if (notification) notification.close();
    else showSynth();
  });

  function showSynth() {
    const html = document.createElement('div');

    const onOffBtn = document.createElement('input') as any;
    mixin(onOffBtn, { type: 'button', value: (window as any).i18nextify.i18next.t('ON/OFF'), className: state.enableSynth ? 'switched-on' : 'switched-off' });
    onOffBtn.addEventListener('click', () => {
      state.enableSynth = !state.enableSynth;
      onOffBtn.className = state.enableSynth ? 'switched-on' : 'switched-off';
      if (!state.enableSynth) {
        for (const i in audio.playings) {
          if (!audio.playings.hasOwnProperty(i)) continue;
          const playing = audio.playings[i];
          if (playing && playing.voice) { playing.voice.osc.stop(); playing.voice = undefined; }
        }
      }
    });
    html.appendChild(onOffBtn);

    let knobCanvas = document.createElement('canvas') as any;
    mixin(knobCanvas, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: 'knob' });
    html.appendChild(knobCanvas);
    let knob = new Knob(knobCanvas, 0, 100, 0.1, 50, 'mix', '%');
    knob.canvas.style.width = '32px';
    knob.canvas.style.height = '32px';
    knob.on('change', (k: any) => { const mix = k.value / 100; audio.pianoGain.gain.value = 1 - mix; audio.synthGain.gain.value = mix; });
    knob.emit('change', knob);

    const typeBtn = document.createElement('input') as any;
    mixin(typeBtn, { type: 'button', value: (window as any).i18nextify.i18next.t(osc_types[osc_type_index]) });
    typeBtn.addEventListener('click', () => { if (++osc_type_index >= osc_types.length) osc_type_index = 0; osc1_type = osc_types[osc_type_index]; typeBtn.value = (window as any).i18nextify.i18next.t(osc1_type); });
    html.appendChild(typeBtn);

    const knobConfigs = [
      { min: 0, max: 1, step: 0.001, value: osc1_attack, name: 'osc1 attack', unit: 's', setter: (v: number) => { osc1_attack = v; } },
      { min: 0, max: 2, step: 0.001, value: osc1_decay, name: 'osc1 decay', unit: 's', setter: (v: number) => { osc1_decay = v; } },
      { min: 0, max: 1, step: 0.001, value: osc1_sustain, name: 'osc1 sustain', unit: 'x', setter: (v: number) => { osc1_sustain = v; } },
      { min: 0, max: 2, step: 0.001, value: osc1_release, name: 'osc1 release', unit: 's', setter: (v: number) => { osc1_release = v; } },
    ];
    for (const cfg of knobConfigs) {
      knobCanvas = document.createElement('canvas');
      mixin(knobCanvas, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: 'knob' });
      html.appendChild(knobCanvas);
      knob = new Knob(knobCanvas, cfg.min, cfg.max, cfg.step, cfg.value, cfg.name, cfg.unit);
      knob.canvas.style.width = '32px';
      knob.canvas.style.height = '32px';
      knob.on('change', ((s: any) => (k: any) => { s(k.value); })(cfg.setter));
      knob.emit('change', knob);
    }

    notification = new Notification({ title: 'Synthesize', html, duration: -1, target: '#synth-btn' });
    notification.on('close', () => { const tip = document.getElementById('tooltip'); if (tip) tip.parentNode!.removeChild(tip); notification = null; });
  }
}

import { Knob } from '../util/util';
import { Notification } from '../libs/Notification';
import { state, getClient, getPiano } from '../util/state';
import { settings } from '../modules/settings/settings';
import { press, release, pressSustain, releaseSustain, getAutoSustain } from '../util/actions';
import { MIDI_KEY_NAMES, MIDI_TRANSPOSE } from '../util/constants';
import { MidiInputInfo } from '../types';

declare global {
  interface MIDIInput {
    enabled: boolean;
    volume: number;
  }

  interface MIDIOutput {
    enabled: boolean;
    volume: number;
  }
}

export function initMidi(): void {
  const gClient = getClient();
  const gPiano = getPiano();

  let devices_json = '[]';
  function sendDevices() {
    gClient.sendArray([{ m: 'devices', list: JSON.parse(devices_json) }]);
  }
  gClient.on('connect', sendDevices);

  const pitchBends: Record<number, number> = {};
  for (let i = 0; i < 16; i++) pitchBends[i] = 0;

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then((midi) => {
      function midimessagehandler(evt: MIDIMessageEvent & { target: { enabled: boolean, volume: number } }) {
        if (!evt.target!.enabled) return;
        if (!evt.data) return;

        const channel = evt.data[0] & 0xf;
        const cmd = evt.data[0] >> 4;
        const note_number = evt.data[1];
        let vel = evt.data[2];
        if (settings.disableMIDIDrumChannel && channel === 9) return;

        const { getTranspose } = require('../modules/keyboard');
        const transpose = getTranspose();

        if (cmd === 8 || (cmd === 9 && vel === 0)) {
          release(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE + transpose + pitchBends[channel]]);
        } else if (cmd === 9) {
          if (evt.target.volume !== undefined) vel *= evt.target.volume;
          press(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE + transpose + pitchBends[channel]], vel / 127);
        } else if (cmd === 11) {
          if (!getAutoSustain()) {
            if (note_number === 64) {
              if (vel > 20) pressSustain();
              else releaseSustain();
            }
          }
        } else if (cmd === 14) {
          let pitchMod = evt.data[1] + (evt.data[2] << 7) - 0x2000;
          pitchMod = Math.round(pitchMod / 1000);
          pitchBends[channel] = pitchMod;
        }
      }
      function deviceInfo(dev: MidiInputInfo) {
        return { type: dev.type, manufacturer: dev.manufacturer, name: dev.name, version: dev.version, enabled: dev.enabled, volume: dev.volume };
      }

      function updateDevices() {
        const list: Array<MidiInputInfo> = [];
        if (midi.inputs.size > 0) {
          const inputs = midi.inputs.values();
          for (let it = inputs.next(); it && !it.done; it = inputs.next()) list.push(deviceInfo(it.value));
        }
        if (midi.outputs.size > 0) {
          const outputs = midi.outputs.values();
          for (let it = outputs.next(); it && !it.done; it = outputs.next()) list.push(deviceInfo(it.value));
        }
        const new_json = JSON.stringify(list);
        if (new_json !== devices_json) { devices_json = new_json; sendDevices(); }
      }

      function plug() {
        if (midi.inputs.size > 0) {
          const inputs = midi.inputs.values();
          for (let it = inputs.next(); it && !it.done; it = inputs.next()) {
            const input = it.value;
            input.onmidimessage = midimessagehandler as ((this: MIDIInput, ev: MIDIMessageEvent) => any);
            if (input.enabled !== false) input.enabled = true;
            if (typeof input.volume === 'undefined') input.volume = 1.0;
          }
        }
        if (midi.outputs.size > 0) {
          const outputs = midi.outputs.values();
          for (let it = outputs.next(); it && !it.done; it = outputs.next()) {
            const output = it.value;
            if (typeof output.volume === 'undefined') output.volume = 1.0;
          }
          state.midiOutTest = (note_name, vel, delay_ms, participantId) => {
            if (!settings.outputOwnNotes && participantId === gClient.participantId) return;
            const note_number = MIDI_KEY_NAMES.indexOf(note_name);
            if (note_number === -1) return;
            const nn = note_number + 9 - MIDI_TRANSPOSE;
            const outputs = midi.outputs.values();
            for (let it = outputs.next(); it && !it.done; it = outputs.next()) {
              const output = it.value;
              if (output.enabled) {
                let v = vel;
                if (output.volume !== undefined) v *= output.volume;
                output.send([0x90, nn, v], window.performance.now() + delay_ms);
              }
            }
          };
        }
        showConnections(false);
        updateDevices();
      }

      midi.addEventListener('statechange', () => { plug(); });

      let connectionsNotification: { close: () => void } | null = null;
      function showConnections(sticky: boolean) {
        const inputs_ul = document.createElement('ul');
        if (midi.inputs.size > 0) {
          const inputs = midi.inputs.values();
          for (let it = inputs.next(); it && !it.done; it = inputs.next()) {
            const input = it.value;
            const li = document.createElement('li') as HTMLLIElement & { connectionId: string };
            li.connectionId = input.id;
            li.classList.add('connection');
            if (input.enabled) li.classList.add('enabled');
            li.textContent = input.name;
            li.addEventListener('click', (evt: Event) => {
              const ins = midi.inputs.values();
              for (let iit = ins.next(); iit && !iit.done; iit = ins.next()) {
                if (iit.value.id === (evt.target as HTMLElement & { connectionId: string }).connectionId) {
                  iit.value.enabled = !iit.value.enabled;
                  (evt.target as HTMLElement).classList.toggle('enabled');
                  updateDevices();
                  return;
                }
              }
            });
            if (settings.midiVolumeTest) {
              let knobCanvas = document.createElement('canvas');
              Object.assign(knobCanvas, { width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: 'knob' });
              li.appendChild(knobCanvas);
              const knob = new Knob(knobCanvas, 0, 2, 0.01, input.volume, 'volume');
              knob.canvas.style.width = '16px';
              knob.canvas.style.height = '16px';
              knob.canvas.style.float = 'right';
              knob.on('change', (k: { value: number }) => { input.volume = k.value; });
              knob.emit('change', knob);
            }
            inputs_ul.appendChild(li);
          }
        } else { inputs_ul.textContent = '(none)'; }

        const outputs_ul = document.createElement('ul');
        if (midi.outputs.size > 0) {
          const outputs = midi.outputs.values();
          for (let it = outputs.next(); it && !it.done; it = outputs.next()) {
            const output = it.value;
            const li = document.createElement('li') as HTMLLIElement & { connectionId: string };
            li.connectionId = output.id;
            li.classList.add('connection');
            if (output.enabled) li.classList.add('enabled');
            li.textContent = output.name;
            li.addEventListener('click', (evt: Event) => {
              const outs = midi.outputs.values();
              for (let oit = outs.next(); oit && !oit.done; oit = outs.next()) {
                if (oit.value.id === (evt.target as HTMLElement & { connectionId: string }).connectionId) {
                  oit.value.enabled = !oit.value.enabled;
                  (evt.target as HTMLElement).classList.toggle('enabled');
                  updateDevices();
                  return;
                }
              }
            });
            if (settings.midiVolumeTest) {
              let knobCanvas = document.createElement('canvas');
              Object.assign(knobCanvas, { width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: 'knob' });
              li.appendChild(knobCanvas);
              const knob = new Knob(knobCanvas, 0, 2, 0.01, output.volume, 'volume');
              knob.canvas.style.width = '16px';
              knob.canvas.style.height = '16px';
              knob.canvas.style.float = 'right';
              knob.on('change', (k: { value: number }) => { output.volume = k.value; });
              knob.emit('change', knob);
            }
            outputs_ul.appendChild(li);
          }
        } else { outputs_ul.textContent = '(none)'; }

        outputs_ul.setAttribute('translated', '');
        inputs_ul.setAttribute('translated', '');
        const div = document.createElement('div');
        let h1 = document.createElement('h1');
        h1.textContent = 'Inputs';
        div.appendChild(h1);
        div.appendChild(inputs_ul);
        h1 = document.createElement('h1');
        h1.textContent = 'Outputs';
        div.appendChild(h1);
        div.appendChild(outputs_ul);
        connectionsNotification = new Notification({ id: 'MIDI-Connections', title: 'MIDI Connections', duration: sticky ? -1 : 4500, html: div, target: '#midi-btn' });
      }

      plug();


      document.getElementById('midi-btn')!.addEventListener('click', () => {
        if (!document.getElementById('Notification-MIDI-Connections')) showConnections(true);
        else connectionsNotification!.close();
      });
    }, () => {});
  }

  window.onerror = function (_message, _url, _line) {};
}

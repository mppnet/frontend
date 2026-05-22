import { Color } from '../libs/Color';
import { getClient } from '../util/state';
import { settings } from './settings/settings';

const DEFAULT_COLOR = '#220022';
const DEFAULT_COLOR2 = '#000022';

export function setBackgroundColor(hex: string, hex2?: string): void {
  const color1 = new Color(hex);
  const color2 = new Color(hex2 || hex);
  if (!hex2) color2.add(-0x40, -0x40, -0x40);
  const bottom = document.getElementById('bottom')!;
  document.body.style.setProperty('--color', color1.toHexa());
  document.body.style.setProperty('--color2', color2.toHexa());
  bottom.style.setProperty('--color', color1.toHexa());
  bottom.style.setProperty('--color2', color2.toHexa());
}

export function setBackgroundColorToDefault(): void {
  setBackgroundColor(DEFAULT_COLOR, DEFAULT_COLOR2);
}

export function initBackground(): void {
  setBackgroundColorToDefault();

  getClient().on('ch', (ch: any) => {
    if (settings.noBackgroundColor) {
      setBackgroundColorToDefault();
      return;
    }
    if (ch.ch.settings) {
      if (ch.ch.settings.color) {
        setBackgroundColor(ch.ch.settings.color, ch.ch.settings.color2);
      } else {
        setBackgroundColorToDefault();
      }
    }
  });
}

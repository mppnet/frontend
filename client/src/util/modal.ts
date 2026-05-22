import { settings } from '../modules/settings/settings';
import { state } from './state';
import { fadeIn, fadeOut } from './util';

let gModal: string | null = null;

export function getModal(): string | null { return gModal; }

export function modalHandleEsc(evt: KeyboardEvent): void {
  if (
    evt.keyCode === 27 ||
    ((evt.keyCode === 32 || evt.keyCode === 13) &&
      document.activeElement &&
      (document.activeElement as HTMLInputElement).type !== 'text' &&
      gModal !== '#age' &&
      gModal !== '#siteban')
  ) {
    closeModal();
    if (!settings.noPreventDefault) evt.preventDefault();
    evt.stopPropagation();
  }
}

export function openModal(selector: string, focus?: string): void {
  if (state.chat) state.chat.blur();
  const { releaseKeyboard } = require('../modules/keyboard');
  releaseKeyboard();
  document.addEventListener('keydown', modalHandleEsc);
  const modals = document.querySelector('#modal #modals') as HTMLElement;
  if (modals) {
    Array.from(modals.children).forEach(child => (child as HTMLElement).style.display = 'none');
  }
  const modal = document.getElementById('modal')!;
  fadeIn(modal, 250);
  const target = document.querySelector(selector) as HTMLElement;
  if (target) target.style.display = 'block';
  if (focus) {
    setTimeout(() => {
      const focusEl = target?.querySelector(focus) as HTMLElement;
      if (focusEl) focusEl.focus();
    }, 100);
  }
  gModal = selector;
}

export function closeModal(): void {
  if (gModal === '#age') return;
  document.removeEventListener('keydown', modalHandleEsc);
  const modal = document.getElementById('modal')!;
  fadeOut(modal, 100);
  const modals = document.querySelector('#modal #modals') as HTMLElement;
  if (modals) {
    Array.from(modals.children).forEach(child => (child as HTMLElement).style.display = 'none');
  }
  const { captureKeyboard } = require('../modules/keyboard');
  captureKeyboard();
  gModal = null;
}

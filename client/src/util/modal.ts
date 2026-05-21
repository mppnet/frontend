import { settings } from '../modules/settings/settings';
import { state } from './state';

declare const $: any;

let gModal: string | null = null;

export function getModal(): string | null { return gModal; }

export function modalHandleEsc(evt: any): void {
  if (
    evt.keyCode === 27 ||
    ((evt.keyCode === 32 || evt.keyCode === 13) &&
      document.activeElement &&
      (document.activeElement as any).type !== 'text' &&
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
  $(document).on('keydown', modalHandleEsc);
  $('#modal #modals > *').hide();
  $('#modal').fadeIn(250);
  $(selector).show();
  setTimeout(() => { $(selector).find(focus).focus(); }, 100);
  gModal = selector;
}

export function closeModal(): void {
  if (gModal === '#age') return;
  $(document).off('keydown', modalHandleEsc);
  $('#modal').fadeOut(100);
  $('#modal #modals > *').hide();
  const { captureKeyboard } = require('../modules/keyboard');
  captureKeyboard();
  gModal = null;
}

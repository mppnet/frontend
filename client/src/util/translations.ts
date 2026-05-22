import * as I18ni from 'i18nextify';
import type { i18n as I18n } from 'i18next';

export const start = I18ni.init({ autorun: false })!.start;

export const i18nextify = I18ni;

export const i18next = I18ni.i18next as I18n;

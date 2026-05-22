import { Notification } from '../libs/Notification';

let knowsYouCanUseKeyboardTimeout: ReturnType<typeof setTimeout> | undefined;
let knowsYouCanUseKeyboardNotification: { close: () => void } | undefined;

export function setKeyboardTimeout(timeout: ReturnType<typeof setTimeout>): void {
  knowsYouCanUseKeyboardTimeout = timeout;
}

export function setKeyboardNotification(notification: Notification): void {
  knowsYouCanUseKeyboardNotification = notification;
}

export function clearKeyboardHint(): void {
  if (knowsYouCanUseKeyboardTimeout) clearTimeout(knowsYouCanUseKeyboardTimeout);
  if (knowsYouCanUseKeyboardNotification) knowsYouCanUseKeyboardNotification.close();
}

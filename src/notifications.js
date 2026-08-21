import { isNotifsEnabled, setNotifsEnabled } from './persistence.js';

export function notifsSupported() {
  return typeof Notification !== 'undefined';
}

// The user's stored preference is only ever "on" if the browser permission
// actually backs it up — a stale '1' left over from before a permission was
// revoked in browser settings should never make the toggle lie.
export function notifsActive() {
  return notifsSupported() && Notification.permission === 'granted' && isNotifsEnabled();
}

export function notifsBlocked() {
  return notifsSupported() && Notification.permission === 'denied';
}

// Must run from a user gesture (a checkbox click) — browsers reject or
// silently ignore permission requests made outside one.
export async function enableNotifications() {
  if (!notifsSupported()) return false;
  const result = Notification.permission === 'granted'
    ? 'granted'
    : await Notification.requestPermission();
  const granted = result === 'granted';
  setNotifsEnabled(granted);
  return granted;
}

export function disableNotifications() {
  setNotifsEnabled(false);
}

// Only worth interrupting the user with an OS notification if they've
// opted in AND aren't already looking at the tab — otherwise the in-page
// completion UI and chime already told them.
export async function notifySessionEnd(title, body) {
  if (!notifsActive()) return;
  if (document.visibilityState === 'visible') return;
  // renotify is required for a same-tag notification to actually re-alert
  // (sound/vibrate) — without it, browsers silently swap the old
  // notification's content with no alert at all, which would make every
  // stage transition after the first one go unnoticed. requireInteraction
  // keeps it on screen instead of auto-dismissing after a few seconds
  // (Chrome desktop only; other browsers ignore it and fall back to their
  // own timeout).
  const options = {
    body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: 'cadence-session-end',
    renotify: true,
    requireInteraction: true,
  };
  try {
    if (navigator.serviceWorker) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) { await reg.showNotification(title, options); return; }
    }
  } catch(e) {}
  try { new Notification(title, options); } catch(e) {}
}

import { fadeOut } from '../util/util';
import { getClient, getPiano } from '../util/state';
import { settings } from './settings/settings';
import { openModal, closeModal } from '../util/modal';
import { getRoomNameFromURL } from '../util/url-utils';
import { Notification } from '../libs/Notification';
import { i18next } from '../util/translations';
import { setKeyboardTimeout, setKeyboardNotification } from './keyboard-hint';

export function initRooms(): void {
  const gClient = getClient();
  const gPiano = getPiano();
  const { captureKeyboard, releaseKeyboard } = require('./keyboard');
  const { getTabIsActive } = require('./connection');
  const volume_slider = document.getElementById('volume-slider') as HTMLInputElement;

  let gKnowsYouCanUseKeyboard = false;
  if (localStorage && localStorage.knowsYouCanUseKeyboard) gKnowsYouCanUseKeyboard = true;
  if (!gKnowsYouCanUseKeyboard) {
    setKeyboardTimeout(setTimeout(() => {
      setKeyboardNotification(new Notification({
        id: 'play',
        title: i18next.t('Did you know!?!'),
        text: i18next.t('You can play the piano with your keyboard, too.  Try it!'),
        target: '#piano',
        duration: 10000,
      }));
    }, 30000));
  }

  if (window.localStorage) {
    if (localStorage.volume) {
      volume_slider.value = localStorage.volume;
      gPiano.audio.setVolume(localStorage.volume);
      document.getElementById('volume-label')!.innerHTML = i18next.t('Volume') + '<span translated>: ' + Math.floor(gPiano.audio.volume * 100) + '%</span>';
    } else localStorage.volume = gPiano.audio.volume;
    const hasBeenHereBefore = !!localStorage.gHasBeenHereBefore;
    localStorage.gHasBeenHereBefore = true;
  }

  // Room list and switching
  (document.querySelector('#room > .info') as HTMLElement).textContent = '--';
  gClient.on('ch', (msg: any) => {
    const channel = msg.ch;
    const info = document.querySelector('#room > .info') as HTMLElement;
    info.textContent = channel._id;
    if (channel.settings.lobby) info.classList.add('lobby'); else info.classList.remove('lobby');
    if (!channel.settings.chat) info.classList.add('no-chat'); else info.classList.remove('no-chat');
    if (channel.settings.crownsolo) info.classList.add('crownsolo'); else info.classList.remove('crownsolo');
    if (channel.settings['no cussing']) info.classList.add('no-cussing'); else info.classList.remove('no-cussing');
    if (!channel.settings.visible) info.classList.add('not-visible'); else info.classList.remove('not-visible');
  });
  gClient.on('ls', (ls: any) => {
    for (const i in ls.u) {
      if (!ls.u.hasOwnProperty(i)) continue;
      const room = ls.u[i];
      let info = document.querySelector('#room .info[roomid="' + (room.id + '').replace(/[\\"']/g, '\\$&').replace(/ /g, '\\0') + '"]') as HTMLElement | null;
      if (!info) {
        info = document.createElement('div');
        info.className = 'info';
        info.setAttribute('roomname', room._id);
        info.setAttribute('roomid', room.id);
        document.querySelector('#room .more')!.appendChild(info);
      }
      info.setAttribute('translated', '');
      info.textContent = room.count + '/' + ('limit' in room.settings ? room.settings.limit : 20) + ' ' + room._id;
      if (room.settings.lobby) info.classList.add('lobby'); else info.classList.remove('lobby');
      if (!room.settings.chat) info.classList.add('no-chat'); else info.classList.remove('no-chat');
      if (room.settings.crownsolo) info.classList.add('crownsolo'); else info.classList.remove('crownsolo');
      if (room.settings['no cussing']) info.classList.add('no-cussing'); else info.classList.remove('no-cussing');
      if (!room.settings.visible) info.classList.add('not-visible'); else info.classList.remove('not-visible');
      if (room.banned) info.classList.add('banned'); else info.classList.remove('banned');
    }
  });

  document.getElementById('room')!.addEventListener('click', (evt: any) => {
    evt.stopPropagation();
    if ((evt.target as HTMLElement).classList.contains('info') && (evt.target as HTMLElement).closest('.more') !== null) {
      fadeOut(document.querySelector('#room .more') as HTMLElement, 250);
      const selected_name = (evt.target as HTMLElement).getAttribute('roomname');
      if (typeof selected_name !== 'undefined') {
        if (!evt.ctrlKey) changeRoom(selected_name!, 'right');
        else window.open(`?c=${selected_name}`);
      }
      return false;
    } else if ((evt.target as HTMLElement).classList.contains('new')) {
      openModal('#new-room', 'input[name=name]');
    }
    const doc_click = (evt2: any) => {
      if ((evt2.target as HTMLElement).closest('#room')) return;
      document.removeEventListener('mousedown', doc_click);
      fadeOut(document.querySelector('#room .more') as HTMLElement, 250);
      gClient.sendArray([{ m: '-ls' }]);
    };
    document.addEventListener('mousedown', doc_click);
    document.querySelectorAll('#room .more .info').forEach(el => el.remove());
    (document.querySelector('#room .more') as HTMLElement).style.display = 'block';
    gClient.sendArray([{ m: '+ls' }]);
  });

  document.getElementById('new-room-btn')!.addEventListener('click', (evt: any) => { evt.stopPropagation(); openModal('#new-room', 'input[name=name]'); });
  document.getElementById('play-alone-btn')!.addEventListener('click', (evt: any) => {
    evt.stopPropagation();
    const room_name = 'Room' + Math.floor(Math.random() * 1000000000000);
    changeRoom(room_name, 'right', { visible: false });
    setTimeout(() => {
      new Notification({ id: 'share', title: i18next.t('Playing alone'), html: i18next.t('You are playing alone in a room by yourself, but you can always invite friends by sending them the link.') + '<br><a href="' + location.href + '">' + location.href + '</a>', duration: 25000 });
    }, 1000);
  });

  document.getElementById('account-btn')!.addEventListener('click', (evt: any) => {
    evt.stopPropagation();
    openModal('#account');
    if (gClient.accountInfo) {
      (document.querySelector('#account #account-info') as HTMLElement).style.display = 'block';
      if (gClient.accountInfo.type === 'discord') {
        (document.querySelector('#account #avatar-image') as HTMLImageElement).src = gClient.accountInfo.avatar ?? "https://placehold.co/300x300";
        document.querySelector('#account #logged-in-user-text')!.textContent = `@${gClient.accountInfo.username}`;
      }
    } else { (document.querySelector('#account #account-info') as HTMLElement).style.display = 'none'; }
  });
  let gHistoryDepth = 0;

  function changeRoom(name: string, direction?: string, roomSettings?: any, push?: boolean) {
    if (!roomSettings) roomSettings = {};
    if (!direction) direction = 'right';
    if (typeof push === 'undefined') push = true;
    const opposite = direction === 'left' ? 'right' : 'left';
    if (name === '') name = 'lobby';
    if (gClient.channel && gClient.channel._id === name) return;
    if (push) {
      const url = '/?c=' + encodeURIComponent(name).replace("'", '%27');
      if (window.history && history.pushState) {
        history.pushState({ depth: (gHistoryDepth += 1), name }, 'Piano > ' + name, url);
      } else { (window as any).location = url; return; }
    }
    gClient.setChannel(name, roomSettings);
    let t = 0; const d = 100;
    const pianoEl = document.getElementById('piano')!;
    pianoEl.classList.add('ease-out', 'slide-' + opposite);
    setTimeout(() => { pianoEl.classList.remove('ease-out', 'slide-' + opposite); pianoEl.classList.add('slide-' + direction); }, (t += d));
    setTimeout(() => { pianoEl.classList.add('ease-in'); pianoEl.classList.remove('slide-' + direction); }, (t += d));
    setTimeout(() => { pianoEl.classList.remove('ease-in'); }, (t += d));
  }

  window.addEventListener('popstate', (evt: any) => {
    const depth = evt.state ? evt.state.depth : 0;
    const direction = depth <= gHistoryDepth ? 'left' : 'right';
    gHistoryDepth = depth;
    changeRoom(getRoomNameFromURL(), direction, null, false);
  });
  // New room dialog
  (() => {
    function submit() {
      const name = (document.querySelector('#new-room .text[name=name]') as HTMLInputElement).value;
      const roomSettings = { visible: (document.querySelector('#new-room .checkbox[name=visible]') as HTMLInputElement).checked, chat: true };
      (document.querySelector('#new-room .text[name=name]') as HTMLInputElement).value = '';
      closeModal();
      changeRoom(name, 'right', roomSettings);
      setTimeout(() => { new Notification({ id: 'share', title: i18next.t('Created a Room'), html: i18next.t('You can invite friends to your room by sending them the link.') + '<br><a href="' + location.href + '">' + location.href + '</a>', duration: 25000 }); }, 1000);
    }
    document.querySelector('#new-room .submit')!.addEventListener('click', () => { submit(); });
    document.querySelector('#new-room .text[name=name]')!.addEventListener('keypress', (evt: any) => {
      if (evt.keyCode === 13) submit();
      else if (evt.keyCode === 27) closeModal();
      else return;
      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
      return false;
    });
  })();

  // Rename dialog
  (() => {
    function submit() {
      const set = { name: (document.querySelector('#rename input[name=name]') as HTMLInputElement).value, color: (document.querySelector('#rename input[name=color]') as HTMLInputElement).value };
      closeModal();
      gClient.sendArray([{ m: 'userset', set }]);
    }
    document.querySelector('#rename .submit')!.addEventListener('click', () => { submit(); });
    document.querySelector('#rename .text[name=name]')!.addEventListener('keypress', (evt: any) => {
      if (evt.keyCode === 13) submit();
      else if (evt.keyCode === 27) closeModal();
      else return;
      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
      return false;
    });
  })();
  // Site ban dialog
  (() => {
    function submit() {
      const msg: any = { m: 'siteban' };
      msg.id = (document.querySelector('#siteban .text[name=id]') as HTMLInputElement).value;
      const durationUnit = (document.querySelector('#siteban select[name=durationUnit]') as HTMLSelectElement).value;
      if (durationUnit === 'permanent') {
        if (!gClient.permissions.siteBanAnyDuration) { (document.querySelector('#siteban p[name=errorText]') as HTMLElement).textContent = "You don't have permission to ban longer than 1 month."; return; }
        msg.permanent = true;
      } else {
        const factors: Record<string, number> = { seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000, weeks: 604800000, months: 2592000000, years: 31536000000 };
        const duration = (factors[durationUnit] || 0) * parseFloat((document.querySelector('#siteban input[name=durationNumber]') as HTMLInputElement).value);
        if (duration < 0) { (document.querySelector('#siteban p[name=errorText]') as HTMLElement).textContent = 'Invalid duration.'; return; }
        if (duration > 2592000000 && !gClient.permissions.siteBanAnyDuration) { (document.querySelector('#siteban p[name=errorText]') as HTMLElement).textContent = "You don't have permission to ban longer than 1 month."; return; }
        msg.duration = duration;
      }
      let reason: string;
      if ((document.querySelector('#siteban select[name=reasonSelect]') as HTMLSelectElement).value === 'custom') {
        reason = (document.querySelector('#siteban .text[name=reasonText]') as HTMLInputElement).value;
        if (reason.length === 0) { (document.querySelector('#siteban p[name=errorText]') as HTMLElement).textContent = 'Please provide a reason.'; return; }
      } else { reason = (document.querySelector('#siteban select[name=reasonSelect]') as HTMLSelectElement).value; }
      msg.reason = reason;
      const note = (document.querySelector('#siteban textarea[name=note]') as HTMLTextAreaElement).value;
      if (note) msg.note = note;
      closeModal();
      gClient.sendArray([msg]);
    }
    document.querySelector('#siteban .submit')!.addEventListener('click', () => { submit(); });
    document.querySelector('#siteban select[name=reasonSelect]')!.addEventListener('change', (evt) => {
      const value = (evt.target as HTMLSelectElement).value;
      if (value === 'custom') { (document.querySelector('#siteban .text[name=reasonText]') as HTMLInputElement).disabled = false; (document.querySelector('#siteban .text[name=reasonText]') as HTMLInputElement).value = ''; }
      else { (document.querySelector('#siteban .text[name=reasonText]') as HTMLInputElement).disabled = true; (document.querySelector('#siteban .text[name=reasonText]') as HTMLInputElement).value = value; }
    });
    document.querySelector('#siteban select[name=durationUnit]')!.addEventListener('change', (evt) => {
      const value = (evt.target as HTMLSelectElement).value;
      if (value === 'permanent') (document.querySelector('#siteban .text[name=durationNumber]') as HTMLInputElement).disabled = true;
      else (document.querySelector('#siteban .text[name=durationNumber]') as HTMLInputElement).disabled = false;
    });
    const textKeypressEvent = (evt: any) => {
      if (evt.keyCode === 13) submit();
      else if (evt.keyCode === 27) closeModal();
      else return;
      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
      return false;
    };
    document.querySelector('#siteban .text[name=id]')!.addEventListener('keypress', textKeypressEvent);
    document.querySelector('#siteban .text[name=reasonText]')!.addEventListener('keypress', textKeypressEvent);
    if (document.querySelector('#siteban .text[name=note]')) {
      document.querySelector('#siteban .text[name=note]')!.addEventListener('keypress', textKeypressEvent);
    }
  })();

  // Accounts
  (() => {
    function logout() {
      delete localStorage.token;
      delete gClient.accountInfo;
      gClient.stop();
      gClient.start();
      closeModal();
    }
    document.querySelector('#account .logout-btn')!.addEventListener('click', () => { logout(); });
    document.querySelector('#account .login-discord')!.addEventListener('click', () => {
      location.replace(encodeURI(`https://discord.com/api/oauth2/authorize?client_id=926633278100877393&redirect_uri=${location.origin}/?callback=discord&response_type=code&scope=identify email`));
    });
  })();

  // Modal background click
  const modal_bg = document.querySelector('#modal .bg') as HTMLElement;
  modal_bg.addEventListener('click', (evt: any) => { if (evt.target !== modal_bg) return; closeModal(); });
}

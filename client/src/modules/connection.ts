import { Client } from '../libs/Client';
import { Notification } from '../libs/Notification';
import { state, getPiano } from '../util/state';
import { settings } from './settings/settings';
import { press, release } from '../util/actions';
import { getParameterByName, getRoomNameFromURL } from '../util/url-utils';
import { DEFAULT_VELOCITY, TIMING_TARGET } from '../util/constants';
import { openModal, closeModal, modalHandleEsc } from '../util/modal';
import { fadeIn, fadeOut } from '../util/util';
import type { Participant } from '../types';

let tabIsActive = true;
let youreMentioned = false;
let youreReplied = false;
let last_my = -10;

export function getTabIsActive(): boolean { return tabIsActive; }
export function setTabIsActive(v: boolean): void { tabIsActive = v; }
export function getYoureMentioned(): boolean { return youreMentioned; }
export function setYoureMentioned(v: boolean): void { youreMentioned = v; }
export function getYoureReplied(): boolean { return youreReplied; }
export function setYoureReplied(v: boolean): void { youreReplied = v; }

export function shouldHideUser(user: Participant | undefined): boolean {
  if (settings.hideBotUsers) {
    if (user) {
      if (user.tag && user.tag.text === 'BOT') return true;
      else return false;
    }
  }
  return false;
}

export function initConnection(): Client {
  let channel_id = getRoomNameFromURL();

  let loginInfo: any;
  if (getParameterByName('callback') === 'discord') {
    const code = getParameterByName('code');
    if (code) {
      loginInfo = {
        type: 'discord',
        code,
      };
    }
    history.pushState({ name: 'lobby' }, 'Piano > lobby', '/');
    channel_id = 'lobby';
  }

  let gClient: Client;
  if (window.location.hostname === 'localhost') {
    gClient = new Client('ws://localhost:8443');
  } else {
    gClient = new Client('wss://backend.multiplayerpiano.net');
  }
  if (loginInfo) {
    gClient.setLoginInfo(loginInfo);
  }
  gClient.setChannel(channel_id);

  gClient.on('disconnect', (evt: any) => {
    //console.log(evt);
  });

  window.addEventListener('focus', () => {
    tabIsActive = true;
    youreMentioned = false;
    youreReplied = false;
    const count = Object.keys(gClient.ppl).length;
    if (count > 0) {
      document.title = 'Piano (' + count + ')';
    } else {
      document.title = 'Multiplayer Piano';
    }
  });

  window.addEventListener('blur', () => {
    tabIsActive = false;
  });

  // Setting status
  gClient.on('status', (status: string) => {
    const statusEl = document.getElementById('status')!;
    statusEl.textContent = status;
  });

  gClient.on('count', (count: number) => {
    if (count > 0) {
      const statusEl = document.getElementById('status')!;
      statusEl.innerHTML =
        '<span class="number" translated>' +
          count +
          '</span> ' +
          window.i18nextify.i18next.t('people are playing', { count });
      if (!tabIsActive) {
        if (youreMentioned || youreReplied) {
          return;
        }
      }
      document.title = 'Piano (' + count + ')';
    } else {
      document.title = 'Multiplayer Piano';
    }
  });

  // Show moderator buttons
  let receivedHi = false;
  gClient.on('hi', (msg: any) => {
    if (receivedHi) return;
    receivedHi = true;
    if (!msg.motd)
      msg.motd =
        'This site makes a lot of sound! You may want to adjust the volume before continuing.';
    document.getElementById('motd-text')!.innerHTML = msg.motd;
    openModal('#motd');
    document.addEventListener('keydown', modalHandleEsc);
    const user_interact = (evt: any) => {
      if (
        (evt.path || (evt.composedPath && evt.composedPath())).includes(
          document.getElementById('motd'),
        ) ||
        evt.target === document.getElementById('motd')
      ) {
        closeModal();
      }
      document.removeEventListener('click', user_interact);
      getPiano().audio.resume();
    };
    document.addEventListener('click', user_interact);
    if (gClient.permissions.clearChat) {
      (document.getElementById('clearchat-btn') as HTMLElement).style.display = 'block';
    }
    if (gClient.permissions.vanish) {
      (document.getElementById('vanish-btn') as HTMLElement).style.display = 'block';
    } else {
      (document.getElementById('vanish-btn') as HTMLElement).style.display = 'none';
    }
  });

  // Handle changes to participants
  function tagColor(tag: any): string {
    if (typeof tag === 'object') return tag.color;
    if (tag === 'BOT') return '#55f';
    if (tag === 'OWNER') return '#a00';
    if (tag === 'ADMIN') return '#f55';
    if (tag === 'MOD') return '#0a0';
    if (tag === 'MEDIA') return '#f5f';
    return '#777';
  }

  function updateLabels(part: Participant): void {
    if (part.id === gClient.participantId) {
      part.nameDiv.classList.add('me');
    } else {
      part.nameDiv.classList.remove('me');
    }
    if (
      gClient.channel.crown &&
      gClient.channel.crown.participantId === part.id
    ) {
      part.nameDiv.classList.add('owner');
      part.cursorDiv?.classList.add('owner');
    } else {
      part.nameDiv.classList.remove('owner');
      part.cursorDiv?.classList.remove('owner');
    }
    if (settings.pianoMutes.indexOf(part._id) !== -1) {
      part.nameDiv.classList.add('muted-notes');
    } else {
      part.nameDiv.classList.remove('muted-notes');
    }
    if (settings.chatMutes.indexOf(part._id) !== -1) {
      part.nameDiv.classList.add('muted-chat');
    } else {
      part.nameDiv.classList.remove('muted-chat');
    }
  }

  function setupParticipantDivs(part: Participant): void {
    const hadNameDiv = Boolean(part.nameDiv);

    let nameDiv: HTMLElement;
    if (hadNameDiv) {
      nameDiv = part.nameDiv;
      nameDiv.innerHTML = '';
    } else {
      nameDiv = document.createElement('div');
      nameDiv.addEventListener('mousedown', (e: any) => {
        const { getParticipantTouchhandler } = require('./keyboard');
        getParticipantTouchhandler()(e, nameDiv);
      });
      nameDiv.addEventListener('touchstart', (e: any) => {
        const { getParticipantTouchhandler } = require('./keyboard');
        getParticipantTouchhandler()(e, nameDiv);
      });
      nameDiv.style.display = 'none';
      fadeIn(nameDiv, 2000);
      nameDiv.id = 'namediv-' + part._id;
      nameDiv.className = 'name';
      (nameDiv as any).participantId = part.id;
      document.getElementById('names')!.appendChild(nameDiv);
      part.nameDiv = nameDiv;
    }
    nameDiv.style.backgroundColor = part.color || '#777';
    const tagText = typeof part.tag === 'object' ? part.tag.text : part.tag;
    if (tagText === 'BOT') nameDiv.title = 'This is an authorized bot.';
    if (tagText === 'MOD')
      nameDiv.title = 'This user is an official moderator of the site.';
    if (tagText === 'ADMIN')
      nameDiv.title = 'This user is an official administrator of the site.';
    if (tagText === 'OWNER')
      nameDiv.title = 'This user is the owner of the site.';
    if (tagText === 'MEDIA')
      nameDiv.title =
        'This is a well known person on Twitch, Youtube, or another platform.';
    if (tagText === 'DEV')
      nameDiv.title =
        'This user has contributed considerable code to the site.';

    updateLabels(part);

    let hasOtherDiv = false;
    if (part.vanished) {
      hasOtherDiv = true;
      const vanishDiv = document.createElement('div');
      vanishDiv.className = 'nametag';
      vanishDiv.textContent = 'VANISH';
      vanishDiv.style.backgroundColor = '#00ffcc';
      vanishDiv.id = 'namevanish-' + part._id;
      part.nameDiv.appendChild(vanishDiv);
    }

    if (part.tag) {
      hasOtherDiv = true;
      const tagDiv = document.createElement('div');
      tagDiv.className = 'nametag';
      tagDiv.textContent = tagText || '';
      tagDiv.style.backgroundColor = tagColor(part.tag);
      tagDiv.id = 'nametag-' + part._id;
      part.nameDiv.appendChild(tagDiv);
    }
    if (part.afk) {
      const afkDiv = document.createElement('div');
      afkDiv.className = 'nametag';
      afkDiv.textContent = 'AFK';
      afkDiv.style.backgroundColor = '#00000040';
      afkDiv.style['margin-left'] = '5px';
      afkDiv.style['margin-right'] = '0px';
      afkDiv.style.float = 'right';
      afkDiv.id = 'afktag-' + part._id;
      part.nameDiv.appendChild(afkDiv);
    }

    const textDiv = document.createElement('div');
    textDiv.className = 'nametext';
    textDiv.textContent = part.name || '';
    textDiv.id = 'nametext-' + part._id;
    if (hasOtherDiv) textDiv.style.float = 'left';
    part.nameDiv.appendChild(textDiv);
    part.nameDiv.setAttribute('translated', '');

    const namesContainer = document.getElementById('names')!;
    const arr = Array.from(namesContainer.querySelectorAll('.name')) as HTMLElement[];
    arr.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
    arr.forEach(el => namesContainer.appendChild(el));
  }

  gClient.on('participant added', (part: Participant) => {
    if (shouldHideUser(part)) return;

    part.displayX = 150;
    part.displayY = 50;

    // add nameDiv
    setupParticipantDivs(part);

    // add cursorDiv
    if (
      (gClient.participantId !== part.id || settings.seeOwnCursor) &&
      !settings.cursorHides.includes(part.id)
    ) {
      const div = document.createElement('div');
      div.className = 'cursor';
      div.style.display = 'none';
      part.cursorDiv = document.getElementById('cursors')!.appendChild(div);
      fadeIn(part.cursorDiv, 2000);

      const nameDiv = document.createElement('div');
      nameDiv.className = 'name';
      nameDiv.style.backgroundColor = part.color || '#777';
      const tagText = typeof part.tag === 'object' ? part.tag.text : part.tag;

      if (part.tag) {
        const tagDiv = document.createElement('span');
        tagDiv.className = 'curtag';
        tagDiv.textContent = tagText || '';
        tagDiv.style.backgroundColor = tagColor(part.tag);
        tagDiv.id = 'nametag-' + part._id;
        nameDiv.appendChild(tagDiv);
      }

      const namep = document.createElement('span');
      namep.className = 'nametext';
      namep.textContent = part.name || '';
      nameDiv.setAttribute('translated', '');
      nameDiv.appendChild(namep);
      part.cursorDiv.appendChild(nameDiv);
    } else {
      part.cursorDiv = undefined;
    }
  });

  gClient.on('participant removed', (part: Participant) => {
    if (shouldHideUser(part)) return;
    fadeOut(part.cursorDiv, 2000);
    fadeOut(part.nameDiv, 2000, () => {
      part.nameDiv?.remove();
      part.cursorDiv?.remove();
      part.nameDiv = undefined;
      part.cursorDiv = undefined;
    });
  });

  gClient.on('participant update', (part: Participant) => {
    if (shouldHideUser(part)) return;
    const name = part.name || '';
    const color = part.color || '#777';
    setupParticipantDivs(part);
    const cursorNameText = part.cursorDiv?.querySelector('.name .nametext') as HTMLElement | null;
    if (cursorNameText) cursorNameText.textContent = name;
    const cursorName = part.cursorDiv?.querySelector('.name') as HTMLElement | null;
    if (cursorName) cursorName.style.backgroundColor = color;
    if (part.tag != null) {
      const tagSpan = part.cursorDiv?.querySelector('.name .curtag') as HTMLElement | null;
      if (tagSpan) {
        tagSpan.textContent = part.tag.text;
        tagSpan.style.backgroundColor = part.tag.color;
      }
    }
  });

  gClient.on('ch', (msg: any) => {
    for (const id in gClient.ppl) {
      if (gClient.ppl.hasOwnProperty(id)) {
        const part = gClient.ppl[id];
        updateLabels(part);
      }
    }
  });

  gClient.on('participant added', (part: Participant) => {
    if (shouldHideUser(part)) return;
    updateLabels(part);
  });

  function updateCursor(msg: any): void {
    if (settings.hideAllCursors) return;
    const part = gClient.ppl[msg.id];
    if (shouldHideUser(part)) return;
    if (part && part.cursorDiv) {
      if (settings.smoothCursor) {
        part.cursorDiv.style.transform =
          'translate3d(' + msg.x + 'vw, ' + msg.y + 'vh, 0)';
      } else {
        part.cursorDiv.style.left = msg.x + '%';
        part.cursorDiv.style.top = msg.y + '%';
      }
    }
  }
  gClient.on('m', updateCursor);
  gClient.on('participant added', updateCursor);

  // Handle changes to crown
  const crownEl = document.createElement('div');
  crownEl.id = 'crown';
  crownEl.style.display = 'none';
  document.body.appendChild(crownEl);
  const countdownEl = document.createElement('span');
  crownEl.appendChild(countdownEl);
  let countdown_interval: ReturnType<typeof setInterval> | undefined;
  crownEl.addEventListener('click', () => {
    gClient.sendArray([{ m: 'chown', id: gClient.participantId }]);
  });

  gClient.on('ch', (msg: any) => {
    if (msg.ch.crown) {
      const crown = msg.ch.crown;
      if (!crown.participantId || !gClient.ppl[crown.participantId]) {
        const land_time = crown.time + 2000 - gClient.serverTimeOffset;
        const avail_time = crown.time + 15000 - gClient.serverTimeOffset;
        countdownEl.textContent = '';
        crownEl.style.display = 'block';
        if (land_time - Date.now() <= 0) {
          crownEl.style.left = crown.endPos.x + '%';
          crownEl.style.top = crown.endPos.y + '%';
        } else {
          crownEl.style.left = crown.startPos.x + '%';
          crownEl.style.top = crown.startPos.y + '%';
          crownEl.classList.add('spin');
          const anim = crownEl.animate(
            [
              { left: crown.startPos.x + '%', top: crown.startPos.y + '%' },
              { left: crown.endPos.x + '%', top: crown.endPos.y + '%' },
            ],
            { duration: 2000, easing: 'linear', fill: 'forwards' },
          );
          anim.onfinish = () => {
            crownEl.style.left = crown.endPos.x + '%';
            crownEl.style.top = crown.endPos.y + '%';
            crownEl.classList.remove('spin');
          };
        }
        clearInterval(countdown_interval);
        countdown_interval = setInterval(() => {
          const time = Date.now();
          if (time >= land_time) {
            const ms = avail_time - time;
            if (ms > 0) {
              countdownEl.textContent = Math.ceil(ms / 1000) + 's';
            } else {
              countdownEl.textContent = '';
              clearInterval(countdown_interval);
            }
          }
        }, 1000);
      } else {
        crownEl.style.display = 'none';
      }
    } else {
      crownEl.style.display = 'none';
    }
  });

  gClient.on('disconnect', () => {
    fadeOut(crownEl, 2000);
  });

  // Playing notes
  gClient.on('n', (msg: any) => {
    const gPiano = getPiano();
    const t = msg.t - gClient.serverTimeOffset + TIMING_TARGET - Date.now();
    const participant = gClient.findParticipantById(msg.p);
    if (settings.pianoMutes.indexOf(participant._id) !== -1) return;
    if (gClient.findParticipantById(msg.p).tag) {
      if (
        settings.hideBotUsers === true &&
        gClient.findParticipantById(msg.p).tag.text === 'BOT'
      )
        return;
    }
    for (let i = 0; i < msg.n.length; i++) {
      const note = msg.n[i];
      let ms = t + (note.d || 0);
      if (ms < 0) {
        ms = 0;
      } else if (ms > 10000) continue;
      if (note.s) {
        gPiano.stop(note.n, participant, ms);
      } else {
        let vel =
          typeof note.v !== 'undefined' ? parseFloat(note.v) : DEFAULT_VELOCITY;
        if (!vel) vel = 0;
        else if (vel < 0) vel = 0;
        else if (vel > 1) vel = 1;
        gPiano.play(note.n, vel, participant, ms);
        if (state.enableSynth) {
          gPiano.stop(note.n, participant, ms + 1000);
        }
      }
    }
  });

  // Send cursor updates
  let mx = 0;
  let last_mx = -10;
  last_my = -10;
  setInterval(() => {
    if (Math.abs(mx - last_mx) > 0.1 || Math.abs(state.mouseY - last_my) > 0.1) {
      last_mx = mx;
      last_my = state.mouseY;
      gClient.sendArray([{ m: 'm', x: mx, y: state.mouseY }]);
      if (settings.seeOwnCursor) {
        gClient.emit('m', {
          m: 'm',
          id: gClient.participantId,
          x: mx,
          y: state.mouseY,
        });
      }
      const part = gClient.getOwnParticipant();
      if (part) {
        part.x = mx;
        part.y = state.mouseY;
      }
    }
  }, 50);
  document.addEventListener('mousemove', (event: MouseEvent) => {
    mx = +((event.pageX / window.innerWidth) * 100).toFixed(2);
    state.mouseY = +((event.pageY / window.innerHeight) * 100).toFixed(2);
  });

  // Room settings button
  gClient.on('ch', (msg: any) => {
    const roomSettingsBtn = document.getElementById('room-settings-btn') as HTMLElement;
    const getcrownBtn = document.getElementById('getcrown-btn') as HTMLElement;
    if (gClient.isOwner() || gClient.permissions.chsetAnywhere) {
      roomSettingsBtn.style.display = 'block';
    } else {
      roomSettingsBtn.style.display = 'none';
    }
    if (
      !gClient.channel.settings.lobby &&
      (gClient.permissions.chownAnywhere ||
        gClient.channel.settings.owner_id === gClient.user._id)
    ) {
      getcrownBtn.style.display = 'block';
    } else {
      getcrownBtn.style.display = 'none';
    }
  });

  document.getElementById('room-settings-btn')!.addEventListener('click', (evt: any) => {
    if (
      gClient.channel &&
      (gClient.isOwner() || gClient.permissions.chsetAnywhere)
    ) {
      const roomSettings = gClient.channel.settings;
      openModal('#room-settings');
      setTimeout(() => {
        const modal = document.getElementById('room-settings')!;
        (modal.querySelector('.checkbox[name=visible]') as HTMLInputElement).checked = roomSettings.visible;
        (modal.querySelector('.checkbox[name=chat]') as HTMLInputElement).checked = roomSettings.chat;
        (modal.querySelector('.checkbox[name=crownsolo]') as HTMLInputElement).checked = roomSettings.crownsolo;
        (modal.querySelector('.checkbox[name=nocussing]') as HTMLInputElement).checked = roomSettings['no cussing'];
        (modal.querySelector('input[name=color]') as HTMLInputElement).value = roomSettings.color;
        (modal.querySelector('input[name=color2]') as HTMLInputElement).value = roomSettings.color2;
        (modal.querySelector('.checkbox[name=noindex]') as HTMLInputElement).checked = roomSettings.noindex;
        (modal.querySelector('.checkbox[name=allowBots]') as HTMLInputElement).checked = roomSettings.allowBots;
        (modal.querySelector('input[name=limit]') as HTMLInputElement).value = roomSettings.limit.toString();
      }, 100);
    }
  });

  const roomSettingsModal = document.getElementById('room-settings')!;
  roomSettingsModal.querySelector('.submit')!.addEventListener('click', () => {
    const modal = roomSettingsModal;
    const newSettings = {
      visible: (modal.querySelector('.checkbox[name=visible]') as HTMLInputElement).checked,
      chat: (modal.querySelector('.checkbox[name=chat]') as HTMLInputElement).checked,
      crownsolo: (modal.querySelector('.checkbox[name=crownsolo]') as HTMLInputElement).checked,
      'no cussing': (modal.querySelector('.checkbox[name=nocussing]') as HTMLInputElement).checked,
      noindex: (modal.querySelector('.checkbox[name=noindex]') as HTMLInputElement).checked,
      allowBots: (modal.querySelector('.checkbox[name=allowBots]') as HTMLInputElement).checked,
      color: (modal.querySelector('input[name=color]') as HTMLInputElement).value,
      color2: (modal.querySelector('input[name=color2]') as HTMLInputElement).value,
      limit: +(modal.querySelector('input[name=limit]') as HTMLInputElement).value,
    };
    gClient.setChannelSettings(newSettings);
    closeModal();
  });

  roomSettingsModal.querySelector('.drop-crown')!.addEventListener('click', () => {
    closeModal();
    if (confirm('This will drop the crown...!'))
      gClient.sendArray([{ m: 'chown' }]);
  });

  // Clear chat button
  document.getElementById('clearchat-btn')!.addEventListener('click', (evt: any) => {
    if (confirm('Are you sure you want to clear chat?'))
      gClient.sendArray([{ m: 'clearchat' }]);
  });

  // Get crown button
  document.getElementById('getcrown-btn')!.addEventListener('click', (evt: any) => {
    gClient.sendArray([{ m: 'chown', id: gClient.getOwnParticipant().id }]);
  });

  // Vanish or unvanish button
  document.getElementById('vanish-btn')!.addEventListener('click', (evt: any) => {
    gClient.sendArray([
      { m: 'v', vanish: !gClient.getOwnParticipant().vanished },
    ]);
  });

  gClient.on('participant update', (part: Participant) => {
    if (part._id === gClient.getOwnParticipant()._id) {
      const vanishBtn = document.getElementById('vanish-btn') as HTMLElement;
      if (part.vanished) {
        vanishBtn.textContent = 'Unvanish';
      } else {
        vanishBtn.textContent = 'Vanish';
      }
    }
  });

  gClient.on('participant added', (part: Participant) => {
    if (part._id === gClient.getOwnParticipant()._id) {
      const vanishBtn = document.getElementById('vanish-btn') as HTMLElement;
      if (part.vanished) {
        vanishBtn.textContent = 'Unvanish';
      } else {
        vanishBtn.textContent = 'Vanish';
      }
    }
  });

  // Handle notifications
  gClient.on('notification', (msg: any) => {
    new Notification(msg);
  });

  // Don't forget spin
  gClient.on('ch', (msg: any) => {
    const chidlo = msg.ch._id.toLowerCase();
    const pianoEl = document.getElementById('piano') as HTMLElement;
    if (chidlo === 'spin' || chidlo.substr(-5) === '/spin') {
      pianoEl.classList.add('spin');
    } else {
      pianoEl.classList.remove('spin');
    }
  });

  // Crownsolo notice
  gClient.on('ch', (msg: any) => {
    let notice = '';
    let has_notice = false;
    if (msg.ch.settings.crownsolo) {
      has_notice = true;
      notice += '<p>This room is set to "only the owner can play."</p>';
    }
    if (msg.ch.settings['no cussing']) {
      has_notice = true;
      notice += '<p>This room is set to "no cussing."</p>';
    }
    const noticeDiv = document.getElementById('room-notice') as HTMLElement;
    if (has_notice) {
      noticeDiv.innerHTML = notice;
      if (noticeDiv.style.display === 'none') fadeIn(noticeDiv, 1000);
    } else {
      if (noticeDiv.style.display !== 'none') fadeOut(noticeDiv, 1000);
    }
  });

  gClient.on('disconnect', () => {
    fadeOut(document.getElementById('room-notice') as HTMLElement, 1000);
  });

  state.client = gClient;
  return gClient;
}

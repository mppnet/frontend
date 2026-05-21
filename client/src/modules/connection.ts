import { Client } from '../libs/Client';
import { Notification } from '../libs/Notification';
import { state, getPiano } from '../util/state';
import { settings } from './settings/settings';
import { press, release } from '../util/actions';
import { getParameterByName, getRoomNameFromURL } from '../util/url-utils';
import { DEFAULT_VELOCITY, TIMING_TARGET } from '../util/constants';
import { openModal, closeModal, modalHandleEsc } from '../util/modal';

declare const $: any;
declare const MPP: any;

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

export function shouldHideUser(user: any): boolean {
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
    const count = Object.keys(MPP.client.ppl).length;
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
    $('#status').text(status);
  });

  gClient.on('count', (count: number) => {
    if (count > 0) {
      $('#status').html(
        '<span class="number" translated>' +
          count +
          '</span> ' +
          (window as any).i18nextify.i18next.t('people are playing', { count }),
      );
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
    $(document).on('keydown', modalHandleEsc);
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
      $('#clearchat-btn').show();
    }
    if (gClient.permissions.vanish) {
      $('#vanish-btn').show();
    } else {
      $('#vanish-btn').hide();
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

  function updateLabels(part: any): void {
    if (part.id === gClient.participantId) {
      $(part.nameDiv).addClass('me');
    } else {
      $(part.nameDiv).removeClass('me');
    }
    if (
      gClient.channel.crown &&
      gClient.channel.crown.participantId === part.id
    ) {
      $(part.nameDiv).addClass('owner');
      $(part.cursorDiv).addClass('owner');
    } else {
      $(part.nameDiv).removeClass('owner');
      $(part.cursorDiv).removeClass('owner');
    }
    if (settings.pianoMutes.indexOf(part._id) !== -1) {
      $(part.nameDiv).addClass('muted-notes');
    } else {
      $(part.nameDiv).removeClass('muted-notes');
    }
    if (settings.chatMutes.indexOf(part._id) !== -1) {
      $(part.nameDiv).addClass('muted-chat');
    } else {
      $(part.nameDiv).removeClass('muted-chat');
    }
  }

  function setupParticipantDivs(part: any): void {
    const hadNameDiv = Boolean(part.nameDiv);

    let nameDiv: any;
    if (hadNameDiv) {
      nameDiv = part.nameDiv;
      $(nameDiv).empty();
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
      $(nameDiv).fadeIn(2000);
      nameDiv.id = 'namediv-' + part._id;
      nameDiv.className = 'name';
      nameDiv.participantId = part.id;
      $('#names')[0].appendChild(nameDiv);
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

    const arr = $('#names .name');
    arr.sort((a: any, b: any) => {
      if (a.id > b.id) return 1;
      else if (a.id < b.id) return -1;
      else return 0;
    });
    $('#names').html(arr);
  }

  gClient.on('participant added', (part: any) => {
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
      part.cursorDiv = $('#cursors')[0].appendChild(div);
      $(part.cursorDiv).fadeIn(2000);

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

  gClient.on('participant removed', (part: any) => {
    if (shouldHideUser(part)) return;
    const nd = $(part.nameDiv);
    const cd = $(part.cursorDiv);
    cd.fadeOut(2000);
    nd.fadeOut(2000, () => {
      nd.remove();
      cd.remove();
      part.nameDiv = undefined;
      part.cursorDiv = undefined;
    });
  });

  gClient.on('participant update', (part: any) => {
    if (shouldHideUser(part)) return;
    const name = part.name || '';
    const color = part.color || '#777';
    setupParticipantDivs(part);
    $(part.cursorDiv).find('.name .nametext').text(name);
    $(part.cursorDiv).find('.name').css('background-color', color);
    if (part.tag != null) {
      const tagSpan = $(part.cursorDiv).find('.name .curtag');
      tagSpan.text(part.tag.text);
      tagSpan.css('background-color', part.tag.color);
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

  gClient.on('participant added', (part: any) => {
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
  const jqcrown = $('<div id="crown"></div>').appendTo(document.body).hide();
  const jqcountdown = $('<span></span>').appendTo(jqcrown);
  let countdown_interval: any;
  jqcrown.click(() => {
    gClient.sendArray([{ m: 'chown', id: gClient.participantId }]);
  });

  gClient.on('ch', (msg: any) => {
    if (msg.ch.crown) {
      const crown = msg.ch.crown;
      if (!crown.participantId || !gClient.ppl[crown.participantId]) {
        const land_time = crown.time + 2000 - gClient.serverTimeOffset;
        const avail_time = crown.time + 15000 - gClient.serverTimeOffset;
        jqcountdown.text('');
        jqcrown.show();
        if (land_time - Date.now() <= 0) {
          jqcrown.css({
            left: crown.endPos.x + '%',
            top: crown.endPos.y + '%',
          });
        } else {
          jqcrown.css({
            left: crown.startPos.x + '%',
            top: crown.startPos.y + '%',
          });
          jqcrown.addClass('spin');
          jqcrown.animate(
            {
              left: crown.endPos.x + '%',
              top: crown.endPos.y + '%',
            },
            2000,
            'linear',
            () => {
              jqcrown.removeClass('spin');
            },
          );
        }
        clearInterval(countdown_interval);
        countdown_interval = setInterval(() => {
          const time = Date.now();
          if (time >= land_time) {
            const ms = avail_time - time;
            if (ms > 0) {
              jqcountdown.text(Math.ceil(ms / 1000) + 's');
            } else {
              jqcountdown.text('');
              clearInterval(countdown_interval);
            }
          }
        }, 1000);
      } else {
        jqcrown.hide();
      }
    } else {
      jqcrown.hide();
    }
  });

  gClient.on('disconnect', () => {
    jqcrown.fadeOut(2000);
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
  $(document).mousemove((event: any) => {
    mx = +((event.pageX / $(window).width()) * 100).toFixed(2);
    state.mouseY = +((event.pageY / $(window).height()) * 100).toFixed(2);
  });

  // Room settings button
  gClient.on('ch', (msg: any) => {
    if (gClient.isOwner() || gClient.permissions.chsetAnywhere) {
      $('#room-settings-btn').show();
    } else {
      $('#room-settings-btn').hide();
    }
    if (
      !gClient.channel.settings.lobby &&
      (gClient.permissions.chownAnywhere ||
        gClient.channel.settings.owner_id === gClient.user._id)
    ) {
      $('#getcrown-btn').show();
    } else {
      $('#getcrown-btn').hide();
    }
  });

  $('#room-settings-btn').click((evt: any) => {
    if (
      gClient.channel &&
      (gClient.isOwner() || gClient.permissions.chsetAnywhere)
    ) {
      const roomSettings = gClient.channel.settings;
      openModal('#room-settings');
      setTimeout(() => {
        $('#room-settings .checkbox[name=visible]').prop(
          'checked',
          roomSettings.visible,
        );
        $('#room-settings .checkbox[name=chat]').prop(
          'checked',
          roomSettings.chat,
        );
        $('#room-settings .checkbox[name=crownsolo]').prop(
          'checked',
          roomSettings.crownsolo,
        );
        $('#room-settings .checkbox[name=nocussing]').prop(
          'checked',
          roomSettings['no cussing'],
        );
        $('#room-settings input[name=color]').val(roomSettings.color);
        $('#room-settings input[name=color2]').val(roomSettings.color2);
        $('#room-settings .checkbox[name=noindex]').prop(
          'checked',
          roomSettings.noindex,
        );
        $('#room-settings .checkbox[name=allowBots]').prop(
          'checked',
          roomSettings.allowBots,
        );
        $('#room-settings input[name=limit]').val(roomSettings.limit);
      }, 100);
    }
  });

  $('#room-settings .submit').click(() => {
    const newSettings = {
      visible: $('#room-settings .checkbox[name=visible]').is(':checked'),
      chat: $('#room-settings .checkbox[name=chat]').is(':checked'),
      crownsolo: $('#room-settings .checkbox[name=crownsolo]').is(':checked'),
      'no cussing': $('#room-settings .checkbox[name=nocussing]').is(':checked'),
      noindex: $('#room-settings .checkbox[name=noindex]').is(':checked'),
      allowBots: $('#room-settings .checkbox[name=allowBots]').is(':checked'),
      color: $('#room-settings input[name=color]').val(),
      color2: $('#room-settings input[name=color2]').val(),
      limit: $('#room-settings input[name=limit]').val(),
    };
    gClient.setChannelSettings(newSettings);
    closeModal();
  });

  $('#room-settings .drop-crown').click(() => {
    closeModal();
    if (confirm('This will drop the crown...!'))
      gClient.sendArray([{ m: 'chown' }]);
  });

  // Clear chat button
  $('#clearchat-btn').click((evt: any) => {
    if (confirm('Are you sure you want to clear chat?'))
      gClient.sendArray([{ m: 'clearchat' }]);
  });

  // Get crown button
  $('#getcrown-btn').click((evt: any) => {
    gClient.sendArray([{ m: 'chown', id: MPP.client.getOwnParticipant().id }]);
  });

  // Vanish or unvanish button
  $('#vanish-btn').click((evt: any) => {
    gClient.sendArray([
      { m: 'v', vanish: !gClient.getOwnParticipant().vanished },
    ]);
  });

  gClient.on('participant update', (part: any) => {
    if (part._id === gClient.getOwnParticipant()._id) {
      if (part.vanished) {
        $('#vanish-btn').text('Unvanish');
      } else {
        $('#vanish-btn').text('Vanish');
      }
    }
  });

  gClient.on('participant added', (part: any) => {
    if (part._id === gClient.getOwnParticipant()._id) {
      if (part.vanished) {
        $('#vanish-btn').text('Unvanish');
      } else {
        $('#vanish-btn').text('Vanish');
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
    if (chidlo === 'spin' || chidlo.substr(-5) === '/spin') {
      $('#piano').addClass('spin');
    } else {
      $('#piano').removeClass('spin');
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
    const notice_div = $('#room-notice');
    if (has_notice) {
      notice_div.html(notice);
      if (notice_div.is(':hidden')) notice_div.fadeIn(1000);
    } else {
      if (notice_div.is(':visible')) notice_div.fadeOut(1000);
    }
  });

  gClient.on('disconnect', () => {
    $('#room-notice').fadeOut(1000);
  });

  state.client = gClient;
  return gClient;
}

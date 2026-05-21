import { getClient, getPiano, state } from '../util/state';
import { settings } from './settings/settings';
import { press, release, pressSustain, releaseSustain, setAutoSustain, getAutoSustain } from '../util/actions';
import { NoteQuota } from '../libs/NoteQuota';
import { Color } from '../libs/Color';
import { Notification } from '../libs/Notification';
import { openModal, closeModal } from '../util/modal';

declare const $: any;
declare let gKnowsYouCanUseKeyboard: boolean;
declare let gKnowsYouCanUseKeyboardNotification: any;
declare let gKeyboardSeq: number;

// Module-level state
let transpose = 0;
let key_binding: Record<number, { note: { note: string; octave: number }; held: boolean }>;
let capturingKeyboard = false;
let capsLockKey = false;

// DM state
let gDmParticipant: any;
let gIsDming = false;
let gReplyParticipant: any;
let gIsReplying = false;
let gMessageId: any;

// DM getters/setters
export const getIsDming = (): boolean => gIsDming;
export const setIsDming = (v: boolean): void => { gIsDming = v; };
export const getDmParticipant = (): any => gDmParticipant;
export const setDmParticipant = (v: any): void => { gDmParticipant = v; };
export const getIsReplying = (): boolean => gIsReplying;
export const setIsReplying = (v: boolean): void => { gIsReplying = v; };
export const getReplyParticipant = (): any => gReplyParticipant;
export const setReplyParticipant = (v: any): void => { gReplyParticipant = v; };
export const getMessageId = (): any => gMessageId;
export const setMessageId = (v: any): void => { gMessageId = v; };

export const getTranspose = (): number => transpose;
export const getKeyBinding = (): Record<number, { note: { note: string; octave: number }; held: boolean }> => key_binding;

let _layouts: Record<string, Record<number, any>> | null = null;
export const setKeyBinding = (useVP: boolean): void => {
  if (_layouts) key_binding = useVP ? _layouts.VP : _layouts.MPP;
};

// Forward declarations for keyboard handlers
let handleKeyDown: (evt: any) => any;
let handleKeyUp: (evt: any) => any;
let handleKeyPress: (evt: any) => any;

const recapListener = () => {
  captureKeyboard();
};
export function captureKeyboard(): void {
  if (!capturingKeyboard) {
    capturingKeyboard = true;
    $('#piano').off('mousedown', recapListener);
    $('#piano').off('touchstart', recapListener);
    $(document).on('keydown', handleKeyDown);
    $(document).on('keyup', handleKeyUp);
    $(window).on('keypress', handleKeyPress);
  }
}

export function releaseKeyboard(): void {
  if (capturingKeyboard) {
    capturingKeyboard = false;
    $(document).off('keydown', handleKeyDown);
    $(document).off('keyup', handleKeyUp);
    $(window).off('keypress', handleKeyPress);
    $('#piano').on('mousedown', recapListener);
    $('#piano').on('touchstart', recapListener);
  }
}

export const velocityFromMouseY = (): number => {
  return 0.1 + (state.mouseY / 100) * 0.6;
};

let participantTouchhandler: (e: any, ele: any) => void;

export const getParticipantTouchhandler = (): ((e: any, ele: any) => void) => participantTouchhandler;

export function initKeyboard(): void {
  const gClient = getClient();
  const gPiano = getPiano();

  // Volume slider
  const volume_slider = document.getElementById('volume-slider') as HTMLInputElement;
  volume_slider.value = String(gPiano.audio.volume);
  $('#volume-label').text('Volume: ' + Math.floor(gPiano.audio.volume * 100) + '%');
  volume_slider.addEventListener('input', () => {
    const v = +volume_slider.value;
    gPiano.audio.setVolume(v);
    if (window.localStorage) localStorage.volume = String(v);
    $('#volume-label').text('Volume: ' + Math.floor(v * 100) + '%');
  });

  // Note class
  const Note = function (this: any, note: string, octave?: number) {
    this.note = note;
    this.octave = octave || 0;
  } as any;

  const n = (a: string, b?: number) => {
    return { note: new Note(a, b), held: false };
  };

  // Layouts
  const layouts: Record<string, Record<number, { note: { note: string; octave: number }; held: boolean }>> = {
    MPP: {
      65: n('gs'), 90: n('a'), 83: n('as'), 88: n('b'),
      67: n('c', 1), 70: n('cs', 1), 86: n('d', 1), 71: n('ds', 1),
      66: n('e', 1), 78: n('f', 1), 74: n('fs', 1), 77: n('g', 1),
      75: n('gs', 1), 188: n('a', 1), 76: n('as', 1), 190: n('b', 1),
      191: n('c', 2), 222: n('cs', 2),
      49: n('gs', 1), 81: n('a', 1), 50: n('as', 1), 87: n('b', 1),
      69: n('c', 2), 52: n('cs', 2), 82: n('d', 2), 53: n('ds', 2),
      84: n('e', 2), 89: n('f', 2), 55: n('fs', 2), 85: n('g', 2),
      56: n('gs', 2), 73: n('a', 2), 57: n('as', 2), 79: n('b', 2),
      80: n('c', 3), 189: n('cs', 3), 173: n('cs', 3),
      219: n('d', 3), 187: n('ds', 3), 61: n('ds', 3), 221: n('e', 3),
    },
    VP: {
      112: n('c', -1), 113: n('d', -1), 114: n('e', -1),
      115: n('f', -1), 116: n('g', -1), 117: n('a', -1), 118: n('b', -1),
      49: n('c'), 50: n('d'), 51: n('e'), 52: n('f'),
      53: n('g'), 54: n('a'), 55: n('b'), 56: n('c', 1),
      57: n('d', 1), 48: n('e', 1), 81: n('f', 1), 87: n('g', 1),
      69: n('a', 1), 82: n('b', 1), 84: n('c', 2), 89: n('d', 2),
      85: n('e', 2), 73: n('f', 2), 79: n('g', 2), 80: n('a', 2),
      65: n('b', 2), 83: n('c', 3), 68: n('d', 3), 70: n('e', 3),
      71: n('f', 3), 72: n('g', 3), 74: n('a', 3), 75: n('b', 3),
      76: n('c', 4), 90: n('d', 4), 88: n('e', 4), 67: n('f', 4),
      86: n('g', 4), 66: n('a', 4), 78: n('b', 4), 77: n('c', 5),
    },
  };

  key_binding = settings.virtualPianoLayout ? layouts.VP : layouts.MPP;
  _layouts = layouts;

  const sendTransposeNotif = () => {
    new Notification({
      title: 'Transposing',
      html: 'Transpose level: ' + transpose,
      target: '#midi-btn',
      duration: 1500,
    });
  };

  handleKeyDown = (evt: any) => {
    if (evt.target.type) return;
    const code = parseInt(evt.keyCode);
    if (key_binding[code] !== undefined) {
      const binding = key_binding[code];
      if (!binding.held) {
        binding.held = true;
        const note = binding.note;
        let octave = 1 + note.octave;
        if (!settings.virtualPianoLayout) {
          if (evt.shiftKey) ++octave;
          else if (capsLockKey || evt.ctrlKey) --octave;
          else if (evt.altKey) octave += 2;
        }
        let noteName: string = note.note + octave;
        const index = Object.keys(gPiano.keys).indexOf(noteName);
        if (settings.virtualPianoLayout && evt.shiftKey) {
          noteName = Object.keys(gPiano.keys)[index + transpose + 1];
        } else {
          noteName = Object.keys(gPiano.keys)[index + transpose];
        }
        if (noteName === undefined) return;
        const vol = velocityFromMouseY();
        press(noteName, vol);
      }

      if (++gKeyboardSeq == 3) {
        gKnowsYouCanUseKeyboard = true;
        if (window.gKnowsYouCanUseKeyboardTimeout)
          clearTimeout(window.gKnowsYouCanUseKeyboardTimeout);
        if (localStorage) localStorage.knowsYouCanUseKeyboard = 'true';
        if (window.gKnowsYouCanUseKeyboardNotification)
          window.gKnowsYouCanUseKeyboardNotification.close();
      }

      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
      return false;
    } else if (code == 20) {
      capsLockKey = true;
      if (!settings.noPreventDefault) evt.preventDefault();
    } else if (code === 0x20) {
      pressSustain();
      if (!settings.noPreventDefault) evt.preventDefault();
    } else if (code === 38 && transpose <= 100) {
      transpose += 12;
      sendTransposeNotif();
    } else if (code === 40 && transpose >= -100) {
      transpose -= 12;
      sendTransposeNotif();
    } else if (code === 39 && transpose < 100) {
      transpose++;
      sendTransposeNotif();
    } else if (code === 37 && transpose > -100) {
      transpose--;
      sendTransposeNotif();
    } else if (code == 9) {
      if (!settings.noPreventDefault) evt.preventDefault();
    } else if (code == 8) {
      setAutoSustain(!getAutoSustain());
      if (!settings.noPreventDefault) evt.preventDefault();
    }
  };

  handleKeyUp = (evt: any) => {
    if (evt.target.type) return;
    const code = parseInt(evt.keyCode);
    if (key_binding[code] !== undefined) {
      const binding = key_binding[code];
      if (binding.held) {
        binding.held = false;
        const note = binding.note;
        let octave = 1 + note.octave;
        if (!settings.virtualPianoLayout) {
          if (evt.shiftKey) ++octave;
          else if (capsLockKey || evt.ctrlKey) --octave;
          else if (evt.altKey) octave += 2;
        }
        let noteName: string = note.note + octave;
        const index = Object.keys(gPiano.keys).indexOf(noteName);
        if (settings.virtualPianoLayout && evt.shiftKey) {
          noteName = Object.keys(gPiano.keys)[index + transpose + 1];
        } else {
          noteName = Object.keys(gPiano.keys)[index + transpose];
        }
        if (noteName === undefined) return;
        release(noteName);
      }

      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
      return false;
    } else if (code == 20) {
      capsLockKey = false;
      if (!settings.noPreventDefault) evt.preventDefault();
    } else if (code === 0x20) {
      releaseSustain();
      if (!settings.noPreventDefault) evt.preventDefault();
    }
  };

  handleKeyPress = (evt: any) => {
    if (evt.target.type) return;
    if (!settings.noPreventDefault) evt.preventDefault();
    evt.stopPropagation();
    if (evt.keyCode == 27 || evt.keyCode == 13) {
      // focus chat input if needed
    }
    return false;
  };

  captureKeyboard();

  // NoteQuota
  const gNoteQuota = (() => {
    let last_rat = 0;
    const nqjq = $('#quota .value');
    setInterval(() => {
      gNoteQuota.tick();
    }, 2000);
    return new NoteQuota((points: number) => {
      if(state.noteQuota) {
      const rat = (points / (state.noteQuota as any).max) * 100;
      if (rat <= last_rat)
        nqjq.stop(true, true).css('width', rat.toFixed(0) + '%');
      else
        nqjq.stop(true, true).animate({ width: rat.toFixed(0) + '%' }, 2000, 'linear');
        last_rat = rat;
      }
    });
  })();
  state.noteQuota = gNoteQuota;

  gClient.on('nq', (nq_params: any) => {
    gNoteQuota.setParams(nq_params);
  });
  gClient.on('disconnect', () => {
    gNoteQuota.setParams(NoteQuota.PARAMS_OFFLINE);
  });

  // DMs
  let gKnowsHowToDm = localStorage.knowsHowToDm === 'true';
  gClient.on('participant removed', (part: any) => {
    if (gIsDming && part._id === gDmParticipant._id) {
      state.chat.endDM();
      if (!settings.cancelDMs) {
        new Notification({
          title: 'DM Cancelled',
          html: settings.hasSeenDMWarning
            ? `Your message is still in the chat input field, but will send as a public message.<br/>
          You can disable this in Client Settings.`
            : `Your message is still in the chatbox, but it will send as a public message.<br/>
          You can disable this in Client Settings.<br/>
          Enabling "Cancel DMs when recipient leaves" will clear your message from the text input<br/>
          and unfocus the textbox when the person you're typing to leaves the channel.`,
          target: '#room',
          duration: 20000,
          class: 'top',
        });
        if (!localStorage.hasSeenDMWarning) settings.hasSeenDMWarning = true;
        localStorage.hasSeenDMWarning = 'true';
        $('#chat-input').blur();
      }
      if (settings.cancelDMs) {
        state.chat.blur();
        $('#chat input').value = '';
        new Notification({
          title: 'DM Cancelled',
          text: `${part.name} left the room.`,
          target: '#room',
          duration: 10000,
        });
      }
    }
  });

  // Participant touch handler and menu
  const removeParticipantMenus = () => {
    $('.participant-menu').remove();
    $('.participantSpotlight').hide();
    document.removeEventListener('mousedown', removeParticipantMenus);
    document.removeEventListener('touchstart', removeParticipantMenus);
  };

  const participantMenu = (part: any) => {
    if (!part) return;
    removeParticipantMenus();
    document.addEventListener('mousedown', removeParticipantMenus);
    document.addEventListener('touchstart', removeParticipantMenus);
    $('#' + part.id).find('.enemySpotlight').show();
    const menu = $('<div class="participant-menu"></div>');
    $('body').append(menu);
    const jq_nd = $(part.nameDiv);
    const pos = jq_nd.position();
    menu.css({
      top: pos.top + jq_nd.height() + 15,
      left: pos.left + 6,
      background: part.color || 'black',
    });
    menu.on('mousedown touchstart', (evt: any) => {
      evt.stopPropagation();
      const target = $(evt.target);
      if (target.hasClass('menu-item')) {
        target.addClass('clicked');
        menu.fadeOut(200, () => { removeParticipantMenus(); });
      }
    });
    // Info line
    $('<div class="info"></div>')
      .appendTo(menu)
      .text(part._id)
      .on('mousedown touchstart', (evt: any) => {
        navigator.clipboard.writeText(part._id);
        evt.target.innerText = 'Copied!';
        setTimeout(() => { evt.target.innerText = part._id; }, 2500);
      });
    // Mute Notes
    if (settings.pianoMutes.indexOf(part._id) == -1) {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Mute Notes')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          settings.pianoMutes.push(part._id);
          if (localStorage) localStorage.pianoMutes = settings.pianoMutes.join(',');
          $(part.nameDiv).addClass('muted-notes');
        });
    } else {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Unmute Notes')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          let i: number;
          while ((i = settings.pianoMutes.indexOf(part._id)) != -1)
            settings.pianoMutes.splice(i, 1);
          if (localStorage) localStorage.pianoMutes = settings.pianoMutes.join(',');
          $(part.nameDiv).removeClass('muted-notes');
        });
    }
    // Mute Chat
    if (settings.chatMutes.indexOf(part._id) == -1) {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Mute Chat')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          settings.chatMutes.push(part._id);
          if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');
          $(part.nameDiv).addClass('muted-chat');
        });
    } else {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Unmute Chat')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          let i: number;
          while ((i = settings.chatMutes.indexOf(part._id)) != -1)
            settings.chatMutes.splice(i, 1);
          if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');
          $(part.nameDiv).removeClass('muted-chat');
        });
    }
    // Mute Completely
    if (!(settings.pianoMutes.indexOf(part._id) >= 0) || !(settings.chatMutes.indexOf(part._id) >= 0)) {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Mute Completely')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          settings.pianoMutes.push(part._id);
          if (localStorage) localStorage.pianoMutes = settings.pianoMutes.join(',');
          settings.chatMutes.push(part._id);
          if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');
          $(part.nameDiv).addClass('muted-notes');
          $(part.nameDiv).addClass('muted-chat');
        });
    }
    if (settings.pianoMutes.indexOf(part._id) >= 0 || settings.chatMutes.indexOf(part._id) >= 0) {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Unmute Completely')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          let i: number;
          while ((i = settings.pianoMutes.indexOf(part._id)) != -1)
            settings.pianoMutes.splice(i, 1);
          while ((i = settings.chatMutes.indexOf(part._id)) != -1)
            settings.chatMutes.splice(i, 1);
          if (localStorage) localStorage.pianoMutes = settings.pianoMutes.join(',');
          if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');
          $(part.nameDiv).removeClass('muted-notes');
          $(part.nameDiv).removeClass('muted-chat');
        });
    }
    // DM menu item
    if (gIsDming && gDmParticipant._id === part._id) {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('End Direct Message')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => { state.chat.endDM(); });
    } else {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Direct Message')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          if (!gKnowsHowToDm) {
            localStorage.knowsHowToDm = 'true';
            gKnowsHowToDm = true;
            new Notification({
              target: '#piano',
              duration: 20000,
              title: (window as any).i18nextify.i18next.t('How to DM'),
              text: (window as any).i18nextify.i18next.t(
                'After you click the button to direct message someone, future chat messages will be sent to them instead of to everyone. To go back to talking in public chat, send a blank chat message, or click the button again.',
              ),
            });
          }
          state.chat.startDM(part);
        });
    }
    // Hide/Show Cursor
    if (settings.cursorHides.indexOf(part._id) == -1) {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Hide Cursor')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          settings.cursorHides.push(part._id);
          if (localStorage) localStorage.cursorHides = settings.cursorHides.join(',');
          $(part.cursorDiv).hide();
        });
    } else {
      $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Show Cursor')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          let i: number;
          while ((i = settings.cursorHides.indexOf(part._id)) != -1)
            settings.cursorHides.splice(i, 1);
          if (localStorage) localStorage.cursorHides = settings.cursorHides.join(',');
          $(part.cursorDiv).show();
        });
    }
    // Mention
    $(`<div class="menu-item">${(window as any).i18nextify.i18next.t('Mention')}</div>`)
      .appendTo(menu)
      .on('mousedown touchstart', () => {
        $('#chat-input')[0].value += '@' + part.id + ' ';
        setTimeout(() => { $('#chat-input').focus(); }, 1);
      });
    // Admin actions
    if (gClient.isOwner() || gClient.permissions.chownAnywhere) {
      if (!gClient.channel.settings.lobby) {
        $(`<div class="menu-item give-crown">${(window as any).i18nextify.i18next.t('Give Crown')}</div>`)
          .appendTo(menu)
          .on('mousedown touchstart', () => {
            if (confirm('Give room ownership to ' + part.name + '?'))
              gClient.sendArray([{ m: 'chown', id: part.id }]);
          });
      }
      $(`<div class="menu-item kickban">${(window as any).i18nextify.i18next.t('Kickban')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          const minutes = prompt('How many minutes? (0-300)', '30');
          if (minutes === null) return;
          const ms = (parseFloat(minutes) || 0) * 60 * 1000;
          gClient.sendArray([{ m: 'kickban', _id: part._id, ms: ms }]);
        });
    }
    if (gClient.permissions.siteBan) {
      $(`<div class="menu-item site-ban">${(window as any).i18nextify.i18next.t('Site Ban')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          openModal('#siteban');
          setTimeout(() => {
            $('#siteban input[name=id]').val(part._id);
            $('#siteban input[name=reasonText]').val('Discrimination against others');
            $('#siteban input[name=reasonText]').attr('disabled', true);
            $('#siteban select[name=reasonSelect]').val('Discrimination against others');
            $('#siteban input[name=durationNumber]').val(5);
            $('#siteban input[name=durationNumber]').attr('disabled', false);
            $('#siteban select[name=durationUnit]').val('hours');
            $('#siteban textarea[name=note]').val('');
            $('#siteban p[name=errorText]').text('');
            if (gClient.permissions.siteBanAnyReason) {
              $('#siteban select[name=reasonSelect] option[value=custom]').attr('disabled', false);
            } else {
              $('#siteban select[name=reasonSelect] option[value=custom]').attr('disabled', true);
            }
          }, 100);
        });
    }
    if (gClient.permissions.usersetOthers) {
      $(`<div class="menu-item set-color">${(window as any).i18nextify.i18next.t('Set Color')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          const color = prompt('What color?', part.color);
          if (color === null) return;
          gClient.sendArray([{ m: 'setcolor', _id: part._id, color: color }]);
        });
    }
    if (gClient.permissions.usersetOthers) {
      $(`<div class="menu-item set-name">${(window as any).i18nextify.i18next.t('Set Name')}</div>`)
        .appendTo(menu)
        .on('mousedown touchstart', () => {
          const name = prompt('What name?', part.name);
          if (name === null) return;
          gClient.sendArray([{ m: 'setname', _id: part._id, name: name }]);
        });
    }
    menu.fadeIn(100);
  };

  participantTouchhandler = (e: any, ele: any) => {
    const target = ele;
    const target_jq = $(target);
    if (!target_jq) return;
    if (target_jq.hasClass('name')) {
      target_jq.addClass('play');
      const id = target.participantId;
      if (id == gClient.participantId) {
        openModal('#rename', 'input[name=name]');
        setTimeout(() => {
          $('#rename input[name=name]').val(gClient.ppl[gClient.participantId].name);
          $('#rename input[name=color]').val(gClient.ppl[gClient.participantId].color);
        }, 100);
      } else if (id) {
        const part = gClient.ppl[id] || null;
        if (part) {
          participantMenu(part);
          e.stopPropagation();
        }
      }
    }
  };

  const releasehandler = () => { $('#names .name').removeClass('play'); };
  document.body.addEventListener('mouseup', releasehandler);
  document.body.addEventListener('touchend', releasehandler);

  shouldShowSnowflakes();

  // Background color
  (() => {
    const setColor = (hex: string, hex2?: string) => {
      const color1 = new Color(hex);
      const color2 = new Color(hex2 || hex);
      if (!hex2) color2.add(-0x40, -0x40, -0x40);
      const bottom = document.getElementById('bottom')!;
      document.body.style.setProperty('--color', color1.toHexa());
      document.body.style.setProperty('--color2', color2.toHexa());
      bottom.style.setProperty('--color', color1.toHexa());
      bottom.style.setProperty('--color2', color2.toHexa());
    };

    const setColorToDefault = () => {
      setColor('#220022', '#000022');
    };

    (window as any).setBackgroundColor = setColor;
    (window as any).setBackgroundColorToDefault = setColorToDefault;
    setColorToDefault();

    gClient.on('ch', (ch: any) => {
      if (settings.noBackgroundColor) {
        setColorToDefault();
        return;
      }
      if (ch.ch.settings) {
        if (ch.ch.settings.color) {
          setColor(ch.ch.settings.color, ch.ch.settings.color2);
        } else {
          setColorToDefault();
        }
      }
    });
  })();

  // Hide piano attribute
  if (settings.hidePianoLocal) {
    $('#piano').hide();
  } else {
    $('#piano').show();
  }

  // Hide chat attribute
  if (settings.hideChatLocal) {
    $('#chat').hide();
  } else {
    $('#chat').show();
  }

  // Smooth cursor attribute
  if (settings.smoothCursor) {
    $('#cursors').attr('smooth-cursors', '');
  } else {
    $('#cursors').removeAttr('smooth-cursors');
  }
}

export function shouldShowSnowflakes(): void {
  const snowflakes = document.querySelector('.snowflakes') as HTMLElement;
  if (snowflakes) {
    snowflakes.style.visibility = settings.snowflakes ? 'visible' : 'hidden';
  }
}

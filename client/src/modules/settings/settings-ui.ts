import { Notification } from '../../libs/Notification';
import { getClient } from '../../util/state';
import { settings } from './settings';
import { openModal, closeModal } from '../../util/modal';
import { BASIC_PIANO_SCALES } from '../../util/constants';
import { Participant } from '../../types';
import { i18next } from '../../util/translations';

export function initSettingsUI(): void {
  if (window.location.hostname === 'multiplayerpiano.com') {
    const button = document.getElementById('client-settings-btn')!;
    let notification: { close: () => void; on: (evt: string, cb: () => void) => void } | null = null;

    button.addEventListener('click', () => {
      if (notification) {
        notification.close();
      } else {
        showSynth();
      }
    });

    const showSynth = () => {
      const html = document.createElement('div');

      // show ids in chat
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Show user IDs in chat';
        if (settings.showIdsInChat) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.showIdsInChat = setting.classList.contains('enabled');
          settings.showIdsInChat = setting.classList.contains('enabled');
        };
        html.appendChild(setting);
      })();

      // show timestamps in chat
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Timestamps in chat';
        if (settings.showTimestampsInChat) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.showTimestampsInChat = setting.classList.contains('enabled');
          settings.showTimestampsInChat = setting.classList.contains('enabled');
        };
        html.appendChild(setting);
      })();

      // no chat colors
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'No chat colors';
        if (settings.noChatColors) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.noChatColors = setting.classList.contains('enabled');
          settings.noChatColors = setting.classList.contains('enabled');
        };
        html.appendChild(setting);
      })();

      // no background color
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Force dark background';
        if (settings.noBackgroundColor) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.noBackgroundColor = setting.classList.contains('enabled');
          settings.noBackgroundColor = setting.classList.contains('enabled');
          const client = getClient();
          if (client.channel!.settings.color && !settings.noBackgroundColor) {
            window.setBackgroundColor(
              client.channel!.settings.color,
              client.channel!.settings.color2,
            );
          } else {
            window.setBackgroundColorToDefault();
          }
        };
        html.appendChild(setting);
      })();

      // output own notes
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Output own notes to MIDI';
        if (settings.outputOwnNotes) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.outputOwnNotes = setting.classList.contains('enabled');
          settings.outputOwnNotes = setting.classList.contains('enabled');
        };
        html.appendChild(setting);
      })();

      // virtual piano layout
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Virtual Piano layout';
        if (settings.virtualPianoLayout) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.virtualPianoLayout = setting.classList.contains('enabled');
          settings.virtualPianoLayout = setting.classList.contains('enabled');
          const { setKeyBinding } = require('../keyboard');
          setKeyBinding(settings.virtualPianoLayout);
        };
        html.appendChild(setting);
      })();

      // show chat tooltips
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Show _id tooltips';
        if (settings.showChatTooltips) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.showChatTooltips = setting.classList.contains('enabled');
          settings.showChatTooltips = setting.classList.contains('enabled');
        };
        html.appendChild(setting);
      })();

      // show piano notes
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Show Piano Notes';
        if (settings.showPianoNotes) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.showPianoNotes = setting.classList.contains('enabled');
          settings.showPianoNotes = setting.classList.contains('enabled');
        };
        html.appendChild(setting);
      })();

      // enable smooth cursors
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Enable smooth cursors';
        if (settings.smoothCursor) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.smoothCursor = setting.classList.contains('enabled');
          settings.smoothCursor = setting.classList.contains('enabled');
          const client = getClient();
          if (settings.smoothCursor) {
            document.getElementById('cursors')!.setAttribute('smooth-cursors', '');
          } else {
            document.getElementById('cursors')!.removeAttribute('smooth-cursors');
          }
          if (settings.smoothCursor) {
            Object.values(client.ppl).forEach((participant: Participant) => {
              if (participant.cursorDiv) {
                participant.cursorDiv.style.left = '';
                participant.cursorDiv.style.top = '';
                participant.cursorDiv.style.transform =
                  'translate3d(' + participant.x + 'vw, ' + participant.y + 'vh, 0)';
              }
            });
          } else {
            Object.values(client.ppl).forEach((participant: Participant) => {
              if (participant.cursorDiv) {
                participant.cursorDiv.style.left = participant.x + '%';
                participant.cursorDiv.style.top = participant.y + '%';
                participant.cursorDiv.style.transform = '';
              }
            });
          }
        };
        html.appendChild(setting);
      })();

      // highlight scale notes
      (() => {
        const setting = document.createElement('select') as HTMLSelectElement;
        setting.className = 'setting';
        (setting as HTMLElement).style.cssText = 'color: inherit; width: calc(100% - 2px);';
        setting.setAttribute('translated', '');
        const keys = Object.keys(BASIC_PIANO_SCALES);
        const defaultOption = document.createElement('option');
        defaultOption.value = defaultOption.innerText = 'No highlighted notes';
        defaultOption.selected = !settings.highlightScaleNotes;
        setting.appendChild(defaultOption);

        for (const key of keys) {
          const option = document.createElement('option');
          option.value = key;
          option.innerText = key;
          option.selected = key === settings.highlightScaleNotes;
          setting.appendChild(option);
        }

        if (settings.highlightScaleNotes) {
          setting.value = settings.highlightScaleNotes;
        }

        setting.onchange = () => {
          localStorage.highlightScaleNotes = setting.value;
          settings.highlightScaleNotes = setting.value;
        };
        html.appendChild(setting);
      })();

      // hide all cursors
      (() => {
        const setting = document.createElement('div');
        setting.className = 'setting';
        setting.innerText = 'Hide all cursors';
        if (settings.hideAllCursors) {
          setting.classList.toggle('enabled');
        }
        setting.onclick = () => {
          setting.classList.toggle('enabled');
          localStorage.hideAllCursors = setting.classList.contains('enabled');
          settings.hideAllCursors = setting.classList.contains('enabled');
          if (settings.hideAllCursors) {
            document.getElementById('cursors')!.style.display = 'none';
          } else {
            document.getElementById('cursors')!.style.display = 'block';
          }
        };
        html.appendChild(setting);
      })();

      // notification
      notification = new Notification({
        title: 'Client Settings',
        html: html,
        duration: -1,
        target: '#client-settings-btn',
      });
      notification.on('close', () => {
        const tip = document.getElementById('tooltip');
        if (tip) tip.parentNode!.removeChild(tip);
        notification = null;
      });
    };
  } else {
    const button = document.getElementById('client-settings-btn')!;
    const content = document.getElementById('client-settings-content')!;
    const tablinks = document.getElementsByClassName('client-settings-tablink');
    const okButton = document.getElementById('client-settings-ok-btn')!;

    button.addEventListener('click', (evt) => {
      evt.stopPropagation();
      openModal('#client-settings');
    });

    okButton.addEventListener('click', (evt) => {
      evt.stopPropagation();
      closeModal();
    });

    const createSetting = (
      id: string,
      labelText: string,
      isChecked: boolean,
      addBr: boolean,
      container: HTMLElement,
      onclickFunc: () => void,
    ) => {
      const setting = document.createElement('input') as HTMLInputElement;
      setting.type = 'checkbox';
      setting.id = id;
      setting.checked = isChecked;
      setting.onclick = onclickFunc;

      const label = document.createElement('label');
      label.innerText = i18next.t(labelText + ':') + ' ';

      label.appendChild(setting);
      container.appendChild(label);
      if (addBr) container.appendChild(document.createElement('br'));
    };

    window.changeClientSettingsTab = (evt: { currentTarget: Element }, tabName: string) => {
      content.innerHTML = '';

      for (let index = 0; index < tablinks.length; index++) {
        tablinks[index].className = tablinks[index].className.replace(' active', '');
      }
      evt.currentTarget.className += ' active';

      switch (tabName.toLowerCase()) {
        case 'chat': {
          const html = document.createElement('div');

          createSetting(
            'show-timestamps-in-chat',
            'Show timestamps in chat',
            settings.showTimestampsInChat,
            true,
            html,
            () => {
              settings.showTimestampsInChat = !settings.showTimestampsInChat;
              localStorage.showTimestampsInChat = settings.showTimestampsInChat;
            },
          );

          createSetting(
            'show-user-ids-in-chat',
            'Show user IDs in chat',
            settings.showIdsInChat,
            true,
            html,
            () => {
              settings.showIdsInChat = !settings.showIdsInChat;
              localStorage.showIdsInChat = settings.showIdsInChat;
            },
          );

          createSetting(
            'show-id-tooltips',
            'Show ID tooltips',
            settings.showChatTooltips,
            true,
            html,
            () => {
              settings.showChatTooltips = !settings.showChatTooltips;
              localStorage.showChatTooltips = settings.showChatTooltips;
            },
          );

          createSetting(
            'no-chat-colors',
            'No chat colors',
            settings.noChatColors,
            true,
            html,
            () => {
              settings.noChatColors = !settings.noChatColors;
              localStorage.noChatColors = settings.noChatColors;
            },
          );

          createSetting(
            'hide-chat',
            'Hide chat',
            settings.hideChatLocal,
            true,
            html,
            () => {
              settings.hideChatLocal = !settings.hideChatLocal;
              localStorage.hideChat = settings.hideChatLocal;

              if (settings.hideChatLocal) {
                document.getElementById('chat')!.style.display = 'none';
              } else {
                document.getElementById('chat')!.style.display = 'block';
              }
            },
          );

          createSetting(
            'cancel-dms',
            'Cancel DMs when recipient leaves',
            settings.cancelDMs,
            false,
            html,
            () => {
              settings.cancelDMs = !settings.cancelDMs;
              localStorage.cancelDMs = settings.cancelDMs;
            },
          );

          content.appendChild(html);
          break;
        }

        case 'midi': {
          const html = document.createElement('div');

          createSetting(
            'output-own-notes-to-midi',
            'Output own notes to MIDI',
            settings.outputOwnNotes,
            true,
            html,
            () => {
              settings.outputOwnNotes = !settings.outputOwnNotes;
              localStorage.outputOwnNotes = settings.outputOwnNotes;
            },
          );
          createSetting(
            'disable-midi-drum-channel',
            'Disable MIDI Drum Channel (channel 10)',
            settings.disableMIDIDrumChannel,
            true,
            html,
            () => {
              settings.disableMIDIDrumChannel = !settings.disableMIDIDrumChannel;
              localStorage.disableMIDIDrumChannel = settings.disableMIDIDrumChannel;
            },
          );

          content.appendChild(html);
          break;
        }

        case 'piano': {
          const html = document.createElement('div');

          createSetting(
            'virtual-piano-layout',
            'Virtual Piano layout',
            settings.virtualPianoLayout,
            true,
            html,
            () => {
              settings.virtualPianoLayout = !settings.virtualPianoLayout;
              localStorage.virtualPianoLayout = settings.virtualPianoLayout;
              const { setKeyBinding } = require('../keyboard');
              setKeyBinding(settings.virtualPianoLayout);
            },
          );

          createSetting(
            'show-piano-notes',
            'Show piano notes',
            settings.showPianoNotes,
            true,
            html,
            () => {
              settings.showPianoNotes = !settings.showPianoNotes;
              localStorage.showPianoNotes = settings.showPianoNotes;
            },
          );

          createSetting(
            'hide-piano',
            'Hide piano',
            settings.hidePianoLocal,
            true,
            html,
            () => {
              settings.hidePianoLocal = !settings.hidePianoLocal;
              localStorage.hidePiano = settings.hidePianoLocal;

              if (settings.hidePianoLocal) {
                document.getElementById('piano')!.style.display = 'none';
              } else {
                document.getElementById('piano')!.style.display = 'block';
              }
            },
          );

          const selectSetting = document.createElement('select') as HTMLSelectElement;
          selectSetting.className = 'setting';
          selectSetting.style.cssText = 'width: calc(58.7% - 2px);';

          selectSetting.onchange = () => {
            localStorage.highlightScaleNotes = selectSetting.value;
            settings.highlightScaleNotes = selectSetting.value;
          };

          const keys = Object.keys(BASIC_PIANO_SCALES);
          const defaultOption = document.createElement('option');
          defaultOption.value = defaultOption.innerText = 'None';
          defaultOption.selected = !settings.highlightScaleNotes;
          selectSetting.appendChild(defaultOption);

          for (const key of keys) {
            const option = document.createElement('option');
            option.value = key;
            option.innerText = key;
            option.selected = key === settings.highlightScaleNotes;
            selectSetting.appendChild(option);
          }

          if (settings.highlightScaleNotes) {
            selectSetting.value = settings.highlightScaleNotes;
          }

          const label = document.createElement('label');
          label.setAttribute('for', selectSetting.id);
          label.innerText = 'Highlighted notes: ';

          html.appendChild(label);
          html.appendChild(selectSetting);

          content.appendChild(html);
          break;
        }

        case 'misc': {
          const html = document.createElement('div');

          createSetting(
            'dont-use-prevent-default',
            "Don't use prevent default",
            settings.noPreventDefault,
            true,
            html,
            () => {
              settings.noPreventDefault = !settings.noPreventDefault;
              localStorage.noPreventDefault = settings.noPreventDefault;
            },
          );

          createSetting(
            'force-dark-background',
            'Force dark background',
            settings.noBackgroundColor,
            true,
            html,
            () => {
              settings.noBackgroundColor = !settings.noBackgroundColor;
              localStorage.noBackgroundColor = settings.noBackgroundColor;
              const client = getClient();

              if (client.channel!.settings.color && !settings.noBackgroundColor) {
                window.setBackgroundColor(
                  client.channel!.settings.color,
                  client.channel!.settings.color2,
                );
              } else {
                window.setBackgroundColorToDefault();
              }
            },
          );

          createSetting(
            'enable-smooth-cursors',
            'Enable smooth cursors',
            settings.smoothCursor,
            true,
            html,
            () => {
              settings.smoothCursor = !settings.smoothCursor;
              localStorage.smoothCursor = settings.smoothCursor;
              const client = getClient();
              if (settings.smoothCursor) {
                document.getElementById('cursors')!.setAttribute('smooth-cursors', '');
                Object.values(client.ppl).forEach((participant: Participant) => {
                  if (participant.cursorDiv) {
                    participant.cursorDiv.style.left = '';
                    participant.cursorDiv.style.top = '';
                    participant.cursorDiv.style.transform =
                      'translate3d(' + participant.x + 'vw, ' + participant.y + 'vh, 0)';
                  }
                });
              } else {
                document.getElementById('cursors')!.removeAttribute('smooth-cursors');
                Object.values(client.ppl).forEach((participant: Participant) => {
                  if (participant.cursorDiv) {
                    participant.cursorDiv.style.left = participant.x + '%';
                    participant.cursorDiv.style.top = participant.y + '%';
                    participant.cursorDiv.style.transform = '';
                  }
                });
              }
            },
          );

          createSetting(
            'hide-all-cursors',
            'Hide all cursors',
            settings.hideAllCursors,
            true,
            html,
            () => {
              settings.hideAllCursors = !settings.hideAllCursors;
              localStorage.hideAllCursors = settings.hideAllCursors;
              if (settings.hideAllCursors) {
                document.getElementById('cursors')!.style.display = 'none';
              } else {
                document.getElementById('cursors')!.style.display = 'block';
              }
            },
          );

          createSetting(
            'hide-bot-users',
            'Hide all bots',
            settings.hideBotUsers,
            true,
            html,
            () => {
              settings.hideBotUsers = !settings.hideBotUsers;
              localStorage.hideBotUsers = settings.hideBotUsers;
              const client = getClient();

              Object.values(client.ppl).forEach((participant: Participant) => {
                if (
                  participant.tag &&
                    participant.tag.text === 'BOT' &&
                  participant.cursorDiv
                ) {
                  if (settings.hideBotUsers) {
                    const nd = document.getElementById('namediv-' + participant.id); if (nd) nd.style.display = 'none';
                    participant.cursorDiv.style.display = 'none';
                  } else {
                    const nd = document.getElementById('namediv-' + participant.id); if (nd) nd.style.display = 'block';
                    participant.cursorDiv.style.display = 'block';
                  }
                }
              });
            },
          );

          if (new Date().getMonth() === 11) {
            createSetting(
              'snowflakes',
              'Enable snowflakes',
              settings.snowflakes,
              true,
              html,
              () => {
                settings.snowflakes = !settings.snowflakes;
                localStorage.snowflakes = settings.snowflakes;
                const { shouldShowSnowflakes } = require('../keyboard');
                shouldShowSnowflakes();
              },
            );
          }

          content.appendChild(html);
          break;
        }
      }
    };

    window.changeClientSettingsTab(
      {
        currentTarget: document.getElementsByClassName(
          'client-settings-tablink',
        )[0],
      },
      'Chat',
    );
  }
}

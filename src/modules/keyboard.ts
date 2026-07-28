import { getClient, getPiano, state } from '../util/state';
import { settings } from './settings/settings';
import {
	press,
	release,
	pressSustain,
	releaseSustain,
	setAutoSustain,
	getAutoSustain,
} from '../util/actions';
import { NoteQuota } from '../libs/NoteQuota';
import { Notification } from '../libs/Notification';
import { openModal } from '../util/modal';
import { fadeIn, fadeOut } from '../util/util';
import type { Participant } from '../types';
import { i18next } from '../util/translations';
import { initBackground } from './background';

let gKeyboardSeq = 0;

// Module-level state
let transpose = 0;
let key_binding: Record<
	number,
	{ note: { note: string; octave: number }; held: boolean }
>;
let capturingKeyboard = false;
let capsLockKey = false;

let knowsYouCanUseKeyboardTimeout: ReturnType<typeof setTimeout> | undefined;
let knowsYouCanUseKeyboardNotification: { close: () => void } | undefined;

// DM state
let gDmParticipant: Participant | null = null;
let gIsDming = false;
let gReplyParticipant: Participant | null = null;
let gIsReplying = false;
let gMessageId: string | null = null;

// DM getters/setters
export const getIsDming = (): boolean => gIsDming;
export const setIsDming = (v: boolean): void => {
	gIsDming = v;
};
export const getDmParticipant = (): Participant | null => gDmParticipant;
export const setDmParticipant = (v: Participant | null): void => {
	gDmParticipant = v;
};
export const getIsReplying = (): boolean => gIsReplying;
export const setIsReplying = (v: boolean): void => {
	gIsReplying = v;
};
export const getReplyParticipant = (): Participant | null => gReplyParticipant;
export const setReplyParticipant = (v: Participant | null): void => {
	gReplyParticipant = v;
};
export const getMessageId = (): string | null => gMessageId;
export const setMessageId = (v: string | null): void => {
	gMessageId = v;
};

export const getTranspose = (): number => transpose;
export const getKeyBinding = (): Record<
	number,
	{ note: { note: string; octave: number }; held: boolean }
> => key_binding;

let _layouts: Record<string, Record<number, any>> | null = null;
export const setKeyBinding = (useVP: boolean): void => {
	if (_layouts) key_binding = useVP ? _layouts.VP : _layouts.MPP;
};

// Forward declarations for keyboard handlers
let handleKeyDown: (evt: KeyboardEvent) => any;
let handleKeyUp: (evt: KeyboardEvent) => any;
let handleKeyPress: (evt: KeyboardEvent) => any;

const recapListener = () => {
	captureKeyboard();
};
export function captureKeyboard(): void {
	if (!capturingKeyboard) {
		capturingKeyboard = true;
		document
			.getElementById('piano')!
			.removeEventListener('mousedown', recapListener);
		document
			.getElementById('piano')!
			.removeEventListener('touchstart', recapListener);
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		window.addEventListener('keypress', handleKeyPress);
	}
}

export function releaseKeyboard(): void {
	if (capturingKeyboard) {
		capturingKeyboard = false;
		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);
		window.removeEventListener('keypress', handleKeyPress);
		document
			.getElementById('piano')!
			.addEventListener('mousedown', recapListener);
		document
			.getElementById('piano')!
			.addEventListener('touchstart', recapListener);
	}
}

export const velocityFromMouseY = (): number => {
	return 0.1 + (state.mouseY / 100) * 0.6;
};

let participantTouchhandler: (e: Event, ele: HTMLElement) => void;

export const getParticipantTouchhandler = (): ((
	e: Event,
	ele: HTMLElement,
) => void) => participantTouchhandler;

export function initKeyboard(): void {
	const gClient = getClient();
	const gPiano = getPiano();

	// Volume slider
	const volume_slider = document.getElementById(
		'volume-slider',
	) as HTMLInputElement;
	volume_slider.value = String(gPiano.audio.volume);
	document.getElementById('volume-label')!.textContent =
		'Volume: ' + Math.floor(gPiano.audio.volume * 100) + '%';
	volume_slider.addEventListener('input', () => {
		const v = +volume_slider.value;
		gPiano.audio.setVolume(v);
		if (window.localStorage) localStorage.volume = String(v);
		document.getElementById('volume-label')!.textContent =
			'Volume: ' + Math.floor(v * 100) + '%';
	});

	// Note class
	const Note = function (
		this: { note: string; octave: number },
		note: string,
		octave?: number,
	) {
		this.note = note;
		this.octave = octave || 0;
	} as any;

	const n = (a: string, b?: number) => {
		return { note: new Note(a, b), held: false };
	};

	// Layouts
	const layouts: Record<
		string,
		Record<number, { note: { note: string; octave: number }; held: boolean }>
	> = {
		MPP: {
			65: n('gs'),
			90: n('a'),
			83: n('as'),
			88: n('b'),
			67: n('c', 1),
			70: n('cs', 1),
			86: n('d', 1),
			71: n('ds', 1),
			66: n('e', 1),
			78: n('f', 1),
			74: n('fs', 1),
			77: n('g', 1),
			75: n('gs', 1),
			188: n('a', 1),
			76: n('as', 1),
			190: n('b', 1),
			191: n('c', 2),
			222: n('cs', 2),
			49: n('gs', 1),
			81: n('a', 1),
			50: n('as', 1),
			87: n('b', 1),
			69: n('c', 2),
			52: n('cs', 2),
			82: n('d', 2),
			53: n('ds', 2),
			84: n('e', 2),
			89: n('f', 2),
			55: n('fs', 2),
			85: n('g', 2),
			56: n('gs', 2),
			73: n('a', 2),
			57: n('as', 2),
			79: n('b', 2),
			80: n('c', 3),
			189: n('cs', 3),
			173: n('cs', 3),
			219: n('d', 3),
			187: n('ds', 3),
			61: n('ds', 3),
			221: n('e', 3),
		},
		VP: {
			112: n('c', -1),
			113: n('d', -1),
			114: n('e', -1),
			115: n('f', -1),
			116: n('g', -1),
			117: n('a', -1),
			118: n('b', -1),
			49: n('c'),
			50: n('d'),
			51: n('e'),
			52: n('f'),
			53: n('g'),
			54: n('a'),
			55: n('b'),
			56: n('c', 1),
			57: n('d', 1),
			48: n('e', 1),
			81: n('f', 1),
			87: n('g', 1),
			69: n('a', 1),
			82: n('b', 1),
			84: n('c', 2),
			89: n('d', 2),
			85: n('e', 2),
			73: n('f', 2),
			79: n('g', 2),
			80: n('a', 2),
			65: n('b', 2),
			83: n('c', 3),
			68: n('d', 3),
			70: n('e', 3),
			71: n('f', 3),
			72: n('g', 3),
			74: n('a', 3),
			75: n('b', 3),
			76: n('c', 4),
			90: n('d', 4),
			88: n('e', 4),
			67: n('f', 4),
			86: n('g', 4),
			66: n('a', 4),
			78: n('b', 4),
			77: n('c', 5),
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

	handleKeyDown = (evt: KeyboardEvent) => {
		if ((evt.target as HTMLElement & { type?: string }).type) return;
		const code = parseInt(String(evt.keyCode));
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
				clearKeyboardHint();
				if (localStorage) localStorage.knowsYouCanUseKeyboard = 'true';
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

	handleKeyUp = (evt: KeyboardEvent) => {
		if ((evt.target as HTMLElement & { type?: string }).type) return;
		const code = parseInt(String(evt.keyCode));
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

	handleKeyPress = (evt: KeyboardEvent) => {
		if ((evt.target as HTMLElement & { type?: string }).type) return;
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
		const nqjq = document.querySelector('#quota .value') as HTMLElement;
		setInterval(() => {
			gNoteQuota.tick();
		}, 2000);
		return new NoteQuota((points: number) => {
			if (state.noteQuota) {
				const rat = (points / (state.noteQuota as any).max) * 100;
				if (rat <= last_rat) {
					nqjq.style.transition = 'none';
					nqjq.style.width = rat.toFixed(0) + '%';
				} else {
					nqjq.style.transition = 'width 2s linear';
					nqjq.style.width = rat.toFixed(0) + '%';
				}
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
		if (gIsDming && gDmParticipant && part._id === gDmParticipant._id) {
			state.chat!.endDM();
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
				(document.getElementById('chat-input') as HTMLElement).blur();
			}
			if (settings.cancelDMs) {
				state.chat!.blur();
				(document.querySelector('#chat input') as HTMLInputElement).value = '';
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
		document.querySelectorAll('.participant-menu').forEach(el => el.remove());
		document
			.querySelectorAll('.participantSpotlight')
			.forEach(el => ((el as HTMLElement).style.display = 'none'));
		document.removeEventListener('mousedown', removeParticipantMenus);
		document.removeEventListener('touchstart', removeParticipantMenus);
	};

	const participantMenu = (part: any) => {
		if (!part) return;
		removeParticipantMenus();
		document.addEventListener('mousedown', removeParticipantMenus);
		document.addEventListener('touchstart', removeParticipantMenus);
		const spotlight = document
			.getElementById(part.id)
			?.querySelector('.enemySpotlight') as HTMLElement;
		if (spotlight) spotlight.style.display = 'block';
		const menu = document.createElement('div');
		menu.className = 'participant-menu';
		document.body.appendChild(menu);
		const pos = part.nameDiv!.getBoundingClientRect();
		Object.assign(menu.style, {
			top: pos.top + part.nameDiv!.offsetHeight + 'px',
			left: pos.left + 'px',
			background: part.color || 'black',
		});
		const menuClickHandler = (evt: Event) => {
			evt.stopPropagation();
			const target = evt.target as HTMLElement;
			if (target.classList.contains('menu-item')) {
				target.classList.add('clicked');
				fadeOut(menu, 200, () => {
					removeParticipantMenus();
				});
			}
		};
		menu.addEventListener('mousedown', menuClickHandler);
		menu.addEventListener('touchstart', menuClickHandler);
		// Info line
		const infoDiv = document.createElement('div');
		infoDiv.className = 'info';
		infoDiv.textContent = part._id;
		const infoHandler = (evt: Event) => {
			navigator.clipboard.writeText(part._id);
			(evt.target as HTMLElement).innerText = 'Copied!';
			setTimeout(() => {
				(evt.target as HTMLElement).innerText = part._id;
			}, 2500);
		};
		infoDiv.addEventListener('mousedown', infoHandler);
		infoDiv.addEventListener('touchstart', infoHandler);
		menu.appendChild(infoDiv);

		// Helper to create menu items
		const createMenuItem = (label: string, handler: () => void) => {
			const item = document.createElement('div');
			item.className = 'menu-item';
			item.innerHTML = label;
			item.addEventListener('mousedown', handler);
			item.addEventListener('touchstart', handler);
			menu.appendChild(item);
		};

		// Mute Notes
		if (settings.pianoMutes.indexOf(part._id) == -1) {
			createMenuItem(i18next.t('Mute Notes'), () => {
				settings.pianoMutes.push(part._id);
				if (localStorage)
					localStorage.pianoMutes = settings.pianoMutes.join(',');
				part.nameDiv?.classList.add('muted-notes');
			});
		} else {
			createMenuItem(i18next.t('Unmute Notes'), () => {
				let i: number;
				while ((i = settings.pianoMutes.indexOf(part._id)) != -1)
					settings.pianoMutes.splice(i, 1);
				if (localStorage)
					localStorage.pianoMutes = settings.pianoMutes.join(',');
				part.nameDiv?.classList.remove('muted-notes');
			});
		}
		// Mute Chat
		if (settings.chatMutes.indexOf(part._id) == -1) {
			createMenuItem(i18next.t('Mute Chat'), () => {
				// hide messages
				try {
                    (Array.from(document.querySelectorAll("#chat li")) as HTMLLIElement[])
                        .filter(msg => msg.getAttribute("user-id") === part._id)
                        .forEach(msg => msg.style.display = "none");
                } catch (error) {
                    console.error("couldn't hide muted user's messages: " + error);
                }

				settings.chatMutes.push(part._id);
				if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');
				part.nameDiv?.classList.add('muted-chat');
			});
		} else {
			createMenuItem(i18next.t('Unmute Chat'), () => {
				//show messages
				try {
                    (Array.from(document.querySelectorAll("#chat li")) as HTMLLIElement[])
                        .filter(msg => msg.getAttribute("user-id") === part._id)
                        .forEach(msg => msg.style.display = "block");
                } catch (error) {
                    console.log("couldn't show muted user's messages: " + error);
                }

				let i: number;
				while ((i = settings.chatMutes.indexOf(part._id)) != -1)
					settings.chatMutes.splice(i, 1);
				if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');
				part.nameDiv?.classList.remove('muted-chat');
			});
		}
		// Mute Completely
		if (
			!(settings.pianoMutes.indexOf(part._id) >= 0) ||
			!(settings.chatMutes.indexOf(part._id) >= 0)
		) {
			createMenuItem(i18next.t('Mute Completely'), () => {
				settings.pianoMutes.push(part._id);
				if (localStorage)
					localStorage.pianoMutes = settings.pianoMutes.join(',');

				// hide messages
				try {
                    (Array.from(document.querySelectorAll("#chat li")) as HTMLLIElement[])
                        .filter(msg => msg.getAttribute("user-id") === part._id)
                        .forEach(msg => msg.style.display = "none");
                } catch (error) {
                    console.error("couldn't remove muted user's messages:" + error);
                }

				settings.chatMutes.push(part._id);
				if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');
				part.nameDiv?.classList.add('muted-notes');
				part.nameDiv?.classList.add('muted-chat');
			});
		}
		if (
			settings.pianoMutes.indexOf(part._id) >= 0 ||
			settings.chatMutes.indexOf(part._id) >= 0
		) {
			createMenuItem(i18next.t('Unmute Completely'), () => {
				let i: number;
				while ((i = settings.pianoMutes.indexOf(part._id)) != -1)
					settings.pianoMutes.splice(i, 1);
				while ((i = settings.chatMutes.indexOf(part._id)) != -1)
					settings.chatMutes.splice(i, 1);
				if (localStorage)
					localStorage.pianoMutes = settings.pianoMutes.join(',');
				if (localStorage) localStorage.chatMutes = settings.chatMutes.join(',');

				// show messages
				try {
                    (Array.from(document.querySelectorAll("#chat li")) as HTMLLIElement[])
                        .filter(msg => msg.getAttribute("user-id") === part._id)
                        .forEach(msg => msg.style.display = "block");
                } catch (error) {
                    console.error("couldn't remove muted user's messages: " + error);
                }

				part.nameDiv?.classList.remove('muted-notes');
				part.nameDiv?.classList.remove('muted-chat');
			});
		}
		// DM menu item
		if (gIsDming && gDmParticipant && gDmParticipant._id === part._id) {
			createMenuItem(i18next.t('End Direct Message'), () => {
				state.chat!.endDM();
			});
		} else {
			createMenuItem(i18next.t('Direct Message'), () => {
				if (!gKnowsHowToDm) {
					localStorage.knowsHowToDm = 'true';
					gKnowsHowToDm = true;
					new Notification({
						target: '#piano',
						duration: 20000,
						title: i18next.t('How to DM'),
						text: i18next.t(
							'After you click the button to direct message someone, future chat messages will be sent to them instead of to everyone. To go back to talking in public chat, send a blank chat message, or click the button again.',
						),
					});
				}
				state.chat!.startDM(part);
			});
		}
		// Hide/Show Cursor
		if (settings.cursorHides.indexOf(part._id) == -1) {
			createMenuItem(i18next.t('Hide Cursor'), () => {
				settings.cursorHides.push(part._id);
				if (localStorage)
					localStorage.cursorHides = settings.cursorHides.join(',');
				if (part.cursorDiv) part.cursorDiv.style.display = 'none';
			});
		} else {
			createMenuItem(i18next.t('Show Cursor'), () => {
				let i: number;
				while ((i = settings.cursorHides.indexOf(part._id)) != -1)
					settings.cursorHides.splice(i, 1);
				if (localStorage)
					localStorage.cursorHides = settings.cursorHides.join(',');
				if (part.cursorDiv) part.cursorDiv.style.display = 'block';
			});
		}
		// Mention
		createMenuItem(i18next.t('Mention'), () => {
			(document.getElementById('chat-input') as HTMLInputElement).value +=
				'@' + part.id + ' ';
			setTimeout(() => {
				(document.getElementById('chat-input') as HTMLElement).focus();
			}, 1);
		});
		// Admin actions
		if (gClient.isOwner() || gClient.permissions.chownAnywhere) {
			if (!gClient.channel!.settings.lobby) {
				createMenuItem(i18next.t('Give Crown'), () => {
					if (confirm('Give room ownership to ' + part.name + '?'))
						gClient.sendArray([{ m: 'chown', id: part.id }]);
				});
			}
			createMenuItem(i18next.t('Kickban'), () => {
				const minutes = prompt('How many minutes? (0-300)', '30');
				if (minutes === null) return;
				const ms = (parseFloat(minutes) || 0) * 60 * 1000;
				gClient.sendArray([{ m: 'kickban', _id: part._id, ms: ms }]);
			});
		}
		if (gClient.permissions.siteBan) {
			createMenuItem(i18next.t('Site Ban'), () => {
				openModal('#siteban');
				setTimeout(() => {
					(
						document.querySelector(
							'#siteban input[name=id]',
						) as HTMLInputElement
					).value = part._id;
					(
						document.querySelector(
							'#siteban input[name=reasonText]',
						) as HTMLInputElement
					).value = 'Discrimination against others';
					(
						document.querySelector(
							'#siteban input[name=reasonText]',
						) as HTMLInputElement
					).setAttribute('disabled', 'true');
					(
						document.querySelector(
							'#siteban select[name=reasonSelect]',
						) as HTMLSelectElement
					).value = 'Discrimination against others';
					(
						document.querySelector(
							'#siteban input[name=durationNumber]',
						) as HTMLInputElement
					).value = '5';
					(
						document.querySelector(
							'#siteban input[name=durationNumber]',
						) as HTMLInputElement
					).removeAttribute('disabled');
					(
						document.querySelector(
							'#siteban select[name=durationUnit]',
						) as HTMLSelectElement
					).value = 'hours';
					(
						document.querySelector(
							'#siteban textarea[name=note]',
						) as HTMLTextAreaElement
					).value = '';
					(
						document.querySelector('#siteban p[name=errorText]') as HTMLElement
					).textContent = '';
					if (gClient.permissions.siteBanAnyReason) {
						(
							document.querySelector(
								'#siteban select[name=reasonSelect] option[value=custom]',
							) as HTMLOptionElement
						).removeAttribute('disabled');
					} else {
						(
							document.querySelector(
								'#siteban select[name=reasonSelect] option[value=custom]',
							) as HTMLOptionElement
						).setAttribute('disabled', 'true');
					}
				}, 100);
			});
		}
		if (gClient.permissions.usersetOthers) {
			createMenuItem(i18next.t('Set Color'), () => {
				const color = prompt('What color?', part.color);
				if (color === null) return;
				gClient.sendArray([{ m: 'setcolor', _id: part._id, color: color }]);
			});
		}
		if (gClient.permissions.usersetOthers) {
			createMenuItem(i18next.t('Set Name'), () => {
				const name = prompt('What name?', part.name);
				if (name === null) return;
				gClient.sendArray([{ m: 'setname', _id: part._id, name: name }]);
			});
		}
		fadeIn(menu, 100);
	};

	participantTouchhandler = (e: Event, ele: HTMLElement) => {
		const target = ele;
		if (!target) return;
		if (target.classList.contains('name')) {
			target.classList.add('play');
			const id = (target as any).participantId;
			if (id == gClient.participantId) {
				openModal('#rename', 'input[name=name]');
				setTimeout(() => {
					(
						document.querySelector(
							'#rename input[name=name]',
						) as HTMLInputElement
					).value = gClient.ppl[gClient.participantId!].name;
					(
						document.querySelector(
							'#rename input[name=color]',
						) as HTMLInputElement
					).value = gClient.ppl[gClient.participantId!].color;
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

	const releasehandler = () => {
		document
			.querySelectorAll('#names .name')
			.forEach(el => el.classList.remove('play'));
	};
	document.body.addEventListener('mouseup', releasehandler);
	document.body.addEventListener('touchend', releasehandler);

	shouldShowSnowflakes();

	initBackground();

	// Hide piano attribute
	if (settings.hidePianoLocal) {
		document.getElementById('piano')!.style.display = 'none';
	} else {
		document.getElementById('piano')!.style.display = 'block';
	}

	// Hide chat attribute
	if (settings.hideChatLocal) {
		document.getElementById('chat')!.style.display = 'none';
	} else {
		document.getElementById('chat')!.style.display = 'block';
	}

	// Smooth cursor attribute
	if (settings.smoothCursor) {
		document.getElementById('cursors')!.setAttribute('smooth-cursors', '');
	} else {
		document.getElementById('cursors')!.removeAttribute('smooth-cursors');
	}
}

export function shouldShowSnowflakes(): void {
	const snowflakes = document.querySelector('.snowflakes') as HTMLElement;
	if (snowflakes) {
		snowflakes.style.visibility = settings.snowflakes ? 'visible' : 'hidden';
	}
}


export function setKeyboardTimeout(
	timeout: ReturnType<typeof setTimeout>,
): void {
	knowsYouCanUseKeyboardTimeout = timeout;
}

export function setKeyboardNotification(notification: Notification): void {
	knowsYouCanUseKeyboardNotification = notification;
}

export function clearKeyboardHint(): void {
	if (knowsYouCanUseKeyboardTimeout)
		clearTimeout(knowsYouCanUseKeyboardTimeout);
	if (knowsYouCanUseKeyboardNotification)
		knowsYouCanUseKeyboardNotification.close();
}

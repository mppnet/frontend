import { fadeIn, fadeOut, getRoomNameFromURL } from '../util/util';
import { getClient, getPiano } from '../util/state';
import { openModal } from '../util/modal';
import { Notification } from '../libs/Notification';
import { i18next } from '../util/translations';
import { setKeyboardTimeout, setKeyboardNotification } from '../modules/keyboard';
import type { Client } from '../libs/Client';
import type { Channel } from '../types';
let gHistoryDepth = 0;

export function changeRoom(
	client: Client,
	name: string,
	direction?: string,
	roomSettings?: any,
	push?: boolean,
) {
	if (!roomSettings) roomSettings = {};
	if (!direction) direction = 'right';
	if (typeof push === 'undefined') push = true;
	const opposite = direction === 'left' ? 'right' : 'left';
	if (name === '') name = 'lobby';
	if (client.channel && client.channel._id === name) return;
	if (push) {
		const url = '/?c=' + encodeURIComponent(name).replace("'", '%27');
		if (window.history && history.pushState) {
			history.pushState({ depth: (gHistoryDepth += 1), name }, 'Piano > ' + name, url);
		} else {
			(window as any).location = url;
			return;
		}
	}
	client.setChannel(name, roomSettings);
	let t = 0;
	const d = 100;
	const pianoEl = document.getElementById('piano')!;
	pianoEl.classList.add('ease-out', 'slide-' + opposite);
	setTimeout(
		() => {
			pianoEl.classList.remove('ease-out', 'slide-' + opposite);
			pianoEl.classList.add('slide-' + direction);
		},
		(t += d),
	);
	setTimeout(
		() => {
			pianoEl.classList.add('ease-in');
			pianoEl.classList.remove('slide-' + direction);
		},
		(t += d),
	);
	setTimeout(
		() => {
			pianoEl.classList.remove('ease-in');
		},
		(t += d),
	);
}

/**
 * Set the style for a room name/info element in the room list (add CSS classes and images)
 * @param ch Channel info object
 * @param ele Room name/info element in room list
 */
function setRoomInfoStyle(ch: Channel, ele: HTMLElement) {
	if (ch.settings.lobby) ele.classList.add('lobby');
	else ele.classList.remove('lobby');
	if (!ch.settings.chat) ele.classList.add('no-chat');
	else ele.classList.remove('no-chat');
	if (ch.settings.crownsolo) ele.classList.add('crownsolo');
	else ele.classList.remove('crownsolo');
	if (ch.settings['no cussing']) ele.classList.add('no-cussing');
	else ele.classList.remove('no-cussing');
	if (!ch.settings.visible) ele.classList.add('not-visible');
	else ele.classList.remove('not-visible');

	if (ele.classList.contains('no-chat'))
		ele.innerHTML += `<img src="/no-chat.png" style="padding: 0 4px;" />`;

	if (ele.classList.contains('crownsolo'))
		ele.innerHTML += `<img src="/crownsolo.png" style="padding: 0 4px;" />`;
}

export function initRooms(): void {
	const gClient = getClient();
	const gPiano = getPiano();
	const { captureKeyboard, releaseKeyboard } = require('./keyboard');
	const { getTabIsActive } = require('./connection');
	const volume_slider = document.getElementById('volume-slider') as HTMLInputElement;

	let gKnowsYouCanUseKeyboard = false;
	if (localStorage && localStorage.knowsYouCanUseKeyboard) gKnowsYouCanUseKeyboard = true;
	if (!gKnowsYouCanUseKeyboard) {
		setKeyboardTimeout(
			setTimeout(() => {
				setKeyboardNotification(
					new Notification({
						id: 'play',
						title: i18next.t('Did you know!?!'),
						text: i18next.t('You can play the piano with your keyboard, too.  Try it!'),
						target: '#piano',
						duration: 10000,
					}),
				);
			}, 30000),
		);
	}

	if (window.localStorage) {
		if (localStorage.volume) {
			volume_slider.value = localStorage.volume;
			gPiano.audio.setVolume(localStorage.volume);
			document.getElementById('volume-label')!.innerHTML =
				i18next.t('Volume') +
				'<span translated>: ' +
				Math.floor(gPiano.audio.volume * 100) +
				'%</span>';
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
		setRoomInfoStyle(channel, info);
	});

	gClient.on('ls', (ls: any) => {
		for (const i in ls.u) {
			if (!ls.u.hasOwnProperty(i)) continue;
			const room = ls.u[i];
			let info = Array.from(document.querySelectorAll('#room .more .info')).find(
				el => el.getAttribute('roomid') === String(room.id),
			) as HTMLElement | null;
			if (!info) {
				info = document.createElement('div');
				info.className = 'info';
				info.setAttribute('roomname', room._id);
				info.setAttribute('roomid', room.id);
				document.querySelector('#room .more')!.appendChild(info);
			}
			info.setAttribute('translated', '');
			info.textContent =
				room.count + '/' + ('limit' in room.settings ? room.settings.limit : 20) + ' ' + room._id;
			setRoomInfoStyle(room, info);
		}
	});

	document.getElementById('room')!.addEventListener('click', (evt: any) => {
		evt.stopPropagation();
		const target = evt.target as HTMLElement;
		const more = document.querySelector('#room .more') as HTMLElement;
		if (target.classList.contains('info') && target.closest('.more') !== null) {
			fadeOut(more, 250);
			const selected_name = target.getAttribute('roomname');
			if (selected_name !== null) {
				if (!evt.ctrlKey) changeRoom(gClient, selected_name, 'right');
				else window.open(`?c=${selected_name}`);
			}
			return;
		} else if (target.classList.contains('new')) {
			openModal('#new-room', 'input[name=name]');
		}

		const doc_click = (evt2: any) => {
			if ((evt2.target as HTMLElement).closest('#room')) return;
			document.removeEventListener('mousedown', doc_click);
			fadeOut(more, 250);
			gClient.sendArray([{ m: '-ls' }]);
		};

		if (more.style.display == 'block') {
			document.removeEventListener('mousedown', doc_click);
			fadeOut(more, 250);
			gClient.sendArray([{ m: '-ls' }]);
			return;
		}
		document.addEventListener('mousedown', doc_click);
		document.querySelectorAll('#room .more .info').forEach(el => el.remove());
		fadeIn(more, 0);
		gClient.sendArray([{ m: '+ls' }]);
	});

	window.addEventListener('popstate', (evt: any) => {
		const depth = evt.state ? evt.state.depth : 0;
		const direction = depth <= gHistoryDepth ? 'left' : 'right';
		gHistoryDepth = depth;
		changeRoom(gClient, getRoomNameFromURL(), direction, null, false);
	});
}

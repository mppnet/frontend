import { state } from './util/state';
import { Piano } from './piano/piano';
import { SoundSelector } from './libs/SoundSelector';
import { initConnection } from './modules/connection';
import { initKeyboard } from './modules/keyboard';
import { initRooms } from './modules/rooms';
import { initChat } from './modules/chat';
import { initMidi } from './piano/midi';
import { initSynth } from './piano/synth';
import { initSettingsUI } from './modules/settings/settings-ui';
import { Notification } from './libs/Notification';
import {
	press,
	release,
	pressSustain,
	releaseSustain,
	setPress,
	setRelease,
	setPressSustain,
	setReleaseSustain,
} from './util/actions';
import { i18next, i18nextify, start } from './util/translations';
import { closeModal, getModal, openModal } from './util/modal';
import { EventEmitter } from './util/util';
import { initModals } from './modules/modals';
import { Client } from './libs/Client';

if (location.host === 'multiplayerpiano.com') {
	const url = new URL('https://multiplayerpiano.net/' + location.search);
	if (localStorage.token) url.searchParams.set('token', localStorage.token);
	location.replace(url.toString());
	throw new Error('Redirecting to multiplayerpiano.net');
}

if (location.host === 'multiplayerpiano.net') {
	const url = new URL(location.href);
	const token = url.searchParams.get('token');
	if (token) {
		localStorage.token = token;
		url.searchParams.delete('token');
		location.replace(url.toString());
		throw new Error('Finalizing redirect.');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	start();

	console.log('%cMPP Developer Console', 'color: #0066ff; font-size:20px;');
	console.log(
		'%cCheck out the client source: https://github.com/mppnet/frontend/tree/main/client\nGuide for developers: https://docs.google.com/document/d/1OrxwdLD1l1TE8iau6ToETVmnLuLXyGBhA0VfAY1Lf14/edit?usp=sharing',
		'color:gray; font-size:12px;',
	);

	const piano = new Piano(document.getElementById('piano')!);
	state.piano = piano;

	const soundSelector = new SoundSelector(piano);
	soundSelector.addPacks([
		'/sounds/Emotional/',
		'/sounds/Emotional_2.0/',
		'/sounds/GreatAndSoftPiano/',
		'/sounds/HardAndToughPiano/',
		'/sounds/HardPiano/',
		'/sounds/Harp/',
		'/sounds/Harpsicord/',
		'/sounds/LoudAndProudPiano/',
		'/sounds/MLG/',
		'/sounds/Music_Box/',
		'/sounds/NewPiano/',
		'/sounds/Orchestra/',
		'/sounds/Piano2/',
		'/sounds/PianoSounds/',
		'/sounds/Rhodes_MK1/',
		'/sounds/SoftPiano/',
		'/sounds/Steinway_Grand/',
		'/sounds/Untitled/',
		'/sounds/Vintage_Upright/',
		'/sounds/Vintage_Upright_Soft/',
	]);
	soundSelector.init();
	state.soundSelector = soundSelector;

	const client = initConnection();
	initKeyboard();
  initRooms();
  initModals();
	const chat = initChat();
	initMidi();
	initSynth();
	initSettingsUI();

	if (window !== top) {
		alert(
			"Hey, it looks like you're visiting our site through another website. Consider playing Multiplayer Piano directly at https://multiplayerpiano.net",
		);
	}

	const translationIdsWithNames = [
		{ code: 'bg', name: 'Bulgarian', native: 'Български' },
		{ code: 'cs', name: 'Czech', native: 'Česky' },
		{ code: 'de', name: 'German', native: 'Deutsch' },
		{ code: 'en', name: 'English', native: 'English' },
		{ code: 'es', name: 'Spanish', native: 'Español' },
		{ code: 'fr', name: 'French', native: 'Français' },
		{ code: 'hu', name: 'Hungarian', native: 'Magyar' },
		{ code: 'is', name: 'Icelandic', native: 'Íslenska' },
		{ code: 'ja', name: 'Japanese', native: '日本語' },
		{ code: 'ko', name: 'Korean', native: '한국어' },
		{ code: 'lv', name: 'Latvian', native: 'Latviešu' },
		{ code: 'nb', name: 'Norwegian Bokmål', native: 'Norsk bokmål' },
		{ code: 'nl', name: 'Dutch', native: 'Nederlands' },
		{ code: 'pl', name: 'Polish', native: 'Polski' },
		{ code: 'pt', name: 'Portuguese', native: 'Português' },
		{ code: 'ru', name: 'Russian', native: 'Русский' },
		{ code: 'sk', name: 'Slovak', native: 'Slovenčina' },
		{ code: 'sv', name: 'Swedish', native: 'Svenska' },
		{ code: 'tr', name: 'Turkish', native: 'Türkçe' },
		{ code: 'zh', name: 'Chinese', native: '中文' },
	];
	const languages = document.getElementById('languages')!;

	function createTranslationOptions() {
		translationIdsWithNames.forEach(z => {
			const option = document.createElement('option');
			option.value = z.code;
			option.innerText = z.native;
			if (z.code === i18next.language.split('-')[0]) option.selected = true;
			option.setAttribute('translated', '');
			languages.appendChild(option);
		});
	}

	if (i18next.isInitialized) createTranslationOptions();
	else
		i18next.on('initialized', () => {
			createTranslationOptions();
		});

	document.getElementById('lang-btn')!.addEventListener('click', () => {
		openModal('#language');
	});
	document
		.querySelector('#language > button')!
		.addEventListener('click', async () => {
			await i18next.changeLanguage(
				(document.querySelector('#languages') as HTMLSelectElement)
					.selectedOptions[0].value,
			);
			i18nextify.forceRerender();
			closeModal();
		});

	client.start();

  globalThis.EventEmitter = EventEmitter;
  globalThis.Client = Client;

	(window as any).MPP = {
		get press() {
			return press;
		},
		set press(fn: any) {
			setPress(fn);
		},
		get release() {
			return release;
		},
		set release(fn: any) {
			setRelease(fn);
		},
		get pressSustain() {
			return pressSustain;
		},
		set pressSustain(fn: any) {
			setPressSustain(fn);
		},
		get releaseSustain() {
			return releaseSustain;
		},
		set releaseSustain(fn: any) {
			setReleaseSustain(fn);
		},
		piano,
		client,
		chat,
		noteQuota: state.noteQuota,
		soundSelector,
		Notification,
		modal: {
			getModal,
			closeModal,
			openModal,
		},
	};
});

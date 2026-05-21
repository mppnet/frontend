export class Settings {
  pianoMutes: string[];
  chatMutes: string[];
  showIdsInChat: boolean;
  showTimestampsInChat: boolean;
  noChatColors: boolean;
  noBackgroundColor: boolean;
  outputOwnNotes: boolean;
  virtualPianoLayout: boolean;
  smoothCursor: boolean;
  showChatTooltips: boolean;
  showPianoNotes: boolean;
  highlightScaleNotes: string | null;
  cursorHides: string[];
  hideAllCursors: boolean;
  hidePianoLocal: boolean;
  hideChatLocal: boolean;
  noPreventDefault: boolean;
  hideBotUsers: boolean;
  cancelDMs: boolean;
  hasSeenDMWarning: boolean;
  snowflakes: boolean;
  disableMIDIDrumChannel: boolean;
  testMode: boolean;
  seeOwnCursor: boolean;
  midiVolumeTest: boolean;

  constructor() {
    const hash = window.location.hash || '';
    this.testMode = /^(?:#.+)*#test(?:#.+)*$/i.test(hash);
    this.seeOwnCursor = /^(?:#.+)*#seeowncursor(?:#.+)*$/i.test(hash);
    this.midiVolumeTest = /^(?:#.+)*#midivolumetest(?:#.+)*$/i.test(hash);
    this.pianoMutes = (localStorage.pianoMutes || '').split(',').filter(Boolean);
    this.chatMutes = (localStorage.chatMutes || '').split(',').filter(Boolean);
    this.showIdsInChat = localStorage.showIdsInChat === 'true';
    this.showTimestampsInChat = localStorage.showTimestampsInChat === 'true';
    this.noChatColors = localStorage.noChatColors === 'true';
    this.noBackgroundColor = localStorage.noBackgroundColor === 'true';
    this.outputOwnNotes = localStorage.outputOwnNotes ? localStorage.outputOwnNotes === 'true' : true;
    this.virtualPianoLayout = localStorage.virtualPianoLayout === 'true';
    this.smoothCursor = localStorage.smoothCursor === 'true';
    this.showChatTooltips = localStorage.showChatTooltips === 'true';
    this.showPianoNotes = localStorage.showPianoNotes === 'true';
    this.highlightScaleNotes = localStorage.highlightScaleNotes || null;
    this.cursorHides = (localStorage.cursorHides || '').split(',').filter(Boolean);
    this.hideAllCursors = localStorage.hideAllCursors === 'true';
    this.hidePianoLocal = localStorage.hidePiano === 'true';
    this.hideChatLocal = localStorage.hideChat === 'true';
    this.noPreventDefault = localStorage.noPreventDefault === 'true';
    this.hideBotUsers = localStorage.hideBotUsers === 'true';
    this.cancelDMs = localStorage.cancelDMs === 'true';
    this.hasSeenDMWarning = localStorage.hasSeenDMWarning === 'true';
    this.snowflakes = new Date().getMonth() === 11 && localStorage.snowflakes !== 'false';
    this.disableMIDIDrumChannel = localStorage.disableMIDIDrumChannel
      ? localStorage.disableMIDIDrumChannel === 'true' : true;
  }
}

export const settings = new Settings();

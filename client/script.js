var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toCommonJS = (from) => {
  var entry = (__moduleCache ??= new WeakMap).get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function") {
    for (var key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(entry, key))
        __defProp(entry, key, {
          get: __accessProp.bind(from, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  __moduleCache.set(from, entry);
  return entry;
};
var __moduleCache;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// client/src/util/state.ts
function getClient() {
  if (!state.client)
    throw new Error("Client not initialized");
  return state.client;
}
function getPiano() {
  if (!state.piano)
    throw new Error("Piano not initialized");
  return state.piano;
}
function getNoteQuota() {
  if (!state.noteQuota)
    throw new Error("NoteQuota not initialized");
  return state.noteQuota;
}
var state;
var init_state = __esm(() => {
  state = {
    client: null,
    piano: null,
    noteQuota: null,
    soundSelector: null,
    chat: null,
    midiOutTest: null,
    enableSynth: false,
    synthVoice: null,
    mouseY: 0
  };
});

// client/src/util/constants.ts
var DEFAULT_VELOCITY = 0.5, TIMING_TARGET = 1000, MIDI_TRANSPOSE = -12, MIDI_KEY_NAMES, BASIC_PIANO_SCALES;
var init_constants = __esm(() => {
  MIDI_KEY_NAMES = (() => {
    const names = ["a-1", "as-1", "b-1"];
    const bare = "c cs d ds e f fs g gs a as b".split(" ");
    for (let oct = 0;oct < 7; oct++) {
      for (const n of bare)
        names.push(n + oct);
    }
    names.push("c7");
    return names;
  })();
  BASIC_PIANO_SCALES = {
    "Notes in C Major": ["C", "D", "E", "F", "G", "A", "B", "C"],
    "Notes in D Major": ["D", "E", "G♭", "G", "A", "B", "D♭", "D"],
    "Notes in E Major": ["E", "G♭", "A♭", "A", "B", "D♭", "E♭", "E"],
    "Notes in F Major": ["F", "G", "A", "B♭", "C", "D", "E", "F"],
    "Notes in G Major": ["G", "A", "B", "C", "D", "E", "G♭", "G"],
    "Notes in A Major": ["A", "B", "D♭", "D", "E", "G♭", "A♭", "A"],
    "Notes in B Major": ["B", "D♭", "E♭", "E", "G♭", "A♭", "B♭", "B"],
    "Notes in C# / Db Major": ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C", "D♭"],
    "Notes in D# / Eb Major": ["E♭", "F", "G", "A♭", "B♭", "C", "D", "E♭"],
    "Notes in F# / Gb Major": ["G♭", "A♭", "B♭", "B", "D♭", "E♭", "F", "G♭"],
    "Notes in G# / Ab Major": ["A♭", "B♭", "C", "D♭", "E♭", "F", "G", "A♭"],
    "Notes in A# / Bb Major": ["B♭", "C", "D", "E♭", "F", "G", "A", "B♭"],
    "Notes in A Minor": ["A", "B", "C", "D", "E", "F", "G", "A"],
    "Notes in A# / Bb Minor": ["B♭", "C", "D♭", "E♭", "F", "G♭", "A♭", "B♭"],
    "Notes in B Minor": ["B", "D♭", "D", "E", "G♭", "G", "A", "B"],
    "Notes in C Minor": ["C", "D", "E♭", "F", "G", "A♭", "B♭", "C"],
    "Notes in C# / Db Minor": ["D♭", "E♭", "E", "G♭", "A♭", "A", "B", "D♭"],
    "Notes in D Minor": ["D", "E", "F", "G", "A", "B♭", "C", "D"],
    "Notes in D# / Eb Minor": ["E♭", "F", "G♭", "A♭", "B♭", "B", "D♭", "E♭"],
    "Notes in E Minor": ["E", "G♭", "G", "A", "B", "C", "D", "E"],
    "Notes in F Minor": ["F", "G", "A♭", "B♭", "C", "D♭", "E♭", "F"],
    "Notes in F# / Gb Minor": ["G♭", "A♭", "A", "B", "D♭", "D", "E", "G♭"],
    "Notes in G Minor": ["G", "A", "B♭", "C", "D", "E♭", "F", "G"],
    "Notes in G# / Ab Minor": ["A♭", "B♭", "B", "D♭", "E♭", "E", "G♭", "A♭"]
  };
});

// client/src/modules/settings/settings.ts
class Settings {
  pianoMutes;
  chatMutes;
  showIdsInChat;
  showTimestampsInChat;
  noChatColors;
  noBackgroundColor;
  outputOwnNotes;
  virtualPianoLayout;
  smoothCursor;
  showChatTooltips;
  showPianoNotes;
  highlightScaleNotes;
  cursorHides;
  hideAllCursors;
  hidePianoLocal;
  hideChatLocal;
  noPreventDefault;
  hideBotUsers;
  cancelDMs;
  hasSeenDMWarning;
  snowflakes;
  disableMIDIDrumChannel;
  testMode;
  seeOwnCursor;
  midiVolumeTest;
  constructor() {
    const hash = window.location.hash || "";
    this.testMode = /^(?:#.+)*#test(?:#.+)*$/i.test(hash);
    this.seeOwnCursor = /^(?:#.+)*#seeowncursor(?:#.+)*$/i.test(hash);
    this.midiVolumeTest = /^(?:#.+)*#midivolumetest(?:#.+)*$/i.test(hash);
    this.pianoMutes = (localStorage.pianoMutes || "").split(",").filter(Boolean);
    this.chatMutes = (localStorage.chatMutes || "").split(",").filter(Boolean);
    this.showIdsInChat = localStorage.showIdsInChat === "true";
    this.showTimestampsInChat = localStorage.showTimestampsInChat === "true";
    this.noChatColors = localStorage.noChatColors === "true";
    this.noBackgroundColor = localStorage.noBackgroundColor === "true";
    this.outputOwnNotes = localStorage.outputOwnNotes ? localStorage.outputOwnNotes === "true" : true;
    this.virtualPianoLayout = localStorage.virtualPianoLayout === "true";
    this.smoothCursor = localStorage.smoothCursor === "true";
    this.showChatTooltips = localStorage.showChatTooltips === "true";
    this.showPianoNotes = localStorage.showPianoNotes === "true";
    this.highlightScaleNotes = localStorage.highlightScaleNotes || null;
    this.cursorHides = (localStorage.cursorHides || "").split(",").filter(Boolean);
    this.hideAllCursors = localStorage.hideAllCursors === "true";
    this.hidePianoLocal = localStorage.hidePiano === "true";
    this.hideChatLocal = localStorage.hideChat === "true";
    this.noPreventDefault = localStorage.noPreventDefault === "true";
    this.hideBotUsers = localStorage.hideBotUsers === "true";
    this.cancelDMs = localStorage.cancelDMs === "true";
    this.hasSeenDMWarning = localStorage.hasSeenDMWarning === "true";
    this.snowflakes = new Date().getMonth() === 11 && localStorage.snowflakes !== "false";
    this.disableMIDIDrumChannel = localStorage.disableMIDIDrumChannel ? localStorage.disableMIDIDrumChannel === "true" : true;
  }
}
var settings;
var init_settings = __esm(() => {
  settings = new Settings;
});

// client/src/util/actions.ts
function defaultPress(id, vol) {
  const client = getClient();
  const noteQuota = getNoteQuota();
  const piano = getPiano();
  if (!client.preventsPlaying() && noteQuota.spend(1)) {
    heldNotes[id] = true;
    sustainedNotes[id] = true;
    piano.play(id, vol !== undefined ? vol : DEFAULT_VELOCITY, client.getOwnParticipant(), 0);
    client.startNote(id, vol);
  }
}
function defaultRelease(id) {
  if (heldNotes[id]) {
    heldNotes[id] = false;
    if ((autoSustain || sustain) && !state.enableSynth) {
      sustainedNotes[id] = true;
    } else {
      const noteQuota = getNoteQuota();
      if (noteQuota.spend(1)) {
        const client = getClient();
        const piano = getPiano();
        piano.stop(id, client.getOwnParticipant(), 0);
        client.stopNote(id);
        sustainedNotes[id] = false;
      }
    }
  }
}
function defaultPressSustain() {
  sustain = true;
}
function defaultReleaseSustain() {
  sustain = false;
  if (!autoSustain) {
    for (const id in sustainedNotes) {
      if (sustainedNotes.hasOwnProperty(id) && sustainedNotes[id] && !heldNotes[id]) {
        sustainedNotes[id] = false;
        const noteQuota = getNoteQuota();
        if (noteQuota.spend(1)) {
          const client = getClient();
          const piano = getPiano();
          piano.stop(id, client.getOwnParticipant(), 0);
          client.stopNote(id);
        }
      }
    }
  }
}
function press(id, vol) {
  _press(id, vol);
}
function release(id) {
  _release(id);
}
function pressSustain() {
  _pressSustain();
}
function releaseSustain() {
  _releaseSustain();
}
function setPress(fn) {
  _press = fn;
}
function setRelease(fn) {
  _release = fn;
}
function setPressSustain(fn) {
  _pressSustain = fn;
}
function setReleaseSustain(fn) {
  _releaseSustain = fn;
}
function getAutoSustain() {
  return autoSustain;
}
function setAutoSustain(v) {
  autoSustain = v;
}
var autoSustain = false, sustain = false, heldNotes, sustainedNotes, _press, _release, _pressSustain, _releaseSustain;
var init_actions = __esm(() => {
  init_state();
  init_constants();
  heldNotes = {};
  sustainedNotes = {};
  _press = defaultPress;
  _release = defaultRelease;
  _pressSustain = defaultPressSustain;
  _releaseSustain = defaultReleaseSustain;
});

// client/src/util/util.ts
function getNaturalDisplay(el) {
  const tmp = document.createElement(el.tagName);
  document.body.appendChild(tmp);
  const display = getComputedStyle(tmp).display;
  document.body.removeChild(tmp);
  return display === "none" ? "block" : display;
}
function fadeIn(el, ms, cb) {
  const isHidden = el.style.display === "none" || getComputedStyle(el).display === "none";
  el.style.opacity = "0";
  el.style.display = isHidden ? getNaturalDisplay(el) : getComputedStyle(el).display;
  el.style.transition = `opacity ${ms}ms`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = "1";
    });
  });
  setTimeout(() => {
    el.style.transition = "";
    cb?.();
  }, ms);
}
function fadeOut(el, ms, cb) {
  if (!el)
    return;
  el.style.transition = `opacity ${ms}ms`;
  el.style.opacity = "0";
  setTimeout(() => {
    el.style.display = "none";
    el.style.transition = "";
    cb?.();
  }, ms);
}

class EventEmitter {
  _events = {};
  on(evtn, fn) {
    if (!this._events.hasOwnProperty(evtn))
      this._events[evtn] = [];
    this._events[evtn].push(fn);
  }
  off(evtn, fn) {
    if (!this._events.hasOwnProperty(evtn))
      return;
    const idx = this._events[evtn].indexOf(fn);
    if (idx < 0)
      return;
    this._events[evtn].splice(idx, 1);
  }
  emit(evtn, ...args) {
    if (!this._events.hasOwnProperty(evtn))
      return;
    const fns = this._events[evtn].slice(0);
    if (fns.length < 1)
      return;
    for (let i = 0;i < fns.length; i++)
      fns[i].apply(this, args);
  }
}
function round(number, increment, offset) {
  return Math.round((number - offset) / increment) * increment + offset;
}
var Knob, url_regex, parseContent = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"), markdownRegex, getTextContent = (text) => {
  return text.indexOf(">") > -1 && text.indexOf("</") > -1 ? text.slice(text.indexOf(">") + 1, text.lastIndexOf("</")) || text : text;
}, getLinkTextContent = (text) => {
  const rightArrowIndex = text.indexOf(">");
  const leftArrowSlashIndex = text.lastIndexOf("</");
  const properRightArrowIndex = rightArrowIndex > leftArrowSlashIndex ? -1 : rightArrowIndex;
  return properRightArrowIndex > -1 || leftArrowSlashIndex > -1 ? text.slice(properRightArrowIndex > -1 ? properRightArrowIndex + 1 : 0, leftArrowSlashIndex > -1 ? leftArrowSlashIndex : text.length) || text : text;
}, parseUrl = (text) => {
  return text.replace(url_regex, (match) => {
    const url = getLinkTextContent(match);
    return `<a rel="noreferer noopener" target="_blank" class="chatLink" href="${url}">${url}</a>`;
  });
}, parseMarkdown = (text, parseFunction = (t) => t) => {
  return text.split(markdownRegex).map((match) => {
    const endsWithTildes = match.endsWith("~~");
    const endsWithThreeUnderscores = match.endsWith("___");
    const endsWithTwoUnderscores = match.endsWith("__");
    const endsWithUnderscore = match.endsWith("_");
    const endsWithThreeAsterisks = match.endsWith("***");
    const endsWithTwoAsterisks = match.endsWith("**");
    const endsWithAsterisk = match.endsWith("*");
    const endsWithThreeBackticks = match.endsWith("```");
    const endsWithTwoBackticks = match.endsWith("``");
    const endsWithBacktick = match.endsWith("`");
    const endsWithVerticalBars = match.endsWith("||");
    if (match.startsWith("\\~~") && endsWithTildes || match.startsWith("\\___") && endsWithThreeUnderscores || match.startsWith("\\__") && endsWithTwoUnderscores || match.startsWith("\\_") && endsWithUnderscore || match.startsWith("\\***") && endsWithThreeAsterisks || match.startsWith("\\**") && endsWithTwoAsterisks || match.startsWith("\\*") && endsWithAsterisk || match.startsWith("\\```") && endsWithThreeBackticks || match.startsWith("\\``") && endsWithTwoBackticks || match.startsWith("\\`") && endsWithBacktick || match.startsWith("\\||") && endsWithVerticalBars) {
      return parseFunction(match.slice(1));
    } else if (match.startsWith("~~") && endsWithTildes) {
      const content = parseMarkdown(getTextContent(match.slice(2, match.length - 2)), parseFunction);
      return content.trim().length < 1 ? match : `<del class="markdown">${content}</del>`;
    } else if (match.startsWith("___") && endsWithThreeUnderscores) {
      const content = parseMarkdown(getTextContent(match.slice(3, match.length - 3)), parseFunction);
      return content.trim().length < 1 ? match : `<em class="markdown"><u class="markdown">${content}</u></em>`;
    } else if (match.startsWith("__") && endsWithTwoUnderscores) {
      const content = parseMarkdown(getTextContent(match.slice(2, match.length - 2)), parseFunction);
      return content.trim().length < 1 ? match : `<u class="markdown">${content}</u>`;
    } else if (match.startsWith("***") && endsWithThreeAsterisks) {
      const content = parseMarkdown(getTextContent(match.slice(3, match.length - 3)), parseFunction);
      return content.trim().length < 1 ? match : `<em class="markdown"><strong class="markdown">${content}</strong></em>`;
    } else if (match.startsWith("**") && endsWithTwoAsterisks) {
      const content = parseMarkdown(getTextContent(match.slice(2, match.length - 2)), parseFunction);
      return content.trim().length < 1 ? match : `<strong class="markdown">${content}</strong>`;
    } else if (match.startsWith("*") && endsWithAsterisk || match.startsWith("_") && endsWithUnderscore) {
      const content = parseMarkdown(getTextContent(match.slice(1, match.length - 1)), parseFunction);
      return content.trim().length < 1 ? match : `<em class="markdown">${content}</em>`;
    } else if (match.startsWith("`") && endsWithBacktick) {
      const slice = match.startsWith("```") && endsWithThreeBackticks ? 3 : match.startsWith("``") && endsWithTwoBackticks ? 2 : 1;
      const content = getTextContent(match.slice(slice, match.length - slice));
      return content.trim().length < 1 ? match : `<code class="markdown">${content}</code>`;
    } else if (match.startsWith("||") && endsWithVerticalBars) {
      const content = parseMarkdown(getTextContent(match.slice(2, match.length - 2)), parseFunction);
      return content.trim().length < 1 ? match : `<span class="markdown spoiler">${content}</span>`;
    }
    return parseFunction(match);
  }).join("");
};
var init_util = __esm(() => {
  Knob = class Knob extends EventEmitter {
    min;
    max;
    step;
    value;
    knobValue;
    name;
    unit;
    fixedPoint;
    dragY;
    mouse_over;
    canvas;
    ctx;
    radius;
    baseImage;
    constructor(canvas, min, max, step, value, name, unit) {
      super();
      this.min = min || 0;
      this.max = max || 10;
      this.step = step || 0.01;
      this.value = value || this.min;
      this.knobValue = (this.value - this.min) / (this.max - this.min);
      this.name = name || "";
      this.unit = unit || "";
      const ind = step.toString().indexOf(".");
      const fixedInd = ind == -1 ? step.toString().length - 1 : ind;
      this.fixedPoint = step.toString().substr(fixedInd).length - 1;
      this.dragY = 0;
      this.mouse_over = false;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.radius = this.canvas.width * 0.3333;
      this.baseImage = document.createElement("canvas");
      this.baseImage.width = canvas.width;
      this.baseImage.height = canvas.height;
      const ctx = this.baseImage.getContext("2d");
      ctx.fillStyle = "#444";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = this.canvas.width * 0.02;
      ctx.shadowOffsetY = this.canvas.width * 0.02;
      ctx.beginPath();
      ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, Math.PI * 2);
      ctx.fill();
      const self = this;
      let dragging = false;
      (function() {
        function mousemove(evt) {
          if (evt.screenY !== self.dragY) {
            const delta = -(evt.screenY - self.dragY);
            let scale = 0.0075;
            if (evt.ctrlKey)
              scale *= 0.05;
            self.setKnobValue(self.knobValue + delta * scale);
            self.dragY = evt.screenY;
            self.redraw();
          }
          evt.preventDefault();
          showTip();
        }
        function mouseout(evt) {
          if (evt.toElement === null && evt.relatedTarget === null) {
            mouseup();
          }
        }
        function mouseup() {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseout", mouseout);
          document.removeEventListener("mouseup", mouseup);
          self.emit("release", self);
          dragging = false;
          if (!self.mouse_over)
            removeTip();
        }
        canvas.addEventListener("mousedown", function(evt) {
          const pos = self.translateMouseEvent(evt);
          if (self.contains(pos.x, pos.y)) {
            dragging = true;
            self.dragY = evt.screenY;
            showTip();
            document.addEventListener("mousemove", mousemove);
            document.addEventListener("mouseout", mouseout);
            document.addEventListener("mouseup", mouseup);
          }
        });
        canvas.addEventListener("keydown", function(evt) {
          if (evt.keyCode == 38) {
            self.setValue(self.value + self.step);
            showTip();
          } else if (evt.keyCode == 40) {
            self.setValue(self.value - self.step);
            showTip();
          }
        });
      })();
      function showTip() {
        let div = document.getElementById("tooltip");
        if (!div) {
          div = document.createElement("div");
          document.body.appendChild(div);
          div.id = "tooltip";
          const rect = self.canvas.getBoundingClientRect();
          div.style.left = rect.left + "px";
          div.style.top = rect.bottom + "px";
        }
        div.textContent = self.name;
        if (self.name)
          div.textContent += ": ";
        div.textContent += self.valueString() + self.unit;
      }
      function removeTip() {
        const div = document.getElementById("tooltip");
        if (div) {
          div.parentElement.removeChild(div);
        }
      }
      function ttmousemove(evt) {
        const pos = self.translateMouseEvent(evt);
        if (self.contains(pos.x, pos.y)) {
          self.mouse_over = true;
          showTip();
        } else {
          self.mouse_over = false;
          if (!dragging)
            removeTip();
        }
      }
      function ttmouseout() {
        self.mouse_over = false;
        if (!dragging)
          removeTip();
      }
      canvas.addEventListener("mousemove", ttmousemove);
      canvas.addEventListener("mouseout", ttmouseout);
      this.redraw();
    }
    redraw() {
      const dot_distance = 0.28 * this.canvas.width;
      const dot_radius = 0.03 * this.canvas.width;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.baseImage, 0, 0);
      let a = this.knobValue;
      a *= Math.PI * 2 * 0.8;
      a += Math.PI / 2;
      a += Math.PI * 2 * 0.1;
      const half_width = this.canvas.width / 2;
      const x = Math.cos(a) * dot_distance + half_width;
      const y = Math.sin(a) * dot_distance + half_width;
      this.ctx.fillStyle = "#fff";
      this.ctx.beginPath();
      this.ctx.arc(x, y, dot_radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    setKnobValue(value) {
      if (value < 0)
        value = 0;
      else if (value > 1)
        value = 1;
      this.knobValue = value;
      this.setValue(value * (this.max - this.min) + this.min);
    }
    setValue(value) {
      value = round(value, this.step, this.min);
      if (value < this.min)
        value = this.min;
      else if (value > this.max)
        value = this.max;
      if (this.value !== value) {
        this.value = value;
        this.knobValue = (value - this.min) / (this.max - this.min);
        this.redraw();
        this.emit("change", this);
      }
    }
    valueString() {
      return this.value.toFixed(this.fixedPoint);
    }
    contains(x, y) {
      x -= this.canvas.width / 2;
      y -= this.canvas.height / 2;
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < this.radius;
    }
    translateMouseEvent(evt) {
      const element = evt.target;
      return {
        x: evt.clientX - element.getBoundingClientRect().left - element.clientLeft + element.scrollLeft,
        y: evt.clientY - (element.getBoundingClientRect().top - element.clientTop + element.scrollTop)
      };
    }
  };
  url_regex = new RegExp("(?:(?:(?:https?|ftp):)?\\/\\/)" + "(?:\\S+(?::\\S*)?@)?" + "(?:" + "(?!(?:10|127)(?:\\.\\d{1,3}){3})" + "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" + "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" + "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" + "(?:" + "(?:" + "[a-z0-9\\u00a1-\\uffff]" + "[a-z0-9\\u00a1-\\uffff_-]{0,62}" + ")?" + "[a-z0-9\\u00a1-\\uffff]\\." + ")+" + "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" + ")" + "(?::\\d{2,5})?" + "(?:[/?#]\\S*)?", "ig");
  markdownRegex = /((?:\\|)(?:\|\|.+?\|\||```.+?```|``.+?``|`.+?`|\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*|___.+?___|__.+?__|_.+?_(?:\s|$)|~~.+?~~))/g;
});

// client/src/libs/Notification.ts
var Notification;
var init_Notification = __esm(() => {
  init_util();
  Notification = class Notification extends EventEmitter {
    id;
    title;
    text;
    html;
    target;
    duration;
    domElement;
    onresize;
    ["class"];
    constructor(par) {
      super();
      par = par || {};
      this.id = "Notification-" + (par.id || Math.random());
      this.title = par.title || "";
      this.text = par.text || "";
      this.html = par.html || "";
      this.target = document.querySelector(par.target || "#piano");
      this.duration = par.duration || 30000;
      this["class"] = par["class"] || "classic";
      const existing = document.getElementById(this.id);
      if (existing)
        existing.remove();
      const wrapper = document.createElement("div");
      wrapper.className = "notification";
      const body = document.createElement("div");
      body.className = "notification-body";
      const titleDiv = document.createElement("div");
      titleDiv.className = "title";
      titleDiv.textContent = this.title;
      const textDiv = document.createElement("div");
      textDiv.className = "text";
      body.appendChild(titleDiv);
      body.appendChild(textDiv);
      const xBtn = document.createElement("div");
      xBtn.className = "x";
      xBtn.setAttribute("translated", "");
      xBtn.textContent = "X";
      wrapper.appendChild(body);
      wrapper.appendChild(xBtn);
      this.domElement = wrapper;
      this.domElement.id = this.id;
      this.domElement.classList.add(this["class"]);
      if (this.text.length > 0) {
        textDiv.textContent = this.text;
      } else if (this.html instanceof HTMLElement) {
        textDiv.appendChild(this.html);
      } else if (this.html.length > 0) {
        textDiv.innerHTML = this.html;
      }
      document.body.appendChild(this.domElement);
      this.position();
      this.onresize = () => {
        this.position();
      };
      window.addEventListener("resize", this.onresize);
      xBtn.addEventListener("click", () => {
        this.close();
      });
      if (this.duration > 0) {
        setTimeout(() => {
          this.close();
        }, this.duration);
      }
    }
    position() {
      const pos = this.target.getBoundingClientRect();
      let x = pos.left - this.domElement.offsetWidth / 2 + this.target.offsetWidth / 4;
      const y = pos.top - this.domElement.offsetHeight - 8;
      const width = this.domElement.offsetWidth;
      if (x + width > document.body.offsetWidth) {
        x -= x + width - document.body.offsetWidth;
      }
      if (x < 0)
        x = 0;
      this.domElement.style.left = x + "px";
      this.domElement.style.top = y + "px";
      this.domElement.style.position = "absolute";
    }
    close() {
      window.removeEventListener("resize", this.onresize);
      fadeOut(this.domElement, 500, () => {
        this.domElement.remove();
        this.emit("close");
      });
    }
  };
});

// client/src/libs/Client.ts
var Client;
var init_Client = __esm(() => {
  init_util();
  WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: (target, thisArg, args) => {
      if (!(args[0] instanceof ArrayBuffer) && localStorage.token && !args[0].startsWith(`[{"m":"hi"`))
        args[0] = args[0].replace(localStorage.token, "[REDACTED]");
      return target.apply(thisArg, args);
    }
  });
  Client = class Client extends EventEmitter {
    uri;
    ws;
    serverTimeOffset = 0;
    user;
    participantId;
    channel;
    ppl = {};
    connectionTime;
    connectionAttempts = 0;
    desiredChannelId;
    desiredChannelSettings;
    pingInterval;
    canConnect = false;
    noteBuffer = [];
    noteBufferTime = 0;
    noteFlushInterval;
    permissions = {};
    "\uD83D\uDC08" = 0;
    loginInfo;
    accountInfo;
    offlineChannelSettings = { color: "#ecfaed" };
    offlineParticipant = { id: "", _id: "", name: "", color: "#777" };
    constructor(uri) {
      if (window.MPP && window.MPP.client) {
        throw new Error("Running multiple clients in a single tab is not allowed due to abuse.");
      }
      super();
      this.uri = uri;
      this.bindEventListeners();
      this.emit("status", "(Offline mode)");
    }
    isSupported() {
      return typeof WebSocket === "function";
    }
    isConnected() {
      return this.isSupported() && this.ws && this.ws.readyState === WebSocket.OPEN;
    }
    isConnecting() {
      return this.isSupported() && this.ws && this.ws.readyState === WebSocket.CONNECTING;
    }
    start() {
      this.canConnect = true;
      if (!this.connectionTime)
        this.connect();
    }
    stop() {
      this.canConnect = false;
      this.ws.close();
    }
    decodeBinaryMessage(buffer) {
      const view = new DataView(buffer);
      const metaLength = view.getUint32(0);
      const metaBytes = new Uint8Array(buffer, 4, metaLength);
      const meta = JSON.parse(new TextDecoder().decode(metaBytes));
      const binary = buffer.slice(4 + metaLength);
      return { meta, binary };
    }
    connect() {
      if (!this.canConnect || !this.isSupported() || this.isConnected() || this.isConnecting())
        return;
      this.emit("status", "Connecting...");
      this.ws = new WebSocket(this.uri);
      this.ws.binaryType = "arraybuffer";
      const self = this;
      this.ws.addEventListener("close", function(evt) {
        self.user = undefined;
        self.participantId = undefined;
        self.channel = undefined;
        self.setParticipants([]);
        clearInterval(self.pingInterval);
        clearInterval(self.noteFlushInterval);
        self.emit("disconnect", evt);
        self.emit("status", "Offline mode");
        if (self.connectionTime) {
          self.connectionTime = undefined;
          self.connectionAttempts = 0;
        } else {
          ++self.connectionAttempts;
        }
        const ms_lut = [50, 2500, 1e4];
        let idx = self.connectionAttempts;
        if (idx >= ms_lut.length)
          idx = ms_lut.length - 1;
        setTimeout(self.connect.bind(self), ms_lut[idx]);
      });
      this.ws.addEventListener("error", function(err) {
        self.emit("wserror", err);
        self.ws.close();
      });
      this.ws.addEventListener("open", function(evt) {
        self.pingInterval = setInterval(function() {
          self.sendPing();
        }, 20000);
        self.noteBuffer = [];
        self.noteBufferTime = 0;
        self.noteFlushInterval = setInterval(function() {
          if (self.noteBufferTime && self.noteBuffer.length > 0) {
            self.sendArray([{ m: "n", t: self.noteBufferTime + self.serverTimeOffset, n: self.noteBuffer }]);
            self.noteBufferTime = 0;
            self.noteBuffer = [];
          }
        }, 200);
        self.emit("connect");
        self.emit("status", "Joining channel...");
      });
      this.ws.addEventListener("message", async function(evt) {
        if (evt.data instanceof ArrayBuffer) {
          const { meta, binary } = self.decodeBinaryMessage(evt.data);
          self.emit(meta.m, { ...meta, binary });
        } else {
          const transmission = JSON.parse(evt.data);
          for (let i = 0;i < transmission.length; i++) {
            self.emit(transmission[i].m, transmission[i]);
          }
        }
      });
    }
    bindEventListeners() {
      const self = this;
      this.on("hi", function(msg) {
        self.connectionTime = Date.now();
        self.user = msg.u;
        self.receiveServerTime(msg.t, msg.e || undefined);
        if (self.desiredChannelId)
          self.setChannel();
        if (msg.token)
          localStorage.token = msg.token;
        self.permissions = msg.permissions || {};
        self.accountInfo = msg.accountInfo || undefined;
      });
      this.on("t", function(msg) {
        self.receiveServerTime(msg.t, msg.e || undefined);
      });
      this.on("ch", function(msg) {
        self.desiredChannelId = msg.ch._id;
        self.desiredChannelSettings = msg.ch.settings;
        self.channel = msg.ch;
        if (msg.p)
          self.participantId = msg.p;
        self.setParticipants(msg.ppl);
      });
      this.on("p", function(msg) {
        self.participantUpdate(msg);
        self.emit("participant update", self.findParticipantById(msg.id));
      });
      this.on("m", function(msg) {
        if (self.ppl.hasOwnProperty(msg.id))
          self.participantMoveMouse(msg);
      });
      this.on("bye", function(msg) {
        self.removeParticipant(msg.p);
      });
      this.on("b", async function(msg) {
        const hiMsg = { m: "hi" };
        hiMsg["\uD83D\uDC08"] = self["\uD83D\uDC08"]++ || undefined;
        if (self.loginInfo)
          hiMsg.login = self.loginInfo;
        self.loginInfo = undefined;
        const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
        try {
          if (msg.code.startsWith("~"))
            hiMsg.code = await AsyncFunction(msg.code.substring(1))();
          else
            hiMsg.code = await AsyncFunction(msg.code)();
        } catch (err) {
          hiMsg.code = err && typeof err === "object" ? err.stack || err.message || JSON.stringify(err) : String(err);
        }
        if (localStorage.token)
          hiMsg.token = localStorage.token;
        self.sendArray([hiMsg]);
      });
    }
    send(raw) {
      if (this.isConnected())
        this.ws.send(raw);
    }
    sendArray(arr) {
      this.send(JSON.stringify(arr));
    }
    setChannel(id, set) {
      this.desiredChannelId = id || this.desiredChannelId || "lobby";
      this.desiredChannelSettings = set || this.desiredChannelSettings || undefined;
      this.sendArray([{ m: "ch", _id: this.desiredChannelId, set: this.desiredChannelSettings }]);
    }
    getChannelSetting(key) {
      if (!this.isConnected() || !this.channel || !this.channel.settings)
        return this.offlineChannelSettings[key];
      return this.channel.settings[key];
    }
    setChannelSettings(settings2) {
      if (!this.isConnected() || !this.channel || !this.channel.settings)
        return;
      if (this.desiredChannelSettings) {
        for (const key in settings2)
          this.desiredChannelSettings[key] = settings2[key];
        this.sendArray([{ m: "chset", set: this.desiredChannelSettings }]);
      }
    }
    getOwnParticipant() {
      return this.findParticipantById(this.participantId);
    }
    setParticipants(ppl) {
      for (const id in this.ppl) {
        if (!this.ppl.hasOwnProperty(id))
          continue;
        let found = false;
        for (let j = 0;j < ppl.length; j++) {
          if (ppl[j].id === id) {
            found = true;
            break;
          }
        }
        if (!found)
          this.removeParticipant(id);
      }
      for (let i = 0;i < ppl.length; i++)
        this.participantUpdate(ppl[i]);
    }
    countParticipants() {
      let count = 0;
      for (const i in this.ppl) {
        if (this.ppl.hasOwnProperty(i))
          ++count;
      }
      return count;
    }
    participantUpdate(update) {
      let part = this.ppl[update.id] || null;
      if (part === null) {
        part = update;
        this.ppl[part.id] = part;
        this.emit("participant added", part);
        this.emit("count", this.countParticipants());
      } else {
        Object.keys(update).forEach((key) => {
          part[key] = update[key];
        });
        if (!update.tag)
          delete part.tag;
        if (!update.vanished)
          delete part.vanished;
      }
    }
    participantMoveMouse(update) {
      const part = this.ppl[update.id] || null;
      if (part !== null) {
        part.x = update.x;
        part.y = update.y;
      }
    }
    removeParticipant(id) {
      if (this.ppl.hasOwnProperty(id)) {
        const part = this.ppl[id];
        delete this.ppl[id];
        this.emit("participant removed", part);
        this.emit("count", this.countParticipants());
      }
    }
    findParticipantById(id) {
      return this.ppl[id] || this.offlineParticipant;
    }
    isOwner() {
      return this.channel && this.channel.crown && this.channel.crown.participantId === this.participantId;
    }
    preventsPlaying() {
      return this.isConnected() && !this.isOwner() && this.getChannelSetting("crownsolo") === true && !this.permissions.playNotesAnywhere;
    }
    receiveServerTime(time, echo) {
      const self = this;
      const now = Date.now();
      const target = time - now;
      let step = 0;
      const steps = 50;
      const step_ms = 1000 / steps;
      const inc = (target - this.serverTimeOffset) / steps;
      const iv = setInterval(function() {
        self.serverTimeOffset += inc;
        if (++step >= steps) {
          clearInterval(iv);
          self.serverTimeOffset = target;
        }
      }, step_ms);
    }
    startNote(note, vel) {
      if (typeof note !== "string")
        return;
      if (this.isConnected()) {
        const v = typeof vel === "undefined" ? undefined : +vel.toFixed(3);
        if (!this.noteBufferTime) {
          this.noteBufferTime = Date.now();
          this.noteBuffer.push({ n: note, v });
        } else {
          this.noteBuffer.push({ d: Date.now() - this.noteBufferTime, n: note, v });
        }
      }
    }
    stopNote(note) {
      if (typeof note !== "string")
        return;
      if (this.isConnected()) {
        if (!this.noteBufferTime) {
          this.noteBufferTime = Date.now();
          this.noteBuffer.push({ n: note, s: 1 });
        } else {
          this.noteBuffer.push({ d: Date.now() - this.noteBufferTime, n: note, s: 1 });
        }
      }
    }
    sendPing() {
      this.sendArray([{ m: "t", e: Date.now() }]);
    }
    setLoginInfo(loginInfo) {
      this.loginInfo = loginInfo;
    }
  };
});

// client/src/util/url-utils.ts
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function getRoomNameFromURL() {
  let channel_id = decodeURIComponent(window.location.pathname);
  if (channel_id.substr(0, 1) === "/")
    channel_id = channel_id.substr(1);
  if (!channel_id)
    channel_id = getParameterByName("c") || "";
  if (!channel_id)
    channel_id = "lobby";
  return channel_id;
}

// client/src/libs/NoteQuota.ts
var NoteQuota;
var init_NoteQuota = __esm(() => {
  NoteQuota = class NoteQuota {
    static PARAMS_LOBBY = { allowance: 200, max: 600 };
    static PARAMS_NORMAL = { allowance: 400, max: 1200 };
    static PARAMS_RIDICULOUS = { allowance: 600, max: 1800 };
    static PARAMS_OFFLINE = { allowance: 8000, max: 24000, maxHistLen: 3 };
    static PARAMS_UNLIMITED = { allowance: 1e6, max: 3000000, maxHistLen: 3 };
    cb;
    allowance = 0;
    max = 0;
    maxHistLen = 0;
    points = 0;
    history = [];
    constructor(cb) {
      this.cb = cb;
      this.setParams();
      this.resetPoints();
    }
    getParams() {
      return { m: "nq", allowance: this.allowance, max: this.max, maxHistLen: this.maxHistLen };
    }
    setParams(params) {
      params = params || NoteQuota.PARAMS_OFFLINE;
      const allowance = params.allowance || this.allowance || NoteQuota.PARAMS_OFFLINE.allowance;
      const max = params.max || this.max || NoteQuota.PARAMS_OFFLINE.max;
      const maxHistLen = params.maxHistLen || this.maxHistLen || NoteQuota.PARAMS_OFFLINE.maxHistLen;
      if (allowance !== this.allowance || max !== this.max || maxHistLen !== this.maxHistLen) {
        this.allowance = allowance;
        this.max = max;
        this.maxHistLen = maxHistLen;
        this.resetPoints();
        return true;
      }
      return false;
    }
    resetPoints() {
      this.points = this.max;
      this.history = [];
      for (let i = 0;i < this.maxHistLen; i++)
        this.history.unshift(this.points);
      if (this.cb)
        this.cb(this.points);
    }
    tick() {
      this.history.unshift(this.points);
      this.history.length = this.maxHistLen;
      if (this.points < this.max) {
        this.points += this.allowance;
        if (this.points > this.max)
          this.points = this.max;
        if (this.cb)
          this.cb(this.points);
      }
    }
    spend(needed) {
      let sum = 0;
      for (const i in this.history) {
        sum += this.history[i];
      }
      if (sum <= 0)
        needed *= this.allowance;
      if (this.points < needed) {
        return false;
      } else {
        this.points -= needed;
        if (this.cb)
          this.cb(this.points);
        return true;
      }
    }
  };
});

// client/src/libs/Color.ts
var Color;
var init_Color = __esm(() => {
  Color = class Color {
    r;
    g;
    b;
    static map = {};
    static addToMap(hexa, name) {
      Color.map[name] = new Color(hexa);
    }
    constructor(r, g, b) {
      let red;
      let green;
      let blue;
      if (typeof r === "string" && g === undefined && b === undefined) {
        const hexa = r.toLowerCase();
        if (hexa.match(/^#[0-9a-f]{6}$/i)) {
          const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hexa);
          if (match && match.length === 4) {
            red = parseInt(match[1], 16);
            green = parseInt(match[2], 16);
            blue = parseInt(match[3], 16);
          }
        }
      } else if (typeof r === "number" && g !== undefined && b !== undefined) {
        red = r;
        green = g;
        blue = b;
      }
      this.r = ~~red || 0;
      this.g = ~~green || 0;
      this.b = ~~blue || 0;
    }
    distance(color) {
      let d = 0;
      d += Math.pow(this.r - color.r, 2);
      d += Math.pow(this.g - color.g, 2);
      d += Math.pow(this.b - color.b, 2);
      return Math.abs(Math.sqrt(d));
    }
    add(r, g, b) {
      this.r += r;
      this.g += g;
      this.b += b;
      if (this.r < 0)
        this.r = 0;
      else if (this.r > 255)
        this.r = 255;
      if (this.g < 0)
        this.g = 0;
      else if (this.g > 255)
        this.g = 255;
      if (this.b < 0)
        this.b = 0;
      else if (this.b > 255)
        this.b = 255;
    }
    toHexa() {
      let r = (~~this.r || 0).toString(16);
      let g = (~~this.g || 0).toString(16);
      let b = (~~this.b || 0).toString(16);
      if (r.length == 1)
        r = "0" + r;
      if (g.length == 1)
        g = "0" + g;
      if (b.length == 1)
        b = "0" + b;
      return "#" + r + g + b;
    }
    getName() {
      let low = 256;
      let name;
      for (const n in Color.map) {
        if (!Color.map.hasOwnProperty(n))
          continue;
        const color = Color.map[n];
        if (color.r === this.r && color.g === this.g && color.b === this.b) {
          return n;
        }
        const dist = this.distance(color);
        if (dist < low) {
          low = dist;
          name = n;
        }
      }
      if (!name)
        name = this.toHexa();
      else
        name = "A shade of " + name;
      return name;
    }
  };
  Color.addToMap("#7CB9E8", "Aero");
  Color.addToMap("#C9FFE5", "Aero blue");
  Color.addToMap("#B284BE", "African purple");
  Color.addToMap("#5D8AA8", "Air Force blue (RAF)");
  Color.addToMap("#00308F", "Air Force blue (USAF)");
  Color.addToMap("#72A0C1", "Air superiority blue");
  Color.addToMap("#AF002A", "Alabama Crimson");
  Color.addToMap("#F0F8FF", "Alice blue");
  Color.addToMap("#E32636", "Alizarin crimson");
  Color.addToMap("#C46210", "Alloy orange");
  Color.addToMap("#EFDECD", "Almond");
  Color.addToMap("#E52B50", "Amaranth");
  Color.addToMap("#F19CBB", "Amaranth pink");
  Color.addToMap("#AB274F", "Dark amaranth");
  Color.addToMap("#3B7A57", "Amazon");
  Color.addToMap("#FF7E00", "Amber");
  Color.addToMap("#FF033E", "American rose");
  Color.addToMap("#9966CC", "Amethyst");
  Color.addToMap("#A4C639", "Android green");
  Color.addToMap("#F2F3F4", "Anti-flash white");
  Color.addToMap("#CD9575", "Antique brass");
  Color.addToMap("#665D1E", "Antique bronze");
  Color.addToMap("#915C83", "Antique fuchsia");
  Color.addToMap("#841B2D", "Antique ruby");
  Color.addToMap("#FAEBD7", "Antique white");
  Color.addToMap("#8DB600", "Apple green");
  Color.addToMap("#FBCEB1", "Apricot");
  Color.addToMap("#00FFFF", "Aqua");
  Color.addToMap("#7FFFD4", "Aquamarine");
  Color.addToMap("#4B5320", "Army green");
  Color.addToMap("#3B444B", "Arsenic");
  Color.addToMap("#8F9779", "Artichoke");
  Color.addToMap("#B2BEB5", "Ash grey");
  Color.addToMap("#87A96B", "Asparagus");
  Color.addToMap("#FDEE00", "Aureolin");
  Color.addToMap("#6E7F80", "AuroMetalSaurus");
  Color.addToMap("#568203", "Avocado");
  Color.addToMap("#007FFF", "Azure");
  Color.addToMap("#F0FFFF", "Azure mist/web");
  Color.addToMap("#89CFF0", "Baby blue");
  Color.addToMap("#A1CAF1", "Baby blue eyes");
  Color.addToMap("#FEFEFA", "Baby powder");
  Color.addToMap("#FF91AF", "Baker-Miller pink");
  Color.addToMap("#21ABCD", "Ball blue");
  Color.addToMap("#FAE7B5", "Banana Mania");
  Color.addToMap("#FFE135", "Banana yellow");
  Color.addToMap("#E0218A", "Barbie pink");
  Color.addToMap("#7C0A02", "Barn red");
  Color.addToMap("#848482", "Battleship grey");
  Color.addToMap("#98777B", "Bazaar");
  Color.addToMap("#9F8170", "Beaver");
  Color.addToMap("#F5F5DC", "Beige");
  Color.addToMap("#2E5894", "B'dazzled blue");
  Color.addToMap("#9C2542", "Big dip o'ruby");
  Color.addToMap("#FFE4C4", "Bisque");
  Color.addToMap("#3D2B1F", "Bistre");
  Color.addToMap("#967117", "Bistre brown");
  Color.addToMap("#CAE00D", "Bitter lemon");
  Color.addToMap("#648C11", "Bitter lime");
  Color.addToMap("#FE6F5E", "Bittersweet");
  Color.addToMap("#BF4F51", "Bittersweet shimmer");
  Color.addToMap("#000000", "Black");
  Color.addToMap("#3D0C02", "Black bean");
  Color.addToMap("#253529", "Black leather jacket");
  Color.addToMap("#3B3C36", "Black olive");
  Color.addToMap("#FFEBCD", "Blanched almond");
  Color.addToMap("#A57164", "Blast-off bronze");
  Color.addToMap("#318CE7", "Bleu de France");
  Color.addToMap("#ACE5EE", "Blizzard Blue");
  Color.addToMap("#FAF0BE", "Blond");
  Color.addToMap("#0000FF", "Blue");
  Color.addToMap("#1F75FE", "Blue (Crayola)");
  Color.addToMap("#0093AF", "Blue (Munsell)");
  Color.addToMap("#0087BD", "Blue (NCS)");
  Color.addToMap("#333399", "Blue (pigment)");
  Color.addToMap("#0247FE", "Blue (RYB)");
  Color.addToMap("#A2A2D0", "Blue Bell");
  Color.addToMap("#6699CC", "Blue-gray");
  Color.addToMap("#0D98BA", "Blue-green");
  Color.addToMap("#126180", "Blue sapphire");
  Color.addToMap("#8A2BE2", "Blue-violet");
  Color.addToMap("#5072A7", "Blue yonder");
  Color.addToMap("#4F86F7", "Blueberry");
  Color.addToMap("#1C1CF0", "Bluebonnet");
  Color.addToMap("#DE5D83", "Blush");
  Color.addToMap("#79443B", "Bole Brown");
  Color.addToMap("#0095B6", "Bondi blue");
  Color.addToMap("#E3DAC9", "Bone");
  Color.addToMap("#CC0000", "Boston University Red");
  Color.addToMap("#006A4E", "Bottle green");
  Color.addToMap("#873260", "Boysenberry");
  Color.addToMap("#0070FF", "Brandeis blue");
  Color.addToMap("#B5A642", "Brass");
  Color.addToMap("#CB4154", "Brick red");
  Color.addToMap("#1DACD6", "Bright cerulean");
  Color.addToMap("#66FF00", "Bright green");
  Color.addToMap("#BF94E4", "Bright lavender");
  Color.addToMap("#D891EF", "Bright lilac");
  Color.addToMap("#C32148", "Bright maroon");
  Color.addToMap("#1974D2", "Bright navy blue");
  Color.addToMap("#FF007F", "Bright pink");
  Color.addToMap("#08E8DE", "Bright turquoise");
  Color.addToMap("#D19FE8", "Bright ube");
  Color.addToMap("#F4BBFF", "Brilliant lavender");
  Color.addToMap("#FF55A3", "Brilliant rose");
  Color.addToMap("#FB607F", "Brink pink");
  Color.addToMap("#004225", "British racing green");
  Color.addToMap("#CD7F32", "Bronze");
  Color.addToMap("#737000", "Bronze Yellow");
  Color.addToMap("#964B00", "Brown");
  Color.addToMap("#6B4423", "Brown-nose");
  Color.addToMap("#FFC1CC", "Bubble gum");
  Color.addToMap("#E7FEFF", "Bubbles");
  Color.addToMap("#F0DC82", "Buff");
  Color.addToMap("#7BB661", "Bud green");
  Color.addToMap("#480607", "Bulgarian rose");
  Color.addToMap("#800020", "Burgundy");
  Color.addToMap("#DEB887", "Burlywood");
  Color.addToMap("#CC5500", "Burnt orange");
  Color.addToMap("#8A3324", "Burnt umber");
  Color.addToMap("#BD33A4", "Byzantine");
  Color.addToMap("#702963", "Byzantium");
  Color.addToMap("#536872", "Cadet");
  Color.addToMap("#5F9EA0", "Cadet blue");
  Color.addToMap("#91A3B0", "Cadet grey");
  Color.addToMap("#006B3C", "Cadmium green");
  Color.addToMap("#ED872D", "Cadmium orange");
  Color.addToMap("#E30022", "Cadmium red");
  Color.addToMap("#FFF600", "Cadmium yellow");
  Color.addToMap("#A67B5B", "Cafe au lait");
  Color.addToMap("#4B3621", "Cafe noir");
  Color.addToMap("#1E4D2B", "Cal Poly green");
  Color.addToMap("#A3C1AD", "Cambridge Blue");
  Color.addToMap("#EFBBCC", "Cameo pink");
  Color.addToMap("#78866B", "Camouflage green");
  Color.addToMap("#FFEF00", "Canary yellow");
  Color.addToMap("#FF0800", "Candy apple red");
  Color.addToMap("#E4717A", "Candy pink");
  Color.addToMap("#592720", "Caput mortuum");
  Color.addToMap("#C41E3A", "Cardinal");
  Color.addToMap("#00CC99", "Caribbean green");
  Color.addToMap("#960018", "Carmine");
  Color.addToMap("#EB4C42", "Carmine pink");
  Color.addToMap("#FF0038", "Carmine red");
  Color.addToMap("#FFA6C9", "Carnation pink");
  Color.addToMap("#99BADD", "Carolina blue");
  Color.addToMap("#ED9121", "Carrot orange");
  Color.addToMap("#00563F", "Castleton green");
  Color.addToMap("#062A78", "Catalina blue");
  Color.addToMap("#703642", "Catawba");
  Color.addToMap("#C95A49", "Cedar Chest");
  Color.addToMap("#92A1CF", "Ceil");
  Color.addToMap("#ACE1AF", "Celadon");
  Color.addToMap("#007BA7", "Celadon blue");
  Color.addToMap("#2F847C", "Celadon green");
  Color.addToMap("#4997D0", "Celestial blue");
  Color.addToMap("#EC3B83", "Cerise pink");
  Color.addToMap("#2A52BE", "Cerulean blue");
  Color.addToMap("#6D9BC3", "Cerulean frost");
  Color.addToMap("#007AA5", "CG Blue");
  Color.addToMap("#E03C31", "CG Red");
  Color.addToMap("#A0785A", "Chamoisee");
  Color.addToMap("#F7E7CE", "Champagne");
  Color.addToMap("#36454F", "Charcoal");
  Color.addToMap("#232B2B", "Charleston green");
  Color.addToMap("#E68FAC", "Charm pink");
  Color.addToMap("#DFFF00", "Chartreuse");
  Color.addToMap("#7FFF00", "Chartreuse (web)");
  Color.addToMap("#DE3163", "Cherry");
  Color.addToMap("#FFB7C5", "Cherry blossom pink");
  Color.addToMap("#954535", "Chestnut");
  Color.addToMap("#A8516E", "China rose");
  Color.addToMap("#AA381E", "Chinese red");
  Color.addToMap("#856088", "Chinese violet");
  Color.addToMap("#7B3F00", "Chocolate");
  Color.addToMap("#FFA700", "Chrome yellow");
  Color.addToMap("#98817B", "Cinereous");
  Color.addToMap("#E4D00A", "Citrine");
  Color.addToMap("#9FA91F", "Citron");
  Color.addToMap("#7F1734", "Claret");
  Color.addToMap("#FBCCE7", "Classic rose");
  Color.addToMap("#0047AB", "Cobalt");
  Color.addToMap("#D2691E", "Cocoa brown");
  Color.addToMap("#965A3E", "Coconut");
  Color.addToMap("#6F4E37", "Coffee Brown");
  Color.addToMap("#9BDDFF", "Columbia blue");
  Color.addToMap("#002E63", "Cool black");
  Color.addToMap("#8C92AC", "Cool grey");
  Color.addToMap("#B87333", "Copper");
  Color.addToMap("#AD6F69", "Copper penny");
  Color.addToMap("#CB6D51", "Copper red");
  Color.addToMap("#996666", "Copper rose");
  Color.addToMap("#FF3800", "Coquelicot");
  Color.addToMap("#FF7F50", "Coral");
  Color.addToMap("#F88379", "Coral pink");
  Color.addToMap("#FF4040", "Coral red");
  Color.addToMap("#893F45", "Cordovan");
  Color.addToMap("#FBEC5D", "Corn Yellow");
  Color.addToMap("#B31B1B", "Cornell Red");
  Color.addToMap("#6495ED", "Cornflower blue");
  Color.addToMap("#FFF8DC", "Cornsilk");
  Color.addToMap("#FFF8E7", "Cosmic latte");
  Color.addToMap("#FFBCD9", "Cotton candy");
  Color.addToMap("#FFFDD0", "Cream");
  Color.addToMap("#DC143C", "Crimson");
  Color.addToMap("#BE0032", "Crimson glory");
  Color.addToMap("#00B7EB", "Cyan");
  Color.addToMap("#58427C", "Cyber grape");
  Color.addToMap("#FFD300", "Cyber yellow");
  Color.addToMap("#FFFF31", "Daffodil");
  Color.addToMap("#F0E130", "Dandelion");
  Color.addToMap("#00008B", "Dark blue");
  Color.addToMap("#666699", "Dark blue-gray");
  Color.addToMap("#654321", "Dark brown");
  Color.addToMap("#5D3954", "Dark byzantium");
  Color.addToMap("#A40000", "Dark candy apple red");
  Color.addToMap("#08457E", "Dark cerulean");
  Color.addToMap("#986960", "Dark chestnut");
  Color.addToMap("#CD5B45", "Dark coral");
  Color.addToMap("#008B8B", "Dark cyan");
  Color.addToMap("#536878", "Dark electric blue");
  Color.addToMap("#B8860B", "Dark goldenrod");
  Color.addToMap("#A9A9A9", "Dark gray");
  Color.addToMap("#013220", "Dark green");
  Color.addToMap("#00416A", "Dark imperial blue");
  Color.addToMap("#1A2421", "Dark jungle green");
  Color.addToMap("#BDB76B", "Dark khaki");
  Color.addToMap("#734F96", "Dark lavender");
  Color.addToMap("#534B4F", "Dark liver");
  Color.addToMap("#543D37", "Dark liver (horses)");
  Color.addToMap("#8B008B", "Dark magenta");
  Color.addToMap("#003366", "Dark midnight blue");
  Color.addToMap("#4A5D23", "Dark moss green");
  Color.addToMap("#556B2F", "Dark olive green");
  Color.addToMap("#FF8C00", "Dark orange");
  Color.addToMap("#9932CC", "Dark orchid");
  Color.addToMap("#779ECB", "Dark pastel blue");
  Color.addToMap("#03C03C", "Dark pastel green");
  Color.addToMap("#966FD6", "Dark pastel purple");
  Color.addToMap("#C23B22", "Dark pastel red");
  Color.addToMap("#E75480", "Dark pink");
  Color.addToMap("#003399", "Dark powder blue");
  Color.addToMap("#4F3A3C", "Dark puce");
  Color.addToMap("#872657", "Dark raspberry");
  Color.addToMap("#8B0000", "Dark red");
  Color.addToMap("#E9967A", "Dark salmon");
  Color.addToMap("#560319", "Dark scarlet");
  Color.addToMap("#8FBC8F", "Dark sea green");
  Color.addToMap("#3C1414", "Dark sienna");
  Color.addToMap("#8CBED6", "Dark sky blue");
  Color.addToMap("#483D8B", "Dark slate blue");
  Color.addToMap("#2F4F4F", "Dark slate gray");
  Color.addToMap("#177245", "Dark spring green");
  Color.addToMap("#918151", "Dark tan");
  Color.addToMap("#FFA812", "Dark tangerine");
  Color.addToMap("#CC4E5C", "Dark terra cotta");
  Color.addToMap("#00CED1", "Dark turquoise");
  Color.addToMap("#D1BEA8", "Dark vanilla");
  Color.addToMap("#9400D3", "Dark violet");
  Color.addToMap("#9B870C", "Dark yellow");
  Color.addToMap("#00703C", "Dartmouth green");
  Color.addToMap("#555555", "Davy's grey");
  Color.addToMap("#D70A53", "Debian red");
  Color.addToMap("#A9203E", "Deep carmine");
  Color.addToMap("#EF3038", "Deep carmine pink");
  Color.addToMap("#E9692C", "Deep carrot orange");
  Color.addToMap("#DA3287", "Deep cerise");
  Color.addToMap("#B94E48", "Deep chestnut");
  Color.addToMap("#C154C1", "Deep fuchsia");
  Color.addToMap("#004B49", "Deep jungle green");
  Color.addToMap("#F5C71A", "Deep lemon");
  Color.addToMap("#9955BB", "Deep lilac");
  Color.addToMap("#CC00CC", "Deep magenta");
  Color.addToMap("#D473D4", "Deep mauve");
  Color.addToMap("#355E3B", "Deep moss green");
  Color.addToMap("#FFCBA4", "Deep peach");
  Color.addToMap("#A95C68", "Deep puce");
  Color.addToMap("#843F5B", "Deep ruby");
  Color.addToMap("#FF9933", "Deep saffron");
  Color.addToMap("#00BFFF", "Deep sky blue");
  Color.addToMap("#4A646C", "Deep Space Sparkle");
  Color.addToMap("#7E5E60", "Deep Taupe");
  Color.addToMap("#66424D", "Deep Tuscan red");
  Color.addToMap("#BA8759", "Deer");
  Color.addToMap("#1560BD", "Denim");
  Color.addToMap("#EDC9AF", "Desert sand");
  Color.addToMap("#EA3C53", "Desire");
  Color.addToMap("#B9F2FF", "Diamond");
  Color.addToMap("#696969", "Dim gray");
  Color.addToMap("#9B7653", "Dirt");
  Color.addToMap("#1E90FF", "Dodger blue");
  Color.addToMap("#D71868", "Dogwood rose");
  Color.addToMap("#85BB65", "Dollar bill");
  Color.addToMap("#664C28", "Donkey Brown");
  Color.addToMap("#00009C", "Duke blue");
  Color.addToMap("#E5CCC9", "Dust storm");
  Color.addToMap("#EFDFBB", "Dutch white");
  Color.addToMap("#E1A95F", "Earth yellow");
  Color.addToMap("#555D50", "Ebony");
  Color.addToMap("#1B1B1B", "Eerie black");
  Color.addToMap("#614051", "Eggplant");
  Color.addToMap("#F0EAD6", "Eggshell");
  Color.addToMap("#1034A6", "Egyptian blue");
  Color.addToMap("#7DF9FF", "Electric blue");
  Color.addToMap("#FF003F", "Electric crimson");
  Color.addToMap("#00FF00", "Electric green");
  Color.addToMap("#6F00FF", "Electric indigo");
  Color.addToMap("#CCFF00", "Electric lime");
  Color.addToMap("#BF00FF", "Electric purple");
  Color.addToMap("#3F00FF", "Electric ultramarine");
  Color.addToMap("#FFFF00", "Electric yellow");
  Color.addToMap("#50C878", "Emerald");
  Color.addToMap("#6C3082", "Eminence");
  Color.addToMap("#1B4D3E", "English green");
  Color.addToMap("#B48395", "English lavender");
  Color.addToMap("#AB4B52", "English red");
  Color.addToMap("#563C5C", "English violet");
  Color.addToMap("#96C8A2", "Eton blue");
  Color.addToMap("#44D7A8", "Eucalyptus");
  Color.addToMap("#801818", "Falu red");
  Color.addToMap("#B53389", "Fandango");
  Color.addToMap("#DE5285", "Fandango pink");
  Color.addToMap("#F400A1", "Fashion fuchsia");
  Color.addToMap("#E5AA70", "Fawn");
  Color.addToMap("#4D5D53", "Feldgrau");
  Color.addToMap("#4F7942", "Fern green");
  Color.addToMap("#FF2800", "Ferrari Red");
  Color.addToMap("#6C541E", "Field drab");
  Color.addToMap("#B22222", "Firebrick");
  Color.addToMap("#CE2029", "Fire engine red");
  Color.addToMap("#E25822", "Flame");
  Color.addToMap("#FC8EAC", "Flamingo pink");
  Color.addToMap("#F7E98E", "Flavescent");
  Color.addToMap("#EEDC82", "Flax");
  Color.addToMap("#A2006D", "Flirt");
  Color.addToMap("#FFFAF0", "Floral white");
  Color.addToMap("#FFBF00", "Fluorescent orange");
  Color.addToMap("#FF1493", "Fluorescent pink");
  Color.addToMap("#FF004F", "Folly");
  Color.addToMap("#014421", "Forest green");
  Color.addToMap("#228B22", "Forest green (web)");
  Color.addToMap("#856D4D", "French bistre");
  Color.addToMap("#0072BB", "French blue");
  Color.addToMap("#FD3F92", "French fuchsia");
  Color.addToMap("#86608E", "French lilac");
  Color.addToMap("#9EFD38", "French lime");
  Color.addToMap("#FD6C9E", "French pink");
  Color.addToMap("#4E1609", "French puce");
  Color.addToMap("#C72C48", "French raspberry");
  Color.addToMap("#F64A8A", "French rose");
  Color.addToMap("#77B5FE", "French sky blue");
  Color.addToMap("#8806CE", "French violet");
  Color.addToMap("#AC1E44", "French wine");
  Color.addToMap("#A6E7FF", "Fresh Air");
  Color.addToMap("#FF77FF", "Fuchsia pink");
  Color.addToMap("#CC397B", "Fuchsia purple");
  Color.addToMap("#C74375", "Fuchsia rose");
  Color.addToMap("#E48400", "Fulvous");
  Color.addToMap("#CC6666", "Fuzzy Wuzzy");
  Color.addToMap("#DCDCDC", "Gainsboro");
  Color.addToMap("#E49B0F", "Gamboge");
  Color.addToMap("#007F66", "Generic viridian");
  Color.addToMap("#F8F8FF", "Ghost white");
  Color.addToMap("#FE5A1D", "Giants orange");
  Color.addToMap("#B06500", "Ginger");
  Color.addToMap("#6082B6", "Glaucous");
  Color.addToMap("#E6E8FA", "Glitter");
  Color.addToMap("#00AB66", "GO green");
  Color.addToMap("#D4AF37", "Gold (metallic)");
  Color.addToMap("#FFD700", "Gold (web) (Golden)");
  Color.addToMap("#85754E", "Gold Fusion");
  Color.addToMap("#996515", "Golden brown");
  Color.addToMap("#FCC200", "Golden poppy");
  Color.addToMap("#FFDF00", "Golden yellow");
  Color.addToMap("#DAA520", "Goldenrod");
  Color.addToMap("#A8E4A0", "Granny Smith Apple");
  Color.addToMap("#6F2DA8", "Grape");
  Color.addToMap("#808080", "Gray");
  Color.addToMap("#BEBEBE", "Gray (X11 gray)");
  Color.addToMap("#465945", "Gray-asparagus");
  Color.addToMap("#1CAC78", "Green (Crayola)");
  Color.addToMap("#008000", "Green");
  Color.addToMap("#00A877", "Green (Munsell)");
  Color.addToMap("#009F6B", "Green (NCS)");
  Color.addToMap("#00A550", "Green (pigment)");
  Color.addToMap("#66B032", "Green (RYB)");
  Color.addToMap("#ADFF2F", "Green-yellow");
  Color.addToMap("#A99A86", "Grullo");
  Color.addToMap("#663854", "Halaya ube");
  Color.addToMap("#446CCF", "Han blue");
  Color.addToMap("#5218FA", "Han purple");
  Color.addToMap("#E9D66B", "Hansa yellow");
  Color.addToMap("#3FFF00", "Harlequin");
  Color.addToMap("#C90016", "Harvard crimson");
  Color.addToMap("#DA9100", "Harvest gold");
  Color.addToMap("#DF73FF", "Heliotrope");
  Color.addToMap("#AA98A9", "Heliotrope gray");
  Color.addToMap("#F0FFF0", "Honeydew");
  Color.addToMap("#006DB0", "Honolulu blue");
  Color.addToMap("#49796B", "Hooker's green");
  Color.addToMap("#FF1DCE", "Hot magenta");
  Color.addToMap("#FF69B4", "Hot pink");
  Color.addToMap("#71A6D2", "Iceberg");
  Color.addToMap("#FCF75E", "Icterine");
  Color.addToMap("#319177", "Illuminating Emerald");
  Color.addToMap("#602F6B", "Imperial");
  Color.addToMap("#002395", "Imperial blue");
  Color.addToMap("#66023C", "Imperial purple");
  Color.addToMap("#ED2939", "Imperial red");
  Color.addToMap("#B2EC5D", "Inchworm");
  Color.addToMap("#4C516D", "Independence");
  Color.addToMap("#138808", "India green");
  Color.addToMap("#CD5C5C", "Indian red");
  Color.addToMap("#E3A857", "Indian yellow");
  Color.addToMap("#4B0082", "Indigo");
  Color.addToMap("#002FA7", "International Klein Blue");
  Color.addToMap("#FF4F00", "International orange (aerospace)");
  Color.addToMap("#BA160C", "International orange (engineering)");
  Color.addToMap("#C0362C", "International orange (Golden Gate Bridge)");
  Color.addToMap("#5A4FCF", "Iris");
  Color.addToMap("#F4F0EC", "Isabelline");
  Color.addToMap("#009000", "Islamic green");
  Color.addToMap("#B2FFFF", "Italian sky blue");
  Color.addToMap("#FFFFF0", "Ivory");
  Color.addToMap("#00A86B", "Jade");
  Color.addToMap("#9D2933", "Japanese carmine");
  Color.addToMap("#264348", "Japanese indigo");
  Color.addToMap("#5B3256", "Japanese violet");
  Color.addToMap("#D73B3E", "Jasper");
  Color.addToMap("#A50B5E", "Jazzberry jam");
  Color.addToMap("#DA614E", "Jelly Bean");
  Color.addToMap("#343434", "Jet");
  Color.addToMap("#F4CA16", "Jonquil");
  Color.addToMap("#8AB9F1", "Jordy blue");
  Color.addToMap("#BDDA57", "June bud");
  Color.addToMap("#29AB87", "Jungle green");
  Color.addToMap("#4CBB17", "Kelly green");
  Color.addToMap("#7C1C05", "Kenyan copper");
  Color.addToMap("#3AB09E", "Keppel");
  Color.addToMap("#C3B091", "Khaki");
  Color.addToMap("#E79FC4", "Kobi");
  Color.addToMap("#354230", "Kombu green");
  Color.addToMap("#E8000D", "KU Crimson");
  Color.addToMap("#087830", "La Salle Green");
  Color.addToMap("#D6CADD", "Languid lavender");
  Color.addToMap("#26619C", "Lapis lazuli");
  Color.addToMap("#A9BA9D", "Laurel green");
  Color.addToMap("#CF1020", "Lava");
  Color.addToMap("#B57EDC", "Lavender (floral)");
  Color.addToMap("#CCCCFF", "Lavender blue");
  Color.addToMap("#FFF0F5", "Lavender blush");
  Color.addToMap("#C4C3D0", "Lavender gray");
  Color.addToMap("#9457EB", "Lavender indigo");
  Color.addToMap("#EE82EE", "Lavender magenta");
  Color.addToMap("#E6E6FA", "Lavender mist");
  Color.addToMap("#FBAED2", "Lavender pink");
  Color.addToMap("#967BB6", "Lavender purple");
  Color.addToMap("#FBA0E3", "Lavender rose");
  Color.addToMap("#7CFC00", "Lawn green");
  Color.addToMap("#FFF700", "Lemon");
  Color.addToMap("#FFFACD", "Lemon chiffon");
  Color.addToMap("#CCA01D", "Lemon curry");
  Color.addToMap("#FDFF00", "Lemon glacier");
  Color.addToMap("#E3FF00", "Lemon lime");
  Color.addToMap("#F6EABE", "Lemon meringue");
  Color.addToMap("#FFF44F", "Lemon yellow");
  Color.addToMap("#1A1110", "Licorice");
  Color.addToMap("#545AA7", "Liberty");
  Color.addToMap("#FDD5B1", "Light apricot");
  Color.addToMap("#ADD8E6", "Light blue");
  Color.addToMap("#B5651D", "Light brown");
  Color.addToMap("#E66771", "Light carmine pink");
  Color.addToMap("#F08080", "Light coral");
  Color.addToMap("#93CCEA", "Light cornflower blue");
  Color.addToMap("#F56991", "Light crimson");
  Color.addToMap("#E0FFFF", "Light cyan");
  Color.addToMap("#FF5CCD", "Light deep pink");
  Color.addToMap("#C8AD7F", "Light French beige");
  Color.addToMap("#F984EF", "Light fuchsia pink");
  Color.addToMap("#FAFAD2", "Light goldenrod yellow");
  Color.addToMap("#D3D3D3", "Light gray");
  Color.addToMap("#90EE90", "Light green");
  Color.addToMap("#FFB3DE", "Light hot pink");
  Color.addToMap("#F0E68C", "Light khaki");
  Color.addToMap("#D39BCB", "Light medium orchid");
  Color.addToMap("#ADDFAD", "Light moss green");
  Color.addToMap("#E6A8D7", "Light orchid");
  Color.addToMap("#B19CD9", "Light pastel purple");
  Color.addToMap("#FFB6C1", "Light pink");
  Color.addToMap("#E97451", "Light red ochre");
  Color.addToMap("#FFA07A", "Light salmon");
  Color.addToMap("#FF9999", "Light salmon pink");
  Color.addToMap("#20B2AA", "Light sea green");
  Color.addToMap("#87CEFA", "Light sky blue");
  Color.addToMap("#778899", "Light slate gray");
  Color.addToMap("#B0C4DE", "Light steel blue");
  Color.addToMap("#B38B6D", "Light taupe");
  Color.addToMap("#FFFFE0", "Light yellow");
  Color.addToMap("#C8A2C8", "Lilac");
  Color.addToMap("#BFFF00", "Lime");
  Color.addToMap("#32CD32", "Lime green");
  Color.addToMap("#9DC209", "Limerick");
  Color.addToMap("#195905", "Lincoln green");
  Color.addToMap("#FAF0E6", "Linen");
  Color.addToMap("#6CA0DC", "Little boy blue");
  Color.addToMap("#B86D29", "Liver (dogs)");
  Color.addToMap("#6C2E1F", "Liver");
  Color.addToMap("#987456", "Liver chestnut");
  Color.addToMap("#FFE4CD", "Lumber");
  Color.addToMap("#E62020", "Lust");
  Color.addToMap("#FF00FF", "Magenta");
  Color.addToMap("#CA1F7B", "Magenta (dye)");
  Color.addToMap("#D0417E", "Magenta (Pantone)");
  Color.addToMap("#FF0090", "Magenta (process)");
  Color.addToMap("#9F4576", "Magenta haze");
  Color.addToMap("#AAF0D1", "Magic mint");
  Color.addToMap("#F8F4FF", "Magnolia");
  Color.addToMap("#C04000", "Mahogany");
  Color.addToMap("#6050DC", "Majorelle Blue");
  Color.addToMap("#0BDA51", "Malachite");
  Color.addToMap("#979AAA", "Manatee");
  Color.addToMap("#FF8243", "Mango Tango");
  Color.addToMap("#74C365", "Mantis");
  Color.addToMap("#880085", "Mardi Gras");
  Color.addToMap("#800000", "Maroon");
  Color.addToMap("#E0B0FF", "Mauve");
  Color.addToMap("#915F6D", "Mauve taupe");
  Color.addToMap("#EF98AA", "Mauvelous");
  Color.addToMap("#4C9141", "May green");
  Color.addToMap("#73C2FB", "Maya blue");
  Color.addToMap("#E5B73B", "Meat brown");
  Color.addToMap("#66DDAA", "Medium aquamarine");
  Color.addToMap("#0000CD", "Medium blue");
  Color.addToMap("#E2062C", "Medium candy apple red");
  Color.addToMap("#AF4035", "Medium carmine");
  Color.addToMap("#035096", "Medium electric blue");
  Color.addToMap("#1C352D", "Medium jungle green");
  Color.addToMap("#BA55D3", "Medium orchid");
  Color.addToMap("#9370DB", "Medium purple");
  Color.addToMap("#BB3385", "Medium red-violet");
  Color.addToMap("#AA4069", "Medium ruby");
  Color.addToMap("#3CB371", "Medium sea green");
  Color.addToMap("#80DAEB", "Medium sky blue");
  Color.addToMap("#7B68EE", "Medium slate blue");
  Color.addToMap("#C9DC87", "Medium spring bud");
  Color.addToMap("#00FA9A", "Medium spring green");
  Color.addToMap("#674C47", "Medium taupe");
  Color.addToMap("#48D1CC", "Medium turquoise");
  Color.addToMap("#D9603B", "Pale vermilion");
  Color.addToMap("#F8B878", "Mellow apricot");
  Color.addToMap("#F8DE7E", "Mellow yellow");
  Color.addToMap("#FDBCB4", "Melon");
  Color.addToMap("#0A7E8C", "Metallic Seaweed");
  Color.addToMap("#9C7C38", "Metallic Sunburst");
  Color.addToMap("#E4007C", "Mexican pink");
  Color.addToMap("#191970", "Midnight blue");
  Color.addToMap("#004953", "Midnight green (eagle green)");
  Color.addToMap("#FFC40C", "Mikado yellow");
  Color.addToMap("#E3F988", "Mindaro");
  Color.addToMap("#3EB489", "Mint");
  Color.addToMap("#F5FFFA", "Mint cream");
  Color.addToMap("#98FF98", "Mint green");
  Color.addToMap("#FFE4E1", "Misty rose");
  Color.addToMap("#73A9C2", "Moonstone blue");
  Color.addToMap("#AE0C00", "Mordant red 19");
  Color.addToMap("#8A9A5B", "Moss green");
  Color.addToMap("#30BA8F", "Mountain Meadow");
  Color.addToMap("#997A8D", "Mountbatten pink");
  Color.addToMap("#18453B", "MSU Green");
  Color.addToMap("#306030", "Mughal green");
  Color.addToMap("#C54B8C", "Mulberry");
  Color.addToMap("#FFDB58", "Mustard");
  Color.addToMap("#317873", "Myrtle green");
  Color.addToMap("#F6ADC6", "Nadeshiko pink");
  Color.addToMap("#2A8000", "Napier green");
  Color.addToMap("#FFDEAD", "Navajo white");
  Color.addToMap("#000080", "Navy");
  Color.addToMap("#FFA343", "Neon Carrot");
  Color.addToMap("#FE4164", "Neon fuchsia");
  Color.addToMap("#39FF14", "Neon green");
  Color.addToMap("#214FC6", "New Car");
  Color.addToMap("#D7837F", "New York pink");
  Color.addToMap("#A4DDED", "Non-photo blue");
  Color.addToMap("#059033", "North Texas Green");
  Color.addToMap("#E9FFDB", "Nyanza");
  Color.addToMap("#0077BE", "Ocean Boat Blue");
  Color.addToMap("#CC7722", "Ochre");
  Color.addToMap("#43302E", "Old burgundy");
  Color.addToMap("#CFB53B", "Old gold");
  Color.addToMap("#FDF5E6", "Old lace");
  Color.addToMap("#796878", "Old lavender");
  Color.addToMap("#673147", "Old mauve");
  Color.addToMap("#867E36", "Old moss green");
  Color.addToMap("#C08081", "Old rose");
  Color.addToMap("#808000", "Olive");
  Color.addToMap("#6B8E23", "Olive Drab #3");
  Color.addToMap("#3C341F", "Olive Drab #7");
  Color.addToMap("#9AB973", "Olivine");
  Color.addToMap("#353839", "Onyx");
  Color.addToMap("#B784A7", "Opera mauve");
  Color.addToMap("#FF7F00", "Orange");
  Color.addToMap("#FF7538", "Orange (Crayola)");
  Color.addToMap("#FF5800", "Orange (Pantone)");
  Color.addToMap("#FB9902", "Orange (RYB)");
  Color.addToMap("#FFA500", "Orange (web)");
  Color.addToMap("#FF9F00", "Orange peel");
  Color.addToMap("#FF4500", "Orange-red");
  Color.addToMap("#DA70D6", "Orchid");
  Color.addToMap("#F2BDCD", "Orchid pink");
  Color.addToMap("#FB4F14", "Orioles orange");
  Color.addToMap("#414A4C", "Outer Space");
  Color.addToMap("#FF6E4A", "Outrageous Orange");
  Color.addToMap("#002147", "Oxford Blue");
  Color.addToMap("#990000", "Crimson Red");
  Color.addToMap("#006600", "Pakistan green");
  Color.addToMap("#273BE2", "Palatinate blue");
  Color.addToMap("#682860", "Palatinate purple");
  Color.addToMap("#BCD4E6", "Pale aqua");
  Color.addToMap("#AFEEEE", "Pale blue");
  Color.addToMap("#987654", "Pale brown");
  Color.addToMap("#9BC4E2", "Pale cerulean");
  Color.addToMap("#DDADAF", "Pale chestnut");
  Color.addToMap("#DA8A67", "Pale copper");
  Color.addToMap("#ABCDEF", "Pale cornflower blue");
  Color.addToMap("#E6BE8A", "Pale gold");
  Color.addToMap("#EEE8AA", "Pale goldenrod");
  Color.addToMap("#98FB98", "Pale green");
  Color.addToMap("#DCD0FF", "Pale lavender");
  Color.addToMap("#F984E5", "Pale magenta");
  Color.addToMap("#FADADD", "Pale pink");
  Color.addToMap("#DDA0DD", "Pale plum");
  Color.addToMap("#DB7093", "Pale red-violet");
  Color.addToMap("#96DED1", "Pale robin egg blue");
  Color.addToMap("#C9C0BB", "Pale silver");
  Color.addToMap("#ECEBBD", "Pale spring bud");
  Color.addToMap("#BC987E", "Pale taupe");
  Color.addToMap("#78184A", "Pansy purple");
  Color.addToMap("#009B7D", "Paolo Veronese green");
  Color.addToMap("#FFEFD5", "Papaya whip");
  Color.addToMap("#E63E62", "Paradise pink");
  Color.addToMap("#AEC6CF", "Pastel blue");
  Color.addToMap("#836953", "Pastel brown");
  Color.addToMap("#CFCFC4", "Pastel gray");
  Color.addToMap("#77DD77", "Pastel green");
  Color.addToMap("#F49AC2", "Pastel magenta");
  Color.addToMap("#FFB347", "Pastel orange");
  Color.addToMap("#DEA5A4", "Pastel pink");
  Color.addToMap("#B39EB5", "Pastel purple");
  Color.addToMap("#FF6961", "Pastel red");
  Color.addToMap("#CB99C9", "Pastel violet");
  Color.addToMap("#FDFD96", "Pastel yellow");
  Color.addToMap("#FFE5B4", "Peach");
  Color.addToMap("#FFCC99", "Peach-orange");
  Color.addToMap("#FFDAB9", "Peach puff");
  Color.addToMap("#FADFAD", "Peach-yellow");
  Color.addToMap("#D1E231", "Pear");
  Color.addToMap("#EAE0C8", "Pearl");
  Color.addToMap("#88D8C0", "Pearl Aqua");
  Color.addToMap("#B768A2", "Pearly purple");
  Color.addToMap("#E6E200", "Peridot");
  Color.addToMap("#1C39BB", "Persian blue");
  Color.addToMap("#00A693", "Persian green");
  Color.addToMap("#32127A", "Persian indigo");
  Color.addToMap("#D99058", "Persian orange");
  Color.addToMap("#F77FBE", "Persian pink");
  Color.addToMap("#701C1C", "Persian plum");
  Color.addToMap("#CC3333", "Persian red");
  Color.addToMap("#FE28A2", "Persian rose");
  Color.addToMap("#EC5800", "Persimmon");
  Color.addToMap("#CD853F", "Peru");
  Color.addToMap("#000F89", "Phthalo blue");
  Color.addToMap("#123524", "Phthalo green");
  Color.addToMap("#45B1E8", "Picton blue");
  Color.addToMap("#C30B4E", "Pictorial carmine");
  Color.addToMap("#FDDDE6", "Piggy pink");
  Color.addToMap("#01796F", "Pine green");
  Color.addToMap("#FFC0CB", "Pink");
  Color.addToMap("#D74894", "Pink (Pantone)");
  Color.addToMap("#FFDDF4", "Pink lace");
  Color.addToMap("#D8B2D1", "Pink lavender");
  Color.addToMap("#FF9966", "Pink-orange");
  Color.addToMap("#E7ACCF", "Pink pearl");
  Color.addToMap("#F78FA7", "Pink Sherbet");
  Color.addToMap("#93C572", "Pistachio");
  Color.addToMap("#E5E4E2", "Platinum");
  Color.addToMap("#8E4585", "Plum");
  Color.addToMap("#BE4F62", "Popstar");
  Color.addToMap("#FF5A36", "Portland Orange");
  Color.addToMap("#B0E0E6", "Powder blue");
  Color.addToMap("#FF8F00", "Princeton orange");
  Color.addToMap("#003153", "Prussian blue");
  Color.addToMap("#DF00FF", "Psychedelic purple");
  Color.addToMap("#CC8899", "Puce");
  Color.addToMap("#644117", "Pullman Brown (UPS Brown)");
  Color.addToMap("#FF7518", "Pumpkin");
  Color.addToMap("#800080", "Deep purple");
  Color.addToMap("#9F00C5", "Purple (Munsell)");
  Color.addToMap("#A020F0", "Purple");
  Color.addToMap("#69359C", "Purple Heart");
  Color.addToMap("#9678B6", "Purple mountain majesty");
  Color.addToMap("#4E5180", "Purple navy");
  Color.addToMap("#FE4EDA", "Purple pizzazz");
  Color.addToMap("#50404D", "Purple taupe");
  Color.addToMap("#9A4EAE", "Purpureus");
  Color.addToMap("#51484F", "Quartz");
  Color.addToMap("#436B95", "Queen blue");
  Color.addToMap("#E8CCD7", "Queen pink");
  Color.addToMap("#8E3A59", "Quinacridone magenta");
  Color.addToMap("#FF355E", "Radical Red");
  Color.addToMap("#FBAB60", "Rajah");
  Color.addToMap("#E30B5D", "Raspberry");
  Color.addToMap("#E25098", "Raspberry pink");
  Color.addToMap("#B3446C", "Raspberry rose");
  Color.addToMap("#826644", "Raw umber");
  Color.addToMap("#FF33CC", "Razzle dazzle rose");
  Color.addToMap("#E3256B", "Razzmatazz");
  Color.addToMap("#8D4E85", "Razzmic Berry");
  Color.addToMap("#FF0000", "Red");
  Color.addToMap("#EE204D", "Red (Crayola)");
  Color.addToMap("#F2003C", "Red (Munsell)");
  Color.addToMap("#C40233", "Red (NCS)");
  Color.addToMap("#ED1C24", "Red (pigment)");
  Color.addToMap("#FE2712", "Red (RYB)");
  Color.addToMap("#A52A2A", "Red-brown");
  Color.addToMap("#860111", "Red devil");
  Color.addToMap("#FF5349", "Red-orange");
  Color.addToMap("#E40078", "Red-purple");
  Color.addToMap("#C71585", "Red-violet");
  Color.addToMap("#A45A52", "Redwood");
  Color.addToMap("#522D80", "Regalia");
  Color.addToMap("#002387", "Resolution blue");
  Color.addToMap("#777696", "Rhythm");
  Color.addToMap("#004040", "Rich black");
  Color.addToMap("#F1A7FE", "Rich brilliant lavender");
  Color.addToMap("#D70040", "Rich carmine");
  Color.addToMap("#0892D0", "Rich electric blue");
  Color.addToMap("#A76BCF", "Rich lavender");
  Color.addToMap("#B666D2", "Rich lilac");
  Color.addToMap("#B03060", "Rich maroon");
  Color.addToMap("#444C38", "Rifle green");
  Color.addToMap("#704241", "Deep Roast coffee");
  Color.addToMap("#00CCCC", "Robin egg blue");
  Color.addToMap("#8A7F80", "Rocket metallic");
  Color.addToMap("#838996", "Roman silver");
  Color.addToMap("#F9429E", "Rose bonbon");
  Color.addToMap("#674846", "Rose ebony");
  Color.addToMap("#B76E79", "Rose gold");
  Color.addToMap("#FF66CC", "Rose pink");
  Color.addToMap("#C21E56", "Rose red");
  Color.addToMap("#905D5D", "Rose taupe");
  Color.addToMap("#AB4E52", "Rose vale");
  Color.addToMap("#65000B", "Rosewood");
  Color.addToMap("#D40000", "Rosso corsa");
  Color.addToMap("#BC8F8F", "Rosy brown");
  Color.addToMap("#0038A8", "Royal azure");
  Color.addToMap("#002366", "Royal blue");
  Color.addToMap("#4169E1", "Royal light blue");
  Color.addToMap("#CA2C92", "Royal fuchsia");
  Color.addToMap("#7851A9", "Royal purple");
  Color.addToMap("#FADA5E", "Royal yellow");
  Color.addToMap("#CE4676", "Ruber");
  Color.addToMap("#D10056", "Rubine red");
  Color.addToMap("#E0115F", "Ruby");
  Color.addToMap("#9B111E", "Ruby red");
  Color.addToMap("#FF0028", "Ruddy");
  Color.addToMap("#BB6528", "Ruddy brown");
  Color.addToMap("#E18E96", "Ruddy pink");
  Color.addToMap("#A81C07", "Rufous");
  Color.addToMap("#80461B", "Russet");
  Color.addToMap("#679267", "Russian green");
  Color.addToMap("#32174D", "Russian violet");
  Color.addToMap("#B7410E", "Rust");
  Color.addToMap("#DA2C43", "Rusty red");
  Color.addToMap("#8B4513", "Saddle brown");
  Color.addToMap("#FF6700", "Safety orange (blaze orange)");
  Color.addToMap("#EED202", "Safety yellow");
  Color.addToMap("#F4C430", "Saffron");
  Color.addToMap("#BCB88A", "Sage");
  Color.addToMap("#23297A", "St. Patrick's blue");
  Color.addToMap("#FA8072", "Salmon");
  Color.addToMap("#FF91A4", "Salmon pink");
  Color.addToMap("#C2B280", "Sand");
  Color.addToMap("#ECD540", "Sandstorm");
  Color.addToMap("#F4A460", "Sandy brown");
  Color.addToMap("#92000A", "Sangria");
  Color.addToMap("#507D2A", "Sap green");
  Color.addToMap("#0F52BA", "Sapphire");
  Color.addToMap("#0067A5", "Sapphire blue");
  Color.addToMap("#CBA135", "Satin sheen gold");
  Color.addToMap("#FF2400", "Scarlet");
  Color.addToMap("#FFD800", "School bus yellow");
  Color.addToMap("#76FF7A", "Screamin' Green");
  Color.addToMap("#006994", "Sea blue");
  Color.addToMap("#2E8B57", "Sea green");
  Color.addToMap("#321414", "Seal brown");
  Color.addToMap("#FFF5EE", "Seashell");
  Color.addToMap("#FFBA00", "Selective yellow");
  Color.addToMap("#704214", "Sepia");
  Color.addToMap("#8A795D", "Shadow");
  Color.addToMap("#778BA5", "Shadow blue");
  Color.addToMap("#FFCFF1", "Shampoo");
  Color.addToMap("#009E60", "Shamrock green");
  Color.addToMap("#8FD400", "Sheen Green");
  Color.addToMap("#D98695", "Shimmering Blush");
  Color.addToMap("#FC0FC0", "Shocking pink");
  Color.addToMap("#882D17", "Sienna");
  Color.addToMap("#C0C0C0", "Silver");
  Color.addToMap("#ACACAC", "Silver chalice");
  Color.addToMap("#5D89BA", "Silver Lake blue");
  Color.addToMap("#C4AEAD", "Silver pink");
  Color.addToMap("#BFC1C2", "Silver sand");
  Color.addToMap("#CB410B", "Sinopia");
  Color.addToMap("#007474", "Skobeloff");
  Color.addToMap("#87CEEB", "Sky blue");
  Color.addToMap("#CF71AF", "Sky magenta");
  Color.addToMap("#6A5ACD", "Slate blue");
  Color.addToMap("#708090", "Slate gray");
  Color.addToMap("#C84186", "Smitten");
  Color.addToMap("#738276", "Smoke");
  Color.addToMap("#933D41", "Smokey topaz");
  Color.addToMap("#100C08", "Smoky black");
  Color.addToMap("#FFFAFA", "Snow");
  Color.addToMap("#CEC8EF", "Soap");
  Color.addToMap("#893843", "Solid pink");
  Color.addToMap("#757575", "Sonic silver");
  Color.addToMap("#9E1316", "Spartan Crimson");
  Color.addToMap("#1D2951", "Space cadet");
  Color.addToMap("#807532", "Spanish bistre");
  Color.addToMap("#0070B8", "Spanish blue");
  Color.addToMap("#D10047", "Spanish carmine");
  Color.addToMap("#E51A4C", "Spanish crimson");
  Color.addToMap("#989898", "Spanish gray");
  Color.addToMap("#009150", "Spanish green");
  Color.addToMap("#E86100", "Spanish orange");
  Color.addToMap("#F7BFBE", "Spanish pink");
  Color.addToMap("#E60026", "Spanish red");
  Color.addToMap("#4C2882", "Spanish violet");
  Color.addToMap("#007F5C", "Spanish viridian");
  Color.addToMap("#0FC0FC", "Spiro Disco Ball");
  Color.addToMap("#A7FC00", "Spring bud");
  Color.addToMap("#00FF7F", "Spring green");
  Color.addToMap("#007BB8", "Star command blue");
  Color.addToMap("#4682B4", "Steel blue");
  Color.addToMap("#CC33CC", "Steel pink");
  Color.addToMap("#4F666A", "Stormcloud");
  Color.addToMap("#E4D96F", "Straw");
  Color.addToMap("#FC5A8D", "Strawberry");
  Color.addToMap("#FFCC33", "Sunglow");
  Color.addToMap("#E3AB57", "Sunray");
  Color.addToMap("#FAD6A5", "Sunset");
  Color.addToMap("#FD5E53", "Sunset orange");
  Color.addToMap("#CF6BA9", "Super pink");
  Color.addToMap("#D2B48C", "Tan");
  Color.addToMap("#F94D00", "Tangelo");
  Color.addToMap("#F28500", "Tangerine");
  Color.addToMap("#FFCC00", "Tangerine yellow");
  Color.addToMap("#483C32", "Dark Grayish Brown");
  Color.addToMap("#8B8589", "Taupe gray");
  Color.addToMap("#D0F0C0", "Tea green");
  Color.addToMap("#F4C2C2", "Tea rose");
  Color.addToMap("#008080", "Teal");
  Color.addToMap("#367588", "Teal blue");
  Color.addToMap("#99E6B3", "Teal deer");
  Color.addToMap("#00827F", "Teal green");
  Color.addToMap("#CF3476", "Telemagenta");
  Color.addToMap("#CD5700", "Tenne");
  Color.addToMap("#E2725B", "Terra cotta");
  Color.addToMap("#D8BFD8", "Thistle");
  Color.addToMap("#DE6FA1", "Thulian pink");
  Color.addToMap("#FC89AC", "Tickle Me Pink");
  Color.addToMap("#0ABAB5", "Tiffany Blue");
  Color.addToMap("#E08D3C", "Tiger's eye");
  Color.addToMap("#DBD7D2", "Timberwolf");
  Color.addToMap("#EEE600", "Titanium yellow");
  Color.addToMap("#FF6347", "Tomato");
  Color.addToMap("#746CC0", "Toolbox");
  Color.addToMap("#42B72A", "Toothpaste advert green");
  Color.addToMap("#FFC87C", "Topaz");
  Color.addToMap("#FD0E35", "Tractor red");
  Color.addToMap("#00755E", "Tropical rain forest");
  Color.addToMap("#0073CF", "True Blue");
  Color.addToMap("#417DC1", "Tufts Blue");
  Color.addToMap("#FF878D", "Tulip");
  Color.addToMap("#DEAA88", "Tumbleweed");
  Color.addToMap("#B57281", "Turkish rose");
  Color.addToMap("#40E0D0", "Turquoise");
  Color.addToMap("#00FFEF", "Turquoise blue");
  Color.addToMap("#A0D6B4", "Turquoise green");
  Color.addToMap("#7C4848", "Tuscan red");
  Color.addToMap("#C09999", "Tuscany");
  Color.addToMap("#8A496B", "Twilight lavender");
  Color.addToMap("#0033AA", "UA blue");
  Color.addToMap("#D9004C", "UA red");
  Color.addToMap("#8878C3", "Ube");
  Color.addToMap("#536895", "UCLA Blue");
  Color.addToMap("#FFB300", "UCLA Gold");
  Color.addToMap("#3CD070", "UFO Green");
  Color.addToMap("#120A8F", "Ultramarine");
  Color.addToMap("#4166F5", "Ultramarine blue");
  Color.addToMap("#FF6FFF", "Ultra pink");
  Color.addToMap("#635147", "Umber");
  Color.addToMap("#FFDDCA", "Unbleached silk");
  Color.addToMap("#5B92E5", "United Nations blue");
  Color.addToMap("#B78727", "University of California Gold");
  Color.addToMap("#FFFF66", "Unmellow yellow");
  Color.addToMap("#7B1113", "UP Maroon");
  Color.addToMap("#AE2029", "Upsdell red");
  Color.addToMap("#E1AD21", "Urobilin");
  Color.addToMap("#004F98", "USAFA blue");
  Color.addToMap("#F77F00", "University of Tennessee Orange");
  Color.addToMap("#D3003F", "Utah Crimson");
  Color.addToMap("#F3E5AB", "Vanilla");
  Color.addToMap("#F38FA9", "Vanilla ice");
  Color.addToMap("#C5B358", "Vegas gold");
  Color.addToMap("#C80815", "Venetian red");
  Color.addToMap("#43B3AE", "Verdigris");
  Color.addToMap("#E34234", "Medium vermilion");
  Color.addToMap("#D9381E", "Vermilion");
  Color.addToMap("#8F00FF", "Violet");
  Color.addToMap("#7F00FF", "Violet (color wheel)");
  Color.addToMap("#8601AF", "Violet (RYB)");
  Color.addToMap("#324AB2", "Violet-blue");
  Color.addToMap("#F75394", "Violet-red");
  Color.addToMap("#40826D", "Viridian");
  Color.addToMap("#009698", "Viridian green");
  Color.addToMap("#922724", "Vivid auburn");
  Color.addToMap("#9F1D35", "Vivid burgundy");
  Color.addToMap("#DA1D81", "Vivid cerise");
  Color.addToMap("#CC00FF", "Vivid orchid");
  Color.addToMap("#00CCFF", "Vivid sky blue");
  Color.addToMap("#FFA089", "Vivid tangerine");
  Color.addToMap("#9F00FF", "Vivid violet");
  Color.addToMap("#004242", "Warm black");
  Color.addToMap("#A4F4F9", "Waterspout");
  Color.addToMap("#645452", "Wenge");
  Color.addToMap("#F5DEB3", "Wheat");
  Color.addToMap("#FFFFFF", "White");
  Color.addToMap("#F5F5F5", "White smoke");
  Color.addToMap("#A2ADD0", "Wild blue yonder");
  Color.addToMap("#D470A2", "Wild orchid");
  Color.addToMap("#FF43A4", "Wild Strawberry");
  Color.addToMap("#FC6C85", "Wild watermelon");
  Color.addToMap("#FD5800", "Willpower orange");
  Color.addToMap("#A75502", "Windsor tan");
  Color.addToMap("#722F37", "Wine");
  Color.addToMap("#C9A0DC", "Wisteria");
  Color.addToMap("#C19A6B", "Wood brown");
  Color.addToMap("#738678", "Xanadu");
  Color.addToMap("#0F4D92", "Yale Blue");
  Color.addToMap("#1C2841", "Yankees blue");
  Color.addToMap("#FCE883", "Yellow (Crayola)");
  Color.addToMap("#EFCC00", "Yellow (Munsell)");
  Color.addToMap("#FEDF00", "Yellow (Pantone)");
  Color.addToMap("#FEFE33", "Yellow");
  Color.addToMap("#9ACD32", "Yellow Green");
  Color.addToMap("#FFAE42", "Yellow Orange");
  Color.addToMap("#FFF000", "Yellow rose");
  Color.addToMap("#0014A8", "Zaffre");
  Color.addToMap("#2C1608", "Zinnwaldite brown");
  Color.addToMap("#39A78E", "Zomp");
});

// client/src/modules/keyboard.ts
var exports_keyboard = {};
__export(exports_keyboard, {
  velocityFromMouseY: () => velocityFromMouseY,
  shouldShowSnowflakes: () => shouldShowSnowflakes,
  setReplyParticipant: () => setReplyParticipant,
  setMessageId: () => setMessageId,
  setKeyBinding: () => setKeyBinding,
  setIsReplying: () => setIsReplying,
  setIsDming: () => setIsDming,
  setDmParticipant: () => setDmParticipant,
  releaseKeyboard: () => releaseKeyboard,
  initKeyboard: () => initKeyboard,
  getTranspose: () => getTranspose,
  getReplyParticipant: () => getReplyParticipant,
  getParticipantTouchhandler: () => getParticipantTouchhandler,
  getMessageId: () => getMessageId,
  getKeyBinding: () => getKeyBinding,
  getIsReplying: () => getIsReplying,
  getIsDming: () => getIsDming,
  getDmParticipant: () => getDmParticipant,
  captureKeyboard: () => captureKeyboard
});
function captureKeyboard() {
  if (!capturingKeyboard) {
    capturingKeyboard = true;
    document.getElementById("piano").removeEventListener("mousedown", recapListener);
    document.getElementById("piano").removeEventListener("touchstart", recapListener);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keypress", handleKeyPress);
  }
}
function releaseKeyboard() {
  if (capturingKeyboard) {
    capturingKeyboard = false;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("keypress", handleKeyPress);
    document.getElementById("piano").addEventListener("mousedown", recapListener);
    document.getElementById("piano").addEventListener("touchstart", recapListener);
  }
}
function initKeyboard() {
  const gClient = getClient();
  const gPiano = getPiano();
  const volume_slider = document.getElementById("volume-slider");
  volume_slider.value = String(gPiano.audio.volume);
  document.getElementById("volume-label").textContent = "Volume: " + Math.floor(gPiano.audio.volume * 100) + "%";
  volume_slider.addEventListener("input", () => {
    const v = +volume_slider.value;
    gPiano.audio.setVolume(v);
    if (window.localStorage)
      localStorage.volume = String(v);
    document.getElementById("volume-label").textContent = "Volume: " + Math.floor(v * 100) + "%";
  });
  const Note = function(note, octave) {
    this.note = note;
    this.octave = octave || 0;
  };
  const n = (a, b) => {
    return { note: new Note(a, b), held: false };
  };
  const layouts = {
    MPP: {
      65: n("gs"),
      90: n("a"),
      83: n("as"),
      88: n("b"),
      67: n("c", 1),
      70: n("cs", 1),
      86: n("d", 1),
      71: n("ds", 1),
      66: n("e", 1),
      78: n("f", 1),
      74: n("fs", 1),
      77: n("g", 1),
      75: n("gs", 1),
      188: n("a", 1),
      76: n("as", 1),
      190: n("b", 1),
      191: n("c", 2),
      222: n("cs", 2),
      49: n("gs", 1),
      81: n("a", 1),
      50: n("as", 1),
      87: n("b", 1),
      69: n("c", 2),
      52: n("cs", 2),
      82: n("d", 2),
      53: n("ds", 2),
      84: n("e", 2),
      89: n("f", 2),
      55: n("fs", 2),
      85: n("g", 2),
      56: n("gs", 2),
      73: n("a", 2),
      57: n("as", 2),
      79: n("b", 2),
      80: n("c", 3),
      189: n("cs", 3),
      173: n("cs", 3),
      219: n("d", 3),
      187: n("ds", 3),
      61: n("ds", 3),
      221: n("e", 3)
    },
    VP: {
      112: n("c", -1),
      113: n("d", -1),
      114: n("e", -1),
      115: n("f", -1),
      116: n("g", -1),
      117: n("a", -1),
      118: n("b", -1),
      49: n("c"),
      50: n("d"),
      51: n("e"),
      52: n("f"),
      53: n("g"),
      54: n("a"),
      55: n("b"),
      56: n("c", 1),
      57: n("d", 1),
      48: n("e", 1),
      81: n("f", 1),
      87: n("g", 1),
      69: n("a", 1),
      82: n("b", 1),
      84: n("c", 2),
      89: n("d", 2),
      85: n("e", 2),
      73: n("f", 2),
      79: n("g", 2),
      80: n("a", 2),
      65: n("b", 2),
      83: n("c", 3),
      68: n("d", 3),
      70: n("e", 3),
      71: n("f", 3),
      72: n("g", 3),
      74: n("a", 3),
      75: n("b", 3),
      76: n("c", 4),
      90: n("d", 4),
      88: n("e", 4),
      67: n("f", 4),
      86: n("g", 4),
      66: n("a", 4),
      78: n("b", 4),
      77: n("c", 5)
    }
  };
  key_binding = settings.virtualPianoLayout ? layouts.VP : layouts.MPP;
  _layouts = layouts;
  const sendTransposeNotif = () => {
    new Notification({
      title: "Transposing",
      html: "Transpose level: " + transpose,
      target: "#midi-btn",
      duration: 1500
    });
  };
  handleKeyDown = (evt) => {
    if (evt.target.type)
      return;
    const code = parseInt(String(evt.keyCode));
    if (key_binding[code] !== undefined) {
      const binding = key_binding[code];
      if (!binding.held) {
        binding.held = true;
        const note = binding.note;
        let octave = 1 + note.octave;
        if (!settings.virtualPianoLayout) {
          if (evt.shiftKey)
            ++octave;
          else if (capsLockKey || evt.ctrlKey)
            --octave;
          else if (evt.altKey)
            octave += 2;
        }
        let noteName = note.note + octave;
        const index = Object.keys(gPiano.keys).indexOf(noteName);
        if (settings.virtualPianoLayout && evt.shiftKey) {
          noteName = Object.keys(gPiano.keys)[index + transpose + 1];
        } else {
          noteName = Object.keys(gPiano.keys)[index + transpose];
        }
        if (noteName === undefined)
          return;
        const vol = velocityFromMouseY();
        press(noteName, vol);
      }
      if (++gKeyboardSeq == 3) {
        if (window.gKnowsYouCanUseKeyboardTimeout)
          clearTimeout(window.gKnowsYouCanUseKeyboardTimeout);
        if (localStorage)
          localStorage.knowsYouCanUseKeyboard = "true";
        if (window.gKnowsYouCanUseKeyboardNotification)
          window.gKnowsYouCanUseKeyboardNotification.close();
      }
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
      return false;
    } else if (code == 20) {
      capsLockKey = true;
      if (!settings.noPreventDefault)
        evt.preventDefault();
    } else if (code === 32) {
      pressSustain();
      if (!settings.noPreventDefault)
        evt.preventDefault();
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
      if (!settings.noPreventDefault)
        evt.preventDefault();
    } else if (code == 8) {
      setAutoSustain(!getAutoSustain());
      if (!settings.noPreventDefault)
        evt.preventDefault();
    }
  };
  handleKeyUp = (evt) => {
    if (evt.target.type)
      return;
    const code = parseInt(String(evt.keyCode));
    if (key_binding[code] !== undefined) {
      const binding = key_binding[code];
      if (binding.held) {
        binding.held = false;
        const note = binding.note;
        let octave = 1 + note.octave;
        if (!settings.virtualPianoLayout) {
          if (evt.shiftKey)
            ++octave;
          else if (capsLockKey || evt.ctrlKey)
            --octave;
          else if (evt.altKey)
            octave += 2;
        }
        let noteName = note.note + octave;
        const index = Object.keys(gPiano.keys).indexOf(noteName);
        if (settings.virtualPianoLayout && evt.shiftKey) {
          noteName = Object.keys(gPiano.keys)[index + transpose + 1];
        } else {
          noteName = Object.keys(gPiano.keys)[index + transpose];
        }
        if (noteName === undefined)
          return;
        release(noteName);
      }
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
      return false;
    } else if (code == 20) {
      capsLockKey = false;
      if (!settings.noPreventDefault)
        evt.preventDefault();
    } else if (code === 32) {
      releaseSustain();
      if (!settings.noPreventDefault)
        evt.preventDefault();
    }
  };
  handleKeyPress = (evt) => {
    if (evt.target.type)
      return;
    if (!settings.noPreventDefault)
      evt.preventDefault();
    evt.stopPropagation();
    if (evt.keyCode == 27 || evt.keyCode == 13) {}
    return false;
  };
  captureKeyboard();
  const gNoteQuota = (() => {
    let last_rat = 0;
    const nqjq = document.querySelector("#quota .value");
    setInterval(() => {
      gNoteQuota.tick();
    }, 2000);
    return new NoteQuota((points) => {
      if (state.noteQuota) {
        const rat = points / state.noteQuota.max * 100;
        if (rat <= last_rat) {
          nqjq.style.transition = "none";
          nqjq.style.width = rat.toFixed(0) + "%";
        } else {
          nqjq.style.transition = "width 2s linear";
          nqjq.style.width = rat.toFixed(0) + "%";
        }
        last_rat = rat;
      }
    });
  })();
  state.noteQuota = gNoteQuota;
  gClient.on("nq", (nq_params) => {
    gNoteQuota.setParams(nq_params);
  });
  gClient.on("disconnect", () => {
    gNoteQuota.setParams(NoteQuota.PARAMS_OFFLINE);
  });
  let gKnowsHowToDm = localStorage.knowsHowToDm === "true";
  gClient.on("participant removed", (part) => {
    if (gIsDming && gDmParticipant && part._id === gDmParticipant._id) {
      state.chat.endDM();
      if (!settings.cancelDMs) {
        new Notification({
          title: "DM Cancelled",
          html: settings.hasSeenDMWarning ? `Your message is still in the chat input field, but will send as a public message.<br/>
          You can disable this in Client Settings.` : `Your message is still in the chatbox, but it will send as a public message.<br/>
          You can disable this in Client Settings.<br/>
          Enabling "Cancel DMs when recipient leaves" will clear your message from the text input<br/>
          and unfocus the textbox when the person you're typing to leaves the channel.`,
          target: "#room",
          duration: 20000,
          class: "top"
        });
        if (!localStorage.hasSeenDMWarning)
          settings.hasSeenDMWarning = true;
        localStorage.hasSeenDMWarning = "true";
        document.getElementById("chat-input").blur();
      }
      if (settings.cancelDMs) {
        state.chat.blur();
        document.querySelector("#chat input").value = "";
        new Notification({
          title: "DM Cancelled",
          text: `${part.name} left the room.`,
          target: "#room",
          duration: 1e4
        });
      }
    }
  });
  const removeParticipantMenus = () => {
    document.querySelectorAll(".participant-menu").forEach((el) => el.remove());
    document.querySelectorAll(".participantSpotlight").forEach((el) => el.style.display = "none");
    document.removeEventListener("mousedown", removeParticipantMenus);
    document.removeEventListener("touchstart", removeParticipantMenus);
  };
  const participantMenu = (part) => {
    if (!part)
      return;
    removeParticipantMenus();
    document.addEventListener("mousedown", removeParticipantMenus);
    document.addEventListener("touchstart", removeParticipantMenus);
    const spotlight = document.getElementById(part.id)?.querySelector(".enemySpotlight");
    if (spotlight)
      spotlight.style.display = "block";
    const menu = document.createElement("div");
    menu.className = "participant-menu";
    document.body.appendChild(menu);
    const pos = part.nameDiv.getBoundingClientRect();
    Object.assign(menu.style, {
      top: pos.top + part.nameDiv.offsetHeight + 15 + "px",
      left: pos.left + 6 + "px",
      background: part.color || "black"
    });
    const menuClickHandler = (evt) => {
      evt.stopPropagation();
      const target = evt.target;
      if (target.classList.contains("menu-item")) {
        target.classList.add("clicked");
        fadeOut(menu, 200, () => {
          removeParticipantMenus();
        });
      }
    };
    menu.addEventListener("mousedown", menuClickHandler);
    menu.addEventListener("touchstart", menuClickHandler);
    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    infoDiv.textContent = part._id;
    const infoHandler = (evt) => {
      navigator.clipboard.writeText(part._id);
      evt.target.innerText = "Copied!";
      setTimeout(() => {
        evt.target.innerText = part._id;
      }, 2500);
    };
    infoDiv.addEventListener("mousedown", infoHandler);
    infoDiv.addEventListener("touchstart", infoHandler);
    menu.appendChild(infoDiv);
    const createMenuItem = (label, handler) => {
      const item = document.createElement("div");
      item.className = "menu-item";
      item.innerHTML = label;
      item.addEventListener("mousedown", handler);
      item.addEventListener("touchstart", handler);
      menu.appendChild(item);
    };
    if (settings.pianoMutes.indexOf(part._id) == -1) {
      createMenuItem(window.i18nextify.i18next.t("Mute Notes"), () => {
        settings.pianoMutes.push(part._id);
        if (localStorage)
          localStorage.pianoMutes = settings.pianoMutes.join(",");
        part.nameDiv?.classList.add("muted-notes");
      });
    } else {
      createMenuItem(window.i18nextify.i18next.t("Unmute Notes"), () => {
        let i;
        while ((i = settings.pianoMutes.indexOf(part._id)) != -1)
          settings.pianoMutes.splice(i, 1);
        if (localStorage)
          localStorage.pianoMutes = settings.pianoMutes.join(",");
        part.nameDiv?.classList.remove("muted-notes");
      });
    }
    if (settings.chatMutes.indexOf(part._id) == -1) {
      createMenuItem(window.i18nextify.i18next.t("Mute Chat"), () => {
        settings.chatMutes.push(part._id);
        if (localStorage)
          localStorage.chatMutes = settings.chatMutes.join(",");
        part.nameDiv?.classList.add("muted-chat");
      });
    } else {
      createMenuItem(window.i18nextify.i18next.t("Unmute Chat"), () => {
        let i;
        while ((i = settings.chatMutes.indexOf(part._id)) != -1)
          settings.chatMutes.splice(i, 1);
        if (localStorage)
          localStorage.chatMutes = settings.chatMutes.join(",");
        part.nameDiv?.classList.remove("muted-chat");
      });
    }
    if (!(settings.pianoMutes.indexOf(part._id) >= 0) || !(settings.chatMutes.indexOf(part._id) >= 0)) {
      createMenuItem(window.i18nextify.i18next.t("Mute Completely"), () => {
        settings.pianoMutes.push(part._id);
        if (localStorage)
          localStorage.pianoMutes = settings.pianoMutes.join(",");
        settings.chatMutes.push(part._id);
        if (localStorage)
          localStorage.chatMutes = settings.chatMutes.join(",");
        part.nameDiv?.classList.add("muted-notes");
        part.nameDiv?.classList.add("muted-chat");
      });
    }
    if (settings.pianoMutes.indexOf(part._id) >= 0 || settings.chatMutes.indexOf(part._id) >= 0) {
      createMenuItem(window.i18nextify.i18next.t("Unmute Completely"), () => {
        let i;
        while ((i = settings.pianoMutes.indexOf(part._id)) != -1)
          settings.pianoMutes.splice(i, 1);
        while ((i = settings.chatMutes.indexOf(part._id)) != -1)
          settings.chatMutes.splice(i, 1);
        if (localStorage)
          localStorage.pianoMutes = settings.pianoMutes.join(",");
        if (localStorage)
          localStorage.chatMutes = settings.chatMutes.join(",");
        part.nameDiv?.classList.remove("muted-notes");
        part.nameDiv?.classList.remove("muted-chat");
      });
    }
    if (gIsDming && gDmParticipant && gDmParticipant._id === part._id) {
      createMenuItem(window.i18nextify.i18next.t("End Direct Message"), () => {
        state.chat.endDM();
      });
    } else {
      createMenuItem(window.i18nextify.i18next.t("Direct Message"), () => {
        if (!gKnowsHowToDm) {
          localStorage.knowsHowToDm = "true";
          gKnowsHowToDm = true;
          new Notification({
            target: "#piano",
            duration: 20000,
            title: window.i18nextify.i18next.t("How to DM"),
            text: window.i18nextify.i18next.t("After you click the button to direct message someone, future chat messages will be sent to them instead of to everyone. To go back to talking in public chat, send a blank chat message, or click the button again.")
          });
        }
        state.chat.startDM(part);
      });
    }
    if (settings.cursorHides.indexOf(part._id) == -1) {
      createMenuItem(window.i18nextify.i18next.t("Hide Cursor"), () => {
        settings.cursorHides.push(part._id);
        if (localStorage)
          localStorage.cursorHides = settings.cursorHides.join(",");
        if (part.cursorDiv)
          part.cursorDiv.style.display = "none";
      });
    } else {
      createMenuItem(window.i18nextify.i18next.t("Show Cursor"), () => {
        let i;
        while ((i = settings.cursorHides.indexOf(part._id)) != -1)
          settings.cursorHides.splice(i, 1);
        if (localStorage)
          localStorage.cursorHides = settings.cursorHides.join(",");
        if (part.cursorDiv)
          part.cursorDiv.style.display = "block";
      });
    }
    createMenuItem(window.i18nextify.i18next.t("Mention"), () => {
      document.getElementById("chat-input").value += "@" + part.id + " ";
      setTimeout(() => {
        document.getElementById("chat-input").focus();
      }, 1);
    });
    if (gClient.isOwner() || gClient.permissions.chownAnywhere) {
      if (!gClient.channel.settings.lobby) {
        createMenuItem(window.i18nextify.i18next.t("Give Crown"), () => {
          if (confirm("Give room ownership to " + part.name + "?"))
            gClient.sendArray([{ m: "chown", id: part.id }]);
        });
      }
      createMenuItem(window.i18nextify.i18next.t("Kickban"), () => {
        const minutes = prompt("How many minutes? (0-300)", "30");
        if (minutes === null)
          return;
        const ms = (parseFloat(minutes) || 0) * 60 * 1000;
        gClient.sendArray([{ m: "kickban", _id: part._id, ms }]);
      });
    }
    if (gClient.permissions.siteBan) {
      createMenuItem(window.i18nextify.i18next.t("Site Ban"), () => {
        openModal("#siteban");
        setTimeout(() => {
          document.querySelector("#siteban input[name=id]").value = part._id;
          document.querySelector("#siteban input[name=reasonText]").value = "Discrimination against others";
          document.querySelector("#siteban input[name=reasonText]").setAttribute("disabled", "true");
          document.querySelector("#siteban select[name=reasonSelect]").value = "Discrimination against others";
          document.querySelector("#siteban input[name=durationNumber]").value = "5";
          document.querySelector("#siteban input[name=durationNumber]").removeAttribute("disabled");
          document.querySelector("#siteban select[name=durationUnit]").value = "hours";
          document.querySelector("#siteban textarea[name=note]").value = "";
          document.querySelector("#siteban p[name=errorText]").textContent = "";
          if (gClient.permissions.siteBanAnyReason) {
            document.querySelector("#siteban select[name=reasonSelect] option[value=custom]").removeAttribute("disabled");
          } else {
            document.querySelector("#siteban select[name=reasonSelect] option[value=custom]").setAttribute("disabled", "true");
          }
        }, 100);
      });
    }
    if (gClient.permissions.usersetOthers) {
      createMenuItem(window.i18nextify.i18next.t("Set Color"), () => {
        const color = prompt("What color?", part.color);
        if (color === null)
          return;
        gClient.sendArray([{ m: "setcolor", _id: part._id, color }]);
      });
    }
    if (gClient.permissions.usersetOthers) {
      createMenuItem(window.i18nextify.i18next.t("Set Name"), () => {
        const name = prompt("What name?", part.name);
        if (name === null)
          return;
        gClient.sendArray([{ m: "setname", _id: part._id, name }]);
      });
    }
    fadeIn(menu, 100);
  };
  participantTouchhandler = (e, ele) => {
    const target = ele;
    if (!target)
      return;
    if (target.classList.contains("name")) {
      target.classList.add("play");
      const id = target.participantId;
      if (id == gClient.participantId) {
        openModal("#rename", "input[name=name]");
        setTimeout(() => {
          document.querySelector("#rename input[name=name]").value = gClient.ppl[gClient.participantId].name;
          document.querySelector("#rename input[name=color]").value = gClient.ppl[gClient.participantId].color;
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
    document.querySelectorAll("#names .name").forEach((el) => el.classList.remove("play"));
  };
  document.body.addEventListener("mouseup", releasehandler);
  document.body.addEventListener("touchend", releasehandler);
  shouldShowSnowflakes();
  (() => {
    const setColor = (hex, hex2) => {
      const color1 = new Color(hex);
      const color2 = new Color(hex2 || hex);
      if (!hex2)
        color2.add(-64, -64, -64);
      const bottom = document.getElementById("bottom");
      document.body.style.setProperty("--color", color1.toHexa());
      document.body.style.setProperty("--color2", color2.toHexa());
      bottom.style.setProperty("--color", color1.toHexa());
      bottom.style.setProperty("--color2", color2.toHexa());
    };
    const setColorToDefault = () => {
      setColor("#220022", "#000022");
    };
    window.setBackgroundColor = setColor;
    window.setBackgroundColorToDefault = setColorToDefault;
    setColorToDefault();
    gClient.on("ch", (ch) => {
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
  if (settings.hidePianoLocal) {
    document.getElementById("piano").style.display = "none";
  } else {
    document.getElementById("piano").style.display = "block";
  }
  if (settings.hideChatLocal) {
    document.getElementById("chat").style.display = "none";
  } else {
    document.getElementById("chat").style.display = "block";
  }
  if (settings.smoothCursor) {
    document.getElementById("cursors").setAttribute("smooth-cursors", "");
  } else {
    document.getElementById("cursors").removeAttribute("smooth-cursors");
  }
}
function shouldShowSnowflakes() {
  const snowflakes = document.querySelector(".snowflakes");
  if (snowflakes) {
    snowflakes.style.visibility = settings.snowflakes ? "visible" : "hidden";
  }
}
var gKeyboardSeq = 0, transpose = 0, key_binding, capturingKeyboard = false, capsLockKey = false, gDmParticipant = null, gIsDming = false, gReplyParticipant = null, gIsReplying = false, gMessageId = null, getIsDming = () => gIsDming, setIsDming = (v) => {
  gIsDming = v;
}, getDmParticipant = () => gDmParticipant, setDmParticipant = (v) => {
  gDmParticipant = v;
}, getIsReplying = () => gIsReplying, setIsReplying = (v) => {
  gIsReplying = v;
}, getReplyParticipant = () => gReplyParticipant, setReplyParticipant = (v) => {
  gReplyParticipant = v;
}, getMessageId = () => gMessageId, setMessageId = (v) => {
  gMessageId = v;
}, getTranspose = () => transpose, getKeyBinding = () => key_binding, _layouts = null, setKeyBinding = (useVP) => {
  if (_layouts)
    key_binding = useVP ? _layouts.VP : _layouts.MPP;
}, handleKeyDown, handleKeyUp, handleKeyPress, recapListener = () => {
  captureKeyboard();
}, velocityFromMouseY = () => {
  return 0.1 + state.mouseY / 100 * 0.6;
}, participantTouchhandler, getParticipantTouchhandler = () => participantTouchhandler;
var init_keyboard = __esm(() => {
  init_state();
  init_settings();
  init_actions();
  init_NoteQuota();
  init_Color();
  init_Notification();
  init_modal();
  init_util();
});

// client/src/util/modal.ts
var exports_modal = {};
__export(exports_modal, {
  openModal: () => openModal,
  modalHandleEsc: () => modalHandleEsc,
  getModal: () => getModal,
  closeModal: () => closeModal2
});
function getModal() {
  return gModal;
}
function modalHandleEsc(evt) {
  if (evt.keyCode === 27 || (evt.keyCode === 32 || evt.keyCode === 13) && document.activeElement && document.activeElement.type !== "text" && gModal !== "#age" && gModal !== "#siteban") {
    closeModal2();
    if (!settings.noPreventDefault)
      evt.preventDefault();
    evt.stopPropagation();
  }
}
function openModal(selector, focus) {
  if (state.chat)
    state.chat.blur();
  const { releaseKeyboard: releaseKeyboard2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
  releaseKeyboard2();
  console.log("opening modal, selector: " + selector + " focus: " + focus);
  document.addEventListener("keydown", modalHandleEsc);
  const modals = document.querySelector("#modal #modals");
  if (modals) {
    Array.from(modals.children).forEach((child) => child.style.display = "none");
  }
  const modal = document.getElementById("modal");
  fadeIn(modal, 250);
  console.log(modal, selector);
  const target = document.querySelector(selector);
  if (target)
    target.style.display = "block";
  if (focus) {
    setTimeout(() => {
      const focusEl = target?.querySelector(focus);
      if (focusEl)
        focusEl.focus();
    }, 100);
  }
  gModal = selector;
}
function closeModal2() {
  if (gModal === "#age")
    return;
  document.removeEventListener("keydown", modalHandleEsc);
  const modal = document.getElementById("modal");
  fadeOut(modal, 100);
  const modals = document.querySelector("#modal #modals");
  if (modals) {
    Array.from(modals.children).forEach((child) => child.style.display = "none");
  }
  const { captureKeyboard: captureKeyboard2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
  captureKeyboard2();
  gModal = null;
}
var gModal = null;
var init_modal = __esm(() => {
  init_settings();
  init_state();
  init_util();
});

// client/src/modules/connection.ts
var exports_connection = {};
__export(exports_connection, {
  shouldHideUser: () => shouldHideUser,
  setYoureReplied: () => setYoureReplied,
  setYoureMentioned: () => setYoureMentioned,
  setTabIsActive: () => setTabIsActive,
  initConnection: () => initConnection,
  getYoureReplied: () => getYoureReplied,
  getYoureMentioned: () => getYoureMentioned,
  getTabIsActive: () => getTabIsActive
});
function getTabIsActive() {
  return tabIsActive;
}
function setTabIsActive(v) {
  tabIsActive = v;
}
function getYoureMentioned() {
  return youreMentioned;
}
function setYoureMentioned(v) {
  youreMentioned = v;
}
function getYoureReplied() {
  return youreReplied;
}
function setYoureReplied(v) {
  youreReplied = v;
}
function shouldHideUser(user) {
  if (settings.hideBotUsers) {
    if (user) {
      if (user.tag && user.tag.text === "BOT")
        return true;
      else
        return false;
    }
  }
  return false;
}
function initConnection() {
  let channel_id = getRoomNameFromURL();
  let loginInfo;
  if (getParameterByName("callback") === "discord") {
    const code = getParameterByName("code");
    if (code) {
      loginInfo = {
        type: "discord",
        code
      };
    }
    history.pushState({ name: "lobby" }, "Piano > lobby", "/");
    channel_id = "lobby";
  }
  let gClient;
  if (window.location.hostname === "localhost") {
    gClient = new Client("ws://localhost:8443");
  } else {
    gClient = new Client("wss://backend.multiplayerpiano.net");
  }
  if (loginInfo) {
    gClient.setLoginInfo(loginInfo);
  }
  gClient.setChannel(channel_id);
  gClient.on("disconnect", (evt) => {});
  window.addEventListener("focus", () => {
    tabIsActive = true;
    youreMentioned = false;
    youreReplied = false;
    const count = Object.keys(gClient.ppl).length;
    if (count > 0) {
      document.title = "Piano (" + count + ")";
    } else {
      document.title = "Multiplayer Piano";
    }
  });
  window.addEventListener("blur", () => {
    tabIsActive = false;
  });
  gClient.on("status", (status) => {
    const statusEl = document.getElementById("status");
    statusEl.textContent = status;
  });
  gClient.on("count", (count) => {
    if (count > 0) {
      const statusEl = document.getElementById("status");
      statusEl.innerHTML = '<span class="number" translated>' + count + "</span> " + window.i18nextify.i18next.t("people are playing", { count });
      if (!tabIsActive) {
        if (youreMentioned || youreReplied) {
          return;
        }
      }
      document.title = "Piano (" + count + ")";
    } else {
      document.title = "Multiplayer Piano";
    }
  });
  let receivedHi = false;
  gClient.on("hi", (msg) => {
    if (receivedHi)
      return;
    receivedHi = true;
    if (!msg.motd)
      msg.motd = "This site makes a lot of sound! You may want to adjust the volume before continuing.";
    document.getElementById("motd-text").innerHTML = msg.motd;
    openModal("#motd");
    document.addEventListener("keydown", modalHandleEsc);
    const user_interact = (evt) => {
      if ((evt.path || evt.composedPath && evt.composedPath()).includes(document.getElementById("motd")) || evt.target === document.getElementById("motd")) {
        closeModal2();
      }
      document.removeEventListener("click", user_interact);
      getPiano().audio.resume();
    };
    document.addEventListener("click", user_interact);
    if (gClient.permissions.clearChat) {
      document.getElementById("clearchat-btn").style.display = "block";
    }
    if (gClient.permissions.vanish) {
      document.getElementById("vanish-btn").style.display = "block";
    } else {
      document.getElementById("vanish-btn").style.display = "none";
    }
  });
  function tagColor(tag) {
    if (typeof tag === "object")
      return tag.color;
    if (tag === "BOT")
      return "#55f";
    if (tag === "OWNER")
      return "#a00";
    if (tag === "ADMIN")
      return "#f55";
    if (tag === "MOD")
      return "#0a0";
    if (tag === "MEDIA")
      return "#f5f";
    return "#777";
  }
  function updateLabels(part) {
    if (part.id === gClient.participantId) {
      part.nameDiv.classList.add("me");
    } else {
      part.nameDiv.classList.remove("me");
    }
    if (gClient.channel.crown && gClient.channel.crown.participantId === part.id) {
      part.nameDiv.classList.add("owner");
      part.cursorDiv?.classList.add("owner");
    } else {
      part.nameDiv.classList.remove("owner");
      part.cursorDiv?.classList.remove("owner");
    }
    if (settings.pianoMutes.indexOf(part._id) !== -1) {
      part.nameDiv.classList.add("muted-notes");
    } else {
      part.nameDiv.classList.remove("muted-notes");
    }
    if (settings.chatMutes.indexOf(part._id) !== -1) {
      part.nameDiv.classList.add("muted-chat");
    } else {
      part.nameDiv.classList.remove("muted-chat");
    }
  }
  function setupParticipantDivs(part) {
    const hadNameDiv = Boolean(part.nameDiv);
    let nameDiv;
    if (hadNameDiv) {
      nameDiv = part.nameDiv;
      nameDiv.innerHTML = "";
    } else {
      nameDiv = document.createElement("div");
      nameDiv.addEventListener("mousedown", (e) => {
        const { getParticipantTouchhandler: getParticipantTouchhandler2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
        getParticipantTouchhandler2()(e, nameDiv);
      });
      nameDiv.addEventListener("touchstart", (e) => {
        const { getParticipantTouchhandler: getParticipantTouchhandler2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
        getParticipantTouchhandler2()(e, nameDiv);
      });
      nameDiv.style.display = "none";
      fadeIn(nameDiv, 2000);
      nameDiv.id = "namediv-" + part._id;
      nameDiv.className = "name";
      nameDiv.participantId = part.id;
      document.getElementById("names").appendChild(nameDiv);
      part.nameDiv = nameDiv;
    }
    nameDiv.style.backgroundColor = part.color || "#777";
    const tagText = typeof part.tag === "object" ? part.tag.text : part.tag;
    if (tagText === "BOT")
      nameDiv.title = "This is an authorized bot.";
    if (tagText === "MOD")
      nameDiv.title = "This user is an official moderator of the site.";
    if (tagText === "ADMIN")
      nameDiv.title = "This user is an official administrator of the site.";
    if (tagText === "OWNER")
      nameDiv.title = "This user is the owner of the site.";
    if (tagText === "MEDIA")
      nameDiv.title = "This is a well known person on Twitch, Youtube, or another platform.";
    if (tagText === "DEV")
      nameDiv.title = "This user has contributed considerable code to the site.";
    updateLabels(part);
    let hasOtherDiv = false;
    if (part.vanished) {
      hasOtherDiv = true;
      const vanishDiv = document.createElement("div");
      vanishDiv.className = "nametag";
      vanishDiv.textContent = "VANISH";
      vanishDiv.style.backgroundColor = "#00ffcc";
      vanishDiv.id = "namevanish-" + part._id;
      part.nameDiv.appendChild(vanishDiv);
    }
    if (part.tag) {
      hasOtherDiv = true;
      const tagDiv = document.createElement("div");
      tagDiv.className = "nametag";
      tagDiv.textContent = tagText || "";
      tagDiv.style.backgroundColor = tagColor(part.tag);
      tagDiv.id = "nametag-" + part._id;
      part.nameDiv.appendChild(tagDiv);
    }
    if (part.afk) {
      const afkDiv = document.createElement("div");
      afkDiv.className = "nametag";
      afkDiv.textContent = "AFK";
      afkDiv.style.backgroundColor = "#00000040";
      afkDiv.style["margin-left"] = "5px";
      afkDiv.style["margin-right"] = "0px";
      afkDiv.style.float = "right";
      afkDiv.id = "afktag-" + part._id;
      part.nameDiv.appendChild(afkDiv);
    }
    const textDiv = document.createElement("div");
    textDiv.className = "nametext";
    textDiv.textContent = part.name || "";
    textDiv.id = "nametext-" + part._id;
    if (hasOtherDiv)
      textDiv.style.float = "left";
    part.nameDiv.appendChild(textDiv);
    part.nameDiv.setAttribute("translated", "");
    const namesContainer = document.getElementById("names");
    const arr = Array.from(namesContainer.querySelectorAll(".name"));
    arr.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
    arr.forEach((el) => namesContainer.appendChild(el));
  }
  gClient.on("participant added", (part) => {
    if (shouldHideUser(part))
      return;
    part.displayX = 150;
    part.displayY = 50;
    setupParticipantDivs(part);
    if ((gClient.participantId !== part.id || settings.seeOwnCursor) && !settings.cursorHides.includes(part.id)) {
      const div = document.createElement("div");
      div.className = "cursor";
      div.style.display = "none";
      part.cursorDiv = document.getElementById("cursors").appendChild(div);
      fadeIn(part.cursorDiv, 2000);
      const nameDiv = document.createElement("div");
      nameDiv.className = "name";
      nameDiv.style.backgroundColor = part.color || "#777";
      const tagText = typeof part.tag === "object" ? part.tag.text : part.tag;
      if (part.tag) {
        const tagDiv = document.createElement("span");
        tagDiv.className = "curtag";
        tagDiv.textContent = tagText || "";
        tagDiv.style.backgroundColor = tagColor(part.tag);
        tagDiv.id = "nametag-" + part._id;
        nameDiv.appendChild(tagDiv);
      }
      const namep = document.createElement("span");
      namep.className = "nametext";
      namep.textContent = part.name || "";
      nameDiv.setAttribute("translated", "");
      nameDiv.appendChild(namep);
      part.cursorDiv.appendChild(nameDiv);
    } else {
      part.cursorDiv = undefined;
    }
  });
  gClient.on("participant removed", (part) => {
    if (shouldHideUser(part))
      return;
    fadeOut(part.cursorDiv, 2000);
    fadeOut(part.nameDiv, 2000, () => {
      part.nameDiv?.remove();
      part.cursorDiv?.remove();
      part.nameDiv = undefined;
      part.cursorDiv = undefined;
    });
  });
  gClient.on("participant update", (part) => {
    if (shouldHideUser(part))
      return;
    const name = part.name || "";
    const color = part.color || "#777";
    setupParticipantDivs(part);
    const cursorNameText = part.cursorDiv?.querySelector(".name .nametext");
    if (cursorNameText)
      cursorNameText.textContent = name;
    const cursorName = part.cursorDiv?.querySelector(".name");
    if (cursorName)
      cursorName.style.backgroundColor = color;
    if (part.tag != null) {
      const tagSpan = part.cursorDiv?.querySelector(".name .curtag");
      if (tagSpan) {
        tagSpan.textContent = part.tag.text;
        tagSpan.style.backgroundColor = part.tag.color;
      }
    }
  });
  gClient.on("ch", (msg) => {
    for (const id in gClient.ppl) {
      if (gClient.ppl.hasOwnProperty(id)) {
        const part = gClient.ppl[id];
        updateLabels(part);
      }
    }
  });
  gClient.on("participant added", (part) => {
    if (shouldHideUser(part))
      return;
    updateLabels(part);
  });
  function updateCursor(msg) {
    if (settings.hideAllCursors)
      return;
    const part = gClient.ppl[msg.id];
    if (shouldHideUser(part))
      return;
    if (part && part.cursorDiv) {
      if (settings.smoothCursor) {
        part.cursorDiv.style.transform = "translate3d(" + msg.x + "vw, " + msg.y + "vh, 0)";
      } else {
        part.cursorDiv.style.left = msg.x + "%";
        part.cursorDiv.style.top = msg.y + "%";
      }
    }
  }
  gClient.on("m", updateCursor);
  gClient.on("participant added", updateCursor);
  const crownEl = document.createElement("div");
  crownEl.id = "crown";
  crownEl.style.display = "none";
  document.body.appendChild(crownEl);
  const countdownEl = document.createElement("span");
  crownEl.appendChild(countdownEl);
  let countdown_interval;
  crownEl.addEventListener("click", () => {
    gClient.sendArray([{ m: "chown", id: gClient.participantId }]);
  });
  gClient.on("ch", (msg) => {
    if (msg.ch.crown) {
      const crown = msg.ch.crown;
      if (!crown.participantId || !gClient.ppl[crown.participantId]) {
        const land_time = crown.time + 2000 - gClient.serverTimeOffset;
        const avail_time = crown.time + 15000 - gClient.serverTimeOffset;
        countdownEl.textContent = "";
        crownEl.style.display = "block";
        if (land_time - Date.now() <= 0) {
          crownEl.style.left = crown.endPos.x + "%";
          crownEl.style.top = crown.endPos.y + "%";
        } else {
          crownEl.style.left = crown.startPos.x + "%";
          crownEl.style.top = crown.startPos.y + "%";
          crownEl.classList.add("spin");
          const anim = crownEl.animate([
            { left: crown.startPos.x + "%", top: crown.startPos.y + "%" },
            { left: crown.endPos.x + "%", top: crown.endPos.y + "%" }
          ], { duration: 2000, easing: "linear", fill: "forwards" });
          anim.onfinish = () => {
            crownEl.style.left = crown.endPos.x + "%";
            crownEl.style.top = crown.endPos.y + "%";
            crownEl.classList.remove("spin");
          };
        }
        clearInterval(countdown_interval);
        countdown_interval = setInterval(() => {
          const time = Date.now();
          if (time >= land_time) {
            const ms = avail_time - time;
            if (ms > 0) {
              countdownEl.textContent = Math.ceil(ms / 1000) + "s";
            } else {
              countdownEl.textContent = "";
              clearInterval(countdown_interval);
            }
          }
        }, 1000);
      } else {
        crownEl.style.display = "none";
      }
    } else {
      crownEl.style.display = "none";
    }
  });
  gClient.on("disconnect", () => {
    fadeOut(crownEl, 2000);
  });
  gClient.on("n", (msg) => {
    const gPiano = getPiano();
    const t = msg.t - gClient.serverTimeOffset + TIMING_TARGET - Date.now();
    const participant = gClient.findParticipantById(msg.p);
    if (settings.pianoMutes.indexOf(participant._id) !== -1)
      return;
    if (gClient.findParticipantById(msg.p).tag) {
      if (settings.hideBotUsers === true && gClient.findParticipantById(msg.p).tag.text === "BOT")
        return;
    }
    for (let i = 0;i < msg.n.length; i++) {
      const note = msg.n[i];
      let ms = t + (note.d || 0);
      if (ms < 0) {
        ms = 0;
      } else if (ms > 1e4)
        continue;
      if (note.s) {
        gPiano.stop(note.n, participant, ms);
      } else {
        let vel = typeof note.v !== "undefined" ? parseFloat(note.v) : DEFAULT_VELOCITY;
        if (!vel)
          vel = 0;
        else if (vel < 0)
          vel = 0;
        else if (vel > 1)
          vel = 1;
        gPiano.play(note.n, vel, participant, ms);
        if (state.enableSynth) {
          gPiano.stop(note.n, participant, ms + 1000);
        }
      }
    }
  });
  let mx = 0;
  let last_mx = -10;
  last_my = -10;
  setInterval(() => {
    if (Math.abs(mx - last_mx) > 0.1 || Math.abs(state.mouseY - last_my) > 0.1) {
      last_mx = mx;
      last_my = state.mouseY;
      gClient.sendArray([{ m: "m", x: mx, y: state.mouseY }]);
      if (settings.seeOwnCursor) {
        gClient.emit("m", {
          m: "m",
          id: gClient.participantId,
          x: mx,
          y: state.mouseY
        });
      }
      const part = gClient.getOwnParticipant();
      if (part) {
        part.x = mx;
        part.y = state.mouseY;
      }
    }
  }, 50);
  document.addEventListener("mousemove", (event) => {
    mx = +(event.pageX / window.innerWidth * 100).toFixed(2);
    state.mouseY = +(event.pageY / window.innerHeight * 100).toFixed(2);
  });
  gClient.on("ch", (msg) => {
    const roomSettingsBtn = document.getElementById("room-settings-btn");
    const getcrownBtn = document.getElementById("getcrown-btn");
    if (gClient.isOwner() || gClient.permissions.chsetAnywhere) {
      roomSettingsBtn.style.display = "block";
    } else {
      roomSettingsBtn.style.display = "none";
    }
    if (!gClient.channel.settings.lobby && (gClient.permissions.chownAnywhere || gClient.channel.settings.owner_id === gClient.user._id)) {
      getcrownBtn.style.display = "block";
    } else {
      getcrownBtn.style.display = "none";
    }
  });
  document.getElementById("room-settings-btn").addEventListener("click", (evt) => {
    if (gClient.channel && (gClient.isOwner() || gClient.permissions.chsetAnywhere)) {
      const roomSettings = gClient.channel.settings;
      openModal("#room-settings");
      setTimeout(() => {
        const modal = document.getElementById("room-settings");
        modal.querySelector(".checkbox[name=visible]").checked = roomSettings.visible;
        modal.querySelector(".checkbox[name=chat]").checked = roomSettings.chat;
        modal.querySelector(".checkbox[name=crownsolo]").checked = roomSettings.crownsolo;
        modal.querySelector(".checkbox[name=nocussing]").checked = roomSettings["no cussing"];
        modal.querySelector("input[name=color]").value = roomSettings.color;
        modal.querySelector("input[name=color2]").value = roomSettings.color2;
        modal.querySelector(".checkbox[name=noindex]").checked = roomSettings.noindex;
        modal.querySelector(".checkbox[name=allowBots]").checked = roomSettings.allowBots;
        modal.querySelector("input[name=limit]").value = roomSettings.limit.toString();
      }, 100);
    }
  });
  const roomSettingsModal = document.getElementById("room-settings");
  roomSettingsModal.querySelector(".submit").addEventListener("click", () => {
    const modal = roomSettingsModal;
    const newSettings = {
      visible: modal.querySelector(".checkbox[name=visible]").checked,
      chat: modal.querySelector(".checkbox[name=chat]").checked,
      crownsolo: modal.querySelector(".checkbox[name=crownsolo]").checked,
      "no cussing": modal.querySelector(".checkbox[name=nocussing]").checked,
      noindex: modal.querySelector(".checkbox[name=noindex]").checked,
      allowBots: modal.querySelector(".checkbox[name=allowBots]").checked,
      color: modal.querySelector("input[name=color]").value,
      color2: modal.querySelector("input[name=color2]").value,
      limit: +modal.querySelector("input[name=limit]").value
    };
    gClient.setChannelSettings(newSettings);
    closeModal2();
  });
  roomSettingsModal.querySelector(".drop-crown").addEventListener("click", () => {
    closeModal2();
    if (confirm("This will drop the crown...!"))
      gClient.sendArray([{ m: "chown" }]);
  });
  document.getElementById("clearchat-btn").addEventListener("click", (evt) => {
    if (confirm("Are you sure you want to clear chat?"))
      gClient.sendArray([{ m: "clearchat" }]);
  });
  document.getElementById("getcrown-btn").addEventListener("click", (evt) => {
    gClient.sendArray([{ m: "chown", id: gClient.getOwnParticipant().id }]);
  });
  document.getElementById("vanish-btn").addEventListener("click", (evt) => {
    gClient.sendArray([
      { m: "v", vanish: !gClient.getOwnParticipant().vanished }
    ]);
  });
  gClient.on("participant update", (part) => {
    if (part._id === gClient.getOwnParticipant()._id) {
      const vanishBtn = document.getElementById("vanish-btn");
      if (part.vanished) {
        vanishBtn.textContent = "Unvanish";
      } else {
        vanishBtn.textContent = "Vanish";
      }
    }
  });
  gClient.on("participant added", (part) => {
    if (part._id === gClient.getOwnParticipant()._id) {
      const vanishBtn = document.getElementById("vanish-btn");
      if (part.vanished) {
        vanishBtn.textContent = "Unvanish";
      } else {
        vanishBtn.textContent = "Vanish";
      }
    }
  });
  gClient.on("notification", (msg) => {
    new Notification(msg);
  });
  gClient.on("ch", (msg) => {
    const chidlo = msg.ch._id.toLowerCase();
    const pianoEl = document.getElementById("piano");
    if (chidlo === "spin" || chidlo.substr(-5) === "/spin") {
      pianoEl.classList.add("spin");
    } else {
      pianoEl.classList.remove("spin");
    }
  });
  gClient.on("ch", (msg) => {
    let notice = "";
    let has_notice = false;
    if (msg.ch.settings.crownsolo) {
      has_notice = true;
      notice += '<p>This room is set to "only the owner can play."</p>';
    }
    if (msg.ch.settings["no cussing"]) {
      has_notice = true;
      notice += '<p>This room is set to "no cussing."</p>';
    }
    const noticeDiv = document.getElementById("room-notice");
    if (has_notice) {
      noticeDiv.innerHTML = notice;
      if (noticeDiv.style.display === "none")
        fadeIn(noticeDiv, 1000);
    } else {
      if (noticeDiv.style.display !== "none")
        fadeOut(noticeDiv, 1000);
    }
  });
  gClient.on("disconnect", () => {
    fadeOut(document.getElementById("room-notice"), 1000);
  });
  state.client = gClient;
  return gClient;
}
var tabIsActive = true, youreMentioned = false, youreReplied = false, last_my = -10;
var init_connection = __esm(() => {
  init_Client();
  init_Notification();
  init_state();
  init_settings();
  init_constants();
  init_modal();
  init_util();
});

// client/src/main.ts
init_state();

// client/src/libs/Rect.ts
class Rect {
  x;
  y;
  w;
  h;
  x2;
  y2;
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.x2 = x + w;
    this.y2 = y + h;
  }
  contains(x, y) {
    return x >= this.x && x <= this.x2 && y >= this.y && y <= this.y2;
  }
}

// client/src/piano/renderer.ts
init_constants();
init_settings();
init_actions();

class Renderer {
  piano;
  width = 0;
  height = 0;
  init(piano) {
    this.piano = piano;
    this.resize();
    return this;
  }
  resize(width, height) {
    if (width === undefined)
      width = this.piano.rootElement.offsetWidth;
    if (height === undefined)
      height = Math.floor(width * 0.2);
    this.piano.rootElement.style.height = height + "px";
    this.piano.rootElement.style.marginTop = Math.floor(window.innerHeight / 2 - height / 2) + "px";
    this.width = width * window.devicePixelRatio;
    this.height = height * window.devicePixelRatio;
  }
  visualize(_key, _color) {}
}

class CanvasRenderer extends Renderer {
  canvas;
  ctx;
  whiteKeyWidth = 0;
  whiteKeyHeight = 0;
  blackKeyWidth = 0;
  blackKeyHeight = 0;
  blackKeyOffset = 0;
  keyMovement = 0;
  whiteBlipWidth = 0;
  whiteBlipHeight = 0;
  whiteBlipX = 0;
  whiteBlipY = 0;
  blackBlipWidth = 0;
  blackBlipHeight = 0;
  blackBlipX = 0;
  blackBlipY = 0;
  whiteKeyRender;
  blackKeyRender;
  shadowRender = [];
  noteLyrics = {};
  init(piano) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    piano.rootElement.appendChild(this.canvas);
    super.init(piano);
    const self = this;
    const render = () => {
      self.redraw();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
    let mouse_down = false;
    let last_key = null;
    piano.rootElement.addEventListener("mousedown", (event) => {
      mouse_down = true;
      if (!settings.noPreventDefault)
        event.preventDefault();
      const pos = CanvasRenderer.translateMouseEvent(event);
      const hit = self.getHit(pos.x, pos.y);
      if (hit) {
        press(hit.key.note, hit.v);
        last_key = hit.key;
      }
    });
    piano.rootElement.addEventListener("touchstart", (event) => {
      mouse_down = true;
      if (!settings.noPreventDefault)
        event.preventDefault();
      for (const i in event.changedTouches) {
        const pos = CanvasRenderer.translateMouseEvent(event.changedTouches[i]);
        const hit = self.getHit(pos.x, pos.y);
        if (hit) {
          press(hit.key.note, hit.v);
          last_key = hit.key;
        }
      }
    }, false);
    window.addEventListener("mouseup", () => {
      if (last_key)
        release(last_key.note);
      mouse_down = false;
      last_key = null;
    });
    return this;
  }
  resize(width, height) {
    super.resize(width, height);
    if (this.width < 52 * 2)
      this.width = 52 * 2;
    if (this.height < this.width * 0.2)
      this.height = Math.floor(this.width * 0.2);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = this.width / window.devicePixelRatio + "px";
    this.canvas.style.height = this.height / window.devicePixelRatio + "px";
    this.whiteKeyWidth = Math.floor(this.width / 52);
    this.whiteKeyHeight = Math.floor(this.height * 0.9);
    this.blackKeyWidth = Math.floor(this.whiteKeyWidth * 0.75);
    this.blackKeyHeight = Math.floor(this.height * 0.5);
    this.blackKeyOffset = Math.floor(this.whiteKeyWidth - this.blackKeyWidth / 2);
    this.keyMovement = Math.floor(this.whiteKeyHeight * 0.015);
    this.whiteBlipWidth = Math.floor(this.whiteKeyWidth * 0.7);
    this.whiteBlipHeight = Math.floor(this.whiteBlipWidth * 0.8);
    this.whiteBlipX = Math.floor((this.whiteKeyWidth - this.whiteBlipWidth) / 2);
    this.whiteBlipY = Math.floor(this.whiteKeyHeight - this.whiteBlipHeight * 1.2);
    this.blackBlipWidth = Math.floor(this.blackKeyWidth * 0.7);
    this.blackBlipHeight = Math.floor(this.blackBlipWidth * 0.8);
    this.blackBlipY = Math.floor(this.blackKeyHeight - this.blackBlipHeight * 1.2);
    this.blackBlipX = Math.floor((this.blackKeyWidth - this.blackBlipWidth) / 2);
    this.prerenderKeys();
    this.prerenderShadows();
    this.updateKeyRects();
  }
  prerenderKeys() {
    this.whiteKeyRender = document.createElement("canvas");
    this.whiteKeyRender.width = this.whiteKeyWidth;
    this.whiteKeyRender.height = this.height + 10;
    let ctx = this.whiteKeyRender.getContext("2d");
    if (ctx.createLinearGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.whiteKeyHeight);
      gradient.addColorStop(0, "#eee");
      gradient.addColorStop(0.75, "#fff");
      gradient.addColorStop(1, "#dad4d4");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = "#fff";
    }
    ctx.strokeStyle = "#000";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 10;
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
    ctx.lineWidth = 4;
    ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
    this.blackKeyRender = document.createElement("canvas");
    this.blackKeyRender.width = this.blackKeyWidth + 10;
    this.blackKeyRender.height = this.blackKeyHeight + 10;
    ctx = this.blackKeyRender.getContext("2d");
    if (ctx.createLinearGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.blackKeyHeight);
      gradient.addColorStop(0, "#000");
      gradient.addColorStop(1, "#444");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = "#000";
    }
    ctx.strokeStyle = "#222";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 8;
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
    ctx.lineWidth = 4;
    ctx.fillRect(ctx.lineWidth / 2, ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
  }
  prerenderShadows() {
    this.shadowRender = [];
    const y = -this.canvas.height * 2;
    for (let j = 0;j < 2; j++) {
      const canvas = document.createElement("canvas");
      this.shadowRender[j] = canvas;
      canvas.width = this.canvas.width;
      canvas.height = this.canvas.height;
      const ctx = canvas.getContext("2d");
      const sharp = j ? true : false;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = this.keyMovement * 3;
      ctx.shadowOffsetY = -y + this.keyMovement;
      if (sharp) {
        ctx.shadowOffsetX = this.keyMovement;
      } else {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = -y + this.keyMovement;
      }
      for (const i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i))
          continue;
        const key = this.piano.keys[i];
        if (key.sharp !== sharp)
          continue;
        if (key.sharp) {
          ctx.fillRect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2, y + ctx.lineWidth / 2, this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
        } else {
          ctx.fillRect(this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2, y + ctx.lineWidth / 2, this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
        }
      }
    }
  }
  updateKeyRects() {
    for (const i in this.piano.keys) {
      if (!this.piano.keys.hasOwnProperty(i))
        continue;
      const key = this.piano.keys[i];
      if (key.sharp) {
        key.rect = new Rect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial, 0, this.blackKeyWidth, this.blackKeyHeight);
      } else {
        key.rect = new Rect(this.whiteKeyWidth * key.spatial, 0, this.whiteKeyWidth, this.whiteKeyHeight);
      }
    }
  }
  visualize(key, color) {
    key.timePlayed = Date.now();
    key.blips.push({ time: key.timePlayed, color });
  }
  redraw() {
    const now = Date.now();
    const timeLoadedEnd = now - 1000;
    const timePlayedEnd = now - 100;
    const timeBlipEnd = now - 1000;
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let j = 0;j < 2; j++) {
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(this.shadowRender[j], 0, 0);
      const sharp = j ? true : false;
      for (const i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i))
          continue;
        const key = this.piano.keys[i];
        if (key.sharp !== sharp)
          continue;
        if (!key.loaded) {
          this.ctx.globalAlpha = 0.2;
        } else if (key.timeLoaded > timeLoadedEnd) {
          this.ctx.globalAlpha = (now - key.timeLoaded) / 1000 * 0.8 + 0.2;
        } else {
          this.ctx.globalAlpha = 1;
        }
        let y = 0;
        if (key.timePlayed > timePlayedEnd) {
          y = Math.floor(this.keyMovement - (now - key.timePlayed) / 100 * this.keyMovement);
        }
        let x = Math.floor(key.sharp ? this.blackKeyOffset + this.whiteKeyWidth * key.spatial : this.whiteKeyWidth * key.spatial);
        const image = key.sharp ? this.blackKeyRender : this.whiteKeyRender;
        this.ctx.drawImage(image, x, y);
        let keyName = key.baseNote[0].toUpperCase();
        if (sharp)
          keyName += "#";
        keyName += key.octave + 1;
        if (settings.showPianoNotes) {
          this.ctx.font = `${(key.sharp ? this.blackKeyWidth : this.whiteKeyWidth) / 2}px Arial`;
          this.ctx.fillStyle = key.sharp ? "white" : "black";
          this.ctx.textAlign = "center";
          if (keyName.includes("#")) {
            this.ctx.fillText(keyName, x + (key.sharp ? this.blackKeyWidth : this.whiteKeyWidth) / 2, y + (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight) - 30 - this.ctx.lineWidth);
          }
          keyName = keyName.replace("C#", "D♭").replace("D#", "E♭").replace("F#", "G♭").replace("G#", "A♭").replace("A#", "B♭");
          this.ctx.fillText(keyName, x + (key.sharp ? this.blackKeyWidth : this.whiteKeyWidth) / 2, y + (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight) - 10 - this.ctx.lineWidth);
        }
        const highlightScale = BASIC_PIANO_SCALES[settings.highlightScaleNotes || ""];
        if (highlightScale && key.loaded) {
          keyName = keyName.replace("C#", "D♭").replace("D#", "E♭").replace("F#", "G♭").replace("G#", "A♭").replace("A#", "B♭");
          const keynameNoOctave = keyName.slice(0, -1);
          if (highlightScale.includes(keynameNoOctave)) {
            const prev = this.ctx.globalAlpha;
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = "#0f0";
            if (key.sharp)
              this.ctx.fillRect(x, y, this.blackKeyWidth, this.blackKeyHeight);
            else
              this.ctx.fillRect(x, y, this.whiteKeyWidth, this.whiteKeyHeight);
            this.ctx.globalAlpha = prev;
          }
        }
        if (key.blips.length) {
          const alpha = this.ctx.globalAlpha;
          let w, h;
          if (key.sharp) {
            x += this.blackBlipX;
            y = this.blackBlipY;
            w = this.blackBlipWidth;
            h = this.blackBlipHeight;
          } else {
            x += this.whiteBlipX;
            y = this.whiteBlipY;
            w = this.whiteBlipWidth;
            h = this.whiteBlipHeight;
          }
          for (let b = 0;b < key.blips.length; b++) {
            const blip = key.blips[b];
            if (blip.time > timeBlipEnd) {
              this.ctx.fillStyle = blip.color;
              this.ctx.globalAlpha = alpha - (now - blip.time) / 1000 * alpha;
              this.ctx.fillRect(x, y, w, h);
            } else {
              key.blips.splice(b, 1);
              --b;
            }
            y -= Math.floor(h * 1.1);
          }
        }
      }
    }
    this.ctx.restore();
  }
  getHit(x, y) {
    for (let j = 0;j < 2; j++) {
      const sharp = j ? false : true;
      for (const i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i))
          continue;
        const key = this.piano.keys[i];
        if (key.sharp !== sharp)
          continue;
        if (key.rect.contains(x, y)) {
          let v = y / (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight);
          v += 0.25;
          v *= DEFAULT_VELOCITY;
          if (v > 1)
            v = 1;
          return { key, v };
        }
      }
    }
    return null;
  }
  static isSupported() {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext && canvas.getContext("2d"));
  }
  static translateMouseEvent(evt) {
    let element = evt.target;
    let offx = 0;
    let offy = 0;
    do {
      if (!element)
        break;
      offx += element.offsetLeft;
      offy += element.offsetTop;
    } while (element = element.offsetParent);
    return {
      x: (evt.pageX - offx) * window.devicePixelRatio,
      y: (evt.pageY - offy) * window.devicePixelRatio
    };
  }
}

// client/src/piano/audio.ts
init_Notification();
init_state();

class AudioEngine {
  volume = 0.6;
  sounds = {};
  paused = true;
  init() {
    return this;
  }
  load(_id, _url, _cb) {}
  play(_id, _vol, _delay_ms, _part_id) {}
  stop(_id, _delay_ms, _part_id) {}
  setVolume(vol) {
    this.volume = vol;
  }
  resume() {
    this.paused = false;
  }
}

class AudioEngineWeb extends AudioEngine {
  threshold = 0;
  worker;
  context;
  masterGain;
  limiterNode;
  pianoGain;
  synthGain;
  playings = {};
  constructor() {
    super();
    this.worker = new Worker("/workerTimer.js");
    this.worker.onmessage = (event) => {
      if (event.data.args) {
        if (event.data.args.action === 0) {
          this.actualPlay(event.data.args.id, event.data.args.vol, event.data.args.time, event.data.args.part_id);
        } else {
          this.actualStop(event.data.args.id, event.data.args.time, event.data.args.part_id);
        }
      }
    };
  }
  init() {
    super.init();
    this.context = new AudioContext({ latencyHint: "interactive" });
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.masterGain.gain.value = this.volume;
    this.limiterNode = this.context.createDynamicsCompressor();
    this.limiterNode.threshold.value = -10;
    this.limiterNode.knee.value = 0;
    this.limiterNode.ratio.value = 20;
    this.limiterNode.attack.value = 0;
    this.limiterNode.release.value = 0.1;
    this.limiterNode.connect(this.masterGain);
    this.pianoGain = this.context.createGain();
    this.pianoGain.gain.value = 0.5;
    this.pianoGain.connect(this.limiterNode);
    this.synthGain = this.context.createGain();
    this.synthGain.gain.value = 0.5;
    this.synthGain.connect(this.limiterNode);
    this.playings = {};
    return this;
  }
  load(id, url, cb) {
    const req = new XMLHttpRequest;
    req.open("GET", url);
    req.responseType = "arraybuffer";
    req.addEventListener("readystatechange", () => {
      if (req.readyState !== 4)
        return;
      try {
        this.context.decodeAudioData(req.response, (buffer) => {
          this.sounds[id] = buffer;
          if (cb)
            cb();
        });
      } catch (e) {
        new Notification({
          id: "audio-download-error",
          title: "Problem",
          text: "For some reason, an audio download failed with a status of " + req.status + ". ",
          target: "#piano",
          duration: 1e4
        });
      }
    });
    req.send();
  }
  actualPlay(id, vol, time, part_id) {
    if (this.paused)
      return;
    if (!this.sounds.hasOwnProperty(id))
      return;
    const source = this.context.createBufferSource();
    source.buffer = this.sounds[id];
    const gain = this.context.createGain();
    gain.gain.value = vol;
    source.connect(gain);
    gain.connect(this.pianoGain);
    source.start(time);
    if (this.playings[id]) {
      const playing = this.playings[id];
      playing.gain.gain.setValueAtTime(playing.gain.gain.value, time);
      playing.gain.gain.linearRampToValueAtTime(0, time + 0.2);
      playing.source.stop(time + 0.21);
      if (state.enableSynth && playing.voice) {
        playing.voice.stop(time);
      }
    }
    this.playings[id] = { source, gain, part_id };
    if (state.enableSynth && state.synthVoice) {
      this.playings[id].voice = new state.synthVoice(id, time);
    }
  }
  play(id, vol, delay_ms, part_id) {
    if (!this.sounds.hasOwnProperty(id))
      return;
    const time = this.context.currentTime + delay_ms / 1000;
    const delay = delay_ms - this.threshold;
    if (delay <= 0)
      this.actualPlay(id, vol, time, part_id);
    else {
      this.worker.postMessage({
        delay,
        args: { action: 0, id, vol, time, part_id }
      });
    }
  }
  actualStop(id, time, part_id) {
    if (this.playings.hasOwnProperty(id) && this.playings[id] && this.playings[id].part_id === part_id) {
      const gain = this.playings[id].gain.gain;
      gain.setValueAtTime(gain.value, time);
      gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16);
      gain.linearRampToValueAtTime(0, time + 0.4);
      this.playings[id].source.stop(time + 0.41);
      if (this.playings[id].voice) {
        this.playings[id].voice.stop(time);
      }
      this.playings[id] = null;
    }
  }
  stop(id, delay_ms, part_id) {
    const time = this.context.currentTime + delay_ms / 1000;
    const delay = delay_ms - this.threshold;
    if (delay <= 0)
      this.actualStop(id, time, part_id);
    else {
      this.worker.postMessage({
        delay,
        args: { action: 1, id, time, part_id }
      });
    }
  }
  setVolume(vol) {
    super.setVolume(vol);
    this.masterGain.gain.value = this.volume;
  }
  resume() {
    this.paused = false;
    this.context.resume();
  }
}

// client/src/piano/piano.ts
init_settings();
init_state();

class PianoKey {
  note;
  baseNote;
  octave;
  sharp;
  loaded = false;
  timeLoaded = 0;
  domElement = null;
  timePlayed = 0;
  blips = [];
  spatial = 0;
  rect = null;
  constructor(note, octave) {
    this.note = note + octave;
    this.baseNote = note;
    this.octave = octave;
    this.sharp = note.indexOf("s") !== -1;
  }
}

class Piano {
  rootElement;
  keys = {};
  renderer;
  audio;
  constructor(rootElement) {
    this.rootElement = rootElement;
    let white_spatial = 0;
    let black_spatial = 0;
    let black_it = 0;
    const black_lut = [2, 1, 2, 1, 1];
    const addKey = (note, octave) => {
      const key = new PianoKey(note, octave);
      this.keys[key.note] = key;
      if (key.sharp) {
        key.spatial = black_spatial;
        black_spatial += black_lut[black_it % 5];
        ++black_it;
      } else {
        key.spatial = white_spatial;
        ++white_spatial;
      }
    };
    if (settings.testMode) {
      addKey("c", 2);
    } else {
      addKey("a", -1);
      addKey("as", -1);
      addKey("b", -1);
      const notes = "c cs d ds e f fs g gs a as b".split(" ");
      for (let oct = 0;oct < 7; oct++) {
        for (const n of notes)
          addKey(n, oct);
      }
      addKey("c", 7);
    }
    this.renderer = new CanvasRenderer().init(this);
    window.addEventListener("resize", () => {
      this.renderer.resize();
    });
    window.AudioContext = window.AudioContext || window.webkitAudioContext || undefined;
    this.audio = new AudioEngineWeb().init();
  }
  play(note, vol, participant, delay_ms, lyric) {
    if (!this.keys.hasOwnProperty(note) || !participant)
      return;
    const key = this.keys[note];
    if (key.loaded)
      this.audio.play(key.note, vol, delay_ms, participant.id);
    if (state.midiOutTest)
      state.midiOutTest(key.note, vol * 100, delay_ms, participant.id);
    setTimeout(() => {
      this.renderer.visualize(key, participant.color);
      if (participant.nameDiv) {
        participant.nameDiv.classList.add("play");
        setTimeout(() => {
          participant.nameDiv?.classList.remove("play");
        }, 30);
      }
    }, delay_ms || 0);
  }
  stop(note, participant, delay_ms) {
    if (!this.keys.hasOwnProperty(note))
      return;
    const key = this.keys[note];
    if (key.loaded)
      this.audio.stop(key.note, delay_ms, participant.id);
    if (state.midiOutTest)
      state.midiOutTest(key.note, 0, delay_ms, participant.id);
  }
}

// client/src/libs/SoundSelector.ts
init_Notification();
var soundDomain = window.location.hostname === "localhost" ? `http://${location.host}` : "https://multiplayerpiano.net";

class SoundSelector {
  initialized = false;
  keys;
  loading = {};
  notification;
  packs = [];
  piano;
  soundSelection;
  constructor(piano) {
    this.keys = piano.keys;
    this.piano = piano;
    this.soundSelection = localStorage.soundSelection || "mppclassic";
    this.addPack({
      name: "MPP Classic",
      keys: Object.keys(this.piano.keys),
      ext: ".mp3",
      url: "/sounds/mppclassic/"
    });
  }
  addPack(pack, load) {
    if (typeof pack == "string") {
      this.loading[pack] = true;
    } else {
      this.loading[pack.url] = true;
    }
    const self = this;
    function add(obj) {
      for (let i = 0;i < self.packs.length; i++) {
        if (obj.name === self.packs[i].name)
          return console.warn("Sounds already added!!");
      }
      if (obj.url.substr(obj.url.length - 1) !== "/")
        obj.url = obj.url + "/";
      const html = document.createElement("li");
      html.classList = "pack";
      html.innerText = obj.name + " (" + obj.keys.length + " keys)";
      html.onclick = () => {
        self.loadPack(obj.name);
        self.notification.close();
      };
      obj.html = html;
      self.packs.push(obj);
      self.packs.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
      if (load)
        self.loadPack(obj.name);
      delete self.loading[obj.url];
    }
    if (typeof pack === "string") {
      let useDomain = true;
      if (pack.match(/^(http|https):\/\//i))
        useDomain = false;
      const url = (useDomain ? soundDomain : "") + pack;
      fetch(url + "/info.json").then((r) => r.json()).then((json) => {
        json.url = pack;
        add(json);
      });
    } else
      add(pack);
  }
  addPacks(packs) {
    for (const p of packs)
      this.addPack(p);
  }
  init() {
    if (this.initialized) {
      console.warn("Sound selector already initialized!");
      return;
    }
    if (Object.keys(this.loading).length) {
      setTimeout(() => {
        this.init();
      }, 250);
      return;
    }
    const self = this;
    document.getElementById("sound-btn").addEventListener("click", () => {
      if (document.getElementById("Notification-Sound-Selector") != null)
        return self.notification.close();
      const html = document.createElement("ul");
      for (let i = 0;i < self.packs.length; i++) {
        const pack = self.packs[i];
        pack.html.classList = pack.name === self.soundSelection ? "pack enabled" : "pack";
        pack.html.setAttribute("translated", "");
        html.appendChild(pack.html);
      }
      self.notification = new Notification({ title: "Sound Selector", html, id: "Sound-Selector", duration: -1, target: "#sound-btn" });
    });
    this.initialized = true;
    this.loadPack(this.soundSelection, true);
  }
  loadPack(name, force) {
    let pack = name;
    for (let i = 0;i < this.packs.length; i++) {
      if (this.packs[i].name === name) {
        pack = this.packs[i];
        break;
      }
    }
    if (typeof pack === "string") {
      console.warn("Sound pack does not exist! Loading default pack...");
      return this.loadPack("MPP Classic");
    }
    if (pack.name === this.soundSelection && !force)
      return;
    if (pack.keys.length !== Object.keys(this.piano.keys).length) {
      this.piano.keys = {};
      for (let i = 0;i < pack.keys.length; i++)
        this.piano.keys[pack.keys[i]] = this.keys[pack.keys[i]];
      this.piano.renderer.resize();
    }
    for (const i in this.piano.keys) {
      if (!this.piano.keys.hasOwnProperty(i))
        continue;
      const key = this.piano.keys[i];
      key.loaded = false;
      let useDomain = true;
      if (pack.url.match(/^(http|https):\/\//i))
        useDomain = false;
      this.piano.audio.load(key.note, (useDomain ? soundDomain : "") + pack.url + key.note + pack.ext, () => {
        key.loaded = true;
        key.timeLoaded = Date.now();
      });
    }
    if (localStorage)
      localStorage.soundSelection = pack.name;
    this.soundSelection = pack.name;
  }
  removePack(name) {
    for (let i = 0;i < this.packs.length; i++) {
      if (this.packs[i].name === name) {
        this.packs.splice(i, 1);
        if (name === this.soundSelection)
          this.loadPack(this.packs[0].name);
        return;
      }
    }
    console.warn("Sound pack not found!");
  }
}

// client/src/main.ts
init_connection();
init_keyboard();

// client/src/modules/rooms.ts
init_util();
init_state();
init_settings();
init_modal();
init_Notification();
function initRooms() {
  const gClient = getClient();
  const gPiano = getPiano();
  const { captureKeyboard: captureKeyboard2, releaseKeyboard: releaseKeyboard2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
  const { getTabIsActive: getTabIsActive2 } = (init_connection(), __toCommonJS(exports_connection));
  const volume_slider = document.getElementById("volume-slider");
  let gKnowsYouCanUseKeyboard = false;
  if (localStorage && localStorage.knowsYouCanUseKeyboard)
    gKnowsYouCanUseKeyboard = true;
  if (!gKnowsYouCanUseKeyboard) {
    window.gKnowsYouCanUseKeyboardTimeout = setTimeout(() => {
      window.gKnowsYouCanUseKeyboardNotification = new Notification({
        id: "play",
        title: window.i18nextify.i18next.t("Did you know!?!"),
        text: window.i18nextify.i18next.t("You can play the piano with your keyboard, too.  Try it!"),
        target: "#piano",
        duration: 1e4
      });
    }, 30000);
  }
  if (window.localStorage) {
    if (localStorage.volume) {
      volume_slider.value = localStorage.volume;
      gPiano.audio.setVolume(localStorage.volume);
      document.getElementById("volume-label").innerHTML = window.i18nextify.i18next.t("Volume") + "<span translated>: " + Math.floor(gPiano.audio.volume * 100) + "%</span>";
    } else
      localStorage.volume = gPiano.audio.volume;
    window.gHasBeenHereBefore = localStorage.gHasBeenHereBefore || false;
    localStorage.gHasBeenHereBefore = true;
  }
  document.querySelector("#room > .info").textContent = "--";
  gClient.on("ch", (msg) => {
    const channel = msg.ch;
    const info = document.querySelector("#room > .info");
    info.textContent = channel._id;
    if (channel.settings.lobby)
      info.classList.add("lobby");
    else
      info.classList.remove("lobby");
    if (!channel.settings.chat)
      info.classList.add("no-chat");
    else
      info.classList.remove("no-chat");
    if (channel.settings.crownsolo)
      info.classList.add("crownsolo");
    else
      info.classList.remove("crownsolo");
    if (channel.settings["no cussing"])
      info.classList.add("no-cussing");
    else
      info.classList.remove("no-cussing");
    if (!channel.settings.visible)
      info.classList.add("not-visible");
    else
      info.classList.remove("not-visible");
  });
  gClient.on("ls", (ls) => {
    for (const i in ls.u) {
      if (!ls.u.hasOwnProperty(i))
        continue;
      const room = ls.u[i];
      let info = document.querySelector('#room .info[roomid="' + (room.id + "").replace(/[\\"']/g, "\\$&").replace(/ /g, "\\0") + '"]');
      if (!info) {
        info = document.createElement("div");
        info.className = "info";
        info.setAttribute("roomname", room._id);
        info.setAttribute("roomid", room.id);
        document.querySelector("#room .more").appendChild(info);
      }
      info.setAttribute("translated", "");
      info.textContent = room.count + "/" + ("limit" in room.settings ? room.settings.limit : 20) + " " + room._id;
      if (room.settings.lobby)
        info.classList.add("lobby");
      else
        info.classList.remove("lobby");
      if (!room.settings.chat)
        info.classList.add("no-chat");
      else
        info.classList.remove("no-chat");
      if (room.settings.crownsolo)
        info.classList.add("crownsolo");
      else
        info.classList.remove("crownsolo");
      if (room.settings["no cussing"])
        info.classList.add("no-cussing");
      else
        info.classList.remove("no-cussing");
      if (!room.settings.visible)
        info.classList.add("not-visible");
      else
        info.classList.remove("not-visible");
      if (room.banned)
        info.classList.add("banned");
      else
        info.classList.remove("banned");
    }
  });
  document.getElementById("room").addEventListener("click", (evt) => {
    evt.stopPropagation();
    if (evt.target.classList.contains("info") && evt.target.closest(".more") !== null) {
      fadeOut(document.querySelector("#room .more"), 250);
      const selected_name = evt.target.getAttribute("roomname");
      if (typeof selected_name !== "undefined") {
        if (!evt.ctrlKey)
          changeRoom(selected_name, "right");
        else
          window.open(`?c=${selected_name}`);
      }
      return false;
    } else if (evt.target.classList.contains("new")) {
      openModal("#new-room", "input[name=name]");
    }
    const doc_click = (evt2) => {
      if (evt2.target.matches("#room .more"))
        return;
      document.removeEventListener("mousedown", doc_click);
      fadeOut(document.querySelector("#room .more"), 250);
      gClient.sendArray([{ m: "-ls" }]);
    };
    document.addEventListener("mousedown", doc_click);
    document.querySelectorAll("#room .more .info").forEach((el) => el.remove());
    document.querySelector("#room .more").style.display = "block";
    gClient.sendArray([{ m: "+ls" }]);
  });
  document.getElementById("new-room-btn").addEventListener("click", (evt) => {
    evt.stopPropagation();
    openModal("#new-room", "input[name=name]");
  });
  document.getElementById("play-alone-btn").addEventListener("click", (evt) => {
    evt.stopPropagation();
    const room_name = "Room" + Math.floor(Math.random() * 1000000000000);
    changeRoom(room_name, "right", { visible: false });
    setTimeout(() => {
      new Notification({ id: "share", title: window.i18nextify.i18next.t("Playing alone"), html: window.i18nextify.i18next.t("You are playing alone in a room by yourself, but you can always invite friends by sending them the link.") + '<br><a href="' + location.href + '">' + location.href + "</a>", duration: 25000 });
    }, 1000);
  });
  document.getElementById("account-btn").addEventListener("click", (evt) => {
    evt.stopPropagation();
    openModal("#account");
    if (gClient.accountInfo) {
      document.querySelector("#account #account-info").style.display = "block";
      if (gClient.accountInfo.type === "discord") {
        document.querySelector("#account #avatar-image").src = gClient.accountInfo.avatar;
        document.querySelector("#account #logged-in-user-text").textContent = `@${gClient.accountInfo.username}`;
      }
    } else {
      document.querySelector("#account #account-info").style.display = "none";
    }
  });
  let gHistoryDepth = 0;
  function changeRoom(name, direction, roomSettings, push) {
    if (!roomSettings)
      roomSettings = {};
    if (!direction)
      direction = "right";
    if (typeof push === "undefined")
      push = true;
    const opposite = direction === "left" ? "right" : "left";
    if (name === "")
      name = "lobby";
    if (gClient.channel && gClient.channel._id === name)
      return;
    if (push) {
      const url = "/?c=" + encodeURIComponent(name).replace("'", "%27");
      if (window.history && history.pushState) {
        history.pushState({ depth: gHistoryDepth += 1, name }, "Piano > " + name, url);
      } else {
        window.location = url;
        return;
      }
    }
    gClient.setChannel(name, roomSettings);
    let t = 0;
    const d = 100;
    const pianoEl = document.getElementById("piano");
    pianoEl.classList.add("ease-out", "slide-" + opposite);
    setTimeout(() => {
      pianoEl.classList.remove("ease-out", "slide-" + opposite);
      pianoEl.classList.add("slide-" + direction);
    }, t += d);
    setTimeout(() => {
      pianoEl.classList.add("ease-in");
      pianoEl.classList.remove("slide-" + direction);
    }, t += d);
    setTimeout(() => {
      pianoEl.classList.remove("ease-in");
    }, t += d);
  }
  window.addEventListener("popstate", (evt) => {
    const depth = evt.state ? evt.state.depth : 0;
    const direction = depth <= gHistoryDepth ? "left" : "right";
    gHistoryDepth = depth;
    changeRoom(getRoomNameFromURL(), direction, null, false);
  });
  (() => {
    function submit() {
      const name = document.querySelector("#new-room .text[name=name]").value;
      const roomSettings = { visible: document.querySelector("#new-room .checkbox[name=visible]").checked, chat: true };
      document.querySelector("#new-room .text[name=name]").value = "";
      closeModal2();
      changeRoom(name, "right", roomSettings);
      setTimeout(() => {
        new Notification({ id: "share", title: window.i18nextify.i18next.t("Created a Room"), html: window.i18nextify.i18next.t("You can invite friends to your room by sending them the link.") + '<br><a href="' + location.href + '">' + location.href + "</a>", duration: 25000 });
      }, 1000);
    }
    document.querySelector("#new-room .submit").addEventListener("click", () => {
      submit();
    });
    document.querySelector("#new-room .text[name=name]").addEventListener("keypress", (evt) => {
      if (evt.keyCode === 13)
        submit();
      else if (evt.keyCode === 27)
        closeModal2();
      else
        return;
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
      return false;
    });
  })();
  (() => {
    function submit() {
      const set = { name: document.querySelector("#rename input[name=name]").value, color: document.querySelector("#rename input[name=color]").value };
      closeModal2();
      gClient.sendArray([{ m: "userset", set }]);
    }
    document.querySelector("#rename .submit").addEventListener("click", () => {
      submit();
    });
    document.querySelector("#rename .text[name=name]").addEventListener("keypress", (evt) => {
      if (evt.keyCode === 13)
        submit();
      else if (evt.keyCode === 27)
        closeModal2();
      else
        return;
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
      return false;
    });
  })();
  (() => {
    function submit() {
      const msg = { m: "siteban" };
      msg.id = document.querySelector("#siteban .text[name=id]").value;
      const durationUnit = document.querySelector("#siteban select[name=durationUnit]").value;
      if (durationUnit === "permanent") {
        if (!gClient.permissions.siteBanAnyDuration) {
          document.querySelector("#siteban p[name=errorText]").textContent = "You don't have permission to ban longer than 1 month.";
          return;
        }
        msg.permanent = true;
      } else {
        const factors = { seconds: 1000, minutes: 60000, hours: 3600000, days: 86400000, weeks: 604800000, months: 2592000000, years: 31536000000 };
        const duration = (factors[durationUnit] || 0) * parseFloat(document.querySelector("#siteban input[name=durationNumber]").value);
        if (duration < 0) {
          document.querySelector("#siteban p[name=errorText]").textContent = "Invalid duration.";
          return;
        }
        if (duration > 2592000000 && !gClient.permissions.siteBanAnyDuration) {
          document.querySelector("#siteban p[name=errorText]").textContent = "You don't have permission to ban longer than 1 month.";
          return;
        }
        msg.duration = duration;
      }
      let reason;
      if (document.querySelector("#siteban select[name=reasonSelect]").value === "custom") {
        reason = document.querySelector("#siteban .text[name=reasonText]").value;
        if (reason.length === 0) {
          document.querySelector("#siteban p[name=errorText]").textContent = "Please provide a reason.";
          return;
        }
      } else {
        reason = document.querySelector("#siteban select[name=reasonSelect]").value;
      }
      msg.reason = reason;
      const note = document.querySelector("#siteban textarea[name=note]").value;
      if (note)
        msg.note = note;
      closeModal2();
      gClient.sendArray([msg]);
    }
    document.querySelector("#siteban .submit").addEventListener("click", () => {
      submit();
    });
    document.querySelector("#siteban select[name=reasonSelect]").addEventListener("change", (evt) => {
      const value = evt.target.value;
      if (value === "custom") {
        document.querySelector("#siteban .text[name=reasonText]").disabled = false;
        document.querySelector("#siteban .text[name=reasonText]").value = "";
      } else {
        document.querySelector("#siteban .text[name=reasonText]").disabled = true;
        document.querySelector("#siteban .text[name=reasonText]").value = value;
      }
    });
    document.querySelector("#siteban select[name=durationUnit]").addEventListener("change", (evt) => {
      const value = evt.target.value;
      if (value === "permanent")
        document.querySelector("#siteban .text[name=durationNumber]").disabled = true;
      else
        document.querySelector("#siteban .text[name=durationNumber]").disabled = false;
    });
    const textKeypressEvent = (evt) => {
      if (evt.keyCode === 13)
        submit();
      else if (evt.keyCode === 27)
        closeModal2();
      else
        return;
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
      return false;
    };
    document.querySelector("#siteban .text[name=id]").addEventListener("keypress", textKeypressEvent);
    document.querySelector("#siteban .text[name=reasonText]").addEventListener("keypress", textKeypressEvent);
    if (document.querySelector("#siteban .text[name=note]")) {
      document.querySelector("#siteban .text[name=note]").addEventListener("keypress", textKeypressEvent);
    }
  })();
  (() => {
    function logout() {
      delete localStorage.token;
      delete gClient.accountInfo;
      gClient.stop();
      gClient.start();
      closeModal2();
    }
    document.querySelector("#account .logout-btn").addEventListener("click", () => {
      logout();
    });
    document.querySelector("#account .login-discord").addEventListener("click", () => {
      location.replace(encodeURI(`https://discord.com/api/oauth2/authorize?client_id=926633278100877393&redirect_uri=${location.origin}/?callback=discord&response_type=code&scope=identify email`));
    });
  })();
  const modal_bg = document.querySelector("#modal .bg");
  modal_bg.addEventListener("click", (evt) => {
    if (evt.target !== modal_bg)
      return;
    closeModal2();
  });
}

// client/src/modules/chat.ts
init_util();
init_Notification();
init_state();
init_settings();
init_keyboard();
init_connection();
function initChat() {
  const gClient = getClient();
  const getModal2 = () => {
    const { getModal: gm } = (init_modal(), __toCommonJS(exports_modal));
    return gm();
  };
  const captureKb = () => {
    const { captureKeyboard: captureKeyboard2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
    captureKeyboard2();
  };
  const releaseKb = () => {
    const { releaseKeyboard: releaseKeyboard2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
    releaseKeyboard2();
  };
  const messageCache = [];
  const chat = {
    startDM(part) {
      setIsDming(true);
      setDmParticipant(part);
      document.getElementById("chat-input").placeholder = "Direct messaging " + part.name + ".";
    },
    endDM() {
      setIsDming(false);
      document.getElementById("chat-input").placeholder = window.i18nextify.i18next.t("You can chat with this thing.");
    },
    startReply(part, id) {
      const msgEl = document.getElementById("msg-" + getMessageId());
      if (msgEl)
        Object.assign(msgEl.style, {
          backgroundColor: "unset",
          border: "1px solid #00000000"
        });
      setIsReplying(true);
      setReplyParticipant(part);
      setMessageId(id);
      document.getElementById("chat-input").placeholder = `Replying to ${part.name}`;
    },
    startDmReply(part, id) {
      const msgEl = document.getElementById("msg-" + getMessageId());
      if (msgEl)
        Object.assign(msgEl.style, {
          backgroundColor: "unset",
          border: "1px solid #00000000"
        });
      setIsReplying(true);
      setIsDming(true);
      setMessageId(id);
      setReplyParticipant(part);
      setDmParticipant(part);
      document.getElementById("chat-input").placeholder = `Replying to ${part.name} in a DM.`;
    },
    cancelReply(part) {
      setIsReplying(false);
      const msgEl = document.getElementById("msg-" + getMessageId());
      if (msgEl)
        Object.assign(msgEl.style, {
          backgroundColor: "unset",
          border: "1px solid #00000000"
        });
      document.getElementById("chat-input").placeholder = window.i18nextify.i18next.t(getIsDming() ? `Direct messaging ${part.name}` : `You can chat with this thing.`);
    },
    show() {
      fadeIn(document.getElementById("chat"), 250);
    },
    hide() {
      fadeOut(document.getElementById("chat"), 250);
    },
    clear() {
      document.querySelectorAll("#chat li").forEach((el) => el.remove());
    },
    scrollToBottom() {
      const ele = document.querySelector("#chat ul");
      ele.scrollTop = ele.scrollHeight - ele.clientHeight;
    },
    blur() {
      if (document.getElementById("chat").classList.contains("chatting")) {
        document.querySelector("#chat input").blur();
        document.getElementById("chat").classList.remove("chatting");
        chat.scrollToBottom();
        captureKb();
      }
    },
    send(message) {
      if (getIsReplying()) {
        if (getIsDming()) {
          gClient.sendArray([
            {
              m: "dm",
              reply_to: getMessageId(),
              _id: getReplyParticipant()._id,
              message
            }
          ]);
          setTimeout(() => {
            chat.cancelReply(getReplyParticipant());
          }, 100);
        } else {
          gClient.sendArray([
            {
              m: "a",
              reply_to: getMessageId(),
              _id: getReplyParticipant()._id,
              message
            }
          ]);
          setTimeout(() => {
            chat.cancelReply(getReplyParticipant());
          }, 100);
        }
      } else {
        if (getIsDming()) {
          gClient.sendArray([{ m: "dm", _id: getDmParticipant()._id, message }]);
        } else {
          gClient.sendArray([{ m: "a", message }]);
        }
      }
    },
    receive(msg) {
      if (msg.m === "dm") {
        if (settings.chatMutes.indexOf(msg.sender._id) !== -1)
          return;
      } else {
        if (settings.chatMutes.indexOf(msg.p._id) !== -1)
          return;
      }
      const li = document.createElement("li");
      li.id = "msg-" + msg.id;
      let isSpecialDm = false;
      if (msg.m === "dm") {
        if (msg.sender._id === gClient.user._id || msg.recipient._id === gClient.user._id) {
          const replySpan = document.createElement("span");
          replySpan.className = "reply";
          li.appendChild(replySpan);
        }
      } else {
        const replySpan = document.createElement("span");
        replySpan.className = "reply";
        li.appendChild(replySpan);
      }
      if (settings.showTimestampsInChat) {
        const tsSpan = document.createElement("span");
        tsSpan.className = "timestamp";
        li.appendChild(tsSpan);
      }
      if (msg.m === "dm") {
        if (msg.sender._id === gClient.user._id) {
          const s = document.createElement("span");
          s.className = "sentDm";
          li.appendChild(s);
        } else if (msg.recipient._id === gClient.user._id) {
          const s = document.createElement("span");
          s.className = "receivedDm";
          li.appendChild(s);
        } else {
          const s = document.createElement("span");
          s.className = "otherDm";
          li.appendChild(s);
          isSpecialDm = true;
        }
      }
      if (isSpecialDm) {
        if (settings.showIdsInChat) {
          const s = document.createElement("span");
          s.className = "id";
          li.appendChild(s);
        }
        const nameSpan = document.createElement("span");
        nameSpan.className = "name";
        li.appendChild(nameSpan);
        const arrowSpan = document.createElement("span");
        arrowSpan.className = "dmArrow";
        li.appendChild(arrowSpan);
        if (settings.showIdsInChat) {
          const s = document.createElement("span");
          s.className = "id2";
          li.appendChild(s);
        }
        const name2Span = document.createElement("span");
        name2Span.className = "name2";
        li.appendChild(name2Span);
        const msgSpan = document.createElement("span");
        msgSpan.className = "message";
        li.appendChild(msgSpan);
      } else {
        if (settings.showIdsInChat) {
          const s = document.createElement("span");
          s.className = "id";
          li.appendChild(s);
        }
        const nameSpan = document.createElement("span");
        nameSpan.className = "name";
        li.appendChild(nameSpan);
        if (msg.r) {
          const rlSpan = document.createElement("span");
          rlSpan.className = "replyLink";
          li.appendChild(rlSpan);
        }
        const msgSpan = document.createElement("span");
        msgSpan.className = "message";
        li.appendChild(msgSpan);
      }
      const replyEl = li.querySelector(".reply");
      if (replyEl)
        replyEl.textContent = "➦";
      if (msg.r) {
        const repliedMsg = messageCache.find((e) => e.id === msg.r);
        if (!getTabIsActive()) {
          if (repliedMsg?.p?._id === gClient.user._id) {
            document.title = `You have received a reply!`;
            setYoureReplied(true);
          }
        }
        if (repliedMsg) {
          const replyLinkEl = li.querySelector(".replyLink");
          replyLinkEl.textContent = `➥ ${repliedMsg.m === "dm" ? repliedMsg.sender.name : repliedMsg.p.name}`;
          Object.assign(replyLinkEl.style, {
            background: `${(repliedMsg?.m === "dm" ? repliedMsg?.sender?.color : repliedMsg?.p?.color) ?? "gray"}`
          });
          replyLinkEl.addEventListener("click", () => {
            document.querySelector("#chat input").focus();
            document.getElementById(`msg-${repliedMsg?.id}`)?.scrollIntoView({ behavior: "smooth" });
            const repliedEl = document.getElementById("msg-" + repliedMsg?.id);
            if (repliedEl)
              Object.assign(repliedEl.style, {
                border: `1px solid ${repliedMsg?.m === "dm" ? repliedMsg.sender?.color : repliedMsg.p?.color}80`,
                backgroundColor: `${repliedMsg?.m === "dm" ? repliedMsg.sender?.color : repliedMsg.p?.color}20`
              });
            setTimeout(() => {
              const el = document.getElementById("msg-" + repliedMsg?.id);
              if (el)
                Object.assign(el.style, {
                  backgroundColor: "unset",
                  border: "1px solid #00000000"
                });
            }, 5000);
          });
        } else {
          li.querySelector(".replyLink").textContent = "➥ Unknown Message";
          Object.assign(li.querySelector(".replyLink").style, { background: "gray" });
        }
      }
      if (msg.m === "dm") {
        if (msg.sender._id === gClient.user._id) {
          li.querySelector(".sentDm").textContent = "To";
          Object.assign(li.querySelector(".sentDm").style, { color: "#ff55ff" });
        } else if (msg.recipient._id === gClient.user._id) {
          li.querySelector(".receivedDm").textContent = "From";
          Object.assign(li.querySelector(".receivedDm").style, { color: "#ff55ff" });
        } else {
          li.querySelector(".otherDm").textContent = "DM";
          Object.assign(li.querySelector(".otherDm").style, { color: "#ff55ff" });
          li.querySelector(".dmArrow").textContent = "->";
          Object.assign(li.querySelector(".dmArrow").style, { color: "#ff55ff" });
        }
      }
      if (settings.showTimestampsInChat) {
        li.querySelector(".timestamp").textContent = new Date(msg.t).toLocaleTimeString();
      }
      const message = parseMarkdown(parseContent(msg.a), parseUrl).replace(/@([\da-f]{24})/g, (match, id) => {
        const user = gClient.ppl[id];
        if (user) {
          const nick = parseContent(user.name);
          if (user.id === gClient.getOwnParticipant().id) {
            if (!getTabIsActive()) {
              setYoureMentioned(true);
              document.title = window.i18nextify.i18next.t("You were mentioned!");
            }
            return `<span class="mention" style="background-color: ${user.color};">${nick}</span>`;
          } else
            return `@${nick}`;
        } else
          return match;
      });
      li.querySelector(".message").innerHTML = message;
      if (msg.m === "dm") {
        if (!settings.noChatColors)
          Object.assign(li.querySelector(".message").style, { color: msg.sender.color || "white" });
        if (settings.showIdsInChat) {
          if (msg.sender._id === gClient.user._id) {
            li.querySelector(".id").textContent = msg.recipient._id.substring(0, 6);
          } else {
            li.querySelector(".id").textContent = msg.sender._id.substring(0, 6);
          }
        }
        if (msg.sender._id === gClient.user._id) {
          if (!settings.noChatColors)
            Object.assign(li.querySelector(".name").style, { color: msg.recipient.color || "white" });
          li.querySelector(".name").textContent = msg.recipient.name + ":";
          if (settings.showChatTooltips)
            li.title = msg.recipient._id;
        } else if (msg.recipient._id === gClient.user._id) {
          if (!settings.noChatColors)
            Object.assign(li.querySelector(".name").style, { color: msg.sender.color || "white" });
          li.querySelector(".name").textContent = msg.sender.name + ":";
          if (settings.showChatTooltips)
            li.title = msg.sender._id;
        } else {
          if (!settings.noChatColors)
            Object.assign(li.querySelector(".name").style, { color: msg.sender.color || "white" });
          if (!settings.noChatColors)
            Object.assign(li.querySelector(".name2").style, { color: msg.recipient.color || "white" });
          li.querySelector(".name").textContent = msg.sender.name;
          li.querySelector(".name2").textContent = msg.recipient.name + ":";
          if (settings.showIdsInChat)
            li.querySelector(".id").textContent = msg.sender._id.substring(0, 6);
          if (settings.showIdsInChat)
            li.querySelector(".id2").textContent = msg.recipient._id.substring(0, 6);
          if (settings.showChatTooltips)
            li.title = msg.sender._id;
        }
      } else {
        if (!settings.noChatColors)
          Object.assign(li.querySelector(".message").style, { color: msg.p.color || "white" });
        if (!settings.noChatColors)
          Object.assign(li.querySelector(".name").style, { color: msg.p.color || "white" });
        li.querySelector(".name").textContent = msg.p.name + ":";
        if (!settings.noChatColors)
          Object.assign(li.querySelector(".message").style, { color: msg.p.color || "white" });
        if (settings.showIdsInChat)
          li.querySelector(".id").textContent = msg.p._id.substring(0, 6);
        if (settings.showChatTooltips)
          li.title = msg.p._id;
      }
      li.querySelector(".id")?.addEventListener("click", () => {
        if (msg.m === "dm") {
          const copyId = msg.sender._id === gClient.user._id ? msg.recipient._id : msg.sender._id;
          navigator.clipboard.writeText(copyId);
          li.querySelector(".id").textContent = "Copied";
          setTimeout(() => {
            li.querySelector(".id").textContent = copyId.substring(0, 6);
          }, 2500);
        } else {
          navigator.clipboard.writeText(msg.p._id);
          li.querySelector(".id").textContent = "Copied";
          setTimeout(() => {
            li.querySelector(".id").textContent = msg.p._id.substring(0, 6);
          }, 2500);
        }
      });
      li.querySelector(".id2")?.addEventListener("click", () => {
        navigator.clipboard.writeText(msg.recipient._id);
        li.querySelector(".id2").textContent = "Copied";
        setTimeout(() => {
          li.querySelector(".id2").textContent = msg.recipient._id.substring(0, 6);
        }, 2500);
      });
      li.querySelector(".reply")?.addEventListener("click", () => {
        if (msg.m !== "dm") {
          chat.startReply(msg.p, msg.id, msg.a);
          setTimeout(() => {
            const el = document.getElementById("msg-" + msg.id);
            if (el)
              Object.assign(el.style, {
                border: `1px solid ${msg?.m === "dm" ? msg.sender?.color : msg.p?.color}80`,
                backgroundColor: `${msg?.m === "dm" ? msg.sender?.color : msg.p?.color}20`
              });
          }, 100);
          setTimeout(() => {
            document.querySelector("#chat input").focus();
          }, 100);
        } else {
          const replyingTo = msg.sender._id === gClient.user._id ? msg.recipient : msg.sender;
          if (gClient.ppl[replyingTo._id]) {
            chat.startDmReply(replyingTo, msg.id);
            setTimeout(() => {
              const el = document.getElementById("msg-" + msg.id);
              if (el)
                Object.assign(el.style, {
                  border: `1px solid ${msg?.m === "dm" ? msg.sender?.color : msg.p?.color}80`,
                  backgroundColor: `${msg?.m === "dm" ? msg.sender?.color : msg.p?.color}20`
                });
            }, 100);
            setTimeout(() => {
              document.querySelector("#chat input").focus();
            }, 100);
          } else {
            new Notification({
              target: "#piano",
              title: "User not found.",
              text: "The user who you are trying to reply to in a DM is not found, so a DM could not be started."
            });
          }
        }
      });
      document.querySelector("#chat ul").appendChild(li);
      messageCache.push(msg);
      const eles = Array.from(document.querySelectorAll("#chat ul li"));
      for (let i = 1;i <= 50 && i <= eles.length; i++) {
        eles[eles.length - i].style.opacity = String(1 - i * 0.03);
      }
      if (eles.length > 50) {
        eles[0].style.display = "none";
      }
      if (eles.length > 256) {
        messageCache.shift();
        eles[0].remove();
      }
      if (!document.getElementById("chat").classList.contains("chatting")) {
        chat.scrollToBottom();
      } else {
        const ele = document.querySelector("#chat ul");
        if (ele.scrollTop > ele.scrollHeight - ele.offsetHeight - 50)
          chat.scrollToBottom();
      }
    }
  };
  gClient.on("ch", (msg) => {
    if (msg.ch.settings.chat) {
      chat.show();
    } else {
      chat.hide();
    }
  });
  gClient.on("disconnect", () => {});
  gClient.on("c", (msg) => {
    chat.clear();
    if (msg.c) {
      for (let i = 0;i < msg.c.length; i++) {
        chat.receive(msg.c[i]);
      }
    }
  });
  gClient.on("a", (msg) => {
    chat.receive(msg);
  });
  gClient.on("dm", (msg) => {
    chat.receive(msg);
  });
  document.querySelector("#chat input").addEventListener("focus", () => {
    releaseKb();
    document.getElementById("chat").classList.add("chatting");
    chat.scrollToBottom();
  });
  document.addEventListener("mousedown", (evt) => {
    if (!document.getElementById("chat").contains(evt.target)) {
      chat.blur();
    }
  });
  document.addEventListener("touchstart", (event) => {
    for (const i in event.changedTouches) {
      const touch = event.changedTouches[i];
      if (document.getElementById("chat").contains(touch.target)) {
        chat.blur();
      }
    }
  });
  document.addEventListener("keydown", (evt) => {
    if (document.getElementById("chat").classList.contains("chatting")) {
      if (evt.keyCode === 27) {
        chat.blur();
        if (!settings.noPreventDefault)
          evt.preventDefault();
        evt.stopPropagation();
      } else if (evt.keyCode === 13) {
        document.querySelector("#chat input").focus();
      }
    } else if (!getModal2() && (evt.keyCode === 27 || evt.keyCode === 13)) {
      document.querySelector("#chat input").focus();
    }
  });
  document.querySelector("#chat input").addEventListener("keydown", (evt) => {
    const input = evt.target;
    if (evt.keyCode === 13) {
      if (gClient.isConnected()) {
        const message = input.value;
        if (message.length === 0) {
          if (getIsDming()) {
            chat.endDM();
          }
          if (getIsReplying()) {
            chat.cancelReply(getReplyParticipant());
          }
          setTimeout(() => {
            chat.blur();
          }, 100);
        } else {
          chat.send(message);
          input.value = "";
          setTimeout(() => {
            chat.blur();
          }, 100);
        }
      }
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.keyCode === 27) {
      chat.blur();
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.keyCode === 9) {
      if (!settings.noPreventDefault)
        evt.preventDefault();
      evt.stopPropagation();
    }
  });
  state.chat = chat;
  return chat;
}

// client/src/piano/midi.ts
init_util();
init_Notification();
init_state();
init_settings();
init_actions();
init_constants();
function initMidi() {
  const gClient = getClient();
  const gPiano = getPiano();
  let devices_json = "[]";
  function sendDevices() {
    gClient.sendArray([{ m: "devices", list: JSON.parse(devices_json) }]);
  }
  gClient.on("connect", sendDevices);
  const pitchBends = {};
  for (let i = 0;i < 16; i++)
    pitchBends[i] = 0;
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then((midi) => {
      function midimessagehandler(evt) {
        if (!evt.target.enabled)
          return;
        const channel = evt.data[0] & 15;
        const cmd = evt.data[0] >> 4;
        const note_number = evt.data[1];
        let vel = evt.data[2];
        if (settings.disableMIDIDrumChannel && channel === 9)
          return;
        const { getTranspose: getTranspose2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
        const transpose2 = getTranspose2();
        if (cmd === 8 || cmd === 9 && vel === 0) {
          release(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE + transpose2 + pitchBends[channel]]);
        } else if (cmd === 9) {
          if (evt.target.volume !== undefined)
            vel *= evt.target.volume;
          press(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE + transpose2 + pitchBends[channel]], vel / 127);
        } else if (cmd === 11) {
          if (!getAutoSustain()) {
            if (note_number === 64) {
              if (vel > 20)
                pressSustain();
              else
                releaseSustain();
            }
          }
        } else if (cmd === 14) {
          let pitchMod = evt.data[1] + (evt.data[2] << 7) - 8192;
          pitchMod = Math.round(pitchMod / 1000);
          pitchBends[channel] = pitchMod;
        }
      }
      function deviceInfo(dev) {
        return { type: dev.type, manufacturer: dev.manufacturer, name: dev.name, version: dev.version, enabled: dev.enabled, volume: dev.volume };
      }
      function updateDevices() {
        const list = [];
        if (midi.inputs.size > 0) {
          const inputs = midi.inputs.values();
          for (let it = inputs.next();it && !it.done; it = inputs.next())
            list.push(deviceInfo(it.value));
        }
        if (midi.outputs.size > 0) {
          const outputs = midi.outputs.values();
          for (let it = outputs.next();it && !it.done; it = outputs.next())
            list.push(deviceInfo(it.value));
        }
        const new_json = JSON.stringify(list);
        if (new_json !== devices_json) {
          devices_json = new_json;
          sendDevices();
        }
      }
      function plug() {
        if (midi.inputs.size > 0) {
          const inputs = midi.inputs.values();
          for (let it = inputs.next();it && !it.done; it = inputs.next()) {
            const input = it.value;
            input.onmidimessage = midimessagehandler;
            if (input.enabled !== false)
              input.enabled = true;
            if (typeof input.volume === "undefined")
              input.volume = 1;
          }
        }
        if (midi.outputs.size > 0) {
          const outputs = midi.outputs.values();
          for (let it = outputs.next();it && !it.done; it = outputs.next()) {
            const output = it.value;
            if (typeof output.volume === "undefined")
              output.volume = 1;
          }
          state.midiOutTest = (note_name, vel, delay_ms, participantId) => {
            if (!settings.outputOwnNotes && participantId === gClient.participantId)
              return;
            const note_number = MIDI_KEY_NAMES.indexOf(note_name);
            if (note_number === -1)
              return;
            const nn = note_number + 9 - MIDI_TRANSPOSE;
            const outputs2 = midi.outputs.values();
            for (let it = outputs2.next();it && !it.done; it = outputs2.next()) {
              const output = it.value;
              if (output.enabled) {
                let v = vel;
                if (output.volume !== undefined)
                  v *= output.volume;
                output.send([144, nn, v], window.performance.now() + delay_ms);
              }
            }
          };
        }
        showConnections(false);
        updateDevices();
      }
      midi.addEventListener("statechange", () => {
        plug();
      });
      let connectionsNotification = null;
      function showConnections(sticky) {
        const inputs_ul = document.createElement("ul");
        if (midi.inputs.size > 0) {
          const inputs = midi.inputs.values();
          for (let it = inputs.next();it && !it.done; it = inputs.next()) {
            const input = it.value;
            const li = document.createElement("li");
            li.connectionId = input.id;
            li.classList.add("connection");
            if (input.enabled)
              li.classList.add("enabled");
            li.textContent = input.name;
            li.addEventListener("click", (evt) => {
              const ins = midi.inputs.values();
              for (let iit = ins.next();iit && !iit.done; iit = ins.next()) {
                if (iit.value.id === evt.target.connectionId) {
                  iit.value.enabled = !iit.value.enabled;
                  evt.target.classList.toggle("enabled");
                  updateDevices();
                  return;
                }
              }
            });
            if (settings.midiVolumeTest) {
              let knobCanvas = document.createElement("canvas");
              Object.assign(knobCanvas, { width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: "knob" });
              li.appendChild(knobCanvas);
              const knob = new Knob(knobCanvas, 0, 2, 0.01, input.volume, "volume");
              knob.canvas.style.width = "16px";
              knob.canvas.style.height = "16px";
              knob.canvas.style.float = "right";
              knob.on("change", (k) => {
                input.volume = k.value;
              });
              knob.emit("change", knob);
            }
            inputs_ul.appendChild(li);
          }
        } else {
          inputs_ul.textContent = "(none)";
        }
        const outputs_ul = document.createElement("ul");
        if (midi.outputs.size > 0) {
          const outputs = midi.outputs.values();
          for (let it = outputs.next();it && !it.done; it = outputs.next()) {
            const output = it.value;
            const li = document.createElement("li");
            li.connectionId = output.id;
            li.classList.add("connection");
            if (output.enabled)
              li.classList.add("enabled");
            li.textContent = output.name;
            li.addEventListener("click", (evt) => {
              const outs = midi.outputs.values();
              for (let oit = outs.next();oit && !oit.done; oit = outs.next()) {
                if (oit.value.id === evt.target.connectionId) {
                  oit.value.enabled = !oit.value.enabled;
                  evt.target.classList.toggle("enabled");
                  updateDevices();
                  return;
                }
              }
            });
            if (settings.midiVolumeTest) {
              let knobCanvas = document.createElement("canvas");
              Object.assign(knobCanvas, { width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: "knob" });
              li.appendChild(knobCanvas);
              const knob = new Knob(knobCanvas, 0, 2, 0.01, output.volume, "volume");
              knob.canvas.style.width = "16px";
              knob.canvas.style.height = "16px";
              knob.canvas.style.float = "right";
              knob.on("change", (k) => {
                output.volume = k.value;
              });
              knob.emit("change", knob);
            }
            outputs_ul.appendChild(li);
          }
        } else {
          outputs_ul.textContent = "(none)";
        }
        outputs_ul.setAttribute("translated", "");
        inputs_ul.setAttribute("translated", "");
        const div = document.createElement("div");
        let h1 = document.createElement("h1");
        h1.textContent = "Inputs";
        div.appendChild(h1);
        div.appendChild(inputs_ul);
        h1 = document.createElement("h1");
        h1.textContent = "Outputs";
        div.appendChild(h1);
        div.appendChild(outputs_ul);
        connectionsNotification = new Notification({ id: "MIDI-Connections", title: "MIDI Connections", duration: sticky ? -1 : 4500, html: div, target: "#midi-btn" });
      }
      plug();
      document.getElementById("midi-btn").addEventListener("click", () => {
        if (!document.getElementById("Notification-MIDI-Connections"))
          showConnections(true);
        else
          connectionsNotification.close();
      });
    }, () => {});
  }
  window.onerror = function(_message, _url, _line) {};
}

// client/src/piano/synth.ts
init_util();
init_Notification();
init_state();
init_constants();
function initSynth() {
  const piano = getPiano();
  const audio = piano.audio;
  const context = piano.audio.context;
  const synth_gain = context.createGain();
  synth_gain.gain.value = 0.05;
  synth_gain.connect(audio.synthGain);
  const osc_types = ["sine", "square", "sawtooth", "triangle"];
  let osc_type_index = 1;
  let osc1_type = "square";
  let osc1_attack = 0;
  let osc1_decay = 0.2;
  let osc1_sustain = 0.5;
  let osc1_release = 2;
  function SynthVoice(note_name, time) {
    const note_number = MIDI_KEY_NAMES.indexOf(note_name) + 9 - MIDI_TRANSPOSE;
    const freq = Math.pow(2, (note_number - 69) / 12) * 440;
    this.osc = context.createOscillator();
    this.osc.type = osc1_type;
    this.osc.frequency.value = freq;
    this.gain = context.createGain();
    this.gain.gain.value = 0;
    this.osc.connect(this.gain);
    this.gain.connect(synth_gain);
    this.osc.start(time);
    this.gain.gain.setValueAtTime(0, time);
    this.gain.gain.linearRampToValueAtTime(1, time + osc1_attack);
    this.gain.gain.linearRampToValueAtTime(osc1_sustain, time + osc1_attack + osc1_decay);
  }
  SynthVoice.prototype.stop = function(time) {
    this.gain.gain.linearRampToValueAtTime(0, time + osc1_release);
    this.osc.stop(time + osc1_release);
  };
  state.enableSynth = false;
  state.synthVoice = SynthVoice;
  const button = document.getElementById("synth-btn");
  let notification = null;
  button.addEventListener("click", () => {
    if (notification)
      notification.close();
    else
      showSynth();
  });
  function showSynth() {
    const html = document.createElement("div");
    const onOffBtn = document.createElement("input");
    Object.assign(onOffBtn, { type: "button", value: window.i18nextify.i18next.t("ON/OFF"), className: state.enableSynth ? "switched-on" : "switched-off" });
    onOffBtn.addEventListener("click", () => {
      state.enableSynth = !state.enableSynth;
      onOffBtn.className = state.enableSynth ? "switched-on" : "switched-off";
      if (!state.enableSynth) {
        for (const i in audio.playings) {
          if (!audio.playings.hasOwnProperty(i))
            continue;
          const playing = audio.playings[i];
          if (playing && playing.voice) {
            playing.voice.osc.stop();
            playing.voice = undefined;
          }
        }
      }
    });
    html.appendChild(onOffBtn);
    let knobCanvas = document.createElement("canvas");
    Object.assign(knobCanvas, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob" });
    html.appendChild(knobCanvas);
    let knob = new Knob(knobCanvas, 0, 100, 0.1, 50, "mix", "%");
    knob.canvas.style.width = "32px";
    knob.canvas.style.height = "32px";
    knob.on("change", (k) => {
      const mix = k.value / 100;
      audio.pianoGain.gain.value = 1 - mix;
      audio.synthGain.gain.value = mix;
    });
    knob.emit("change", knob);
    const typeBtn = document.createElement("input");
    Object.assign(typeBtn, { type: "button", value: window.i18nextify.i18next.t(osc_types[osc_type_index]) });
    typeBtn.addEventListener("click", () => {
      if (++osc_type_index >= osc_types.length)
        osc_type_index = 0;
      osc1_type = osc_types[osc_type_index];
      typeBtn.value = window.i18nextify.i18next.t(osc1_type);
    });
    html.appendChild(typeBtn);
    const knobConfigs = [
      { min: 0, max: 1, step: 0.001, value: osc1_attack, name: "osc1 attack", unit: "s", setter: (v) => {
        osc1_attack = v;
      } },
      { min: 0, max: 2, step: 0.001, value: osc1_decay, name: "osc1 decay", unit: "s", setter: (v) => {
        osc1_decay = v;
      } },
      { min: 0, max: 1, step: 0.001, value: osc1_sustain, name: "osc1 sustain", unit: "x", setter: (v) => {
        osc1_sustain = v;
      } },
      { min: 0, max: 2, step: 0.001, value: osc1_release, name: "osc1 release", unit: "s", setter: (v) => {
        osc1_release = v;
      } }
    ];
    for (const cfg of knobConfigs) {
      knobCanvas = document.createElement("canvas");
      Object.assign(knobCanvas, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob" });
      html.appendChild(knobCanvas);
      knob = new Knob(knobCanvas, cfg.min, cfg.max, cfg.step, cfg.value, cfg.name, cfg.unit);
      knob.canvas.style.width = "32px";
      knob.canvas.style.height = "32px";
      knob.on("change", ((s) => (k) => {
        s(k.value);
      })(cfg.setter));
      knob.emit("change", knob);
    }
    notification = new Notification({ title: "Synthesize", html, duration: -1, target: "#synth-btn" });
    notification.on("close", () => {
      const tip = document.getElementById("tooltip");
      if (tip)
        tip.parentNode.removeChild(tip);
      notification = null;
    });
  }
}

// client/src/modules/settings/settings-ui.ts
init_Notification();
init_state();
init_settings();
init_modal();
init_constants();
function initSettingsUI() {
  if (window.location.hostname === "multiplayerpiano.com") {
    const button = document.getElementById("client-settings-btn");
    let notification = null;
    button.addEventListener("click", () => {
      if (notification) {
        notification.close();
      } else {
        showSynth();
      }
    });
    const showSynth = () => {
      const html = document.createElement("div");
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Show user IDs in chat";
        if (settings.showIdsInChat) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.showIdsInChat = setting.classList.contains("enabled");
          settings.showIdsInChat = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Timestamps in chat";
        if (settings.showTimestampsInChat) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.showTimestampsInChat = setting.classList.contains("enabled");
          settings.showTimestampsInChat = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "No chat colors";
        if (settings.noChatColors) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.noChatColors = setting.classList.contains("enabled");
          settings.noChatColors = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Force dark background";
        if (settings.noBackgroundColor) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.noBackgroundColor = setting.classList.contains("enabled");
          settings.noBackgroundColor = setting.classList.contains("enabled");
          const client = getClient();
          if (client.channel.settings.color && !settings.noBackgroundColor) {
            window.setBackgroundColor(client.channel.settings.color, client.channel.settings.color2);
          } else {
            window.setBackgroundColorToDefault();
          }
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Output own notes to MIDI";
        if (settings.outputOwnNotes) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.outputOwnNotes = setting.classList.contains("enabled");
          settings.outputOwnNotes = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Virtual Piano layout";
        if (settings.virtualPianoLayout) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.virtualPianoLayout = setting.classList.contains("enabled");
          settings.virtualPianoLayout = setting.classList.contains("enabled");
          const { setKeyBinding: setKeyBinding2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
          setKeyBinding2(settings.virtualPianoLayout);
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Show _id tooltips";
        if (settings.showChatTooltips) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.showChatTooltips = setting.classList.contains("enabled");
          settings.showChatTooltips = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Show Piano Notes";
        if (settings.showPianoNotes) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.showPianoNotes = setting.classList.contains("enabled");
          settings.showPianoNotes = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Enable smooth cursors";
        if (settings.smoothCursor) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.smoothCursor = setting.classList.contains("enabled");
          settings.smoothCursor = setting.classList.contains("enabled");
          const client = getClient();
          if (settings.smoothCursor) {
            document.getElementById("cursors").setAttribute("smooth-cursors", "");
          } else {
            document.getElementById("cursors").removeAttribute("smooth-cursors");
          }
          if (settings.smoothCursor) {
            Object.values(client.ppl).forEach((participant) => {
              if (participant.cursorDiv) {
                participant.cursorDiv.style.left = "";
                participant.cursorDiv.style.top = "";
                participant.cursorDiv.style.transform = "translate3d(" + participant.x + "vw, " + participant.y + "vh, 0)";
              }
            });
          } else {
            Object.values(client.ppl).forEach((participant) => {
              if (participant.cursorDiv) {
                participant.cursorDiv.style.left = participant.x + "%";
                participant.cursorDiv.style.top = participant.y + "%";
                participant.cursorDiv.style.transform = "";
              }
            });
          }
        };
        html.appendChild(setting);
      })();
      (() => {
        const setting = document.createElement("select");
        setting.className = "setting";
        setting.style.cssText = "color: inherit; width: calc(100% - 2px);";
        setting.setAttribute("translated", "");
        const keys = Object.keys(BASIC_PIANO_SCALES);
        const defaultOption = document.createElement("option");
        defaultOption.value = defaultOption.innerText = "No highlighted notes";
        defaultOption.selected = !settings.highlightScaleNotes;
        setting.appendChild(defaultOption);
        for (const key of keys) {
          const option = document.createElement("option");
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
      (() => {
        const setting = document.createElement("div");
        setting.className = "setting";
        setting.innerText = "Hide all cursors";
        if (settings.hideAllCursors) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = () => {
          setting.classList.toggle("enabled");
          localStorage.hideAllCursors = setting.classList.contains("enabled");
          settings.hideAllCursors = setting.classList.contains("enabled");
          if (settings.hideAllCursors) {
            document.getElementById("cursors").style.display = "none";
          } else {
            document.getElementById("cursors").style.display = "block";
          }
        };
        html.appendChild(setting);
      })();
      notification = new Notification({
        title: "Client Settings",
        html,
        duration: -1,
        target: "#client-settings-btn"
      });
      notification.on("close", () => {
        const tip = document.getElementById("tooltip");
        if (tip)
          tip.parentNode.removeChild(tip);
        notification = null;
      });
    };
  } else {
    const button = document.getElementById("client-settings-btn");
    const content = document.getElementById("client-settings-content");
    const tablinks = document.getElementsByClassName("client-settings-tablink");
    const okButton = document.getElementById("client-settings-ok-btn");
    button.addEventListener("click", (evt) => {
      evt.stopPropagation();
      openModal("#client-settings");
    });
    okButton.addEventListener("click", (evt) => {
      evt.stopPropagation();
      closeModal2();
    });
    const createSetting = (id, labelText, isChecked, addBr, container, onclickFunc) => {
      const setting = document.createElement("input");
      setting.type = "checkbox";
      setting.id = id;
      setting.checked = isChecked;
      setting.onclick = onclickFunc;
      const label = document.createElement("label");
      label.innerText = window.i18nextify.i18next.t(labelText + ":") + " ";
      label.appendChild(setting);
      container.appendChild(label);
      if (addBr)
        container.appendChild(document.createElement("br"));
    };
    window.changeClientSettingsTab = (evt, tabName) => {
      content.innerHTML = "";
      for (let index = 0;index < tablinks.length; index++) {
        tablinks[index].className = tablinks[index].className.replace(" active", "");
      }
      evt.currentTarget.className += " active";
      switch (tabName.toLowerCase()) {
        case "chat": {
          const html = document.createElement("div");
          createSetting("show-timestamps-in-chat", "Show timestamps in chat", settings.showTimestampsInChat, true, html, () => {
            settings.showTimestampsInChat = !settings.showTimestampsInChat;
            localStorage.showTimestampsInChat = settings.showTimestampsInChat;
          });
          createSetting("show-user-ids-in-chat", "Show user IDs in chat", settings.showIdsInChat, true, html, () => {
            settings.showIdsInChat = !settings.showIdsInChat;
            localStorage.showIdsInChat = settings.showIdsInChat;
          });
          createSetting("show-id-tooltips", "Show ID tooltips", settings.showChatTooltips, true, html, () => {
            settings.showChatTooltips = !settings.showChatTooltips;
            localStorage.showChatTooltips = settings.showChatTooltips;
          });
          createSetting("no-chat-colors", "No chat colors", settings.noChatColors, true, html, () => {
            settings.noChatColors = !settings.noChatColors;
            localStorage.noChatColors = settings.noChatColors;
          });
          createSetting("hide-chat", "Hide chat", settings.hideChatLocal, true, html, () => {
            settings.hideChatLocal = !settings.hideChatLocal;
            localStorage.hideChat = settings.hideChatLocal;
            if (settings.hideChatLocal) {
              document.getElementById("chat").style.display = "none";
            } else {
              document.getElementById("chat").style.display = "block";
            }
          });
          createSetting("cancel-dms", "Cancel DMs when recipient leaves", settings.cancelDMs, false, html, () => {
            settings.cancelDMs = !settings.cancelDMs;
            localStorage.cancelDMs = settings.cancelDMs;
          });
          content.appendChild(html);
          break;
        }
        case "midi": {
          const html = document.createElement("div");
          createSetting("output-own-notes-to-midi", "Output own notes to MIDI", settings.outputOwnNotes, true, html, () => {
            settings.outputOwnNotes = !settings.outputOwnNotes;
            localStorage.outputOwnNotes = settings.outputOwnNotes;
          });
          createSetting("disable-midi-drum-channel", "Disable MIDI Drum Channel (channel 10)", settings.disableMIDIDrumChannel, true, html, () => {
            settings.disableMIDIDrumChannel = !settings.disableMIDIDrumChannel;
            localStorage.disableMIDIDrumChannel = settings.disableMIDIDrumChannel;
          });
          content.appendChild(html);
          break;
        }
        case "piano": {
          const html = document.createElement("div");
          createSetting("virtual-piano-layout", "Virtual Piano layout", settings.virtualPianoLayout, true, html, () => {
            settings.virtualPianoLayout = !settings.virtualPianoLayout;
            localStorage.virtualPianoLayout = settings.virtualPianoLayout;
            const { setKeyBinding: setKeyBinding2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
            setKeyBinding2(settings.virtualPianoLayout);
          });
          createSetting("show-piano-notes", "Show piano notes", settings.showPianoNotes, true, html, () => {
            settings.showPianoNotes = !settings.showPianoNotes;
            localStorage.showPianoNotes = settings.showPianoNotes;
          });
          createSetting("hide-piano", "Hide piano", settings.hidePianoLocal, true, html, () => {
            settings.hidePianoLocal = !settings.hidePianoLocal;
            localStorage.hidePiano = settings.hidePianoLocal;
            if (settings.hidePianoLocal) {
              document.getElementById("piano").style.display = "none";
            } else {
              document.getElementById("piano").style.display = "block";
            }
          });
          const selectSetting = document.createElement("select");
          selectSetting.className = "setting";
          selectSetting.style.cssText = "width: calc(58.7% - 2px);";
          selectSetting.onchange = () => {
            localStorage.highlightScaleNotes = selectSetting.value;
            settings.highlightScaleNotes = selectSetting.value;
          };
          const keys = Object.keys(BASIC_PIANO_SCALES);
          const defaultOption = document.createElement("option");
          defaultOption.value = defaultOption.innerText = "None";
          defaultOption.selected = !settings.highlightScaleNotes;
          selectSetting.appendChild(defaultOption);
          for (const key of keys) {
            const option = document.createElement("option");
            option.value = key;
            option.innerText = key;
            option.selected = key === settings.highlightScaleNotes;
            selectSetting.appendChild(option);
          }
          if (settings.highlightScaleNotes) {
            selectSetting.value = settings.highlightScaleNotes;
          }
          const label = document.createElement("label");
          label.setAttribute("for", selectSetting.id);
          label.innerText = "Highlighted notes: ";
          html.appendChild(label);
          html.appendChild(selectSetting);
          content.appendChild(html);
          break;
        }
        case "misc": {
          const html = document.createElement("div");
          createSetting("dont-use-prevent-default", "Don't use prevent default", settings.noPreventDefault, true, html, () => {
            settings.noPreventDefault = !settings.noPreventDefault;
            localStorage.noPreventDefault = settings.noPreventDefault;
          });
          createSetting("force-dark-background", "Force dark background", settings.noBackgroundColor, true, html, () => {
            settings.noBackgroundColor = !settings.noBackgroundColor;
            localStorage.noBackgroundColor = settings.noBackgroundColor;
            const client = getClient();
            if (client.channel.settings.color && !settings.noBackgroundColor) {
              window.setBackgroundColor(client.channel.settings.color, client.channel.settings.color2);
            } else {
              window.setBackgroundColorToDefault();
            }
          });
          createSetting("enable-smooth-cursors", "Enable smooth cursors", settings.smoothCursor, true, html, () => {
            settings.smoothCursor = !settings.smoothCursor;
            localStorage.smoothCursor = settings.smoothCursor;
            const client = getClient();
            if (settings.smoothCursor) {
              document.getElementById("cursors").setAttribute("smooth-cursors", "");
              Object.values(client.ppl).forEach((participant) => {
                if (participant.cursorDiv) {
                  participant.cursorDiv.style.left = "";
                  participant.cursorDiv.style.top = "";
                  participant.cursorDiv.style.transform = "translate3d(" + participant.x + "vw, " + participant.y + "vh, 0)";
                }
              });
            } else {
              document.getElementById("cursors").removeAttribute("smooth-cursors");
              Object.values(client.ppl).forEach((participant) => {
                if (participant.cursorDiv) {
                  participant.cursorDiv.style.left = participant.x + "%";
                  participant.cursorDiv.style.top = participant.y + "%";
                  participant.cursorDiv.style.transform = "";
                }
              });
            }
          });
          createSetting("hide-all-cursors", "Hide all cursors", settings.hideAllCursors, true, html, () => {
            settings.hideAllCursors = !settings.hideAllCursors;
            localStorage.hideAllCursors = settings.hideAllCursors;
            if (settings.hideAllCursors) {
              document.getElementById("cursors").style.display = "none";
            } else {
              document.getElementById("cursors").style.display = "block";
            }
          });
          createSetting("hide-bot-users", "Hide all bots", settings.hideBotUsers, true, html, () => {
            settings.hideBotUsers = !settings.hideBotUsers;
            localStorage.hideBotUsers = settings.hideBotUsers;
            const client = getClient();
            Object.values(client.ppl).forEach((participant) => {
              if (participant.tag && participant.tag.text === "BOT" && participant.cursorDiv) {
                if (settings.hideBotUsers) {
                  const nd = document.getElementById("namediv-" + participant.id);
                  if (nd)
                    nd.style.display = "none";
                  participant.cursorDiv.style.display = "none";
                } else {
                  const nd = document.getElementById("namediv-" + participant.id);
                  if (nd)
                    nd.style.display = "block";
                  participant.cursorDiv.style.display = "block";
                }
              }
            });
          });
          if (new Date().getMonth() === 11) {
            createSetting("snowflakes", "Enable snowflakes", settings.snowflakes, true, html, () => {
              settings.snowflakes = !settings.snowflakes;
              localStorage.snowflakes = settings.snowflakes;
              const { shouldShowSnowflakes: shouldShowSnowflakes2 } = (init_keyboard(), __toCommonJS(exports_keyboard));
              shouldShowSnowflakes2();
            });
          }
          content.appendChild(html);
          break;
        }
      }
    };
    window.changeClientSettingsTab({
      currentTarget: document.getElementsByClassName("client-settings-tablink")[0]
    }, "Chat");
  }
}

// client/src/modules/confetti.ts
init_state();
init_modal();
function initConfetti() {
  const gClient = getClient();
  let maxParticleCount = 500;
  let particleSpeed = 2;
  let streamingConfetti = false;
  let animationTimer = null;
  let particles = [];
  let waveAngle = 0;
  const colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];
  function resetParticle(particle, width, height) {
    particle.color = colors[Math.random() * colors.length | 0];
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = 0;
    return particle;
  }
  function startConfetti() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let canvas = document.getElementById("confetti-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "confetti-canvas";
      canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:absolute;top:0;left:0");
      document.body.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, true);
    }
    const context = canvas.getContext("2d");
    while (particles.length < maxParticleCount)
      particles.push(resetParticle({}, width, height));
    streamingConfetti = true;
    if (animationTimer === null) {
      (function runAnimation() {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (particles.length === 0)
          animationTimer = null;
        else {
          updateParticles();
          drawParticles(context);
          animationTimer = requestAnimationFrame(runAnimation);
        }
      })();
    }
  }
  function stopConfetti() {
    streamingConfetti = false;
  }
  function removeConfetti() {
    stopConfetti();
    particles = [];
  }
  function drawParticles(context) {
    for (let i = 0;i < particles.length; i++) {
      const p = particles[i];
      context.beginPath();
      context.lineWidth = p.diameter;
      context.strokeStyle = p.color;
      context.shadowColor = "rgba(0, 0, 0, .3)";
      context.shadowBlur = 4;
      context.shadowOffsetY = 2;
      context.shadowOffsetX = 0;
      const x = p.x + p.tilt;
      context.moveTo(x + p.diameter / 2, p.y);
      context.lineTo(x, p.y + p.tilt + p.diameter / 2);
      context.stroke();
    }
  }
  function updateParticles() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    waveAngle += 0.01;
    for (let i = 0;i < particles.length; i++) {
      const p = particles[i];
      if (!streamingConfetti && p.y < -15)
        p.y = height + 100;
      else {
        p.tiltAngle += p.tiltAngleIncrement;
        p.x += Math.sin(waveAngle);
        p.y += (Math.cos(waveAngle) + p.diameter + particleSpeed) * 0.5;
        p.tilt = Math.sin(p.tiltAngle) * 15;
      }
      if (p.x > width + 20 || p.x < -20 || p.y > height) {
        if (streamingConfetti && particles.length <= maxParticleCount)
          resetParticle(p, width, height);
        else {
          particles.splice(i, 1);
          i--;
        }
      }
    }
  }
  if (window !== top) {
    alert("Hey, it looks like you're visiting our site through another website. Consider playing Multiplayer Piano directly at https://multiplayerpiano.net");
  }
  (async () => {
    const translationIdsWithNames = [{ code: "bg", name: "Bulgarian", native: "Български" }, { code: "cs", name: "Czech", native: "Česky" }, { code: "de", name: "German", native: "Deutsch" }, { code: "en", name: "English", native: "English" }, { code: "es", name: "Spanish", native: "Español" }, { code: "fr", name: "French", native: "Français" }, { code: "hu", name: "Hungarian", native: "Magyar" }, { code: "is", name: "Icelandic", native: "Íslenska" }, { code: "ja", name: "Japanese", native: "日本語" }, { code: "ko", name: "Korean", native: "한국어" }, { code: "lv", name: "Latvian", native: "Latviešu" }, { code: "nb", name: "Norwegian Bokmål", native: "Norsk bokmål" }, { code: "nl", name: "Dutch", native: "Nederlands" }, { code: "pl", name: "Polish", native: "Polski" }, { code: "pt", name: "Portuguese", native: "Português" }, { code: "ru", name: "Russian", native: "Русский" }, { code: "sk", name: "Slovak", native: "Slovenčina" }, { code: "sv", name: "Swedish", native: "Svenska" }, { code: "tr", name: "Turkish", native: "Türkçe" }, { code: "zh", name: "Chinese", native: "中文" }];
    const languages = document.getElementById("languages");
    function createTranslationOptions() {
      translationIdsWithNames.forEach((z) => {
        const option = document.createElement("option");
        option.value = z.code;
        option.innerText = z.native;
        if (z.code === window.i18nextify.i18next.language.split("-")[0])
          option.selected = true;
        option.setAttribute("translated", "");
        languages.appendChild(option);
      });
    }
    if (window.i18nextify.i18next.isInitialized)
      createTranslationOptions();
    else
      window.i18nextify.i18next.on("initialized", () => {
        createTranslationOptions();
      });
    document.getElementById("lang-btn").addEventListener("click", () => {
      openModal("#language");
    });
    document.querySelector("#language > button").addEventListener("click", async () => {
      await window.i18nextify.i18next.changeLanguage(document.querySelector("#languages").selectedOptions[0].value);
      window.i18nextify.forceRerender();
      closeModal2();
    });
  })();
  gClient.start();
}

// client/src/main.ts
init_Notification();
init_actions();
var translation = window.i18nextify.init({ autorun: false });
if (location.host === "multiplayerpiano.com") {
  const url = new URL("https://multiplayerpiano.net/" + location.search);
  if (localStorage.token)
    url.searchParams.set("token", localStorage.token);
  location.replace(url.toString());
  throw new Error("Redirecting to multiplayerpiano.net");
}
if (location.host === "multiplayerpiano.net") {
  const url = new URL(location.href);
  const token = url.searchParams.get("token");
  if (token) {
    localStorage.token = token;
    url.searchParams.delete("token");
    location.replace(url.toString());
    throw new Error("Finalizing redirect.");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  translation.start();
  console.log("%cMPP Developer Console", "color: #0066ff; font-size:20px;");
  console.log(`%cCheck out the client source : https://github.com/mppnet/frontend/tree/main/client
Guide for developers: https://docs.google.com/document/d/1OrxwdLD1l1TE8iau6ToETVmnLuLXyGBhA0VfAY1Lf14/edit?usp=sharing`, "color:gray; font-size:12px;");
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) {
    setTimeout(cb, 1000 / 30);
    return 0;
  };
  const piano = new Piano(document.getElementById("piano"));
  state.piano = piano;
  const soundSelector = new SoundSelector(piano);
  soundSelector.addPacks([
    "/sounds/Emotional/",
    "/sounds/Emotional_2.0/",
    "/sounds/GreatAndSoftPiano/",
    "/sounds/HardAndToughPiano/",
    "/sounds/HardPiano/",
    "/sounds/Harp/",
    "/sounds/Harpsicord/",
    "/sounds/LoudAndProudPiano/",
    "/sounds/MLG/",
    "/sounds/Music_Box/",
    "/sounds/NewPiano/",
    "/sounds/Orchestra/",
    "/sounds/Piano2/",
    "/sounds/PianoSounds/",
    "/sounds/Rhodes_MK1/",
    "/sounds/SoftPiano/",
    "/sounds/Steinway_Grand/",
    "/sounds/Untitled/",
    "/sounds/Vintage_Upright/",
    "/sounds/Vintage_Upright_Soft/"
  ]);
  soundSelector.init();
  state.soundSelector = soundSelector;
  const client = initConnection();
  initKeyboard();
  initRooms();
  const chat = initChat();
  initMidi();
  initSynth();
  initSettingsUI();
  initConfetti();
  window.MPP = {
    get press() {
      return press;
    },
    set press(fn) {
      setPress(fn);
    },
    get release() {
      return release;
    },
    set release(fn) {
      setRelease(fn);
    },
    get pressSustain() {
      return pressSustain;
    },
    set pressSustain(fn) {
      setPressSustain(fn);
    },
    get releaseSustain() {
      return releaseSustain;
    },
    set releaseSustain(fn) {
      setReleaseSustain(fn);
    },
    piano,
    client,
    chat,
    noteQuota: state.noteQuota,
    soundSelector,
    Notification
  };
});


// 钢琴

$(function () {

  var test_mode = (window.location.hash && window.location.hash.match(/^(?:#.+)*#test(?:#.+)*$/i));

  var gSeeOwnCursor = (window.location.hash && window.location.hash.match(/^(?:#.+)*#seeowncursor(?:#.+)*$/i));

  var gMidiVolumeTest = (window.location.hash && window.location.hash.match(/^(?:#.+)*#midivolumetest(?:#.+)*$/i));

  var gMidiOutTest;

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
      var len = this.length >>> 0;
      var from = Number(arguments[1]) || 0;
      from = (from < 0) ? Math.ceil(from) : Math.floor(from);
      if (from < 0) from += len;
      for (; from < len; from++) {
        if (from in this && this[from] === elt) return from;
      }
      return -1;
    };
  }

  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    || function (cb) { setTimeout(cb, 1000 / 30); };





































  var DEFAULT_VELOCITY = 0.5;












































  var TIMING_TARGET = 1000;



















  // Utility

  ////////////////////////////////////////////////////////////////



  var Rect = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.x2 = x + w;
    this.y2 = y + h;
  };
  Rect.prototype.contains = function (x, y) {
    return (x >= this.x && x <= this.x2 && y >= this.y && y <= this.y2);
  };
















  // performing translation

  ////////////////////////////////////////////////////////////////

  var Translation = (function () {
    var strings = {
      "people are playing": {
        "pt": "pessoas estão jogando",
        "es": "personas están jugando",
        "ru": "человек играет",
        "fr": "personnes jouent",
        "ja": "人が遊んでいる",
        "de": "Leute spielen",
        "zh": "人在玩",
        "nl": "mensen spelen",
        "pl": "osób grają",
        "hu": "ember játszik"
      },
      "New Room...": {
        "pt": "Nova Sala ...",
        "es": "Nueva sala de...",
        "ru": "Новый номер...",
        "ja": "新しい部屋",
        "zh": "新房间",
        "nl": "nieuwe Kamer",
        "hu": "új szoba"
      },
      "room name": {
        "pt": "nome da sala",
        "es": "sala de nombre",
        "ru": "название комнаты",
        "fr": "nom de la chambre",
        "ja": "ルーム名",
        "de": "Raumnamen",
        "zh": "房间名称",
        "nl": "kamernaam",
        "pl": "nazwa pokój",
        "hu": "szoba neve"
      },
      "Visible (open to everyone)": {
        "pt": "Visível (aberto a todos)",
        "es": "Visible (abierto a todo el mundo)",
        "ru": "Visible (открытый для всех)",
        "fr": "Visible (ouvert à tous)",
        "ja": "目に見える（誰にでも開いている）",
        "de": "Sichtbar (offen für alle)",
        "zh": "可见（向所有人开放）",
        "nl": "Zichtbaar (open voor iedereen)",
        "pl": "Widoczne (otwarte dla wszystkich)",
        "hu": "Látható (nyitott mindenki számára)"
      },
      "Enable Chat": {
        "pt": "Ativar bate-papo",
        "es": "Habilitar chat",
        "ru": "Включить чат",
        "fr": "Activer discuter",
        "ja": "チャットを有効にする",
        "de": "aktivieren Sie chatten",
        "zh": "启用聊天",
        "nl": "Chat inschakelen",
        "pl": "Włącz czat",
        "hu": "a csevegést"
      },
      "Play Alone": {
        "pt": "Jogar Sozinho",
        "es": "Jugar Solo",
        "ru": "Играть в одиночку",
        "fr": "Jouez Seul",
        "ja": "一人でプレイ",
        "de": "Alleine Spielen",
        "zh": "独自玩耍",
        "nl": "Speel Alleen",
        "pl": "Zagraj sam",
        "hu": "Játssz egyedül"
      }
      // todo: it, tr, th, sv, ar, fi, nb, da, sv, he, cs, ko, ro, vi, id, nb, el, sk, bg, lt, sl, hr
      // todo: Connecting, Offline mode, input placeholder, Notifications
    };

    var setLanguage = function (lang) {
      language = lang
    };

    var getLanguage = function () {
      if (window.navigator && navigator.language && navigator.language.length >= 2) {
        return navigator.language.substr(0, 2).toLowerCase();
      } else {
        return "en";
      }
    };

    var get = function (text, lang) {
      if (typeof lang === "undefined") lang = language;
      var row = strings[text];
      if (row == undefined) return text;
      var string = row[lang];
      if (string == undefined) return text;
      return string;
    };

    var perform = function (lang) {
      if (typeof lang === "undefined") lang = language;
      $(".translate").each(function (i, ele) {
        var th = $(this);
        if (ele.tagName && ele.tagName.toLowerCase() == "input") {
          if (typeof ele.placeholder != "undefined") {
            th.attr("placeholder", get(th.attr("placeholder"), lang))
          }
        } else {
          th.text(get(th.text(), lang));
        }
      });
    };

    var language = getLanguage();

    return {
      setLanguage: setLanguage,
      getLanguage: getLanguage,
      get: get,
      perform: perform
    };
  })();

  Translation.perform();















  // AudioEngine classes

  ////////////////////////////////////////////////////////////////

  var AudioEngine = function () {
  };

  AudioEngine.prototype.init = function (cb) {
    this.volume = 0.6;
    this.sounds = {};
    this.paused = true;
    return this;
  };

  AudioEngine.prototype.load = function (id, url, cb) {
  };

  AudioEngine.prototype.play = function () {
  };

  AudioEngine.prototype.stop = function () {
  };

  AudioEngine.prototype.setVolume = function (vol) {
    this.volume = vol;
  };

  AudioEngine.prototype.resume = function () {
    this.paused = false;
  };


  AudioEngineWeb = function () {
    this.threshold = 0;
    this.worker = new Worker("/workerTimer.js");
    var self = this;
    this.worker.onmessage = function (event) {
      if (event.data.args)
        if (event.data.args.action == 0) {
          self.actualPlay(event.data.args.id, event.data.args.vol, event.data.args.time, event.data.args.part_id);
        }
        else {
          self.actualStop(event.data.args.id, event.data.args.time, event.data.args.part_id);
        }
    }
  };

  AudioEngineWeb.prototype = new AudioEngine();

  AudioEngineWeb.prototype.init = function (cb) {
    AudioEngine.prototype.init.call(this);

    this.context = new AudioContext({ latencyHint: 'interactive' });

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

    // for synth mix
    this.pianoGain = this.context.createGain();
    this.pianoGain.gain.value = 0.5;
    this.pianoGain.connect(this.limiterNode);
    this.synthGain = this.context.createGain();
    this.synthGain.gain.value = 0.5;
    this.synthGain.connect(this.limiterNode);

    this.playings = {};

    if (cb) setTimeout(cb, 0);
    return this;
  };

  AudioEngineWeb.prototype.load = function (id, url, cb) {
    var audio = this;
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.responseType = "arraybuffer";
    req.addEventListener("readystatechange", function (evt) {
      if (req.readyState !== 4) return;
      try {
        audio.context.decodeAudioData(req.response, function (buffer) {
          audio.sounds[id] = buffer;
          if (cb) cb();
        });
      } catch (e) {
        /*throw new Error(e.message
          + " / id: " + id
          + " / url: " + url
          + " / status: " + req.status
          + " / ArrayBuffer: " + (req.response instanceof ArrayBuffer)
          + " / byteLength: " + (req.response && req.response.byteLength ? req.response.byteLength : "undefined"));*/
        new Notification({
          id: "audio-download-error", title: "Problem", text: "For some reason, an audio download failed with a status of " + req.status + ". ",
          target: "#piano", duration: 10000
        });
      }
    });
    req.send();
  };

  AudioEngineWeb.prototype.actualPlay = function (id, vol, time, part_id) { //the old play(), but with time insted of delay_ms.
    if (this.paused) return;
    if (!this.sounds.hasOwnProperty(id)) return;
    var source = this.context.createBufferSource();
    source.buffer = this.sounds[id];
    var gain = this.context.createGain();
    gain.gain.value = vol;
    source.connect(gain);
    gain.connect(this.pianoGain);
    source.start(time);
    // Patch from ste-art remedies stuttering under heavy load
    if (this.playings[id]) {
      var playing = this.playings[id];
      playing.gain.gain.setValueAtTime(playing.gain.gain.value, time);
      playing.gain.gain.linearRampToValueAtTime(0.0, time + 0.2);
      playing.source.stop(time + 0.21);
      if (enableSynth && playing.voice) {
        playing.voice.stop(time);
      }
    }
    this.playings[id] = { "source": source, "gain": gain, "part_id": part_id };

    if (enableSynth) {
      this.playings[id].voice = new synthVoice(id, time);
    }
  }

  AudioEngineWeb.prototype.play = function (id, vol, delay_ms, part_id) {
    if (!this.sounds.hasOwnProperty(id)) return;
    var time = this.context.currentTime + (delay_ms / 1000); //calculate time on note receive.
    var delay = delay_ms - this.threshold;
    if (delay <= 0) this.actualPlay(id, vol, time, part_id);
    else {
      this.worker.postMessage({ delay: delay, args: { action: 0/*play*/, id: id, vol: vol, time: time, part_id: part_id } }); // but start scheduling right before play.
    }
  }

  AudioEngineWeb.prototype.actualStop = function (id, time, part_id) {
    if (this.playings.hasOwnProperty(id) && this.playings[id] && this.playings[id].part_id === part_id) {
      var gain = this.playings[id].gain.gain;
      gain.setValueAtTime(gain.value, time);
      gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16);
      gain.linearRampToValueAtTime(0.0, time + 0.4);
      this.playings[id].source.stop(time + 0.41);


      if (this.playings[id].voice) {
        this.playings[id].voice.stop(time);
      }

      this.playings[id] = null;
    }
  };

  AudioEngineWeb.prototype.stop = function (id, delay_ms, part_id) {
    var time = this.context.currentTime + (delay_ms / 1000);
    var delay = delay_ms - this.threshold;
    if (delay <= 0) this.actualStop(id, time, part_id);
    else {
      this.worker.postMessage({ delay: delay, args: { action: 1/*stop*/, id: id, time: time, part_id: part_id } });
    }
  };

  AudioEngineWeb.prototype.setVolume = function (vol) {
    AudioEngine.prototype.setVolume.call(this, vol);
    this.masterGain.gain.value = this.volume;
  };

  AudioEngineWeb.prototype.resume = function () {
    this.paused = false;
    this.context.resume();
  };


























  // Renderer classes

  ////////////////////////////////////////////////////////////////

  var Renderer = function () {
  };

  Renderer.prototype.init = function (piano) {
    this.piano = piano;
    this.resize();
    return this;
  };

  Renderer.prototype.resize = function (width, height) {
    if (typeof width == "undefined") width = $(this.piano.rootElement).width();
    if (typeof height == "undefined") height = Math.floor(width * 0.2);
    $(this.piano.rootElement).css({ "height": height + "px", marginTop: Math.floor($(window).height() / 2 - height / 2) + "px" });
    this.width = width * window.devicePixelRatio;
    this.height = height * window.devicePixelRatio;
  };

  Renderer.prototype.visualize = function (key, color) {
  };




  var CanvasRenderer = function () {
    Renderer.call(this);
  };

  CanvasRenderer.prototype = new Renderer();

  CanvasRenderer.prototype.init = function (piano) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    piano.rootElement.appendChild(this.canvas);

    Renderer.prototype.init.call(this, piano); // calls resize()

    // create render loop
    var self = this;
    var render = function () {
      self.redraw();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // add event listeners
    var mouse_down = false;
    var last_key = null;
    $(piano.rootElement).mousedown(function (event) {
      mouse_down = true;
      //event.stopPropagation();
      event.preventDefault();

      var pos = CanvasRenderer.translateMouseEvent(event);
      var hit = self.getHit(pos.x, pos.y);
      if (hit) {
        press(hit.key.note, hit.v);
        last_key = hit.key;
      }
    });
    piano.rootElement.addEventListener("touchstart", function (event) {
      mouse_down = true;
      //event.stopPropagation();
      event.preventDefault();
      for (var i in event.changedTouches) {
        var pos = CanvasRenderer.translateMouseEvent(event.changedTouches[i]);
        var hit = self.getHit(pos.x, pos.y);
        if (hit) {
          press(hit.key.note, hit.v);
          last_key = hit.key;
        }
      }
    }, false);
    $(window).mouseup(function (event) {
      if (last_key) {
        release(last_key.note);
      }
      mouse_down = false;
      last_key = null;
    });
    /*$(piano.rootElement).mousemove(function(event) {
      if(!mouse_down) return;
      var pos = CanvasRenderer.translateMouseEvent(event);
      var hit = self.getHit(pos.x, pos.y);
      if(hit && hit.key != last_key) {
        press(hit.key.note, hit.v);
        last_key = hit.key;
      }
    });*/

    return this;
  };

  CanvasRenderer.prototype.resize = function (width, height) {
    Renderer.prototype.resize.call(this, width, height);
    if (this.width < 52 * 2) this.width = 52 * 2;
    if (this.height < this.width * 0.2) this.height = Math.floor(this.width * 0.2);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = this.width / window.devicePixelRatio + "px";
    this.canvas.style.height = this.height / window.devicePixelRatio + "px";

    // calculate key sizes
    this.whiteKeyWidth = Math.floor(this.width / 52);
    this.whiteKeyHeight = Math.floor(this.height * 0.9);
    this.blackKeyWidth = Math.floor(this.whiteKeyWidth * 0.75);
    this.blackKeyHeight = Math.floor(this.height * 0.5);

    this.blackKeyOffset = Math.floor(this.whiteKeyWidth - (this.blackKeyWidth / 2));
    this.keyMovement = Math.floor(this.whiteKeyHeight * 0.015);

    this.whiteBlipWidth = Math.floor(this.whiteKeyWidth * 0.7);
    this.whiteBlipHeight = Math.floor(this.whiteBlipWidth * 0.8);
    this.whiteBlipX = Math.floor((this.whiteKeyWidth - this.whiteBlipWidth) / 2);
    this.whiteBlipY = Math.floor(this.whiteKeyHeight - this.whiteBlipHeight * 1.2);
    this.blackBlipWidth = Math.floor(this.blackKeyWidth * 0.7);
    this.blackBlipHeight = Math.floor(this.blackBlipWidth * 0.8);
    this.blackBlipY = Math.floor(this.blackKeyHeight - this.blackBlipHeight * 1.2);
    this.blackBlipX = Math.floor((this.blackKeyWidth - this.blackBlipWidth) / 2);

    // prerender white key
    this.whiteKeyRender = document.createElement("canvas");
    this.whiteKeyRender.width = this.whiteKeyWidth;
    this.whiteKeyRender.height = this.height + 10;
    var ctx = this.whiteKeyRender.getContext("2d");
    if (ctx.createLinearGradient) {
      var gradient = ctx.createLinearGradient(0, 0, 0, this.whiteKeyHeight);
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

    // prerender black key
    this.blackKeyRender = document.createElement("canvas");
    this.blackKeyRender.width = this.blackKeyWidth + 10;
    this.blackKeyRender.height = this.blackKeyHeight + 10;
    var ctx = this.blackKeyRender.getContext("2d");
    if (ctx.createLinearGradient) {
      var gradient = ctx.createLinearGradient(0, 0, 0, this.blackKeyHeight);
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

    // prerender shadows
    this.shadowRender = [];
    var y = -this.canvas.height * 2;
    for (var j = 0; j < 2; j++) {
      var canvas = document.createElement("canvas");
      this.shadowRender[j] = canvas;
      canvas.width = this.canvas.width;
      canvas.height = this.canvas.height;
      var ctx = canvas.getContext("2d");
      var sharp = j ? true : false;
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
      for (var i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i)) continue;
        var key = this.piano.keys[i];
        if (key.sharp != sharp) continue;

        if (key.sharp) {
          ctx.fillRect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2,
            y + ctx.lineWidth / 2,
            this.blackKeyWidth - ctx.lineWidth, this.blackKeyHeight - ctx.lineWidth);
        } else {
          ctx.fillRect(this.whiteKeyWidth * key.spatial + ctx.lineWidth / 2,
            y + ctx.lineWidth / 2,
            this.whiteKeyWidth - ctx.lineWidth, this.whiteKeyHeight - ctx.lineWidth);
        }
      }
    }

    // update key rects
    for (var i in this.piano.keys) {
      if (!this.piano.keys.hasOwnProperty(i)) continue;
      var key = this.piano.keys[i];
      if (key.sharp) {
        key.rect = new Rect(this.blackKeyOffset + this.whiteKeyWidth * key.spatial, 0,
          this.blackKeyWidth, this.blackKeyHeight);
      } else {
        key.rect = new Rect(this.whiteKeyWidth * key.spatial, 0,
          this.whiteKeyWidth, this.whiteKeyHeight);
      }
    }
  };

  CanvasRenderer.prototype.visualize = function (key, color) {
    key.timePlayed = Date.now();
    key.blips.push({ "time": key.timePlayed, "color": color });
  };

  CanvasRenderer.prototype.redraw = function () {
    var now = Date.now();
    var timeLoadedEnd = now - 1000;
    var timePlayedEnd = now - 100;
    var timeBlipEnd = now - 1000;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw all keys
    for (var j = 0; j < 2; j++) {
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(this.shadowRender[j], 0, 0);
      var sharp = j ? true : false;
      for (var i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i)) continue;
        var key = this.piano.keys[i];
        if (key.sharp != sharp) continue;

        if (!key.loaded) {
          this.ctx.globalAlpha = 0.2;
        } else if (key.timeLoaded > timeLoadedEnd) {
          this.ctx.globalAlpha = ((now - key.timeLoaded) / 1000) * 0.8 + 0.2;
        } else {
          this.ctx.globalAlpha = 1.0;
        }
        var y = 0;
        if (key.timePlayed > timePlayedEnd) {
          y = Math.floor(this.keyMovement - (((now - key.timePlayed) / 100) * this.keyMovement));
        }
        var x = Math.floor(key.sharp ? this.blackKeyOffset + this.whiteKeyWidth * key.spatial
          : this.whiteKeyWidth * key.spatial);
        var image = key.sharp ? this.blackKeyRender : this.whiteKeyRender;
        this.ctx.drawImage(image, x, y);

        // render blips
        if (key.blips.length) {
          var alpha = this.ctx.globalAlpha;
          var w, h;
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
          for (var b = 0; b < key.blips.length; b++) {
            var blip = key.blips[b];
            if (blip.time > timeBlipEnd) {
              this.ctx.fillStyle = blip.color;
              this.ctx.globalAlpha = alpha - ((now - blip.time) / 1000);
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
  };

  CanvasRenderer.prototype.renderNoteLyrics = function () {
    // render lyric
    for (var part_id in this.noteLyrics) {
      if (!this.noteLyrics.hasOwnProperty(i)) continue;
      var lyric = this.noteLyrics[part_id];
      var lyric_x = x;
      var lyric_y = this.whiteKeyHeight + 1;
      this.ctx.fillStyle = key.lyric.color;
      var alpha = this.ctx.globalAlpha;
      this.ctx.globalAlpha = alpha - ((now - key.lyric.time) / 1000);
      this.ctx.fillRect(x, y, 10, 10);
    }
  };

  CanvasRenderer.prototype.getHit = function (x, y) {
    for (var j = 0; j < 2; j++) {
      var sharp = j ? false : true; // black keys first
      for (var i in this.piano.keys) {
        if (!this.piano.keys.hasOwnProperty(i)) continue;
        var key = this.piano.keys[i];
        if (key.sharp != sharp) continue;
        if (key.rect.contains(x, y)) {
          var v = y / (key.sharp ? this.blackKeyHeight : this.whiteKeyHeight);
          v += 0.25;
          v *= DEFAULT_VELOCITY;
          if (v > 1.0) v = 1.0;
          return { "key": key, "v": v };
        }
      }
    }
    return null;
  };


  CanvasRenderer.isSupported = function () {
    var canvas = document.createElement("canvas");
    return !!(canvas.getContext && canvas.getContext("2d"));
  };

  CanvasRenderer.translateMouseEvent = function (evt) {
    var element = evt.target;
    var offx = 0;
    var offy = 0;
    do {
      if (!element) break; // wtf, wtf?
      offx += element.offsetLeft;
      offy += element.offsetTop;
    } while (element = element.offsetParent);
    return {
      x: (evt.pageX - offx) * window.devicePixelRatio,
      y: (evt.pageY - offy) * window.devicePixelRatio
    }
  };











  // Soundpack Stuff by electrashave ♥

  ////////////////////////////////////////////////////////////////

  var soundDomain = location.hostname === 'www.mppclone.com' ? 'https://www.mppclone.com' : 'https://mppclone.com';

  function SoundSelector(piano) {
    this.initialized = false;
    this.keys = piano.keys;
    this.loading = {};
    this.notification;
    this.packs = [];
    this.piano = piano;
    this.soundSelection = localStorage.soundSelection ? localStorage.soundSelection : "mppclassic";
    this.addPack({ name: "MPP Classic", keys: Object.keys(this.piano.keys), ext: ".mp3", url: "/sounds/mppclassic/" });
  }

  SoundSelector.prototype.addPack = function (pack, load) {
    var self = this;
    self.loading[pack.url || pack] = true;
    function add(obj) {
      var added = false;
      for (var i = 0; self.packs.length > i; i++) {
        if (obj.name == self.packs[i].name) {
          added = true;
          break;
        }
      }

      if (added) return console.warn("Sounds already added!!"); //no adding soundpacks twice D:<

      if (obj.url.substr(obj.url.length - 1) != "/") obj.url = obj.url + "/";
      var html = document.createElement("li");
      html.classList = "pack";
      html.innerText = obj.name + " (" + obj.keys.length + " keys)";
      html.onclick = function () {
        self.loadPack(obj.name);
        self.notification.close();
      };
      obj.html = html;
      self.packs.push(obj);
      self.packs.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      if (load) self.loadPack(obj.name);
      delete self.loading[obj.url];
    }

    if (typeof pack == "string") {
      $.getJSON(soundDomain + pack + "/info.json").done(function (json) {
        json.url = pack;
        add(json);
      });
    } else add(pack); //validate packs??
  };

  SoundSelector.prototype.addPacks = function (packs) {
    for (var i = 0; packs.length > i; i++) this.addPack(packs[i]);
  };

  SoundSelector.prototype.init = function () {
    var self = this;
    if (self.initialized) return console.warn("Sound selector already initialized!");

    if (!!Object.keys(self.loading).length) return setTimeout(function () {
      self.init();
    }, 250);

    $("#sound-btn").on("click", function () {
      if (document.getElementById("Notification-Sound-Selector") != null)
        return self.notification.close();
      var html = document.createElement("ul");
      //$(html).append("<p>Current Sound: " + self.soundSelection + "</p>");

      for (var i = 0; self.packs.length > i; i++) {
        var pack = self.packs[i];
        if (pack.name == self.soundSelection) pack.html.classList = "pack enabled";
        else pack.html.classList = "pack";
        html.appendChild(pack.html);
      }

      self.notification = new Notification({ title: "Sound Selector", html: html, id: "Sound-Selector", duration: -1, target: "#sound-btn" });
    });
    self.initialized = true;
    self.loadPack(self.soundSelection, true);
  };

  SoundSelector.prototype.loadPack = function (pack, f) {
    for (var i = 0; this.packs.length > i; i++) {
      var p = this.packs[i];
      if (p.name == pack) {
        pack = p;
        break;
      }
    }
    if (typeof pack == "string") {
      console.warn("Sound pack does not exist! Loading default pack...");
      return this.loadPack("MPP Classic");
    }

    if (pack.name == this.soundSelection && !f) return;
    if (pack.keys.length != Object.keys(this.piano.keys).length) {
      this.piano.keys = {};
      for (var i = 0; pack.keys.length > i; i++) this.piano.keys[pack.keys[i]] = this.keys[pack.keys[i]];
      this.piano.renderer.resize();
    }

    var self = this;
    for (var i in this.piano.keys) {
      if (!this.piano.keys.hasOwnProperty(i)) continue;
      (function () {
        var key = self.piano.keys[i];
        key.loaded = false;
        self.piano.audio.load(key.note, soundDomain + pack.url + key.note + pack.ext, function () {
          key.loaded = true;
          key.timeLoaded = Date.now();
        });
      })();
    }
    if (localStorage) localStorage.soundSelection = pack.name;
    this.soundSelection = pack.name;
  };

  SoundSelector.prototype.removePack = function (name) {
    var found = false;
    for (var i = 0; this.packs.length > i; i++) {
      var pack = this.packs[i];
      if (pack.name == name) {
        this.packs.splice(i, 1);
        if (pack.name == this.soundSelection) this.loadPack(this.packs[0].name); //add mpp default if none?
        break;
      }
    }
    if (!found) console.warn("Sound pack not found!");
  };











  // Pianoctor

  ////////////////////////////////////////////////////////////////

  var PianoKey = function (note, octave) {
    this.note = note + octave;
    this.baseNote = note;
    this.octave = octave;
    this.sharp = note.indexOf("s") != -1;
    this.loaded = false;
    this.timeLoaded = 0;
    this.domElement = null;
    this.timePlayed = 0;
    this.blips = [];
  };

  var Piano = function (rootElement) {

    var piano = this;
    piano.rootElement = rootElement;
    piano.keys = {};

    var white_spatial = 0;
    var black_spatial = 0;
    var black_it = 0;
    var black_lut = [2, 1, 2, 1, 1];
    var addKey = function (note, octave) {
      var key = new PianoKey(note, octave);
      piano.keys[key.note] = key;
      if (key.sharp) {
        key.spatial = black_spatial;
        black_spatial += black_lut[black_it % 5];
        ++black_it;
      } else {
        key.spatial = white_spatial;
        ++white_spatial;
      }
    }
    if (test_mode) {
      addKey("c", 2);
    } else {
      addKey("a", -1);
      addKey("as", -1);
      addKey("b", -1);
      var notes = "c cs d ds e f fs g gs a as b".split(" ");
      for (var oct = 0; oct < 7; oct++) {
        for (var i in notes) {
          addKey(notes[i], oct);
        }
      }
      addKey("c", 7);
    }


    this.renderer = new CanvasRenderer().init(this);

    window.addEventListener("resize", function () {
      piano.renderer.resize();
    });


    window.AudioContext = window.AudioContext || window.webkitAudioContext || undefined;
    var audio_engine = AudioEngineWeb;
    this.audio = new audio_engine().init();
  };

  Piano.prototype.play = function (note, vol, participant, delay_ms, lyric) {
    if (!this.keys.hasOwnProperty(note) || !participant) return;
    var key = this.keys[note];
    if (key.loaded) this.audio.play(key.note, vol, delay_ms, participant.id);
    if (gMidiOutTest) gMidiOutTest(key.note, vol * 100, delay_ms, participant.id);
    var self = this;
    setTimeout(function () {
      self.renderer.visualize(key, participant.color);
      if (lyric) {

      }
      var jq_namediv = $(participant.nameDiv);
      jq_namediv.addClass("play");
      setTimeout(function () {
        jq_namediv.removeClass("play");
      }, 30);
    }, delay_ms || 0);
  };

  Piano.prototype.stop = function (note, participant, delay_ms) {
    if (!this.keys.hasOwnProperty(note)) return;
    var key = this.keys[note];
    if (key.loaded) this.audio.stop(key.note, delay_ms, participant.id);
    if (gMidiOutTest) gMidiOutTest(key.note, 0, delay_ms, participant.id);
  };

  var gPiano = new Piano(document.getElementById("piano"));

  var gSoundSelector = new SoundSelector(gPiano);
  gSoundSelector.addPacks(["/sounds/Emotional/", "/sounds/Emotional_2.0/", "/sounds/GreatAndSoftPiano/", "/sounds/HardAndToughPiano/", "/sounds/HardPiano/", "/sounds/Harp/", "/sounds/Harpsicord/", "/sounds/LoudAndProudPiano/", "/sounds/MLG/", "/sounds/Music_Box/", "/sounds/NewPiano/", "/sounds/Orchestra/", "/sounds/Piano2/", "/sounds/PianoSounds/", "/sounds/Rhodes_MK1/", "/sounds/SoftPiano/", "/sounds/Steinway_Grand/", "/sounds/Untitled/", "/sounds/Vintage_Upright/", "/sounds/Vintage_Upright_Soft/"]);
  //gSoundSelector.addPacks(["/sounds/Emotional_2.0/", "/sounds/Harp/", "/sounds/Music_Box/", "/sounds/Vintage_Upright/", "/sounds/Steinway_Grand/", "/sounds/Emotional/", "/sounds/Untitled/"]);
  gSoundSelector.init();







  var gAutoSustain = false;
  var gSustain = false;

  var gHeldNotes = {};
  var gSustainedNotes = {};


  function press(id, vol) {
    if (!gClient.preventsPlaying() && gNoteQuota.spend(1)) {
      gHeldNotes[id] = true;
      gSustainedNotes[id] = true;
      gPiano.play(id, vol !== undefined ? vol : DEFAULT_VELOCITY, gClient.getOwnParticipant(), 0);
      gClient.startNote(id, vol);
    }
  }

  function release(id) {
    if (gHeldNotes[id]) {
      gHeldNotes[id] = false;
      if ((gAutoSustain || gSustain) && !enableSynth) {
        gSustainedNotes[id] = true;
      } else {
        if (gNoteQuota.spend(1)) {
          gPiano.stop(id, gClient.getOwnParticipant(), 0);
          gClient.stopNote(id);
          gSustainedNotes[id] = false;
        }
      }
    }
  }

  function pressSustain() {
    gSustain = true;
  }

  function releaseSustain() {
    gSustain = false;
    if (!gAutoSustain) {
      for (var id in gSustainedNotes) {
        if (gSustainedNotes.hasOwnProperty(id) && gSustainedNotes[id] && !gHeldNotes[id]) {
          gSustainedNotes[id] = false;
          if (gNoteQuota.spend(1)) {
            gPiano.stop(id, gClient.getOwnParticipant(), 0);
            gClient.stopNote(id);
          }
        }
      }
    }
  }




  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  //remove chat autocomplete
  if (window.location.hostname === 'multiplayerpiano.com') {
    $('#chat-input')[0].autocomplete = 'off';
  }

  function getRoomNameFromURL() {
    var channel_id = decodeURIComponent(window.location.pathname);
    if (channel_id.substr(0, 1) == "/") channel_id = channel_id.substr(1);
    if (!channel_id) {
      channel_id = getParameterByName('c');
      //transitioning to use this for mppclone.com as well for 2 reasons:
      //cloudflare's caching wasn't applying for new rooms because the pathname was different
      //as I add more paths in the future such as /api, I don't want people to make rooms that conflict with those paths and cause issues
    }
    if (!channel_id) channel_id = "lobby";
    return channel_id;
  }


  // internet science

  ////////////////////////////////////////////////////////////////

  var channel_id = getRoomNameFromURL();

  var loginInfo;
  if (location.pathname === "/callback/discord") {
    var searchParams = new URLSearchParams(location.search);
    var code = searchParams.get("code");
    if (code) {
      loginInfo = {
        type: "discord",
        code
      };
    }
    history.pushState({ "name": "lobby" }, "Piano > lobby", "/");
    channel_id = "lobby";
  }

  var wssport = 8443;
  if (window.location.hostname === "127.0.0.1") {
    var gClient = new Client("ws://localhost:8443");
  } else {
    var gClient = new Client('wss://mppclone.com:8443');
  }
  if (loginInfo) {
    gClient.setLoginInfo(loginInfo);
  }
  gClient.setChannel(channel_id);

  gClient.on("disconnect", function (evt) {
    console.log(evt);
  });


  var tabIsActive = true;
  var youreMentioned = false;

  window.addEventListener('focus', function (event) {
    tabIsActive = true;
    youreMentioned = false;
    var count = Object.keys(MPP.client.ppl).length;
    if (count > 0) {
      document.title = "Piano (" + count + ")";
    } else {
      document.title = "Multiplayer Piano";
    }
  });

  window.addEventListener('blur', function (event) {
    tabIsActive = false;
  });

  // Setting status
  (function () {
    gClient.on("status", function (status) {
      $("#status").text(status);
    });
    gClient.on("count", function (count) {
      if (count > 0) {
        $("#status").html('<span class="number">' + count + '</span> ' + (count == 1 ? 'person is' : 'people are') + ' playing');
        if (!tabIsActive && youreMentioned) return;
        document.title = "Piano (" + count + ")";
      } else {
        document.title = "Multiplayer Piano";
      }
    });
  })();

  // Show moderator buttons
  (function () {
    gClient.on("hi", function (msg) {
      if (gClient.permissions.clearChat) {
        $("#clearchat-btn").show();
      }
      if (gClient.permissions.vanish) {
        $("#vanish-btn").show();
      } else {
        $("#vanish-btn").hide();
      }
    });
  })();

  var participantTouchhandler; //declare this outside of the smaller functions so it can be used below and setup later

  // Handle changes to participants
  (function () {
    function setupParticipantDivs(part) {
      var hadNameDiv = Boolean(part.nameDiv);

      var nameDiv;
      if (hadNameDiv) {
        nameDiv = part.nameDiv;
        $(nameDiv).empty();
      } else {
        nameDiv = document.createElement("div");
        nameDiv.addEventListener("mousedown", e => participantTouchhandler(e, nameDiv));
        nameDiv.addEventListener("touchstart", e => participantTouchhandler(e, nameDiv));
        nameDiv.style.display = "none";
        $(nameDiv).fadeIn(2000);
        nameDiv.id = 'namediv-' + part._id;
        nameDiv.className = "name";
        nameDiv.participantId = part.id;
        $("#names")[0].appendChild(nameDiv);
        part.nameDiv = nameDiv;
      }
      nameDiv.style.backgroundColor = part.color || "#777";
      if (part.veteran) nameDiv.title = 'This user is a veteran of Multiplayer Piano';
      var tagText = typeof part.tag === 'object' ? part.tag.text : part.tag;
      if (tagText === 'BOT') nameDiv.title = 'This is an authorized bot.';
      if (tagText === 'MOD') nameDiv.title = 'This user is an official moderator of the site.';
      if (tagText === 'ADMIN') nameDiv.title = 'This user is an official administrator of the site.';
      if (tagText === 'OWNER') nameDiv.title = 'This user is the owner of the site.';
      if (tagText === 'MEDIA') nameDiv.title = 'This is a well known person on Twitch, Youtube, or another platform.';

      updateLabels(part);

      var hasOtherDiv = false;
      if (part.vanished) {
        hasOtherDiv = true;
        var vanishDiv = document.createElement("div");
        vanishDiv.className = "nametag";
        vanishDiv.textContent = 'VANISH';
        vanishDiv.style.backgroundColor = '#00ffcc';
        vanishDiv.id = 'namevanish-' + part._id;
        part.nameDiv.appendChild(vanishDiv);
      }
      if (part.tag) {
        hasOtherDiv = true;
        var tagDiv = document.createElement("div");
        tagDiv.className = "nametag";
        tagDiv.textContent = tagText || "";
        tagDiv.style.backgroundColor = tagColor(part.tag);
        tagDiv.id = 'nametag-' + part._id;
        part.nameDiv.appendChild(tagDiv);
      }

      var textDiv = document.createElement("div");
      textDiv.className = "nametext";
      textDiv.textContent = part.name || "";
      textDiv.id = 'nametext-' + part._id;
      if (hasOtherDiv) textDiv.style.float = 'left';
      if (part.veteran) textDiv.style.color = '#ffdf00';
      part.nameDiv.appendChild(textDiv);

      var arr = $("#names .name");
      arr.sort(function (a, b) {
        if (a.id > b.id) return 1;
        else if (a.id < b.id) return -1;
        else return 0;
      });
      $("#names").html(arr);


    }
    gClient.on("participant added", function (part) {

      part.displayX = 150;
      part.displayY = 50;

      // add nameDiv
      setupParticipantDivs(part);

      // add cursorDiv
      if (gClient.participantId !== part.id || gSeeOwnCursor) {
        var div = document.createElement("div");
        div.className = "cursor";
        div.style.display = "none";
        part.cursorDiv = $("#cursors")[0].appendChild(div);
        $(part.cursorDiv).fadeIn(2000);

        var div = document.createElement("div");
        div.className = "name";
        div.style.backgroundColor = part.color || "#777"
        div.textContent = part.name || "";
        if (part.veteran) div.style.color = '#ffdf00';
        part.cursorDiv.appendChild(div);

      } else {
        part.cursorDiv = undefined;
      }
    });
    gClient.on("participant removed", function (part) {
      // remove nameDiv
      var nd = $(part.nameDiv);
      var cd = $(part.cursorDiv);
      cd.fadeOut(2000);
      nd.fadeOut(2000, function () {
        nd.remove();
        cd.remove();
        part.nameDiv = undefined;
        part.cursorDiv = undefined;
      });
    });
    gClient.on("participant update", function (part) {
      var name = part.name || "";
      var color = part.color || "#777";
      setupParticipantDivs(part);
      $(part.cursorDiv)
        .find(".name")
        .text(name)
        .css("background-color", color);
    });
    gClient.on("ch", function (msg) {
      for (var id in gClient.ppl) {
        if (gClient.ppl.hasOwnProperty(id)) {
          var part = gClient.ppl[id];
          updateLabels(part);
        }
      }
    });
    gClient.on("participant added", function (part) {
      updateLabels(part);
    });
    function updateLabels(part) {
      if (part.id === gClient.participantId) {
        $(part.nameDiv).addClass("me");
      } else {
        $(part.nameDiv).removeClass("me");
      }
      if (gClient.channel.crown && gClient.channel.crown.participantId === part.id) {
        $(part.nameDiv).addClass("owner");
        $(part.cursorDiv).addClass("owner");
      } else {
        $(part.nameDiv).removeClass("owner");
        $(part.cursorDiv).removeClass("owner");
      }
      if (gPianoMutes.indexOf(part._id) !== -1) {
        $(part.nameDiv).addClass("muted-notes");
      } else {
        $(part.nameDiv).removeClass("muted-notes");
      }
      if (gChatMutes.indexOf(part._id) !== -1) {
        $(part.nameDiv).addClass("muted-chat");
      } else {
        $(part.nameDiv).removeClass("muted-chat");
      }
    }
    function tagColor(tag) {
      if (typeof tag === 'object') return tag.color;
      if (tag === 'BOT') return '#55f';
      if (tag === 'OWNER') return '#a00';
      if (tag === 'ADMIN') return '#f55';
      if (tag === 'MOD') return '#0a0';
      if (tag === 'MEDIA') return '#f5f';
      return '#777';
    }
    function updateCursor(msg) {
      const part = gClient.ppl[msg.id];
      if (part && part.cursorDiv) {
        if (gSmoothCursor) {
          part.cursorDiv.style.transform = 'translate3d(' + msg.x + 'vw, ' + msg.y + 'vh, 0)';
        } else {
          part.cursorDiv.style.left = msg.x + "%";
          part.cursorDiv.style.top = msg.y + "%";
        }
      }
    }
    gClient.on("m", updateCursor);
    gClient.on("participant added", updateCursor);
  })();


  // Handle changes to crown
  (function () {
    var jqcrown = $('<div id="crown"></div>').appendTo(document.body).hide();
    var jqcountdown = $('<span></span>').appendTo(jqcrown);
    var countdown_interval;
    jqcrown.click(function () {
      gClient.sendArray([{ m: "chown", id: gClient.participantId }]);
    });
    gClient.on("ch", function (msg) {
      if (msg.ch.crown) {
        var crown = msg.ch.crown;
        if (!crown.participantId || !gClient.ppl[crown.participantId]) {
          var land_time = crown.time + 2000 - gClient.serverTimeOffset;
          var avail_time = crown.time + 15000 - gClient.serverTimeOffset;
          jqcountdown.text("");
          jqcrown.show();
          if (land_time - Date.now() <= 0) {
            jqcrown.css({ "left": crown.endPos.x + "%", "top": crown.endPos.y + "%" });
          } else {
            jqcrown.css({ "left": crown.startPos.x + "%", "top": crown.startPos.y + "%" });
            jqcrown.addClass("spin");
            jqcrown.animate({ "left": crown.endPos.x + "%", "top": crown.endPos.y + "%" }, 2000, "linear", function () {
              jqcrown.removeClass("spin");
            });
          }
          clearInterval(countdown_interval);
          countdown_interval = setInterval(function () {
            var time = Date.now();
            if (time >= land_time) {
              var ms = avail_time - time;
              if (ms > 0) {
                jqcountdown.text(Math.ceil(ms / 1000) + "s");
              } else {
                jqcountdown.text("");
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
    gClient.on("disconnect", function () {
      jqcrown.fadeOut(2000);
    });
  })();


  // Playing notes
  gClient.on("n", function (msg) {
    var t = msg.t - gClient.serverTimeOffset + TIMING_TARGET - Date.now();
    var participant = gClient.findParticipantById(msg.p);
    if (gPianoMutes.indexOf(participant._id) !== -1)
      return;
    for (var i = 0; i < msg.n.length; i++) {
      var note = msg.n[i];
      var ms = t + (note.d || 0);
      if (ms < 0) {
        ms = 0;
      }
      else if (ms > 10000) continue;
      if (note.s) {
        gPiano.stop(note.n, participant, ms);
      } else {
        var vel = (typeof note.v !== "undefined") ? parseFloat(note.v) : DEFAULT_VELOCITY;
        if (!vel) vel = 0;
        else if (vel < 0) vel = 0;
        else if (vel > 1) vel = 1;
        gPiano.play(note.n, vel, participant, ms);
        if (enableSynth) {
          gPiano.stop(note.n, participant, ms + 1000);
        }
      }
    }
  });

  // Send cursor updates
  var mx = 0, last_mx = -10, my = 0, last_my = -10;
  setInterval(function () {
    if (Math.abs(mx - last_mx) > 0.1 || Math.abs(my - last_my) > 0.1) {
      last_mx = mx;
      last_my = my;
      gClient.sendArray([{ m: "m", x: mx, y: my }]);
      if (gSeeOwnCursor) {
        gClient.emit("m", { m: "m", id: gClient.participantId, x: mx, y: my });
      }
      var part = gClient.getOwnParticipant();
      if (part) {
        part.x = mx;
        part.y = my;
      }
    }
  }, 50);
  $(document).mousemove(function (event) {
    mx = ((event.pageX / $(window).width()) * 100).toFixed(2);
    my = ((event.pageY / $(window).height()) * 100).toFixed(2);
  });


  // Room settings button
  (function () {
    gClient.on("ch", function (msg) {
      if (gClient.isOwner() || gClient.permissions.chsetAnywhere) {
        $("#room-settings-btn").show();
      } else {
        $("#room-settings-btn").hide();
      }
      if (!gClient.channel.settings.lobby && (gClient.permissions.chownAnywhere || gClient.channel.settings.owner_id === gClient.user._id)) {
        $("#getcrown-btn").show();
      } else {
        $("#getcrown-btn").hide();
      }
    });
    $("#room-settings-btn").click(function (evt) {
      if (gClient.channel && (gClient.isOwner() || gClient.permissions.chsetAnywhere)) {
        var settings = gClient.channel.settings;
        openModal("#room-settings");
        setTimeout(function () {
          $("#room-settings .checkbox[name=visible]").prop("checked", settings.visible);
          $("#room-settings .checkbox[name=chat]").prop("checked", settings.chat);
          $("#room-settings .checkbox[name=crownsolo]").prop("checked", settings.crownsolo);
          $("#room-settings .checkbox[name=nocussing]").prop("checked", settings["no cussing"]);
          $("#room-settings input[name=color]").val(settings.color);
          $("#room-settings input[name=color2]").val(settings.color2);
          $("#room-settings input[name=limit]").val(settings.limit);
        }, 100);
      }
    });
    $("#room-settings .submit").click(function () {
      var settings = {
        visible: $("#room-settings .checkbox[name=visible]").is(":checked"),
        chat: $("#room-settings .checkbox[name=chat]").is(":checked"),
        crownsolo: $("#room-settings .checkbox[name=crownsolo]").is(":checked"),
        "no cussing": $("#room-settings .checkbox[name=nocussing]").is(":checked"),
        color: $("#room-settings input[name=color]").val(),
        color2: $("#room-settings input[name=color2]").val(),
        limit: $("#room-settings input[name=limit]").val(),
      };
      gClient.setChannelSettings(settings);
      closeModal();
    });
    $("#room-settings .drop-crown").click(function () {
      closeModal();
      if (confirm("This will drop the crown...!"))
        gClient.sendArray([{ m: "chown" }]);
    });
  })();

  // Clear chat button
  $("#clearchat-btn").click(function (evt) {
    gClient.sendArray([{ m: 'clearchat' }]);
  });

  // Get crown button
  $("#getcrown-btn").click(function (evt) {
    gClient.sendArray([{ m: 'chown', id: MPP.client.getOwnParticipant().id }]);
  });

  // Vanish or unvanish button
  $("#vanish-btn").click(function (evt) {
    gClient.sendArray([{ m: 'v', vanish: !gClient.getOwnParticipant().vanished }]);
  });
  gClient.on('participant update', part => {
    if (part._id === gClient.getOwnParticipant()._id) {
      if (part.vanished) {
        $("#vanish-btn").text('Unvanish');
      } else {
        $("#vanish-btn").text('Vanish');
      }
    }
  });
  gClient.on('participant added', part => {
    if (part._id === gClient.getOwnParticipant()._id) {
      if (part.vanished) {
        $("#vanish-btn").text('Unvanish');
      } else {
        $("#vanish-btn").text('Vanish');
      }
    }
  });

  // Handle notifications
  gClient.on("notification", function (msg) {
    new Notification(msg);
  });

  // Don't foget spin
  gClient.on("ch", function (msg) {
    var chidlo = msg.ch._id.toLowerCase();
    if (chidlo === "spin" || chidlo.substr(-5) === "/spin") {
      $("#piano").addClass("spin");
    } else {
      $("#piano").removeClass("spin");
    }
  });

  /*function eb() {
    if(gClient.channel && gClient.channel._id.toLowerCase() === "test/fishing") {
      ebsprite.start(gClient);
    } else {
      ebsprite.stop();
    }
  }
  if(ebsprite) {
    gClient.on("ch", eb);
    eb();
  }*/

  // Crownsolo notice
  gClient.on("ch", function (msg) {
    let notice = "";
    let has_notice = false;
    if (msg.ch.settings.crownsolo) {
      has_notice = true;
      notice += '<p>This room is set to "only the owner can play."</p>';
    }
    if (msg.ch.settings['no cussing']) {
      has_notice = true;
      notice += '<p>This room is set to "no cussing."</p>';
    }
    let notice_div = $("#room-notice");
    if (has_notice) {
      notice_div.html(notice);
      if (notice_div.is(':hidden')) notice_div.fadeIn(1000);
    } else {
      if (notice_div.is(':visible')) notice_div.fadeOut(1000);
    }
  });
  gClient.on("disconnect", function () {
    $("#room-notice").fadeOut(1000);
  });







  var gPianoMutes = (localStorage.pianoMutes ? localStorage.pianoMutes : "").split(',').filter(v => v);
  var gChatMutes = (localStorage.chatMutes ? localStorage.chatMutes : "").split(',').filter(v => v);
  var gShowIdsInChat = localStorage.showIdsInChat == "true";
  var gShowTimestampsInChat = localStorage.showTimestampsInChat == "true";
  var gNoChatColors = localStorage.noChatColors == "true";
  var gNoBackgroundColor = localStorage.noBackgroundColor == "true";
  var gOutputOwnNotes = localStorage.outputOwnNotes ? localStorage.outputOwnNotes == "true" : true;
  var gVirtualPianoLayout = localStorage.virtualPianoLayout == "true";
  var gSmoothCursor = localStorage.smoothCursor == "true";
  var gShowChatTooltips = localStorage.showChatTooltips ? localStorage.showChatTooltips == "true" : true;
  //var gWarnOnLinks = localStorage.warnOnLinks ? localStorage.warnOnLinks == "true" : true;






  // smooth cursor attribute

  if (gSmoothCursor) {
    $("#cursors").attr('smooth-cursors', '');
  } else {
    $("#cursors").removeAttr('smooth-cursors');
  }


  // Background color
  (function () {
    var old_color1 = new Color("#000000");
    var old_color2 = new Color("#000000");
    function setColor(hex, hex2) {
      var color1 = new Color(hex);
      var color2 = new Color(hex2 || hex);
      if (!hex2)
        color2.add(-0x40, -0x40, -0x40);

      var bottom = document.getElementById("bottom");

      var duration = 500;
      var step = 0;
      var steps = 30;
      var step_ms = duration / steps;
      var difference = new Color(color1.r, color1.g, color1.b);
      difference.r -= old_color1.r;
      difference.g -= old_color1.g;
      difference.b -= old_color1.b;
      var inc1 = new Color(difference.r / steps, difference.g / steps, difference.b / steps);
      difference = new Color(color2.r, color2.g, color2.b);
      difference.r -= old_color2.r;
      difference.g -= old_color2.g;
      difference.b -= old_color2.b;
      var inc2 = new Color(difference.r / steps, difference.g / steps, difference.b / steps);
      var iv;
      iv = setInterval(function () {
        old_color1.add(inc1.r, inc1.g, inc1.b);
        old_color2.add(inc2.r, inc2.g, inc2.b);
        document.body.style.background = "radial-gradient(ellipse at center, " + old_color1.toHexa() + " 0%," + old_color2.toHexa() + " 100%)";
        bottom.style.background = old_color2.toHexa();
        if (++step >= steps) {
          clearInterval(iv);
          old_color1 = color1;
          old_color2 = color2;
          document.body.style.background = "radial-gradient(ellipse at center, " + color1.toHexa() + " 0%," + color2.toHexa() + " 100%)";
          bottom.style.background = color2.toHexa();
        }
      }, step_ms);
    }

    function setColorToDefault() {
      setColor("#220022", "#000022");
    }

    window.setBackgroundColor = setColor;
    window.setBackgroundColorToDefault = setColorToDefault;

    setColorToDefault();

    gClient.on("ch", function (ch) {
      if (gNoBackgroundColor) {
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







  var volume_slider = document.getElementById("volume-slider");
  volume_slider.value = gPiano.audio.volume;
  $("#volume-label").text("Volume: " + Math.floor(gPiano.audio.volume * 100) + "%");
  volume_slider.addEventListener("input", function (evt) {
    var v = +volume_slider.value;
    gPiano.audio.setVolume(v);
    if (window.localStorage) localStorage.volume = v;
    $("#volume-label").text("Volume: " + Math.floor(v * 100) + "%");
  });




  var Note = function (note, octave) {
    this.note = note;
    this.octave = octave || 0;
  };



  var n = function (a, b) { return { note: new Note(a, b), held: false }; };

  var layouts = {
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
      173: n("cs", 3), // firefox why
      219: n("d", 3),
      187: n("ds", 3),
      61: n("ds", 3), // firefox why
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
      77: n("c", 5),
    }
  }

  var key_binding = gVirtualPianoLayout ? layouts.VP : layouts.MPP;

  var capsLockKey = false;

  var transpose = 0;

  function handleKeyDown(evt) {
    //console.log(evt);
    var code = parseInt(evt.keyCode);
    if (key_binding[code] !== undefined) {
      var binding = key_binding[code];
      if (!binding.held) {
        binding.held = true;

        var note = binding.note;
        var octave = 1 + note.octave;
        if (!gVirtualPianoLayout) {
          if (evt.shiftKey) ++octave;
          else if (capsLockKey || evt.ctrlKey) --octave;
          else if (evt.altKey) octave += 2;
        }
        note = note.note + octave;
        var index = Object.keys(gPiano.keys).indexOf(note);
        if (gVirtualPianoLayout && evt.shiftKey) {
          note = Object.keys(gPiano.keys)[index + transpose + 1];
        }
        else note = Object.keys(gPiano.keys)[index + transpose];
        if (note === undefined) return;
        var vol = velocityFromMouseY();
        press(note, vol);
      }

      if (++gKeyboardSeq == 3) {
        gKnowsYouCanUseKeyboard = true;
        if (window.gKnowsYouCanUseKeyboardTimeout) clearTimeout(gKnowsYouCanUseKeyboardTimeout);
        if (localStorage) localStorage.knowsYouCanUseKeyboard = true;
        if (window.gKnowsYouCanUseKeyboardNotification) gKnowsYouCanUseKeyboardNotification.close();
      }

      evt.preventDefault();
      evt.stopPropagation();
      return false;
    } else if (code == 20) { // Caps Lock
      capsLockKey = true;
      evt.preventDefault();
    } else if (code === 0x20) { // Space Bar
      pressSustain();
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
    } else if (code == 9) { // Tab (don't tab away from the piano)
      evt.preventDefault();
    } else if (code == 8) { // Backspace (don't navigate Back)
      gAutoSustain = !gAutoSustain;
      evt.preventDefault();
    }
  };

  function sendTransposeNotif() {
    new Notification({
      title: 'Transposing',
      html: 'Transpose level: ' + transpose,
      target: '#midi-btn',
      duration: 1500
    });
  }

  function handleKeyUp(evt) {
    var code = parseInt(evt.keyCode);
    if (key_binding[code] !== undefined) {
      var binding = key_binding[code];
      if (binding.held) {
        binding.held = false;

        var note = binding.note;
        var octave = 1 + note.octave;
        if (!gVirtualPianoLayout) {
          if (evt.shiftKey) ++octave;
          else if (capsLockKey || evt.ctrlKey) --octave;
          else if (evt.altKey) octave += 2;
        }
        note = note.note + octave;
        var index = Object.keys(gPiano.keys).indexOf(note);
        if (gVirtualPianoLayout && evt.shiftKey) {
          note = Object.keys(gPiano.keys)[index + transpose + 1];
        }
        else note = Object.keys(gPiano.keys)[index + transpose];
        if (note === undefined) return;
        release(note);
      }

      evt.preventDefault();
      evt.stopPropagation();
      return false;
    } else if (code == 20) { // Caps Lock
      capsLockKey = false;
      evt.preventDefault();
    } else if (code === 0x20) { // Space Bar
      releaseSustain();
      evt.preventDefault();
    }
  };

  function handleKeyPress(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.keyCode == 27 || evt.keyCode == 13) {
      //$("#chat input").focus();
    }
    return false;
  };

  var recapListener = function (evt) {
    captureKeyboard();
  };

  function captureKeyboard() {
    $("#piano").off("mousedown", recapListener);
    $("#piano").off("touchstart", recapListener);
    $(document).on("keydown", handleKeyDown);
    $(document).on("keyup", handleKeyUp);
    $(window).on("keypress", handleKeyPress);
  };

  function releaseKeyboard() {
    $(document).off("keydown", handleKeyDown);
    $(document).off("keyup", handleKeyUp);
    $(window).off("keypress", handleKeyPress);
    $("#piano").on("mousedown", recapListener);
    $("#piano").on("touchstart", recapListener);
  };

  captureKeyboard();


  var velocityFromMouseY = function () {
    return 0.1 + (my / 100) * 0.6;
  };





  // NoteQuota
  var gNoteQuota = (function () {
    var last_rat = 0;
    var nqjq = $("#quota .value");
    setInterval(function () {
      gNoteQuota.tick();
    }, 2000);
    return new NoteQuota(function (points) {
      // update UI
      var rat = (points / this.max) * 100;
      if (rat <= last_rat)
        nqjq.stop(true, true).css("width", rat.toFixed(0) + "%");
      else
        nqjq.stop(true, true).animate({ "width": rat.toFixed(0) + "%" }, 2000, "linear");
      last_rat = rat;
    });
  })();
  gClient.on("nq", function (nq_params) {
    gNoteQuota.setParams(nq_params);
  });
  gClient.on("disconnect", function () {
    gNoteQuota.setParams(NoteQuota.PARAMS_OFFLINE);
  });

  //DMs
  var gDmParticipant;
  var gIsDming = false;
  var gKnowsHowToDm = localStorage.knowsHowToDm === "true";
  gClient.on('participant removed', part => {
    if (gIsDming && part._id === gDmParticipant._id) {
      gIsDming = false;
      $('#chat-input')[0].placeholder = 'You can chat with this thing.';
    }
  });

  // click participant names
  (function () {
    participantTouchhandler = function (e, ele) {
      var target = ele;
      var target_jq = $(target);
      if (!target_jq) return;
      if (target_jq.hasClass("name")) {
        target_jq.addClass("play");
        var id = target.participantId;
        if (id == gClient.participantId) {
          openModal("#rename", "input[name=name]");
          setTimeout(function () {
            $("#rename input[name=name]").val(gClient.ppl[gClient.participantId].name);
            $("#rename input[name=color]").val(gClient.ppl[gClient.participantId].color);
          }, 100);
        } else if (id) {
          var part = gClient.ppl[id] || null;
          if (part) {
            participantMenu(part);
            e.stopPropagation();
          }
        }
      }
    };
    var releasehandler = function (e) {
      $("#names .name").removeClass("play");
    };
    document.body.addEventListener("mouseup", releasehandler);
    document.body.addEventListener("touchend", releasehandler);

    var removeParticipantMenus = function () {
      $(".participant-menu").remove();
      $(".participantSpotlight").hide();
      document.removeEventListener("mousedown", removeParticipantMenus);
      document.removeEventListener("touchstart", removeParticipantMenus);
    };

    var participantMenu = function (part) {
      if (!part) return;
      removeParticipantMenus();
      document.addEventListener("mousedown", removeParticipantMenus);
      document.addEventListener("touchstart", removeParticipantMenus);
      $("#" + part.id).find(".enemySpotlight").show();
      var menu = $('<div class="participant-menu"></div>');
      $("body").append(menu);
      // move menu to name position
      var jq_nd = $(part.nameDiv);
      var pos = jq_nd.position();
      menu.css({
        "top": pos.top + jq_nd.height() + 15,
        "left": pos.left + 6,
        "background": part.color || "black"
      });
      menu.on("mousedown touchstart", function (evt) {
        evt.stopPropagation();
        var target = $(evt.target);
        if (target.hasClass("menu-item")) {
          target.addClass("clicked");
          menu.fadeOut(200, function () {
            removeParticipantMenus();
          });
        }
      });
      // this spaces stuff out but also can be used for informational
      $('<div class="info"></div>').appendTo(menu).text(part._id);
      // add menu items
      if (gPianoMutes.indexOf(part._id) == -1) {
        $('<div class="menu-item">Mute Notes</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            gPianoMutes.push(part._id);
            if (localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
            $(part.nameDiv).addClass("muted-notes");
          });
      } else {
        $('<div class="menu-item">Unmute Notes</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            var i;
            while ((i = gPianoMutes.indexOf(part._id)) != -1)
              gPianoMutes.splice(i, 1);
            if (localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
            $(part.nameDiv).removeClass("muted-notes");
          });
      }
      if (gChatMutes.indexOf(part._id) == -1) {
        $('<div class="menu-item">Mute Chat</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            gChatMutes.push(part._id);
            if (localStorage) localStorage.chatMutes = gChatMutes.join(',');
            $(part.nameDiv).addClass("muted-chat");
          });
      } else {
        $('<div class="menu-item">Unmute Chat</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            var i;
            while ((i = gChatMutes.indexOf(part._id)) != -1)
              gChatMutes.splice(i, 1);
            if (localStorage) localStorage.chatMutes = gChatMutes.join(',');
            $(part.nameDiv).removeClass("muted-chat");
          });
      }
      if (!(gPianoMutes.indexOf(part._id) >= 0) || !(gChatMutes.indexOf(part._id) >= 0)) {
        $('<div class="menu-item">Mute Completely</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            gPianoMutes.push(part._id);
            if (localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
            gChatMutes.push(part._id);
            if (localStorage) localStorage.chatMutes = gChatMutes.join(',');
            $(part.nameDiv).addClass("muted-notes");
            $(part.nameDiv).addClass("muted-chat");
          });
      }
      if ((gPianoMutes.indexOf(part._id) >= 0) || (gChatMutes.indexOf(part._id) >= 0)) {
        $('<div class="menu-item">Unmute Completely</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            var i;
            while ((i = gPianoMutes.indexOf(part._id)) != -1)
              gPianoMutes.splice(i, 1);
            while ((i = gChatMutes.indexOf(part._id)) != -1)
              gChatMutes.splice(i, 1);
            if (localStorage) localStorage.pianoMutes = gPianoMutes.join(',');
            if (localStorage) localStorage.chatMutes = gChatMutes.join(',');
            $(part.nameDiv).removeClass("muted-notes");
            $(part.nameDiv).removeClass("muted-chat");
          });
      }
      if (gIsDming && gDmParticipant._id === part._id) {
        $('<div class="menu-item">End Direct Message</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            gIsDming = false;
            $('#chat-input')[0].placeholder = 'You can chat with this thing.';
          });
      } else {
        $('<div class="menu-item">Direct Message</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            if (!gKnowsHowToDm) {
              localStorage.knowsHowToDm = true;
              gKnowsHowToDm = true;
              new Notification({
                target: '#piano',
                duration: 20000,
                title: 'How to DM',
                text: 'After you click the button to direct message someone, future chat messages will be sent to them instead of to everyone. To go back to talking in public chat, send a blank chat message, or click the button again.',
              });
            }
            gIsDming = true;
            gDmParticipant = part;
            $('#chat-input')[0].placeholder = 'Direct messaging ' + part.name + '.';
          });
      }

      $('<div class="menu-item">Mention</div>').appendTo(menu)
        .on("mousedown touchstart", function (evt) {
          $('#chat-input')[0].value += '@' + part.id + ' ';
          setTimeout(() => {
            $('#chat-input').focus();
          }, 1);
        });

      if (gClient.isOwner() || gClient.permissions.chownAnywhere) {
        if (!gClient.channel.settings.lobby) {
          $('<div class="menu-item give-crown">Give Crown</div>').appendTo(menu)
            .on("mousedown touchstart", function (evt) {
              if (confirm("Give room ownership to " + part.name + "?"))
                gClient.sendArray([{ m: "chown", id: part.id }]);
            });
        }
        $('<div class="menu-item kickban">Kickban</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            var minutes = prompt("How many minutes? (0-60)", "30");
            if (minutes === null) return;
            minutes = parseFloat(minutes) || 0;
            var ms = minutes * 60 * 1000;
            gClient.sendArray([{ m: "kickban", _id: part._id, ms: ms }]);
          });
      }
      if (gClient.permissions.siteBan) {
        $('<div class="menu-item site-ban">Site Ban</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            openModal("#siteban");
            setTimeout(function () {
              $("#siteban input[name=id]").val(part._id);
              $("#siteban input[name=reasonText]").val("Evading site-wide punishments with VPNs, proxies, or multiple accounts");
              $("#siteban input[name=reasonText]").attr("disabled", true);
              $("#siteban select[name=reasonSelect]").val("Evading site-wide punishments with VPNs, proxies, or multiple accounts");
              $("#siteban input[name=durationNumber]").val(5);
              $("#siteban input[name=durationNumber]").attr("disabled", false);
              $("#siteban select[name=durationUnit]").val("hours");
              $("#siteban textarea[name=note]").val("");
              $("#siteban p[name=errorText]").text("")
              if (gClient.permissions.siteBanAnyReason) {
                $("#siteban select[name=reasonSelect] option[value=custom]").attr("disabled", false);
              } else {
                $("#siteban select[name=reasonSelect] option[value=custom]").attr("disabled", true);
              }
            }, 100);
          });
      }
      if (gClient.permissions.usersetOthers) {
        $('<div class="menu-item set-color">Set Color</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            var color = prompt("What color?", part.color);
            if (color === null) return;
            gClient.sendArray([{ m: "setcolor", _id: part._id, color: color }]);
          });
      }
      if (gClient.permissions.usersetOthers) {
        $('<div class="menu-item set-name">Set Name</div>').appendTo(menu)
          .on("mousedown touchstart", function (evt) {
            var name = prompt("What name?", part.name);
            if (name === null) return;
            gClient.sendArray([{ m: "setname", _id: part._id, name: name }]);
          });
      }
      menu.fadeIn(100);
    };
  })();
















  // Notification class

  ////////////////////////////////////////////////////////////////

  var Notification = function (par) {
    if (this instanceof Notification === false) throw ("yeet");
    EventEmitter.call(this);

    var par = par || {};

    this.id = "Notification-" + (par.id || Math.random());
    this.title = par.title || "";
    this.text = par.text || "";
    this.html = par.html || "";
    this.target = $(par.target || "#piano");
    this.duration = par.duration || 30000;
    this["class"] = par["class"] || "classic";

    var self = this;
    var eles = $("#" + this.id);
    if (eles.length > 0) {
      eles.remove();
    }
    this.domElement = $('<div class="notification"><div class="notification-body"><div class="title"></div>' +
      '<div class="text"></div></div><div class="x">X</div></div>');
    this.domElement[0].id = this.id;
    this.domElement.addClass(this["class"]);
    this.domElement.find(".title").text(this.title);
    if (this.text.length > 0) {
      this.domElement.find(".text").text(this.text);
    } else if (this.html instanceof HTMLElement) {
      this.domElement.find(".text")[0].appendChild(this.html);
    } else if (this.html.length > 0) {
      this.domElement.find(".text").html(this.html);
    }
    document.body.appendChild(this.domElement.get(0));

    this.position();
    this.onresize = function () {
      self.position();
    };
    window.addEventListener("resize", this.onresize);

    this.domElement.find(".x").click(function () {
      self.close();
    });

    if (this.duration > 0) {
      setTimeout(function () {
        self.close();
      }, this.duration);
    }

    return this;
  }

  mixin(Notification.prototype, EventEmitter.prototype);
  Notification.prototype.constructor = Notification;

  Notification.prototype.position = function () {
    var pos = this.target.offset();
    var x = pos.left - (this.domElement.width() / 2) + (this.target.width() / 4);
    var y = pos.top - this.domElement.height() - 8;
    var width = this.domElement.width();
    if (x + width > $("body").width()) {
      x -= ((x + width) - $("body").width());
    }
    if (x < 0) x = 0;
    this.domElement.offset({ left: x, top: y });
  };

  Notification.prototype.close = function () {
    var self = this;
    window.removeEventListener("resize", this.onresize);
    this.domElement.fadeOut(500, function () {
      self.domElement.remove();
      self.emit("close");
    });
  };















  // set variables from settings or set settings

  ////////////////////////////////////////////////////////////////

  var gKeyboardSeq = 0;
  var gKnowsYouCanUseKeyboard = false;
  if (localStorage && localStorage.knowsYouCanUseKeyboard) gKnowsYouCanUseKeyboard = true;
  if (!gKnowsYouCanUseKeyboard) {
    window.gKnowsYouCanUseKeyboardTimeout = setTimeout(function () {
      window.gKnowsYouCanUseKeyboardNotification = new Notification({
        title: "Did you know!?!",
        text: "You can play the piano with your keyboard, too.  Try it!", target: "#piano", duration: 10000
      });
    }, 30000);
  }




  if (window.localStorage) {

    if (localStorage.volume) {
      volume_slider.value = localStorage.volume;
      gPiano.audio.setVolume(localStorage.volume);
      $("#volume-label").text("Volume: " + Math.floor(gPiano.audio.volume * 100) + "%");
    }
    else localStorage.volume = gPiano.audio.volume;

    window.gHasBeenHereBefore = (localStorage.gHasBeenHereBefore || false);
    if (gHasBeenHereBefore) {
    }
    localStorage.gHasBeenHereBefore = true;

  }




  // warn user about loud noises before starting sound (no autoplay)
  openModal("#sound-warning");
  var user_interact = function (evt) {
    document.removeEventListener("click", user_interact);
    closeModal();
    MPP.piano.audio.resume();
  }
  document.addEventListener("click", user_interact);













  // New room, change room

  ////////////////////////////////////////////////////////////////

  $("#room > .info").text("--");
  gClient.on("ch", function (msg) {
    var channel = msg.ch;
    var info = $("#room > .info");
    info.text(channel._id);
    if (channel.settings.lobby) info.addClass("lobby");
    else info.removeClass("lobby");
    if (!channel.settings.chat) info.addClass("no-chat");
    else info.removeClass("no-chat");
    if (channel.settings.crownsolo) info.addClass("crownsolo");
    else info.removeClass("crownsolo");
    if (channel.settings['no cussing']) info.addClass("no-cussing");
    else info.removeClass("no-cussing");
    if (!channel.settings.visible) info.addClass("not-visible");
    else info.removeClass("not-visible");
  });
  gClient.on("ls", function (ls) {
    for (var i in ls.u) {
      if (!ls.u.hasOwnProperty(i)) continue;
      var room = ls.u[i];
      var info = $("#room .info[roomid=\"" + (room.id + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0') + "\"]");
      if (info.length == 0) {
        info = $("<div class=\"info\"></div>");
        info.attr("roomname", room._id);
        info.attr("roomid", room.id);
        $("#room .more").append(info);
      }
      info.text(room.count + '/' + ('limit' in room.settings ? room.settings.limit : 20) + " " + room._id);
      if (room.settings.lobby) info.addClass("lobby");
      else info.removeClass("lobby");
      if (!room.settings.chat) info.addClass("no-chat");
      else info.removeClass("no-chat");
      if (room.settings.crownsolo) info.addClass("crownsolo");
      else info.removeClass("crownsolo");
      if (room.settings['no cussing']) info.addClass("no-cussing");
      else info.removeClass("no-cussing");
      if (!room.settings.visible) info.addClass("not-visible");
      else info.removeClass("not-visible");
      if (room.banned) info.addClass("banned");
      else info.removeClass("banned");
    }
  });
  $("#room").on("click", function (evt) {
    evt.stopPropagation();

    // clicks on a new room
    if ($(evt.target).hasClass("info") && $(evt.target).parents(".more").length) {
      $("#room .more").fadeOut(250);
      var selected_name = $(evt.target).attr("roomname");
      if (typeof selected_name != "undefined") {
        changeRoom(selected_name, "right");
      }
      return false;
    }
    // clicks on "New Room..."
    else if ($(evt.target).hasClass("new")) {
      openModal("#new-room", "input[name=name]");
    }
    // all other clicks
    var doc_click = function (evt) {
      if ($(evt.target).is("#room .more")) return;
      $(document).off("mousedown", doc_click);
      $("#room .more").fadeOut(250);
      gClient.sendArray([{ m: "-ls" }]);
    }
    $(document).on("mousedown", doc_click);
    $("#room .more .info").remove();
    $("#room .more").show();
    gClient.sendArray([{ m: "+ls" }]);
  });
  $("#new-room-btn").on("click", function (evt) {
    evt.stopPropagation();
    openModal("#new-room", "input[name=name]");
  });


  $("#play-alone-btn").on("click", function (evt) {
    evt.stopPropagation();
    var room_name = "Room" + Math.floor(Math.random() * 1000000000000);
    changeRoom(room_name, "right", { "visible": false });
    setTimeout(function () {
      new Notification({ id: "share", title: "Playing alone", html: 'You are playing alone in a room by yourself, but you can always invite friends by sending them the link.<br><a href="' + location.href + '">' + decodeURIComponent(location.href) + '</a>', duration: 25000 });
    }, 1000);
  });





  //Account button
  $("#account-btn").on("click", function (evt) {
    evt.stopPropagation();
    openModal("#account");
    if (gClient.accountInfo) {
      $("#account #account-info").show()
      if (gClient.accountInfo.type === "discord") {
        $("#account #avatar-image").prop("src", gClient.accountInfo.avatar)
        $("#account #logged-in-user-text").text(gClient.accountInfo.username + "#" + gClient.accountInfo.discriminator)
      }
    } else {
      $("#account #account-info").hide()
    }
  });





  var gModal;

  function modalHandleEsc(evt) {
    if (evt.keyCode == 27) {
      closeModal();
      evt.preventDefault();
      evt.stopPropagation();
    }
  };

  function openModal(selector, focus) {
    if (chat) chat.blur();
    releaseKeyboard();
    $(document).on("keydown", modalHandleEsc);
    $("#modal #modals > *").hide();
    $("#modal").fadeIn(250);
    $(selector).show();
    setTimeout(function () {
      $(selector).find(focus).focus();
    }, 100);
    gModal = selector;
  };

  function closeModal() {
    $(document).off("keydown", modalHandleEsc);
    $("#modal").fadeOut(100);
    $("#modal #modals > *").hide();
    captureKeyboard();
    gModal = null;
  };

  var modal_bg = $("#modal .bg")[0];
  $(modal_bg).on("click", function (evt) {
    if (evt.target != modal_bg) return;
    closeModal();
  });

  (function () {
    function submit() {
      var name = $("#new-room .text[name=name]").val();
      var settings = {
        visible: $("#new-room .checkbox[name=visible]").is(":checked"),
        chat: true
      };
      $("#new-room .text[name=name]").val("");
      closeModal();
      changeRoom(name, "right", settings);
      setTimeout(function () {
        new Notification({ id: "share", title: "Created a Room", html: 'You can invite friends to your room by sending them the link.<br><a href="' + location.href + '">' + decodeURIComponent(location.href) + '</a>', duration: 25000 });
      }, 1000);
    };
    $("#new-room .submit").click(function (evt) {
      submit();
    });
    $("#new-room .text[name=name]").keypress(function (evt) {
      if (evt.keyCode == 13) {
        submit();
      } else if (evt.keyCode == 27) {
        closeModal();
      } else {
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    });
  })();








  function changeRoom(name, direction, settings, push) {
    if (!settings) settings = {};
    if (!direction) direction = "right";
    if (typeof push == "undefined") push = true;
    var opposite = direction == "left" ? "right" : "left";

    if (name == "") name = "lobby";
    if (gClient.channel && gClient.channel._id === name) return;
    if (push) {
      var url = "/?c=" + encodeURIComponent(name).replace("'", "%27");
      if (window.history && history.pushState) {
        history.pushState({ "depth": gHistoryDepth += 1, "name": name }, "Piano > " + name, url);
      } else {
        window.location = url;
        return;
      }
    }

    gClient.setChannel(name, settings);

    var t = 0, d = 100;
    $("#piano").addClass("ease-out").addClass("slide-" + opposite);
    setTimeout(function () {
      $("#piano").removeClass("ease-out").removeClass("slide-" + opposite).addClass("slide-" + direction);
    }, t += d);
    setTimeout(function () {
      $("#piano").addClass("ease-in").removeClass("slide-" + direction);
    }, t += d);
    setTimeout(function () {
      $("#piano").removeClass("ease-in");
    }, t += d);
  };

  var gHistoryDepth = 0;
  $(window).on("popstate", function (evt) {
    var depth = evt.state ? evt.state.depth : 0;
    //if (depth == gHistoryDepth) return; // <-- forgot why I did that though...
    //yeah brandon idk why you did that either, but it's stopping the back button from changing rooms after 1 click so I commented it out

    var direction = depth <= gHistoryDepth ? "left" : "right";
    gHistoryDepth = depth;

    var name = getRoomNameFromURL();
    changeRoom(name, direction, null, false);
  });




















  // Rename

  ////////////////////////////////////////////////////////////////

  (function () {
    function submit() {
      var set = {
        name: $("#rename input[name=name]").val(),
        color: $("#rename input[name=color]").val()
      };
      //$("#rename .text[name=name]").val("");
      closeModal();
      gClient.sendArray([{ m: "userset", set: set }]);
    };
    $("#rename .submit").click(function (evt) {
      submit();
    });
    $("#rename .text[name=name]").keypress(function (evt) {
      if (evt.keyCode == 13) {
        submit();
      } else if (evt.keyCode == 27) {
        closeModal();
      } else {
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    });
  })();









  //site-wide bans
  (function () {
    function submit() {
      var msg = { m: "siteban" };

      msg.id = $("#siteban .text[name=id]").val();

      var durationUnit = $("#siteban select[name=durationUnit]").val();
      if (durationUnit === "permanent") {
        if (!gClient.permissions.siteBanAnyDuration) {
          $("#siteban p[name=errorText]").text("You don't have permission to ban longer than 1 month. Contact a higher staff to ban the user for longer.");
          return;
        }
        msg.permanent = true;
      } else {
        var factor = 0;
        switch (durationUnit) {
          case "seconds": factor = 1000; break;
          case "minutes": factor = 1000 * 60; break;
          case "hours": factor = 1000 * 60 * 60; break;
          case "days": factor = 1000 * 60 * 60 * 24; break;
          case "weeks": factor = 1000 * 60 * 60 * 24 * 7; break;
          case "months": factor = 1000 * 60 * 60 * 24 * 30; break;
          case "years": factor = 1000 * 60 * 60 * 24 * 365; break;
        }
        var duration = factor * parseFloat($("#siteban input[name=durationNumber]").val());
        if (duration < 0) {
          $("#siteban p[name=errorText]").text("Invalid duration.");
          return;
        }
        if (duration > 1000 * 60 * 60 * 24 * 30 && !gClient.permissions.siteBanAnyDuration) {
          $("#siteban p[name=errorText]").text("You don't have permission to ban longer than 1 month. Contact a higher staff to ban the user for longer.");
          return;
        }
        msg.duration = duration;
      }

      var reason;
      if ($("#siteban select[name=reasonSelect]").val() === "custom") {
        reason = $("#siteban .text[name=reasonText]").val();
        if (reason.length === 0) {
          $("#siteban p[name=errorText]").text("Please provide a reason.");
          return;
        }
      } else {
        reason = $("#siteban select[name=reasonSelect]").val();
      }
      msg.reason = reason;

      var note = $("#siteban textarea[name=note]").val();
      if (note) {
        msg.note = note;
      }

      closeModal();
      gClient.sendArray([msg]);
    };
    $("#siteban .submit").click(function (evt) {
      submit();
    });
    $("#siteban select[name=reasonSelect]").change(function (evt) {
      if (this.value === "custom") {
        $("#siteban .text[name=reasonText]").attr("disabled", false);
        $("#siteban .text[name=reasonText]").val("");
      } else {
        $("#siteban .text[name=reasonText]").attr("disabled", true);
        $("#siteban .text[name=reasonText]").val(this.value);
      }
    });
    $("#siteban select[name=durationUnit]").change(function (evt) {
      if (this.value === "permanent") {
        $("#siteban .text[name=durationNumber]").attr("disabled", true);
      } else {
        $("#siteban .text[name=durationNumber]").attr("disabled", false);
      }
    });
    $("#siteban .text[name=id]").keypress(textKeypressEvent);
    $("#siteban .text[name=reasonText]").keypress(textKeypressEvent);
    $("#siteban .text[name=note]").keypress(textKeypressEvent);
    function textKeypressEvent(evt) {
      if (evt.keyCode == 13) {
        submit();
      } else if (evt.keyCode == 27) {
        closeModal();
      } else {
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    }
  })();








  //Accounts

  (function () {
    function logout() {
      delete localStorage.token;
      gClient.stop();
      gClient.start();
      closeModal();
    }
    $("#account .logout-btn").click(function (evt) {
      logout();
    });
    $("#account .login-discord").click(function (evt) {
      if (location.hostname === "127.0.0.1") {
        location.replace("https://discord.com/api/oauth2/authorize?client_id=926633278100877393&redirect_uri=http%3A%2F%2F127.0.0.1%2Fcallback%2Fdiscord&response_type=code&scope=identify");
      } else {
        location.replace("https://discord.com/api/oauth2/authorize?client_id=926633278100877393&redirect_uri=https%3A%2F%2Fmppclone.com%2Fcallback%2Fdiscord&response_type=code&scope=identify");
      }
    });
  })();















  // chatctor

  ////////////////////////////////////////////////////////////////

  var chat = (function () {
    var url_regex = new RegExp(
      // protocol identifier (optional)
      // short syntax // still required
      "(?:(?:(?:https?|ftp):)?\\/\\/)" +
      // user:pass BasicAuth (optional)
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broadcast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
      // host & domain names, may end with dot
      // can be replaced by a shortest alternative
      // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
      "(?:" +
      "(?:" +
      "[a-z0-9\\u00a1-\\uffff]" +
      "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
      ")?" +
      "[a-z0-9\\u00a1-\\uffff]\\." +
      ")+" +
      // TLD identifier name, may end with dot
      "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
      ")" +
      // port number (optional)
      "(?::\\d{2,5})?" +
      // resource path (optional)
      "(?:[/?#]\\S*)?",
      "i"
    );

    gClient.on("ch", function (msg) {
      if (msg.ch.settings.chat) {
        chat.show();
      } else {
        chat.hide();
      }
    });
    gClient.on("disconnect", function (msg) {

    });
    gClient.on("c", function (msg) {
      chat.clear();
      if (msg.c) {
        for (var i = 0; i < msg.c.length; i++) {
          chat.receive(msg.c[i]);
        }
      }
    });
    gClient.on("a", function (msg) {
      chat.receive(msg);
    });
    gClient.on("dm", function (msg) {
      chat.receive(msg);
    });

    $("#chat input").on("focus", function (evt) {
      releaseKeyboard();
      $("#chat").addClass("chatting");
      chat.scrollToBottom();
    });
    /*$("#chat input").on("blur", function(evt) {
      captureKeyboard();
      $("#chat").removeClass("chatting");
      chat.scrollToBottom();
    });*/
    $(document).mousedown(function (evt) {
      if (!$("#chat").has(evt.target).length > 0) {
        chat.blur();
      }
    });
    document.addEventListener("touchstart", function (event) {
      for (var i in event.changedTouches) {
        var touch = event.changedTouches[i];
        if (!$("#chat").has(touch.target).length > 0) {
          chat.blur();
        }
      }
    });
    $(document).on("keydown", function (evt) {
      if ($("#chat").hasClass("chatting")) {
        if (evt.keyCode == 27) {
          chat.blur();
          evt.preventDefault();
          evt.stopPropagation();
        } else if (evt.keyCode == 13) {
          $("#chat input").focus();
        }
      } else if (!gModal && (evt.keyCode == 27 || evt.keyCode == 13)) {
        $("#chat input").focus();
      }
    });
    $("#chat input").on("keydown", function (evt) {
      if (evt.keyCode == 13) {
        if (MPP.client.isConnected()) {
          var message = $(this).val();
          if (message.length == 0) {
            if (gIsDming) {
              gIsDming = false;
              $('#chat-input')[0].placeholder = 'You can chat with this thing.';
            }
            setTimeout(function () {
              chat.blur();
            }, 100);
          } else {
            chat.send(message);
            $(this).val("");
            setTimeout(function () {
              chat.blur();
            }, 100);
          }
        }
        evt.preventDefault();
        evt.stopPropagation();
      } else if (evt.keyCode == 27) {
        chat.blur();
        evt.preventDefault();
        evt.stopPropagation();
      } else if (evt.keyCode == 9) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    });

    // Optionally show a warning when clicking links
    /*$("#chat ul").on("click", ".chatLink", function(ev) {
      var $s = $(this);

      if(gWarnOnLinks) {
        if(!$s.hasClass("clickedOnce")) {
          $s.addClass("clickedOnce");
          var id = setTimeout(() => $s.removeClass("clickedOnce"), 2000);
          $s.data("clickTimeout", id)
          return false;
        } else {
          console.log("a")
          $s.removeClass("clickedOnce");
          var id = $s.data("clickTimeout")
          if(id !== void 0) {
            clearTimeout(id)
            $s.removeData("clickTimeout")
          }
        }
      }
    });*/

    return {
      show: function () {
        $("#chat").fadeIn();
      },

      hide: function () {
        $("#chat").fadeOut();
      },

      clear: function () {
        $("#chat li").remove();
      },

      scrollToBottom: function () {
        var ele = $("#chat ul").get(0);
        ele.scrollTop = ele.scrollHeight - ele.clientHeight;
      },

      blur: function () {
        if ($("#chat").hasClass("chatting")) {
          $("#chat input").get(0).blur();
          $("#chat").removeClass("chatting");
          chat.scrollToBottom();
          captureKeyboard();
        }
      },

      send: function (message) {
        if (gIsDming) {
          gClient.sendArray([{ m: 'dm', _id: gDmParticipant._id, message: message }]);
        } else {
          gClient.sendArray([{ m: "a", message: message }]);
        }
      },

      receive: function (msg) {
        if (msg.m === 'dm') {
          if (gChatMutes.indexOf(msg.sender._id) != -1) return;
        } else {
          if (gChatMutes.indexOf(msg.p._id) != -1) return;
        }

        //construct string for creating list element

        var liString = '<li>';

        var isSpecialDm = false;

        if (gShowTimestampsInChat) liString += '<span class="timestamp"/>';

        if (msg.m === 'dm') {
          if (msg.sender._id === gClient.user._id) { //sent dm
            liString += '<span class="sentDm"/>';
          } else if (msg.recipient._id === gClient.user._id) { //received dm
            liString += '<span class="receivedDm"/>';
          } else { //someone else's dm
            liString += '<span class="otherDm"/>';
            isSpecialDm = true;
          }
        }

        if (isSpecialDm) {
          if (gShowIdsInChat) liString += '<span class="id"/>';
          liString += '<span class="name"/><span class="dmArrow"/>';
          if (gShowIdsInChat) liString += '<span class="id2"/>';
          liString += '<span class="name2"/><span class="message"/>';
        } else {
          if (gShowIdsInChat) liString += '<span class="id"/>';
          liString += '<span class="name"/><span class="message"/>';
        }

        var li = $(liString);

        //prefix before dms so people know it's a dm
        if (msg.m === 'dm') {
          if (msg.sender._id === gClient.user._id) { //sent dm
            li.find(".sentDm").text('To');
            li.find(".sentDm").css("color", '#ff55ff');
          } else if (msg.recipient._id === gClient.user._id) { //received dm
            li.find(".receivedDm").text('From');
            li.find(".receivedDm").css("color", '#ff55ff');
          } else { //someone else's dm
            li.find(".otherDm").text('DM');
            li.find(".otherDm").css("color", '#ff55ff');

            li.find(".dmArrow").text('->');
            li.find(".dmArrow").css("color", '#ff55ff');
          }
        }

        if (gShowTimestampsInChat) {
          li.find(".timestamp").text(new Date(msg.t).toLocaleTimeString());
        }

        var message = $('<div>').text(msg.a).html().replace(/@([\da-f]{24})/g, (match, id) => {
          var user = gClient.ppl[id];
          if (user) {
            var nick = $('<div>').text(user.name).html();
            if (user.id === gClient.getOwnParticipant().id) {
              if (!tabIsActive) {
                youreMentioned = true;
                document.title = "You were mentioned!";
              }
              return `<span class="mention" style="background-color: ${user.color};">${nick}</span>`;
            }
            else return "@" + nick;
          }
          else return match;
        });

        // link formatting
        message = message.replace(url_regex, match => {
          var safe = $("<div>").text(match).html();
          return `<a rel="noreferer noopener" target="_blank" class="chatLink" href="${safe}">${safe}</a>`;
        });

        //apply names, colors, ids
        li.find(".message").html(message);

        if (msg.m === 'dm') {
          if (!gNoChatColors) li.find(".message").css("color", msg.sender.color || "white");
          if (gShowIdsInChat) li.find(".id").text(msg.sender._id.substring(0, 6));

          if (msg.sender._id === gClient.user._id) { //sent dm
            if (!gNoChatColors) li.find(".name").css("color", msg.recipient.color || "white");
            li.find(".name").text(msg.recipient.name + ":");
            if (gShowChatTooltips) li[0].title = msg.recipient._id;
          } else if (msg.recipient._id === gClient.user._id) { //received dm
            if (!gNoChatColors) li.find(".name").css("color", msg.sender.color || "white");
            li.find(".name").text(msg.sender.name + ":");

            if (gShowChatTooltips) li[0].title = msg.sender._id;
          } else { //someone else's dm
            if (!gNoChatColors) li.find(".name").css("color", msg.sender.color || "white");
            if (!gNoChatColors) li.find(".name2").css("color", msg.recipient.color || "white");
            li.find(".name").text(msg.sender.name);
            li.find(".name2").text(msg.recipient.name + ":");

            if (gShowIdsInChat) li.find(".id").text(msg.sender._id.substring(0, 6));
            if (gShowIdsInChat) li.find(".id2").text(msg.recipient._id.substring(0, 6));

            if (gShowChatTooltips) li[0].title = msg.sender._id;
          }
        } else {
          if (!gNoChatColors) li.find(".message").css("color", msg.p.color || "white");
          if (!gNoChatColors) li.find(".name").css("color", msg.p.color || "white");

          li.find(".name").text(msg.p.name + ":");

          if (!gNoChatColors) li.find(".message").css("color", msg.p.color || "white");
          if (gShowIdsInChat) li.find(".id").text(msg.p._id.substring(0, 6));

          if (gShowChatTooltips) li[0].title = msg.p._id;
        }

        //put list element in chat

        $("#chat ul").append(li);

        var eles = $("#chat ul li").get();
        for (var i = 1; i <= 50 && i <= eles.length; i++) {
          eles[eles.length - i].style.opacity = 1.0 - (i * 0.03);
        }
        if (eles.length > 50) {
          eles[0].style.display = "none";
        }
        if (eles.length > 256) {
          $(eles[0]).remove();
        }

        // scroll to bottom if not "chatting" or if not scrolled up
        if (!$("#chat").hasClass("chatting")) {
          chat.scrollToBottom();
        } else {
          var ele = $("#chat ul").get(0);
          if (ele.scrollTop > ele.scrollHeight - ele.offsetHeight - 50)
            chat.scrollToBottom();
        }
      }
    };
  })();















  // MIDI

  ////////////////////////////////////////////////////////////////

  var MIDI_TRANSPOSE = -12;
  var MIDI_KEY_NAMES = ["a-1", "as-1", "b-1"];
  var bare_notes = "c cs d ds e f fs g gs a as b".split(" ");
  for (var oct = 0; oct < 7; oct++) {
    for (var i in bare_notes) {
      MIDI_KEY_NAMES.push(bare_notes[i] + oct);
    }
  }
  MIDI_KEY_NAMES.push("c7");

  var devices_json = "[]";
  function sendDevices() {
    gClient.sendArray([{ "m": "devices", "list": JSON.parse(devices_json) }]);
  }
  gClient.on("connect", sendDevices);

  var pitchBends = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 };

  (function () {

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        function (midi) {
          console.log(midi);
          function midimessagehandler(evt) {
            if (!evt.target.enabled) return;
            //console.log(evt);
            var channel = evt.data[0] & 0xf;
            var cmd = evt.data[0] >> 4;
            var note_number = evt.data[1];
            var vel = evt.data[2];
            //console.log(channel, cmd, note_number, vel);
            if (cmd == 8 || (cmd == 9 && vel == 0)) {
              // NOTE_OFF
              release(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE + transpose + pitchBends[channel]]);
            } else if (cmd == 9) {
              // NOTE_ON
              if (evt.target.volume !== undefined)
                vel *= evt.target.volume;
              press(MIDI_KEY_NAMES[note_number - 9 + MIDI_TRANSPOSE + transpose + pitchBends[channel]], vel / 127);
            } else if (cmd == 11) {
              // CONTROL_CHANGE
              if (!gAutoSustain) {
                if (note_number == 64) {
                  if (vel > 0) {
                    pressSustain();
                  } else {
                    releaseSustain();
                  }
                }
              }
            } else if (cmd == 14) {
              var pitchMod = evt.data[1] + (evt.data[2] << 7) - 0x2000;
              pitchMod = Math.round(pitchMod / 1000);
              pitchBends[channel] = pitchMod;
            }
          }

          function deviceInfo(dev) {
            return {
              type: dev.type,
              //id: dev.id,
              manufacturer: dev.manufacturer,
              name: dev.name,
              version: dev.version,
              //connection: dev.connection,
              //state: dev.state,
              enabled: dev.enabled,
              volume: dev.volume
            };
          }

          function updateDevices() {
            var list = [];
            if (midi.inputs.size > 0) {
              var inputs = midi.inputs.values();
              for (var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
                var input = input_it.value;
                list.push(deviceInfo(input));
              }
            }
            if (midi.outputs.size > 0) {
              var outputs = midi.outputs.values();
              for (var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
                var output = output_it.value;
                list.push(deviceInfo(output));
              }
            }
            var new_json = JSON.stringify(list);
            if (new_json !== devices_json) {
              devices_json = new_json;
              sendDevices();
            }
          }

          function plug() {
            if (midi.inputs.size > 0) {
              var inputs = midi.inputs.values();
              for (var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
                var input = input_it.value;
                //input.removeEventListener("midimessage", midimessagehandler);
                //input.addEventListener("midimessage", midimessagehandler);
                input.onmidimessage = midimessagehandler;
                if (input.enabled !== false) {
                  input.enabled = true;
                }
                if (typeof input.volume === "undefined") {
                  input.volume = 1.0;
                }
                console.log("input", input);
              }
            }
            if (midi.outputs.size > 0) {
              var outputs = midi.outputs.values();
              for (var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
                var output = output_it.value;
                //output.enabled = false; // edit: don't touch
                if (typeof output.volume === "undefined") {
                  output.volume = 1.0;
                }
                console.log("output", output);
              }
              gMidiOutTest = function (note_name, vel, delay_ms, participantId) {
                if (!gOutputOwnNotes && participantId === gClient.participantId) return;
                var note_number = MIDI_KEY_NAMES.indexOf(note_name);
                if (note_number == -1) return;
                note_number = note_number + 9 - MIDI_TRANSPOSE;
                var outputs = midi.outputs.values();
                for (var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
                  var output = output_it.value;
                  if (output.enabled) {
                    var v = vel;
                    if (output.volume !== undefined)
                      v *= output.volume;
                    output.send([0x90, note_number, v], window.performance.now() + delay_ms);
                  }
                }
              }
            }
            showConnections(false);
            updateDevices();
          }

          midi.addEventListener("statechange", function (evt) {
            if (evt instanceof MIDIConnectionEvent) {
              plug();
            }
          });

          plug();


          var connectionsNotification;

          function showConnections(sticky) {
            //if(document.getElementById("Notification-MIDI-Connections"))
            //sticky = 1; // todo: instead, 
            var inputs_ul = document.createElement("ul");
            if (midi.inputs.size > 0) {
              var inputs = midi.inputs.values();
              for (var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
                var input = input_it.value;
                var li = document.createElement("li");
                li.connectionId = input.id;
                li.classList.add("connection");
                if (input.enabled) li.classList.add("enabled");
                li.textContent = input.name;
                li.addEventListener("click", function (evt) {
                  var inputs = midi.inputs.values();
                  for (var input_it = inputs.next(); input_it && !input_it.done; input_it = inputs.next()) {
                    var input = input_it.value;
                    if (input.id === evt.target.connectionId) {
                      input.enabled = !input.enabled;
                      evt.target.classList.toggle("enabled");
                      console.log("click", input);
                      updateDevices();
                      return;
                    }
                  }
                });
                if (gMidiVolumeTest) {
                  var knob = document.createElement("canvas");
                  mixin(knob, { width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: "knob" });
                  li.appendChild(knob);
                  knob = new Knob(knob, 0, 2, 0.01, input.volume, "volume");
                  knob.canvas.style.width = "16px";
                  knob.canvas.style.height = "16px";
                  knob.canvas.style.float = "right";
                  knob.on("change", function (k) {
                    input.volume = k.value;
                  });
                  knob.emit("change", knob);
                }
                inputs_ul.appendChild(li);
              }
            } else {
              inputs_ul.textContent = "(none)";
            }
            var outputs_ul = document.createElement("ul");
            if (midi.outputs.size > 0) {
              var outputs = midi.outputs.values();
              for (var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
                var output = output_it.value;
                var li = document.createElement("li");
                li.connectionId = output.id;
                li.classList.add("connection");
                if (output.enabled) li.classList.add("enabled");
                li.textContent = output.name;
                li.addEventListener("click", function (evt) {
                  var outputs = midi.outputs.values();
                  for (var output_it = outputs.next(); output_it && !output_it.done; output_it = outputs.next()) {
                    var output = output_it.value;
                    if (output.id === evt.target.connectionId) {
                      output.enabled = !output.enabled;
                      evt.target.classList.toggle("enabled");
                      console.log("click", output);
                      updateDevices();
                      return;
                    }
                  }
                });
                if (gMidiVolumeTest) {
                  var knob = document.createElement("canvas");
                  mixin(knob, { width: 16 * window.devicePixelRatio, height: 16 * window.devicePixelRatio, className: "knob" });
                  li.appendChild(knob);
                  knob = new Knob(knob, 0, 2, 0.01, output.volume, "volume");
                  knob.canvas.style.width = "16px";
                  knob.canvas.style.height = "16px";
                  knob.canvas.style.float = "right";
                  knob.on("change", function (k) {
                    output.volume = k.value;
                  });
                  knob.emit("change", knob);
                }
                outputs_ul.appendChild(li);
              }
            } else {
              outputs_ul.textContent = "(none)";
            }
            var div = document.createElement("div");
            var h1 = document.createElement("h1");
            h1.textContent = "Inputs";
            div.appendChild(h1);
            div.appendChild(inputs_ul);
            h1 = document.createElement("h1");
            h1.textContent = "Outputs";
            div.appendChild(h1);
            div.appendChild(outputs_ul);
            connectionsNotification = new Notification({ "id": "MIDI-Connections", "title": "MIDI Connections", "duration": sticky ? "-1" : "4500", "html": div, "target": "#midi-btn" });
          }

          document.getElementById("midi-btn").addEventListener("click", function (evt) {
            if (!document.getElementById("Notification-MIDI-Connections"))
              showConnections(true);
            else {
              connectionsNotification.close();
            }
          });
        },
        function (err) {
          console.log(err);
        });
    }
  })();













  // bug supply

  ////////////////////////////////////////////////////////////////

  window.onerror = function (message, url, line) {
    /*var url = url || "(no url)";
    var line = line || "(no line)";
    // errors in socket.io
    if(url.indexOf("socket.io.js") !== -1) {
      if(message.indexOf("INVALID_STATE_ERR") !== -1) return;
      if(message.indexOf("InvalidStateError") !== -1) return;
      if(message.indexOf("DOM Exception 11") !== -1) return;
      if(message.indexOf("Property 'open' of object #<c> is not a function") !== -1) return;
      if(message.indexOf("Cannot call method 'close' of undefined") !== -1) return;
      if(message.indexOf("Cannot call method 'close' of null") !== -1) return;
      if(message.indexOf("Cannot call method 'onClose' of null") !== -1) return;
      if(message.indexOf("Cannot call method 'payload' of null") !== -1) return;
      if(message.indexOf("Unable to get value of the property 'close'") !== -1) return;
      if(message.indexOf("NS_ERROR_NOT_CONNECTED") !== -1) return;
      if(message.indexOf("Unable to get property 'close' of undefined or null reference") !== -1) return;
      if(message.indexOf("Unable to get value of the property 'close': object is null or undefined") !== -1) return;
      if(message.indexOf("this.transport is null") !== -1) return;
    }
    // errors in soundmanager2
    if(url.indexOf("soundmanager2.js") !== -1) {
      // operation disabled in safe mode?
      if(message.indexOf("Could not complete the operation due to error c00d36ef") !== -1) return;
      if(message.indexOf("_s.o._setVolume is not a function") !== -1) return;
    }
    // errors in midibridge
    if(url.indexOf("midibridge") !== -1) {
      if(message.indexOf("Error calling method on NPObject") !== -1) return;
    }
    // too many failing extensions injected in my html
    if(url.indexOf(".js") !== url.length - 3) return;
    // extensions inject cross-domain embeds too
    if(url.toLowerCase().indexOf("multiplayerpiano.com") == -1) return;

    // errors in my code
    if(url.indexOf("script.js") !== -1) {
      if(message.indexOf("Object [object Object] has no method 'on'") !== -1) return;
      if(message.indexOf("Object [object Object] has no method 'off'") !== -1) return;
      if(message.indexOf("Property '$' of object [object Object] is not a function") !== -1) return;
    }

    var enc = "/bugreport/"
      + (message ? encodeURIComponent(message) : "") + "/"
      + (url ? encodeURIComponent(url) : "") + "/"
      + (line ? encodeURIComponent(line) : "");
    var img = new Image();
    img.src = enc;*/
  };









  // API
  window.MPP = {
    press: press,
    release: release,
    pressSustain: pressSustain,
    releaseSustain: releaseSustain,
    piano: gPiano,
    client: gClient,
    chat: chat,
    noteQuota: gNoteQuota,
    soundSelector: gSoundSelector,
    Notification: Notification
  };










  // record mp3
  (function () {
    var button = document.querySelector("#record-btn");
    var audio = MPP.piano.audio;
    var context = audio.context;
    var encoder_sample_rate = 44100;
    var encoder_kbps = 128;
    var encoder = null;
    var scriptProcessorNode = context.createScriptProcessor(4096, 2, 2);
    var recording = false;
    var recording_start_time = 0;
    var mp3_buffer = [];
    button.addEventListener("click", function (evt) {
      if (!recording) {
        // start recording
        mp3_buffer = [];
        encoder = new lamejs.Mp3Encoder(2, encoder_sample_rate, encoder_kbps);
        scriptProcessorNode.onaudioprocess = onAudioProcess;
        audio.masterGain.connect(scriptProcessorNode);
        scriptProcessorNode.connect(context.destination);
        recording_start_time = Date.now();
        recording = true;
        button.textContent = "Stop Recording";
        button.classList.add("stuck");
        new Notification({ "id": "mp3", "title": "Recording MP3...", "html": "It's recording now.  This could make things slow, maybe.  Maybe give it a moment to settle before playing.<br><br>This feature is experimental.", "duration": 10000 });
      } else {
        // stop recording
        var mp3buf = encoder.flush();
        mp3_buffer.push(mp3buf);
        var blob = new Blob(mp3_buffer, { type: "audio/mp3" });
        var url = URL.createObjectURL(blob);
        scriptProcessorNode.onaudioprocess = null;
        audio.masterGain.disconnect(scriptProcessorNode);
        scriptProcessorNode.disconnect(context.destination);
        recording = false;
        button.textContent = "Record MP3";
        button.classList.remove("stuck");
        new Notification({ "id": "mp3", "title": "MP3 recording finished", "html": "<a href=\"" + url + "\" target=\"blank\">And here it is!</a> (open or save as)<br><br>This feature is experimental.", "duration": 0 });
      }
    });
    function onAudioProcess(evt) {
      var inputL = evt.inputBuffer.getChannelData(0);
      var inputR = evt.inputBuffer.getChannelData(1);
      var mp3buf = encoder.encodeBuffer(convert16(inputL), convert16(inputR));
      mp3_buffer.push(mp3buf);
    }
    function convert16(samples) {
      var len = samples.length;
      var result = new Int16Array(len);
      for (var i = 0; i < len; i++) {
        result[i] = 0x8000 * samples[i];
      }
      return (result);
    }
  })();







  // synth
  var enableSynth = false;
  var audio = gPiano.audio;
  var context = gPiano.audio.context;
  var synth_gain = context.createGain();
  synth_gain.gain.value = 0.05;
  synth_gain.connect(audio.synthGain);

  var osc_types = ["sine", "square", "sawtooth", "triangle"];
  var osc_type_index = 1;

  var osc1_type = "square";
  var osc1_attack = 0;
  var osc1_decay = 0.2;
  var osc1_sustain = 0.5;
  var osc1_release = 2.0;

  function synthVoice(note_name, time) {
    var note_number = MIDI_KEY_NAMES.indexOf(note_name);
    note_number = note_number + 9 - MIDI_TRANSPOSE;
    var freq = Math.pow(2, (note_number - 69) / 12) * 440.0;
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

  synthVoice.prototype.stop = function (time) {
    //this.gain.gain.setValueAtTime(osc1_sustain, time);
    this.gain.gain.linearRampToValueAtTime(0, time + osc1_release);
    this.osc.stop(time + osc1_release);
  };

  (function () {
    var button = document.getElementById("synth-btn");
    var notification;

    button.addEventListener("click", function () {
      if (notification) {
        notification.close();
      } else {
        showSynth();
      }
    });

    function showSynth() {

      var html = document.createElement("div");

      // on/off button
      (function () {
        var button = document.createElement("input");
        mixin(button, { type: "button", value: "ON/OFF", className: enableSynth ? "switched-on" : "switched-off" });
        button.addEventListener("click", function (evt) {
          enableSynth = !enableSynth;
          button.className = enableSynth ? "switched-on" : "switched-off";
          if (!enableSynth) {
            // stop all
            for (var i in audio.playings) {
              if (!audio.playings.hasOwnProperty(i)) continue;
              var playing = audio.playings[i];
              if (playing && playing.voice) {
                playing.voice.osc.stop();
                playing.voice = undefined;
              }
            }
          }
        });
        html.appendChild(button);
      })();

      // mix
      var knob = document.createElement("canvas");
      mixin(knob, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob" });
      html.appendChild(knob);
      knob = new Knob(knob, 0, 100, 0.1, 50, "mix", "%");
      knob.canvas.style.width = "32px";
      knob.canvas.style.height = "32px";
      knob.on("change", function (k) {
        var mix = k.value / 100;
        audio.pianoGain.gain.value = 1 - mix;
        audio.synthGain.gain.value = mix;
      });
      knob.emit("change", knob);

      // osc1 type
      (function () {
        osc1_type = osc_types[osc_type_index];
        var button = document.createElement("input");
        mixin(button, { type: "button", value: osc_types[osc_type_index] });
        button.addEventListener("click", function (evt) {
          if (++osc_type_index >= osc_types.length) osc_type_index = 0;
          osc1_type = osc_types[osc_type_index];
          button.value = osc1_type;
        });
        html.appendChild(button);
      })();

      // osc1 attack
      var knob = document.createElement("canvas");
      mixin(knob, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob" });
      html.appendChild(knob);
      knob = new Knob(knob, 0, 1, 0.001, osc1_attack, "osc1 attack", "s");
      knob.canvas.style.width = "32px";
      knob.canvas.style.height = "32px";
      knob.on("change", function (k) {
        osc1_attack = k.value;
      });
      knob.emit("change", knob);

      // osc1 decay
      var knob = document.createElement("canvas");
      mixin(knob, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob" });
      html.appendChild(knob);
      knob = new Knob(knob, 0, 2, 0.001, osc1_decay, "osc1 decay", "s");
      knob.canvas.style.width = "32px";
      knob.canvas.style.height = "32px";
      knob.on("change", function (k) {
        osc1_decay = k.value;
      });
      knob.emit("change", knob);

      var knob = document.createElement("canvas");
      mixin(knob, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob" });
      html.appendChild(knob);
      knob = new Knob(knob, 0, 1, 0.001, osc1_sustain, "osc1 sustain", "x");
      knob.canvas.style.width = "32px";
      knob.canvas.style.height = "32px";
      knob.on("change", function (k) {
        osc1_sustain = k.value;
      });
      knob.emit("change", knob);

      // osc1 release
      var knob = document.createElement("canvas");
      mixin(knob, { width: 32 * window.devicePixelRatio, height: 32 * window.devicePixelRatio, className: "knob" });
      html.appendChild(knob);
      knob = new Knob(knob, 0, 2, 0.001, osc1_release, "osc1 release", "s");
      knob.canvas.style.width = "32px";
      knob.canvas.style.height = "32px";
      knob.on("change", function (k) {
        osc1_release = k.value;
      });
      knob.emit("change", knob);


      //useless blank space
      //var div = document.createElement("div");
      //div.innerHTML = "<br><br><br><br><center>this space intentionally left blank</center><br><br><br><br>";
      //html.appendChild(div);



      // notification
      notification = new Notification({ title: "Synthesize", html: html, duration: -1, target: "#synth-btn" });
      notification.on("close", function () {
        var tip = document.getElementById("tooltip");
        if (tip) tip.parentNode.removeChild(tip);
        notification = null;
      });
    }
  })();

  (function () {
    var button = document.getElementById("client-settings-btn");
    var notification;

    button.addEventListener("click", function () {
      if (notification) {
        notification.close();
      } else {
        showSynth();
      }
    });

    function showSynth() {

      var html = document.createElement("div");

      // show ids in chat
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "Show user IDs in chat";
        if (gShowIdsInChat) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.showIdsInChat = setting.classList.contains("enabled");
          gShowIdsInChat = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();

      // show timestamps in chat
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "Timestamps in chat";
        if (gShowTimestampsInChat) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.showTimestampsInChat = setting.classList.contains("enabled");
          gShowTimestampsInChat = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();

      // no chat colors
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "No chat colors";
        if (gNoChatColors) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.noChatColors = setting.classList.contains("enabled");
          gNoChatColors = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();

      // no background color
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "Force dark background";
        if (gNoBackgroundColor) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.noBackgroundColor = setting.classList.contains("enabled");
          gNoBackgroundColor = setting.classList.contains("enabled");
          if (gClient.channel.settings.color && !gNoBackgroundColor) {
            setBackgroundColor(gClient.channel.settings.color, gClient.channel.settings.color2);
          } else {
            setBackgroundColorToDefault();
          }
        };
        html.appendChild(setting);
      })();

      // output own notes
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "Output own notes to MIDI";
        if (gOutputOwnNotes) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.outputOwnNotes = setting.classList.contains("enabled");
          gOutputOwnNotes = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();

      // virtual piano layout
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "Virtual Piano layout";
        if (gVirtualPianoLayout) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.virtualPianoLayout = setting.classList.contains("enabled");
          gVirtualPianoLayout = setting.classList.contains("enabled");
          key_binding = gVirtualPianoLayout ? layouts.VP : layouts.MPP;
        };
        html.appendChild(setting);
      })();

      // 			gShowChatTooltips
      // Show chat tooltips for _ids.
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "Show _id tooltips";
        if (gShowChatTooltips) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.showChatTooltips = setting.classList.contains("enabled");
          gShowChatTooltips = setting.classList.contains("enabled");
        };
        html.appendChild(setting);
      })();

      // Enable smooth cursors.
      (function () {
        var setting = document.createElement("div");
        setting.classList = "setting";
        setting.innerText = "Enable smooth cursors";
        if (gSmoothCursor) {
          setting.classList.toggle("enabled");
        }
        setting.onclick = function () {
          setting.classList.toggle("enabled");
          localStorage.smoothCursor = setting.classList.contains("enabled");
          gSmoothCursor = setting.classList.contains("enabled");
          if (gSmoothCursor) {
            $("#cursors").attr('smooth-cursors', '');
          } else {
            $("#cursors").removeAttr('smooth-cursors');
          }
          if (gSmoothCursor) {
            Object.values(gClient.ppl).forEach(function (participant) {
              if (participant.cursorDiv) {
                participant.cursorDiv.style.left = '';
                participant.cursorDiv.style.top = '';
                participant.cursorDiv.style.transform = 'translate3d(' + participant.x + 'vw, ' + participant.y + 'vh, 0)';
              }
            });
          } else {
            Object.values(gClient.ppl).forEach(function (participant) {
              if (participant.cursorDiv) {
                participant.cursorDiv.style.left = participant.x + "%";
                participant.cursorDiv.style.top = participant.y + "%";
                participant.cursorDiv.style.transform = '';
              }
            });
          }
        };
        html.appendChild(setting);
      })();

      // warn on links
      /*(function() {
        var setting = document.createElement("div");
          setting.classList = "setting";
          setting.innerText = "Warn when clicking links";
          if (gWarnOnLinks) {
                    setting.classList.toggle("enabled");
          }
          setting.onclick = function() {
            setting.classList.toggle("enabled");
            localStorage.warnOnLinks = setting.classList.contains("enabled");
            gWarnOnLinks = setting.classList.contains("enabled");
          };
        html.appendChild(setting);
      })();*/


      //useless blank space
      //var div = document.createElement("div");
      //div.innerHTML = "<br><br><br><br><center>this space intentionally left blank</center><br><br><br><br>";
      //html.appendChild(div);



      // notification
      notification = new Notification({ title: "Client Settings", html: html, duration: -1, target: "#client-settings-btn" });
      notification.on("close", function () {
        var tip = document.getElementById("tooltip");
        if (tip) tip.parentNode.removeChild(tip);
        notification = null;
      });
    }
  })();














  gClient.start();
});



















// misc

////////////////////////////////////////////////////////////////


// non-ad-free experience
/*(function() {
  function adsOn() {
    if(window.localStorage) {
      var div = document.querySelector("#inclinations");
      div.innerHTML = "Ads:<br>ON / <a id=\"adsoff\" href=\"#\">OFF</a>";
      div.querySelector("#adsoff").addEventListener("click", adsOff);
      localStorage.ads = true;
    }
    // adsterra
    var script = document.createElement("script");
    script.src = "//pl132070.puhtml.com/68/7a/97/687a978dd26d579c788cb41e352f5a41.js";
    document.head.appendChild(script);
  }

  function adsOff() {
    if(window.localStorage) localStorage.ads = false;
    document.location.reload(true);
  }

  function noAds() {
    var div = document.querySelector("#inclinations");
    div.innerHTML = "Ads:<br><a id=\"adson\" href=\"#\">ON</a> / OFF";
    div.querySelector("#adson").addEventListener("click", adsOn);
  }

  if(window.localStorage) {
    if(localStorage.ads === undefined || localStorage.ads === "true")
      adsOn();
    else
      noAds();
  } else {
    adsOn();
  }
})();*/

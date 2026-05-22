import { EventEmitter } from '../util/util';
import type { Participant, Channel, ChannelSettings, Permissions, NoteQuotaParams } from '../types';

WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
  apply: (target, thisArg, args) => {
    if (!(args[0] instanceof ArrayBuffer) && localStorage.token && !args[0].startsWith(`[{"m":"hi"`))
      args[0] = args[0].replace(localStorage.token, "[REDACTED]");
    return target.apply(thisArg, args);
  },
});

export class Client extends EventEmitter {
  uri: string;
  ws: WebSocket | undefined;
  serverTimeOffset: number = 0;
  user: Participant | undefined;
  participantId: string | undefined;
  channel: Channel | undefined;
  ppl: Record<string, Participant> = {};
  connectionTime: number | undefined;
  connectionAttempts: number = 0;
  desiredChannelId: string | undefined;
  desiredChannelSettings: Partial<ChannelSettings> | undefined;
  pingInterval: ReturnType<typeof setInterval> | undefined;
  canConnect: boolean = false;
  noteBuffer: Array<{ n: string; v?: number; d?: number; s?: number }> = [];
  noteBufferTime: number = 0;
  noteFlushInterval: ReturnType<typeof setInterval> | undefined;
  permissions: Permissions = {};
  "🐈": number = 0;
  loginInfo: Record<string, string> | undefined;
  accountInfo: { type: string; avatar?: string; username?: string } | undefined;
  offlineChannelSettings = { color: "#ecfaed" };
  offlineParticipant = { id: "", _id: "", name: "", color: "#777" };

  constructor(uri: string) {
    if ((window as any).MPP && (window as any).MPP.client) {
      throw new Error("Running multiple clients in a single tab is not allowed due to abuse.");
    }
    super();
    this.uri = uri;
    this.bindEventListeners();
    this.emit("status", "(Offline mode)");
  }

  isSupported() { return typeof WebSocket === "function"; }
  isConnected() { return this.isSupported() && this.ws && this.ws.readyState === WebSocket.OPEN; }
  isConnecting() { return this.isSupported() && this.ws && this.ws.readyState === WebSocket.CONNECTING; }

  start() { this.canConnect = true; if (!this.connectionTime) this.connect(); }
  stop() { this.canConnect = false; this.ws!.close(); }

  decodeBinaryMessage(buffer: ArrayBuffer) {
    const view = new DataView(buffer);
    const metaLength = view.getUint32(0);
    const metaBytes = new Uint8Array(buffer, 4, metaLength);
    const meta = JSON.parse(new TextDecoder().decode(metaBytes));
    const binary = buffer.slice(4 + metaLength);
    return { meta, binary };
  }

  connect() {
    if (!this.canConnect || !this.isSupported() || this.isConnected() || this.isConnecting()) return;
    this.emit("status", "Connecting...");
    this.ws = new WebSocket(this.uri);
    this.ws.binaryType = "arraybuffer";
    const self = this;
    this.ws.addEventListener("close", function (evt) {
      self.user = undefined;
      self.participantId = undefined;
      self.channel = undefined;
      self.setParticipants([]);
      clearInterval(self.pingInterval);
      clearInterval(self.noteFlushInterval);
      self.emit("disconnect", evt);
      self.emit("status", "Offline mode");
      if (self.connectionTime) { self.connectionTime = undefined; self.connectionAttempts = 0; }
      else { ++self.connectionAttempts; }
      const ms_lut = [50, 2500, 10000];
      let idx = self.connectionAttempts;
      if (idx >= ms_lut.length) idx = ms_lut.length - 1;
      setTimeout(self.connect.bind(self), ms_lut[idx]);
    });
    this.ws.addEventListener("error", function (err) { self.emit("wserror", err); self.ws!.close(); });
    this.ws.addEventListener("open", function (evt) {
      self.pingInterval = setInterval(function () { self.sendPing(); }, 20000);
      self.noteBuffer = [];
      self.noteBufferTime = 0;
      self.noteFlushInterval = setInterval(function () {
        if (self.noteBufferTime && self.noteBuffer.length > 0) {
          self.sendArray([{ m: "n", t: self.noteBufferTime + self.serverTimeOffset, n: self.noteBuffer }]);
          self.noteBufferTime = 0;
          self.noteBuffer = [];
        }
      }, 200);
      self.emit("connect");
      self.emit("status", "Joining channel...");
    });
    this.ws.addEventListener("message", async function (evt: any) {
      if (evt.data instanceof ArrayBuffer) {
        const { meta, binary } = self.decodeBinaryMessage(evt.data);
        self.emit(meta.m, { ...meta, binary });
      } else {
        const transmission = JSON.parse(evt.data);
        for (let i = 0; i < transmission.length; i++) { self.emit(transmission[i].m, transmission[i]); }
      }
    });
  }

  bindEventListeners() {
    const self = this;
    this.on("hi", function (msg: any) {
      self.connectionTime = Date.now();
      self.user = msg.u;
      self.receiveServerTime(msg.t, msg.e || undefined);
      if (self.desiredChannelId) self.setChannel();
      if (msg.token) localStorage.token = msg.token;
      self.permissions = msg.permissions || {};
      self.accountInfo = msg.accountInfo || undefined;
    });
    this.on("t", function (msg: any) { self.receiveServerTime(msg.t, msg.e || undefined); });
    this.on("ch", function (msg: any) {
      self.desiredChannelId = msg.ch._id;
      self.desiredChannelSettings = msg.ch.settings;
      self.channel = msg.ch;
      if (msg.p) self.participantId = msg.p;
      self.setParticipants(msg.ppl);
    });
    this.on("p", function (msg: any) {
      self.participantUpdate(msg);
      self.emit("participant update", self.findParticipantById(msg.id));
    });
    this.on("m", function (msg: any) {
      if (self.ppl.hasOwnProperty(msg.id)) self.participantMoveMouse(msg);
    });
    this.on("bye", function (msg: any) { self.removeParticipant(msg.p); });
    this.on("b", async function (this: any, msg: any) {
      const hiMsg: Record<string, unknown> = { m: "hi" };
      hiMsg["🐈"] = self["🐈"]++ || undefined;
      if (self.loginInfo) hiMsg.login = self.loginInfo;
      self.loginInfo = undefined;
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      try {
        if (msg.code.startsWith("~")) hiMsg.code = await AsyncFunction(msg.code.substring(1))();
        else hiMsg.code = await AsyncFunction(msg.code)();
      } catch (err: any) {
        hiMsg.code = err && typeof err === "object"
          ? (err.stack || err.message || JSON.stringify(err)) : String(err);
      }
      if (localStorage.token) hiMsg.token = localStorage.token;
      self.sendArray([hiMsg]);
    });
  }

  send(raw: string) { if (this.isConnected()) this.ws!.send(raw); }
  sendArray(arr: Record<string, unknown>[]) { this.send(JSON.stringify(arr)); }

  setChannel(id?: string, set?: Partial<ChannelSettings>) {
    this.desiredChannelId = id || this.desiredChannelId || "lobby";
    this.desiredChannelSettings = set || this.desiredChannelSettings || undefined;
    this.sendArray([{ m: "ch", _id: this.desiredChannelId, set: this.desiredChannelSettings }]);
  }

  getChannelSetting(key: string) {
    if (!this.isConnected() || !this.channel || !this.channel.settings)
      return (this.offlineChannelSettings as any)[key];
    return this.channel.settings[key];
  }

  setChannelSettings(settings: Partial<ChannelSettings>) {
    if (!this.isConnected() || !this.channel || !this.channel.settings) return;
    if (this.desiredChannelSettings) {
      for (const key in settings) this.desiredChannelSettings[key] = settings[key];
      this.sendArray([{ m: "chset", set: this.desiredChannelSettings }]);
    }
  }

  getOwnParticipant() { return this.findParticipantById(this.participantId); }

  setParticipants(ppl: Participant[]) {
    for (const id in this.ppl) {
      if (!this.ppl.hasOwnProperty(id)) continue;
      let found = false;
      for (let j = 0; j < ppl.length; j++) { if (ppl[j].id === id) { found = true; break; } }
      if (!found) this.removeParticipant(id);
    }
    for (let i = 0; i < ppl.length; i++) this.participantUpdate(ppl[i]);
  }

  countParticipants() {
    let count = 0;
    for (const i in this.ppl) { if (this.ppl.hasOwnProperty(i)) ++count; }
    return count;
  }

  participantUpdate(update: Partial<Participant>) {
    let part = this.ppl[update.id] || null;
    if (part === null) {
      part = update as Participant;
      this.ppl[part.id] = part;
      this.emit("participant added", part);
      this.emit("count", this.countParticipants());
    } else {
      Object.keys(update).forEach((key) => { part[key] = update[key]; });
      if (!update.tag) delete part.tag;
      if (!update.vanished) delete part.vanished;
    }
  }

  participantMoveMouse(update: { id: string; x: number; y: number }) {
    const part = this.ppl[update.id] || null;
    if (part !== null) { part.x = update.x; part.y = update.y; }
  }

  removeParticipant(id: string) {
    if (this.ppl.hasOwnProperty(id)) {
      const part = this.ppl[id];
      delete this.ppl[id];
      this.emit("participant removed", part);
      this.emit("count", this.countParticipants());
    }
  }

  findParticipantById(id: string): Participant { return this.ppl[id] || this.offlineParticipant; }

  isOwner() {
    return this.channel && this.channel.crown && this.channel.crown.participantId === this.participantId;
  }

  preventsPlaying() {
    return this.isConnected() && !this.isOwner() &&
      this.getChannelSetting("crownsolo") === true && !this.permissions.playNotesAnywhere;
  }

  receiveServerTime(time: number, echo?: number) {
    const self = this;
    const now = Date.now();
    const target = time - now;
    let step = 0; const steps = 50;
    const step_ms = 1000 / steps;
    const inc = (target - this.serverTimeOffset) / steps;
    const iv = setInterval(function () {
      self.serverTimeOffset += inc;
      if (++step >= steps) { clearInterval(iv); self.serverTimeOffset = target; }
    }, step_ms);
  }

  startNote(note: string, vel?: number) {
    if (typeof note !== "string") return;
    if (this.isConnected()) {
      const v = typeof vel === "undefined" ? undefined : +vel.toFixed(3);
      if (!this.noteBufferTime) { this.noteBufferTime = Date.now(); this.noteBuffer.push({ n: note, v: v }); }
      else { this.noteBuffer.push({ d: Date.now() - this.noteBufferTime, n: note, v: v }); }
    }
  }

  stopNote(note: string) {
    if (typeof note !== "string") return;
    if (this.isConnected()) {
      if (!this.noteBufferTime) { this.noteBufferTime = Date.now(); this.noteBuffer.push({ n: note, s: 1 }); }
      else { this.noteBuffer.push({ d: Date.now() - this.noteBufferTime, n: note, s: 1 }); }
    }
  }

  sendPing() { this.sendArray([{ m: "t", e: Date.now() }]); }
  setLoginInfo(loginInfo: Record<string, string>) { this.loginInfo = loginInfo; }
}

import type { NoteQuotaParams } from '../types';

export class NoteQuota {
  static PARAMS_LOBBY = { allowance: 200, max: 600 };
  static PARAMS_NORMAL = { allowance: 400, max: 1200 };
  static PARAMS_RIDICULOUS = { allowance: 600, max: 1800 };
  static PARAMS_OFFLINE = { allowance: 8000, max: 24000, maxHistLen: 3 };
  static PARAMS_UNLIMITED = { allowance: 1000000, max: 3000000, maxHistLen: 3 };

  cb: (points: number) => void;
  allowance: number = 0;
  max: number = 0;
  maxHistLen: number = 0;
  points: number = 0;
  history: number[] = [];

  constructor(cb: (points: number) => void) {
    this.cb = cb;
    this.setParams();
    this.resetPoints();
  }

  getParams() {
    return { m: "nq", allowance: this.allowance, max: this.max, maxHistLen: this.maxHistLen };
  }

  setParams(params?: NoteQuotaParams) {
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
    for (let i = 0; i < this.maxHistLen; i++) this.history.unshift(this.points);
    if (this.cb) this.cb(this.points);
  }

  tick() {
    this.history.unshift(this.points);
    this.history.length = this.maxHistLen;
    if (this.points < this.max) {
      this.points += this.allowance;
      if (this.points > this.max) this.points = this.max;
      if (this.cb) this.cb(this.points);
    }
  }

  spend(needed: number) {
    let sum = 0;
    for (const i in this.history) { sum += this.history[i]; }
    if (sum <= 0) needed *= this.allowance;
    if (this.points < needed) {
      return false;
    } else {
      this.points -= needed;
      if (this.cb) this.cb(this.points);
      return true;
    }
  }
}

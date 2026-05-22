export interface Participant {
  id: string;
  _id: string;
  name: string;
  color: string;
  tag?: { text: string; color: string };
  x?: number;
  y?: number;
  nameDiv?: HTMLElement;
  cursorDiv?: HTMLElement;
  vanished?: boolean;
  afk?: boolean;
  displayX?: number;
  displayY?: number;
}

export interface ChannelSettings {
  visible?: boolean;
  chat?: boolean;
  crownsolo?: boolean;
  'no cussing'?: boolean;
  color?: string;
  color2?: string;
  lobby?: boolean;
  noindex?: boolean;
  allowBots?: boolean;
  limit?: number;
  owner_id?: string;
}

export interface Crown {
  participantId?: string;
  time: number;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
}

export interface Channel {
  _id: string;
  settings: ChannelSettings;
  crown?: Crown;
}

export interface ChatMessage {
  m: string;
  id: string;
  a: string;
  t: number;
  p?: Participant;
  r?: string;
  sender?: Participant;
  recipient?: Participant;
}

export interface NoteMessage {
  m: string;
  t: number;
  p: string;
  n: Array<{ n: string; v?: number; d?: number; s?: number }>;
}

export interface NotificationParams {
  id?: string;
  title?: string;
  text?: string;
  html?: string | HTMLElement;
  target?: string;
  duration?: number;
  class?: string;
}

export interface SoundPack {
  name: string;
  keys: string[];
  ext: string;
  url: string;
  html?: HTMLElement;
}

export interface ConfettiParticle {
  color: string;
  x: number;
  y: number;
  diameter: number;
  tilt: number;
  tiltAngleIncrement: number;
  tiltAngle: number;
}

export interface Permissions {
  playNotesAnywhere?: boolean;
  clearChat?: boolean;
  vanish?: boolean;
  chsetAnywhere?: boolean;
  chownAnywhere?: boolean;
  siteBan?: boolean;
  siteBanAnyReason?: boolean;
  siteBanAnyDuration?: boolean;
  usersetOthers?: boolean;
}

export interface NoteQuotaParams {
  m?: string;
  allowance?: number;
  max?: number;
  maxHistLen?: number;
}

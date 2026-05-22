import { parseMarkdown, parseUrl, parseContent, fadeIn, fadeOut } from "../util/util";
import { Notification } from "../libs/Notification";
import { getClient, state } from "../util/state";
import { settings } from "./settings/settings";
import {
  getIsDming, setIsDming,
  getDmParticipant, setDmParticipant,
  getIsReplying, setIsReplying,
  getReplyParticipant, setReplyParticipant,
  getMessageId, setMessageId,
} from "./keyboard";
import {
  getTabIsActive,
  setYoureMentioned,
  setYoureReplied,
} from "./connection";
import type { ChatMessage } from '../types';
import { i18next } from "../util/translations";

export interface Chat {
  startDM(part: any): void;
  endDM(): void;
  startReply(part: any, id: any, msg?: any): void;
  startDmReply(part: any, id: any): void;
  cancelReply(part: any): void;
  show(): void;
  hide(): void;
  clear(): void;
  scrollToBottom(): void;
  blur(): void;
  send(message: string): void;
  receive(msg: any): void;
}

export function initChat(): Chat {
  const gClient = getClient();

  // Lazy require to avoid circular deps
  const getModal = (): string | null => {
    const { getModal: gm } = require("../util/modal");
    return gm();
  };
  const captureKb = (): void => {
    const { captureKeyboard } = require("./keyboard");
    captureKeyboard();
  };
  const releaseKb = (): void => {
    const { releaseKeyboard } = require("./keyboard");
    releaseKeyboard();
  };

  const messageCache: ChatMessage[] = [];

  const chat: Chat = {
    startDM(part: any): void {
      setIsDming(true);
      setDmParticipant(part);
      (document.getElementById('chat-input') as HTMLInputElement).placeholder = "Direct messaging " + part.name + ".";
    },

    endDM(): void {
      setIsDming(false);
      (document.getElementById('chat-input') as HTMLInputElement).placeholder = i18next.t(
        "You can chat with this thing.",
      );
    },

    startReply(part: any, id: any): void {
      const msgEl = document.getElementById('msg-' + getMessageId());
      if (msgEl) Object.assign(msgEl.style, {
        backgroundColor: "unset",
        border: "1px solid #00000000",
      });
      setIsReplying(true);
      setReplyParticipant(part);
      setMessageId(id);
      (document.getElementById('chat-input') as HTMLInputElement).placeholder = `Replying to ${part.name}`;
    },

    startDmReply(part: any, id: any): void {
      const msgEl = document.getElementById('msg-' + getMessageId());
      if (msgEl) Object.assign(msgEl.style, {
        backgroundColor: "unset",
        border: "1px solid #00000000",
      });
      setIsReplying(true);
      setIsDming(true);
      setMessageId(id);
      setReplyParticipant(part);
      setDmParticipant(part);
      (document.getElementById('chat-input') as HTMLInputElement).placeholder = `Replying to ${part.name} in a DM.`;
    },

    cancelReply(part: any): void {
      setIsReplying(false);
      const msgEl = document.getElementById('msg-' + getMessageId());
      if (msgEl) Object.assign(msgEl.style, {
        backgroundColor: "unset",
        border: "1px solid #00000000",
      });
      (document.getElementById('chat-input') as HTMLInputElement).placeholder = i18next.t(
        getIsDming()
          ? `Direct messaging ${part.name}`
          : `You can chat with this thing.`,
      );
    },

    show(): void {
      fadeIn(document.getElementById('chat')!, 250);
    },

    hide(): void {
      fadeOut(document.getElementById('chat')!, 250);
    },

    clear(): void {
      document.querySelectorAll('#chat li').forEach(el => el.remove());
    },

    scrollToBottom(): void {
      const ele = document.querySelector('#chat ul') as HTMLElement;
      ele.scrollTop = ele.scrollHeight - ele.clientHeight;
    },

    blur(): void {
      if (document.getElementById('chat')!.classList.contains('chatting')) {
        (document.querySelector('#chat input') as HTMLElement).blur();
        document.getElementById('chat')!.classList.remove('chatting');
        chat.scrollToBottom();
        captureKb();
      }
    },

    send(message: string): void {
      if (getIsReplying()) {
        if (getIsDming()) {
          gClient.sendArray([
            {
              m: "dm",
              reply_to: getMessageId(),
              _id: getReplyParticipant()._id,
              message,
            },
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
              message,
            },
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

    receive(msg: any): void {
      if (msg.m === "dm") {
        if (settings.chatMutes.indexOf(msg.sender._id) !== -1) return;
      } else {
        if (settings.chatMutes.indexOf(msg.p._id) !== -1) return;
      }

      const li = document.createElement('li');
      li.id = 'msg-' + msg.id;
      let isSpecialDm = false;

      if (msg.m === "dm") {
        if (
          msg.sender._id === gClient.user._id ||
          msg.recipient._id === gClient.user._id
        ) {
          const replySpan = document.createElement('span');
          replySpan.className = 'reply';
          li.appendChild(replySpan);
        }
      } else {
        const replySpan = document.createElement('span');
        replySpan.className = 'reply';
        li.appendChild(replySpan);
      }

      if (settings.showTimestampsInChat) {
        const tsSpan = document.createElement('span');
        tsSpan.className = 'timestamp';
        li.appendChild(tsSpan);
      }

      if (msg.m === "dm") {
        if (msg.sender._id === gClient.user._id) {
          const s = document.createElement('span');
          s.className = 'sentDm';
          li.appendChild(s);
        } else if (msg.recipient._id === gClient.user._id) {
          const s = document.createElement('span');
          s.className = 'receivedDm';
          li.appendChild(s);
        } else {
          const s = document.createElement('span');
          s.className = 'otherDm';
          li.appendChild(s);
          isSpecialDm = true;
        }
      }

      if (isSpecialDm) {
        if (settings.showIdsInChat) {
          const s = document.createElement('span');
          s.className = 'id';
          li.appendChild(s);
        }
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        li.appendChild(nameSpan);
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'dmArrow';
        li.appendChild(arrowSpan);
        if (settings.showIdsInChat) {
          const s = document.createElement('span');
          s.className = 'id2';
          li.appendChild(s);
        }
        const name2Span = document.createElement('span');
        name2Span.className = 'name2';
        li.appendChild(name2Span);
        const msgSpan = document.createElement('span');
        msgSpan.className = 'message';
        li.appendChild(msgSpan);
      } else {
        if (settings.showIdsInChat) {
          const s = document.createElement('span');
          s.className = 'id';
          li.appendChild(s);
        }
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        li.appendChild(nameSpan);
        if (msg.r) {
          const rlSpan = document.createElement('span');
          rlSpan.className = 'replyLink';
          li.appendChild(rlSpan);
        }
        const msgSpan = document.createElement('span');
        msgSpan.className = 'message';
        li.appendChild(msgSpan);
      }

      const replyEl = li.querySelector('.reply') as HTMLElement | null;
      if (replyEl) replyEl.textContent = "➦";

      if (msg.r) {
        const repliedMsg = messageCache.find((e: any) => e.id === msg.r);
        if (!getTabIsActive()) {
          if (repliedMsg?.p?._id === gClient.user._id) {
            document.title = `You have received a reply!`;
            setYoureReplied(true);
          }
        }
        if (repliedMsg) {
          const replyLinkEl = li.querySelector('.replyLink') as HTMLElement;
          replyLinkEl.textContent = `➥ ${
            repliedMsg.m === "dm"
              ? repliedMsg.sender.name
              : repliedMsg.p.name
          }`;
          Object.assign(replyLinkEl.style, {
            background: `${
              (repliedMsg?.m === "dm"
                ? repliedMsg?.sender?.color
                : repliedMsg?.p?.color) ?? "gray"
            }`,
          });
          replyLinkEl.addEventListener('click', () => {
            (document.querySelector('#chat input') as HTMLElement).focus();
            document
              .getElementById(`msg-${repliedMsg?.id}`)
              ?.scrollIntoView({ behavior: "smooth" });
            const repliedEl = document.getElementById('msg-' + repliedMsg?.id);
            if (repliedEl) Object.assign(repliedEl.style, {
              border: `1px solid ${
                repliedMsg?.m === "dm"
                  ? repliedMsg.sender?.color
                  : repliedMsg.p?.color
              }80`,
              backgroundColor: `${
                repliedMsg?.m === "dm"
                  ? repliedMsg.sender?.color
                  : repliedMsg.p?.color
              }20`,
            });
            setTimeout(() => {
              const el = document.getElementById('msg-' + repliedMsg?.id);
              if (el) Object.assign(el.style, {
                backgroundColor: "unset",
                border: "1px solid #00000000",
              });
            }, 5000);
          });
        } else {
          (li.querySelector('.replyLink') as HTMLElement).textContent = "➥ Unknown Message";
          Object.assign((li.querySelector('.replyLink') as HTMLElement).style, { background: "gray" });
        }
      }

      // prefix before dms
      if (msg.m === "dm") {
        if (msg.sender._id === gClient.user._id) {
          (li.querySelector('.sentDm') as HTMLElement).textContent = "To";
          Object.assign((li.querySelector('.sentDm') as HTMLElement).style, { color: "#ff55ff" });
        } else if (msg.recipient._id === gClient.user._id) {
          (li.querySelector('.receivedDm') as HTMLElement).textContent = "From";
          Object.assign((li.querySelector('.receivedDm') as HTMLElement).style, { color: "#ff55ff" });
        } else {
          (li.querySelector('.otherDm') as HTMLElement).textContent = "DM";
          Object.assign((li.querySelector('.otherDm') as HTMLElement).style, { color: "#ff55ff" });
          (li.querySelector('.dmArrow') as HTMLElement).textContent = "->";
          Object.assign((li.querySelector('.dmArrow') as HTMLElement).style, { color: "#ff55ff" });
        }
      }

      if (settings.showTimestampsInChat) {
        (li.querySelector('.timestamp') as HTMLElement).textContent = new Date(msg.t).toLocaleTimeString();
      }

      const message = parseMarkdown(parseContent(msg.a), parseUrl).replace(
        /@([\da-f]{24})/g,
        (match: string, id: string) => {
          const user = gClient.ppl[id];
          if (user) {
            const nick = parseContent(user.name);
            if (user.id === gClient.getOwnParticipant()!.id) {
              if (!getTabIsActive()) {
                setYoureMentioned(true);
                document.title = i18nextt.t(
                  "You were mentioned!",
                );
              }
              return `<span class="mention" style="background-color: ${user.color};">${nick}</span>`;
            } else return `@${nick}`;
          } else return match;
        },
      );

      // apply names, colors, ids
      (li.querySelector('.message') as HTMLElement).innerHTML = message;

      if (msg.m === "dm") {
        if (!settings.noChatColors)
          Object.assign((li.querySelector('.message') as HTMLElement).style, { color: msg.sender.color || "white" });
        if (settings.showIdsInChat) {
          if (msg.sender._id === gClient.user._id) {
            (li.querySelector('.id') as HTMLElement).textContent = msg.recipient._id.substring(0, 6);
          } else {
            (li.querySelector('.id') as HTMLElement).textContent = msg.sender._id.substring(0, 6);
          }
        }

        if (msg.sender._id === gClient.user._id) {
          if (!settings.noChatColors)
            Object.assign((li.querySelector('.name') as HTMLElement).style, { color: msg.recipient.color || "white" });
          (li.querySelector('.name') as HTMLElement).textContent = msg.recipient.name + ":";
          if (settings.showChatTooltips) li.title = msg.recipient._id;
        } else if (msg.recipient._id === gClient.user._id) {
          if (!settings.noChatColors)
            Object.assign((li.querySelector('.name') as HTMLElement).style, { color: msg.sender.color || "white" });
          (li.querySelector('.name') as HTMLElement).textContent = msg.sender.name + ":";
          if (settings.showChatTooltips) li.title = msg.sender._id;
        } else {
          if (!settings.noChatColors)
            Object.assign((li.querySelector('.name') as HTMLElement).style, { color: msg.sender.color || "white" });
          if (!settings.noChatColors)
            Object.assign((li.querySelector('.name2') as HTMLElement).style, { color: msg.recipient.color || "white" });
          (li.querySelector('.name') as HTMLElement).textContent = msg.sender.name;
          (li.querySelector('.name2') as HTMLElement).textContent = msg.recipient.name + ":";
          if (settings.showIdsInChat)
            (li.querySelector('.id') as HTMLElement).textContent = msg.sender._id.substring(0, 6);
          if (settings.showIdsInChat)
            (li.querySelector('.id2') as HTMLElement).textContent = msg.recipient._id.substring(0, 6);
          if (settings.showChatTooltips) li.title = msg.sender._id;
        }
      } else {
        if (!settings.noChatColors)
          Object.assign((li.querySelector('.message') as HTMLElement).style, { color: msg.p.color || "white" });
        if (!settings.noChatColors)
          Object.assign((li.querySelector('.name') as HTMLElement).style, { color: msg.p.color || "white" });
        (li.querySelector('.name') as HTMLElement).textContent = msg.p.name + ":";
        if (!settings.noChatColors)
          Object.assign((li.querySelector('.message') as HTMLElement).style, { color: msg.p.color || "white" });
        if (settings.showIdsInChat) (li.querySelector('.id') as HTMLElement).textContent = msg.p._id.substring(0, 6);
        if (settings.showChatTooltips) li.title = msg.p._id;
      }

      // Adds copying _ids on click in chat
      li.querySelector('.id')?.addEventListener('click', () => {
        if (msg.m === "dm") {
          const copyId = msg.sender._id === gClient.user._id
            ? msg.recipient._id
            : msg.sender._id;
          navigator.clipboard.writeText(copyId);
          (li.querySelector('.id') as HTMLElement).textContent = "Copied";
          setTimeout(() => {
            (li.querySelector('.id') as HTMLElement).textContent = copyId.substring(0, 6);
          }, 2500);
        } else {
          navigator.clipboard.writeText(msg.p._id);
          (li.querySelector('.id') as HTMLElement).textContent = "Copied";
          setTimeout(() => {
            (li.querySelector('.id') as HTMLElement).textContent = msg.p._id.substring(0, 6);
          }, 2500);
        }
      });
      li.querySelector('.id2')?.addEventListener('click', () => {
        navigator.clipboard.writeText(msg.recipient._id);
        (li.querySelector('.id2') as HTMLElement).textContent = "Copied";
        setTimeout(() => {
          (li.querySelector('.id2') as HTMLElement).textContent = msg.recipient._id.substring(0, 6);
        }, 2500);
      });

      // Reply button click event listener
      li.querySelector('.reply')?.addEventListener('click', () => {
        if (msg.m !== "dm") {
          chat.startReply(msg.p, msg.id, msg.a);
          setTimeout(() => {
            const el = document.getElementById('msg-' + msg.id);
            if (el) Object.assign(el.style, {
              border: `1px solid ${
                msg?.m === "dm" ? msg.sender?.color : msg.p?.color
              }80`,
              backgroundColor: `${
                msg?.m === "dm" ? msg.sender?.color : msg.p?.color
              }20`,
            });
          }, 100);
          setTimeout(() => {
            (document.querySelector('#chat input') as HTMLElement).focus();
          }, 100);
        } else {
          const replyingTo =
            msg.sender._id === gClient.user._id
              ? msg.recipient
              : msg.sender;
          if (gClient.ppl[replyingTo._id]) {
            chat.startDmReply(replyingTo, msg.id);
            setTimeout(() => {
              const el = document.getElementById('msg-' + msg.id);
              if (el) Object.assign(el.style, {
                border: `1px solid ${
                  msg?.m === "dm" ? msg.sender?.color : msg.p?.color
                }80`,
                backgroundColor: `${
                  msg?.m === "dm" ? msg.sender?.color : msg.p?.color
                }20`,
              });
            }, 100);
            setTimeout(() => {
              (document.querySelector('#chat input') as HTMLElement).focus();
            }, 100);
          } else {
            new Notification({
              target: "#piano",
              title: "User not found.",
              text: "The user who you are trying to reply to in a DM is not found, so a DM could not be started.",
            });
          }
        }
      });

      // put list element in chat
      document.querySelector('#chat ul')!.appendChild(li);
      messageCache.push(msg);

      const eles = Array.from(document.querySelectorAll('#chat ul li')) as HTMLElement[];
      for (let i = 1; i <= 50 && i <= eles.length; i++) {
        eles[eles.length - i].style.opacity = String(1.0 - i * 0.03);
      }
      if (eles.length > 50) {
        eles[0].style.display = "none";
      }
      if (eles.length > 256) {
        messageCache.shift();
        eles[0].remove();
      }

      // scroll to bottom if not "chatting" or if not scrolled up
      if (!document.getElementById('chat')!.classList.contains('chatting')) {
        chat.scrollToBottom();
      } else {
        const ele = document.querySelector('#chat ul') as HTMLElement;
        if (ele.scrollTop > ele.scrollHeight - ele.offsetHeight - 50)
          chat.scrollToBottom();
      }
    },
  };

  // Wire up client events
  gClient.on("ch", (msg: any) => {
    if (msg.ch.settings.chat) {
      chat.show();
    } else {
      chat.hide();
    }
  });
  gClient.on("disconnect", () => {});
  gClient.on("c", (msg: any) => {
    chat.clear();
    if (msg.c) {
      for (let i = 0; i < msg.c.length; i++) {
        chat.receive(msg.c[i]);
      }
    }
  });
  gClient.on("a", (msg: any) => {
    chat.receive(msg);
  });
  gClient.on("dm", (msg: any) => {
    chat.receive(msg);
  });

  // DOM event bindings
  document.querySelector('#chat input')!.addEventListener('focus', () => {
    releaseKb();
    document.getElementById('chat')!.classList.add('chatting');
    chat.scrollToBottom();
  });

  document.addEventListener('mousedown', (evt: MouseEvent) => {
    if (!document.getElementById('chat')!.contains(evt.target as Node)) {
      chat.blur();
    }
  });
  document.addEventListener("touchstart", (event: TouchEvent) => {
    for (const i in event.changedTouches) {
      const touch = event.changedTouches[i];
      if (document.getElementById('chat')!.contains(touch.target as Node)) {
        chat.blur();
      }
    }
  });

  document.addEventListener('keydown', (evt: KeyboardEvent) => {
    if (document.getElementById('chat')!.classList.contains('chatting')) {
      if (evt.keyCode === 27) {
        chat.blur();
        if (!settings.noPreventDefault) evt.preventDefault();
        evt.stopPropagation();
      } else if (evt.keyCode === 13) {
        (document.querySelector('#chat input') as HTMLElement).focus();
      }
    } else if (!getModal() && (evt.keyCode === 27 || evt.keyCode === 13)) {
      (document.querySelector('#chat input') as HTMLElement).focus();
    }
  });

  document.querySelector('#chat input')!.addEventListener('keydown', (evt: KeyboardEvent) => {
    const input = evt.target as HTMLInputElement;
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
      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.keyCode === 27) {
      chat.blur();
      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.keyCode === 9) {
      if (!settings.noPreventDefault) evt.preventDefault();
      evt.stopPropagation();
    }
  });

  state.chat = chat;
  return chat;
}

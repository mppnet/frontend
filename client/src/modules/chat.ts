import { parseMarkdown, parseUrl, parseContent } from "../util/util";
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

declare const $: any;
declare const MPP: any;

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

  const messageCache: any[] = [];

  const chat: Chat = {
    startDM(part: any): void {
      setIsDming(true);
      setDmParticipant(part);
      $("#chat-input")[0].placeholder = "Direct messaging " + part.name + ".";
    },

    endDM(): void {
      setIsDming(false);
      $("#chat-input")[0].placeholder = (window as any).i18nextify.i18next.t(
        "You can chat with this thing.",
      );
    },

    startReply(part: any, id: any): void {
      $(`#msg-${getMessageId()}`).css({
        "background-color": "unset",
        border: "1px solid #00000000",
      });
      setIsReplying(true);
      setReplyParticipant(part);
      setMessageId(id);
      $("#chat-input")[0].placeholder = `Replying to ${part.name}`;
    },

    startDmReply(part: any, id: any): void {
      $(`#msg-${getMessageId()}`).css({
        "background-color": "unset",
        border: "1px solid #00000000",
      });
      setIsReplying(true);
      setIsDming(true);
      setMessageId(id);
      setReplyParticipant(part);
      setDmParticipant(part);
      $("#chat-input")[0].placeholder = `Replying to ${part.name} in a DM.`;
    },

    cancelReply(part: any): void {
      setIsReplying(false);
      $(`#msg-${getMessageId()}`).css({
        "background-color": "unset",
        border: "1px solid #00000000",
      });
      $("#chat-input")[0].placeholder = (window as any).i18nextify.i18next.t(
        getIsDming()
          ? `Direct messaging ${part.name}`
          : `You can chat with this thing.`,
      );
    },

    show(): void {
      $("#chat").fadeIn();
    },

    hide(): void {
      $("#chat").fadeOut();
    },

    clear(): void {
      $("#chat li").remove();
    },

    scrollToBottom(): void {
      const ele = $("#chat ul").get(0);
      ele.scrollTop = ele.scrollHeight - ele.clientHeight;
    },

    blur(): void {
      if ($("#chat").hasClass("chatting")) {
        $("#chat input").get(0).blur();
        $("#chat").removeClass("chatting");
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
            MPP.chat.cancelReply(getReplyParticipant());
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
            MPP.chat.cancelReply(getReplyParticipant());
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

      let liString = `<li id="msg-${msg.id}">`;
      let isSpecialDm = false;

      if (msg.m === "dm") {
        if (
          msg.sender._id === gClient.user._id ||
          msg.recipient._id === gClient.user._id
        ) {
          liString += `<span class="reply"/>`;
        }
      } else {
        liString += `<span class="reply"/>`;
      }

      if (settings.showTimestampsInChat) liString += '<span class="timestamp"/>';

      if (msg.m === "dm") {
        if (msg.sender._id === gClient.user._id) {
          liString += '<span class="sentDm"/>';
        } else if (msg.recipient._id === gClient.user._id) {
          liString += '<span class="receivedDm"/>';
        } else {
          liString += '<span class="otherDm"/>';
          isSpecialDm = true;
        }
      }

      if (isSpecialDm) {
        if (settings.showIdsInChat) liString += '<span class="id"/>';
        liString += '<span class="name"/><span class="dmArrow"/>';
        if (settings.showIdsInChat) liString += '<span class="id2"/>';
        liString += '<span class="name2"/><span class="message"/>';
      } else {
        if (settings.showIdsInChat) liString += '<span class="id"/>';
        liString += '<span class="name"/>';
        if (msg.r) liString += `<span class="replyLink"/>`;
        liString += '<span class="message"/>';
      }

      const li = $(liString);
      li.find(`.reply`).text("➦");

      if (msg.r) {
        const repliedMsg = messageCache.find((e: any) => e.id === msg.r);
        if (!getTabIsActive()) {
          if (repliedMsg?.p?._id === gClient.user._id) {
            document.title = `You have received a reply!`;
            setYoureReplied(true);
          }
        }
        if (repliedMsg) {
          li.find(".replyLink").text(
            `➥ ${
              repliedMsg.m === "dm"
                ? repliedMsg.sender.name
                : repliedMsg.p.name
            }`,
          );
          li.find(".replyLink").css({
            background: `${
              (repliedMsg?.m === "dm"
                ? repliedMsg?.sender?.color
                : repliedMsg?.p?.color) ?? "gray"
            }`,
          });
          li.find(".replyLink").on("click", () => {
            $("#chat-input").focus();
            document
              .getElementById(`msg-${repliedMsg?.id}`)
              ?.scrollIntoView({ behavior: "smooth" });
            $(`#msg-${repliedMsg?.id}`).css({
              border: `1px solid ${
                repliedMsg?.m === "dm"
                  ? repliedMsg.sender?.color
                  : repliedMsg.p?.color
              }80`,
              "background-color": `${
                repliedMsg?.m === "dm"
                  ? repliedMsg.sender?.color
                  : repliedMsg.p?.color
              }20`,
            });
            setTimeout(() => {
              $(`#msg-${repliedMsg?.id}`).css({
                "background-color": "unset",
                border: "1px solid #00000000",
              });
            }, 5000);
          });
        } else {
          li.find(".replyLink").text("➥ Unknown Message");
          li.find(".replyLink").css({ background: "gray" });
        }
      }

      // prefix before dms
      if (msg.m === "dm") {
        if (msg.sender._id === gClient.user._id) {
          li.find(".sentDm").text("To");
          li.find(".sentDm").css("color", "#ff55ff");
        } else if (msg.recipient._id === gClient.user._id) {
          li.find(".receivedDm").text("From");
          li.find(".receivedDm").css("color", "#ff55ff");
        } else {
          li.find(".otherDm").text("DM");
          li.find(".otherDm").css("color", "#ff55ff");
          li.find(".dmArrow").text("->");
          li.find(".dmArrow").css("color", "#ff55ff");
        }
      }

      if (settings.showTimestampsInChat) {
        li.find(".timestamp").text(new Date(msg.t).toLocaleTimeString());
      }

      const message = parseMarkdown(parseContent(msg.a), parseUrl).replace(
        /@([\da-f]{24})/g,
        (match: string, id: string) => {
          const user = gClient.ppl[id];
          if (user) {
            const nick = parseContent(user.name);
            if (user.id === gClient.getOwnParticipant().id) {
              if (!getTabIsActive()) {
                setYoureMentioned(true);
                document.title = (window as any).i18nextify.i18next.t(
                  "You were mentioned!",
                );
              }
              return `<span class="mention" style="background-color: ${user.color};">${nick}</span>`;
            } else return `@${nick}`;
          } else return match;
        },
      );

      // apply names, colors, ids
      li.find(".message").html(message);

      if (msg.m === "dm") {
        if (!settings.noChatColors)
          li.find(".message").css("color", msg.sender.color || "white");
        if (settings.showIdsInChat) {
          if (msg.sender._id === gClient.user._id) {
            li.find(".id").text(msg.recipient._id.substring(0, 6));
          } else {
            li.find(".id").text(msg.sender._id.substring(0, 6));
          }
        }

        if (msg.sender._id === gClient.user._id) {
          if (!settings.noChatColors)
            li.find(".name").css("color", msg.recipient.color || "white");
          li.find(".name").text(msg.recipient.name + ":");
          if (settings.showChatTooltips) li[0].title = msg.recipient._id;
        } else if (msg.recipient._id === gClient.user._id) {
          if (!settings.noChatColors)
            li.find(".name").css("color", msg.sender.color || "white");
          li.find(".name").text(msg.sender.name + ":");
          if (settings.showChatTooltips) li[0].title = msg.sender._id;
        } else {
          if (!settings.noChatColors)
            li.find(".name").css("color", msg.sender.color || "white");
          if (!settings.noChatColors)
            li.find(".name2").css("color", msg.recipient.color || "white");
          li.find(".name").text(msg.sender.name);
          li.find(".name2").text(msg.recipient.name + ":");
          if (settings.showIdsInChat)
            li.find(".id").text(msg.sender._id.substring(0, 6));
          if (settings.showIdsInChat)
            li.find(".id2").text(msg.recipient._id.substring(0, 6));
          if (settings.showChatTooltips) li[0].title = msg.sender._id;
        }
      } else {
        if (!settings.noChatColors)
          li.find(".message").css("color", msg.p.color || "white");
        if (!settings.noChatColors)
          li.find(".name").css("color", msg.p.color || "white");
        li.find(".name").text(msg.p.name + ":");
        if (!settings.noChatColors)
          li.find(".message").css("color", msg.p.color || "white");
        if (settings.showIdsInChat) li.find(".id").text(msg.p._id.substring(0, 6));
        if (settings.showChatTooltips) li[0].title = msg.p._id;
      }

      // Adds copying _ids on click in chat
      li.find(".id").on("click", () => {
        if (msg.m === "dm") {
          const copyId = msg.sender._id === gClient.user._id
            ? msg.recipient._id
            : msg.sender._id;
          navigator.clipboard.writeText(copyId);
          li.find(".id").text("Copied");
          setTimeout(() => {
            li.find(".id").text(copyId.substring(0, 6));
          }, 2500);
        } else {
          navigator.clipboard.writeText(msg.p._id);
          li.find(".id").text("Copied");
          setTimeout(() => {
            li.find(".id").text(msg.p._id.substring(0, 6));
          }, 2500);
        }
      });
      li.find(".id2").on("click", () => {
        navigator.clipboard.writeText(msg.recipient._id);
        li.find(".id2").text("Copied");
        setTimeout(() => {
          li.find(".id2").text(msg.recipient._id.substring(0, 6));
        }, 2500);
      });

      // Reply button click event listener
      li.find(".reply").on("click", () => {
        if (msg.m !== "dm") {
          MPP.chat.startReply(msg.p, msg.id, msg.a);
          setTimeout(() => {
            $(`#msg-${msg.id}`).css({
              border: `1px solid ${
                msg?.m === "dm" ? msg.sender?.color : msg.p?.color
              }80`,
              "background-color": `${
                msg?.m === "dm" ? msg.sender?.color : msg.p?.color
              }20`,
            });
          }, 100);
          setTimeout(() => {
            $("#chat-input").focus();
          }, 100);
        } else {
          const replyingTo =
            msg.sender._id === gClient.user._id
              ? msg.recipient
              : msg.sender;
          if (gClient.ppl[replyingTo._id]) {
            MPP.chat.startDmReply(replyingTo, msg.id);
            setTimeout(() => {
              $(`#msg-${msg.id}`).css({
                border: `1px solid ${
                  msg?.m === "dm" ? msg.sender?.color : msg.p?.color
                }80`,
                "background-color": `${
                  msg?.m === "dm" ? msg.sender?.color : msg.p?.color
                }20`,
              });
            }, 100);
            setTimeout(() => {
              $("#chat-input").focus();
            }, 100);
          } else {
            new (Notification as any)({
              target: "#piano",
              title: "User not found.",
              text: "The user who you are trying to reply to in a DM is not found, so a DM could not be started.",
            });
          }
        }
      });

      // put list element in chat
      $("#chat ul").append(li);
      messageCache.push(msg);

      const eles = $("#chat ul li").get();
      for (let i = 1; i <= 50 && i <= eles.length; i++) {
        eles[eles.length - i].style.opacity = 1.0 - i * 0.03;
      }
      if (eles.length > 50) {
        eles[0].style.display = "none";
      }
      if (eles.length > 256) {
        messageCache.shift();
        $(eles[0]).remove();
      }

      // scroll to bottom if not "chatting" or if not scrolled up
      if (!$("#chat").hasClass("chatting")) {
        chat.scrollToBottom();
      } else {
        const ele = $("#chat ul").get(0);
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
  $("#chat input").on("focus", () => {
    releaseKb();
    $("#chat").addClass("chatting");
    chat.scrollToBottom();
  });

  $(document).mousedown((evt: any) => {
    if (!$("#chat").has(evt.target)) {
      chat.blur();
    }
  });
  document.addEventListener("touchstart", (event: any) => {
    for (const i in event.changedTouches) {
      const touch = event.changedTouches[i];
      if ($("#chat").has(touch.target)) {
        chat.blur();
      }
    }
  });

  $(document).on("keydown", (evt: any) => {
    if ($("#chat").hasClass("chatting")) {
      if (evt.keyCode === 27) {
        chat.blur();
        if (!settings.noPreventDefault) evt.preventDefault();
        evt.stopPropagation();
      } else if (evt.keyCode === 13) {
        $("#chat input").focus();
      }
    } else if (!getModal() && (evt.keyCode === 27 || evt.keyCode === 13)) {
      $("#chat input").focus();
    }
  });

  $("#chat input").on("keydown", function (this: any, evt: any) {
    if (evt.keyCode === 13) {
      if (MPP.client.isConnected()) {
        const message = $(this).val();
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
          $(this).val("");
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

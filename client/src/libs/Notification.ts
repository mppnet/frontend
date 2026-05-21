import { mixin, EventEmitter } from '../util/util';

declare const $: any;

export class Notification extends EventEmitter {
  id: string;
  title: string;
  text: string;
  html: any;
  target: any;
  duration: number;
  domElement: any;
  onresize: () => void;
  ["class"]: string;

  constructor(par?: any) {
    super();

    par = par || {};

    this.id = "Notification-" + (par.id || Math.random());
    this.title = par.title || "";
    this.text = par.text || "";
    this.html = par.html || "";
    this.target = $(par.target || "#piano");
    this.duration = par.duration || 30000;
    this["class"] = par["class"] || "classic";

    const eles = $("#" + this.id);
    if (eles.length > 0) {
      eles.remove();
    }

    this.domElement = $(
      '<div class="notification"><div class="notification-body"><div class="title"></div>' +
      '<div class="text"></div></div><div class="x" translated>X</div></div>',
    );

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

    this.onresize = () => {
      this.position();
    };

    window.addEventListener("resize", this.onresize);

    this.domElement.find(".x").click(() => {
      this.close();
    });

    if (this.duration > 0) {
      setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  position() {
    const pos = this.target.offset();

    let x =
      pos.left -
      this.domElement.width() / 2 +
      this.target.width() / 4;

    const y = pos.top - this.domElement.height() - 8;
    const width = this.domElement.width();

    if (x + width > $("body").width()) {
      x -= x + width - $("body").width();
    }

    if (x < 0) x = 0;

    this.domElement.offset({ left: x, top: y });
  }

  close() {
    window.removeEventListener("resize", this.onresize);

    this.domElement.fadeOut(500, () => {
      this.domElement.remove();
      this.emit("close");
    });
  }
}

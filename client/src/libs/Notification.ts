import { EventEmitter, fadeOut } from '../util/util';
import type { NotificationParams } from '../types';

export class Notification extends EventEmitter {
  id: string;
  title: string;
  text: string;
  html: string | HTMLElement;
  target: HTMLElement;
  duration: number;
  domElement: HTMLElement;
  onresize: () => void;
  ["class"]: string;

  constructor(par?: NotificationParams) {
    super();

    par = par || {};

    this.id = "Notification-" + (par.id || Math.random());
    this.title = par.title || "";
    this.text = par.text || "";
    this.html = par.html || "";
    this.target = document.querySelector(par.target || '#piano') as HTMLElement;
    this.duration = par.duration || 30000;
    this["class"] = par["class"] || "classic";

    const existing = document.getElementById(this.id);
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'notification';
    const body = document.createElement('div');
    body.className = 'notification-body';
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.textContent = this.title;
    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    body.appendChild(titleDiv);
    body.appendChild(textDiv);
    const xBtn = document.createElement('div');
    xBtn.className = 'x';
    xBtn.setAttribute('translated', '');
    xBtn.textContent = 'X';
    wrapper.appendChild(body);
    wrapper.appendChild(xBtn);
    this.domElement = wrapper;

    this.domElement.id = this.id;
    this.domElement.classList.add(this["class"]);

    if (this.text.length > 0) {
      textDiv.textContent = this.text;
    } else if (this.html instanceof HTMLElement) {
      textDiv.appendChild(this.html as HTMLElement);
    } else if (this.html.length > 0) {
      textDiv.innerHTML = this.html as string;
    }

    document.body.appendChild(this.domElement);

    this.position();

    this.onresize = () => {
      this.position();
    };

    window.addEventListener("resize", this.onresize);

    xBtn.addEventListener('click', () => {
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

    let x =
      pos.left -
      this.domElement.offsetWidth / 2 +
      this.target.offsetWidth / 4;

    const y = pos.top - this.domElement.offsetHeight - 8;
    const width = this.domElement.offsetWidth;

    if (x + width > document.body.offsetWidth) {
      x -= x + width - document.body.offsetWidth;
    }

    if (x < 0) x = 0;

    this.domElement.style.left = x + 'px';
    this.domElement.style.top = y + 'px';
    this.domElement.style.position = 'absolute';
  }

  close() {
    window.removeEventListener("resize", this.onresize);

    fadeOut(this.domElement, 500, () => {
      this.domElement.remove();
      this.emit("close");
    });
  }
}

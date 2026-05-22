function getNaturalDisplay(el: HTMLElement): string {
  const tmp = document.createElement(el.tagName);
  document.body.appendChild(tmp);
  const display = getComputedStyle(tmp).display;
  document.body.removeChild(tmp);
  return display === 'none' ? 'block' : display;
}

export function fadeIn(el: HTMLElement | undefined | null, ms: number, cb?: () => void): void {
  if (!el) return;

  const isHidden =
    el.style.display === 'none' || getComputedStyle(el).display === 'none';

  el.style.opacity = '0';
  el.style.display = isHidden ? getNaturalDisplay(el) : getComputedStyle(el).display;
  el.style.transition = `opacity ${ms}ms`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
    });
  });

  setTimeout(() => {
    el.style.transition = '';
    cb?.();
  }, ms);
}

export function fadeOut(el: HTMLElement | undefined | null, ms: number, cb?: () => void): void {
  if (!el) return;

  el.style.transition = `opacity ${ms}ms`;
  el.style.opacity = '0';

  setTimeout(() => {
    el.style.display = 'none';
    el.style.transition = '';
    cb?.();
  }, ms);
}

export class EventEmitter {
  _events: Record<string, Function[]> = {};

  on(evtn: string, fn: Function) {
    if (!this._events.hasOwnProperty(evtn)) this._events[evtn] = [];
    this._events[evtn].push(fn);
  }

  off(evtn: string, fn: Function) {
    if (!this._events.hasOwnProperty(evtn)) return;
    const idx = this._events[evtn].indexOf(fn);
    if (idx < 0) return;
    this._events[evtn].splice(idx, 1);
  }

  emit(evtn: string, ...args: any[]) {
    if (!this._events.hasOwnProperty(evtn)) return;
    const fns = this._events[evtn].slice(0);
    if (fns.length < 1) return;
    for (let i = 0; i < fns.length; i++) fns[i].apply(this, args);
  }
}

export function hashFnv32a(str: string, asString?: boolean, seed?: number): string | number {
  let hval = (seed === undefined) ? 0x811c9dc5 : seed;
  for (let i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  if (asString) {
    return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
  }
  return hval >>> 0;
}

export function round(number: number, increment: number, offset: number) {
  return Math.round((number - offset) / increment) * increment + offset;
}

// Knob UI component
export class Knob extends EventEmitter {
  min: number;
  max: number;
  step: number;
  value: number;
  knobValue: number;
  name: string;
  unit: string;
  fixedPoint: number;
  dragY: number;
  mouse_over: boolean;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  radius: number;
  baseImage: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, min: number, max: number, step: number, value: number, name: string, unit?: string) {
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
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D; // if this is undefined we have bigger problems

    this.radius = this.canvas.width * 0.3333;
    this.baseImage = document.createElement("canvas");
    this.baseImage.width = canvas.width;
    this.baseImage.height = canvas.height;
    const ctx = this.baseImage.getContext("2d")!;
    ctx.fillStyle = "#444";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = this.canvas.width * 0.02;
    ctx.shadowOffsetY = this.canvas.width * 0.02;
    ctx.beginPath();
    ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // events
    const self = this;
    let dragging = false;
    (function () {
      function mousemove(evt: MouseEvent) {
        if (evt.screenY !== self.dragY) {
          const delta = -(evt.screenY - self.dragY);
          let scale = 0.0075;
          if (evt.ctrlKey) scale *= 0.05;
          self.setKnobValue(self.knobValue + delta * scale);
          self.dragY = evt.screenY;
          self.redraw();
        }
        evt.preventDefault();
        showTip();
      }
      function mouseout(evt: MouseEvent) {
        if ((evt as any).toElement === null && evt.relatedTarget === null) {
          mouseup();
        }
      }
      function mouseup() {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseout", mouseout);
        document.removeEventListener("mouseup", mouseup);
        self.emit("release", self);
        dragging = false;
        if (!self.mouse_over) removeTip();
      }
      canvas.addEventListener("mousedown", function (evt: MouseEvent) {
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
      canvas.addEventListener("keydown", function (evt: KeyboardEvent) {
        if (evt.keyCode == 38) { self.setValue(self.value + self.step); showTip(); }
        else if (evt.keyCode == 40) { self.setValue(self.value - self.step); showTip(); }
      });
    })();

    function showTip() {
      let div = document.getElementById("tooltip") as HTMLElement | null;
      if (!div) {
        div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "tooltip";
        const rect = self.canvas.getBoundingClientRect();
        div.style.left = rect.left + "px";
        div.style.top = rect.bottom + "px";
      }
      div.textContent = self.name;
      if (self.name) div.textContent += ": ";
      div.textContent += self.valueString() + self.unit;
    }
    function removeTip() {
      const div = document.getElementById("tooltip");
      if (div) { div.parentElement!.removeChild(div); }
    }
    function ttmousemove(evt: MouseEvent) {
      const pos = self.translateMouseEvent(evt);
      if (self.contains(pos.x, pos.y)) { self.mouse_over = true; showTip(); }
      else { self.mouse_over = false; if (!dragging) removeTip(); }
    }
    function ttmouseout() { self.mouse_over = false; if (!dragging) removeTip(); }
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

  setKnobValue(value: number) {
    if (value < 0) value = 0;
    else if (value > 1) value = 1;
    this.knobValue = value;
    this.setValue(value * (this.max - this.min) + this.min);
  }

  setValue(value: number) {
    value = round(value, this.step, this.min);
    if (value < this.min) value = this.min;
    else if (value > this.max) value = this.max;
    if (this.value !== value) {
      this.value = value;
      this.knobValue = (value - this.min) / (this.max - this.min);
      this.redraw();
      this.emit("change", this);
    }
  }

  valueString() { return this.value.toFixed(this.fixedPoint); }

  contains(x: number, y: number) {
    x -= this.canvas.width / 2;
    y -= this.canvas.height / 2;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < this.radius;
  }

  translateMouseEvent(evt: MouseEvent) {
    const element = evt.target as HTMLElement;
    return {
      x: evt.clientX - element.getBoundingClientRect().left - element.clientLeft + element.scrollLeft,
      y: evt.clientY - (element.getBoundingClientRect().top - element.clientTop + element.scrollTop),
    };
  }
}
// Parsing utilities
const url_regex = new RegExp(
  "(?:(?:(?:https?|ftp):)?\\/\\/)" +
  "(?:\\S+(?::\\S*)?@)?" +
  "(?:" +
  "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
  "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
  "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
  "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
  "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
  "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
  "|" +
  "(?:" + "(?:" + "[a-z0-9\\u00a1-\\uffff]" + "[a-z0-9\\u00a1-\\uffff_-]{0,62}" + ")?" +
  "[a-z0-9\\u00a1-\\uffff]\\." + ")+" +
  "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
  ")" +
  "(?::\\d{2,5})?" +
  "(?:[/?#]\\S*)?",
  "ig"
);

export const parseContent = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const markdownRegex =
  /((?:\\|)(?:\|\|.+?\|\||```.+?```|``.+?``|`.+?`|\*\*\*.+?\*\*\*|\*\*.+?\*\*|\*.+?\*|___.+?___|__.+?__|_.+?_(?:\s|$)|~~.+?~~))/g;

const getTextContent = (text: string) => {
  return text.indexOf(">") > -1 && text.indexOf("</") > -1
    ? text.slice(text.indexOf(">") + 1, text.lastIndexOf("</")) || text
    : text;
};

const getLinkTextContent = (text: string) => {
  const rightArrowIndex = text.indexOf(">");
  const leftArrowSlashIndex = text.lastIndexOf("</");
  const properRightArrowIndex = rightArrowIndex > leftArrowSlashIndex ? -1 : rightArrowIndex;
  return properRightArrowIndex > -1 || leftArrowSlashIndex > -1
    ? text.slice(
        properRightArrowIndex > -1 ? properRightArrowIndex + 1 : 0,
        leftArrowSlashIndex > -1 ? leftArrowSlashIndex : text.length,
      ) || text
    : text;
};

export const parseUrl = (text: string) => {
  return text.replace(url_regex, (match) => {
    const url = getLinkTextContent(match);
    return `<a rel="noreferer noopener" target="_blank" class="chatLink" href="${url}">${url}</a>`;
  });
};

export const parseMarkdown = (text: string, parseFunction: (t: string) => string = (t) => t): string => {
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
    if (
      (match.startsWith("\\~~") && endsWithTildes) ||
      (match.startsWith("\\___") && endsWithThreeUnderscores) ||
      (match.startsWith("\\__") && endsWithTwoUnderscores) ||
      (match.startsWith("\\_") && endsWithUnderscore) ||
      (match.startsWith("\\***") && endsWithThreeAsterisks) ||
      (match.startsWith("\\**") && endsWithTwoAsterisks) ||
      (match.startsWith("\\*") && endsWithAsterisk) ||
      (match.startsWith("\\```") && endsWithThreeBackticks) ||
      (match.startsWith("\\``") && endsWithTwoBackticks) ||
      (match.startsWith("\\`") && endsWithBacktick) ||
      (match.startsWith("\\||") && endsWithVerticalBars)
    ) {
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
    } else if ((match.startsWith("*") && endsWithAsterisk) || (match.startsWith("_") && endsWithUnderscore)) {
      const content = parseMarkdown(getTextContent(match.slice(1, match.length - 1)), parseFunction);
      return content.trim().length < 1 ? match : `<em class="markdown">${content}</em>`;
    } else if (match.startsWith("`") && endsWithBacktick) {
      const slice = match.startsWith("```") && endsWithThreeBackticks ? 3
        : match.startsWith("``") && endsWithTwoBackticks ? 2 : 1;
      const content = getTextContent(match.slice(slice, match.length - slice));
      return content.trim().length < 1 ? match : `<code class="markdown">${content}</code>`;
    } else if (match.startsWith("||") && endsWithVerticalBars) {
      const content = parseMarkdown(getTextContent(match.slice(2, match.length - 2)), parseFunction);
      return content.trim().length < 1 ? match : `<span class="markdown spoiler">${content}</span>`;
    }
    return parseFunction(match);
  }).join("");
};

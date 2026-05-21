export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  x2: number;
  y2: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.x2 = x + w;
    this.y2 = y + h;
  }

  contains(x: number, y: number): boolean {
    return x >= this.x && x <= this.x2 && y >= this.y && y <= this.y2;
  }
}

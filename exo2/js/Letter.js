export default class Letter {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.character = "A";
    this.fontSize = 32;
  }

  dessine(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    // dessiner la lettre au centre du cercle
    ctx.font = `${this.fontSize}px Helvetica`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);
  }
}

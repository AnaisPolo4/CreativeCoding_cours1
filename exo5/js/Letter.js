export default class Letter {
  constructor(ctx, character, x, y) {
    this.ctx = ctx;
    this.character = character; // Renommer pour cohérence
    this.x = x;
    this.y = y;
    this.color = "white";
    this.scale = 1;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.character, 0, 0); // Utilisation de this.character
    this.ctx.restore();
  }
}

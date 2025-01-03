export default class Letter {
  constructor(x, y, radius, character = "a") {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.character = character;
    this.fontSize = 300;
    this.color = "#00FF00";
    this.strokeStyle = "#00FF00";
    this.lineWidth = 30;
  }

  dessine(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();
    ctx.lineWidth = this.lineWidth;
    ctx.font = `${this.fontSize}px Helvetica`;
    ctx.textAlign = "center";
    ctx.textBaseline = "center";
    // Définir la couleur du texte
    ctx.fillStyle = this.color;
    ctx.fillText(this.character, this.x, this.y); // Affichage de la lettre
  }
}

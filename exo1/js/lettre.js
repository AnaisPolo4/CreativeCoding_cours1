export default class Lettre {
  constructor(context) {
    this.ctx = context;
  }

  drawLettre(x, y, letter, fontSize, color) {
    this.ctx.font = `${fontSize}px helvetica`; 
    this.ctx.fillText(letter, x, y); // Dessine la lettre à la position spécifiée
    this.ctx.fillStyle = color;
  }
}

import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    // créer le canevas
    this.createCanvas();
    // créer une lettre
    this.letter = new Letter(100, 100, 100);
    // initialiser interaction click
    this.initInteraction();
    // dessiner canvas
    this.draw();
  }

  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);

    this.ctx.fillStyle = "#ff92b1";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    document.body.appendChild(this.canvas);
  }

  initInteraction() {
    document.addEventListener(
      "click",
      // "mousemoove" "mouseup" "mousedown" "mousedrag" autre mouse option

      (evenement) => {
        this.letter.x = evenement.x;
        this.letter.y = evenement.y;
      }
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // dessiner cercle
    this.letter.dessine(this.ctx);
    this.letter.x += 1;
    this.letter.y += 1;
    // transformer le canevas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}

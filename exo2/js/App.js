import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    this.createCanvas();
    // Positionne cercle au centre de la fenêtre
    const initialX = this.width / 2;
    const initialY = this.height / 2;
    this.letter = new Letter(initialX, initialY, 130);
    this.targetX = this.letter.x;
    this.targetY = this.letter.y;
    this.speed = 10;
    // suivis du cercle à la souris
    this.isFollowing = true;
    this.initInteraction();
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

    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.appendChild(this.canvas);
  }

  initInteraction() {
    // ACTIIVE le suivis du cercle à la souris
    document.addEventListener("mousemove", (evenement) => {
      if (this.isFollowing) {
        this.targetX = evenement.x;
        this.targetY = evenement.y;
      }
    });

    document.addEventListener("click", (evenement) => {
      // DESACTIVER le suivis du cercle à la souris
      this.isFollowing = !this.isFollowing;
      // Si le suivi est activé, enregistrer la nouvelle cible
      if (this.isFollowing) {
        this.targetX = evenement.x;
        this.targetY = evenement.y;
      }
    });
  }

  // ANCIEN CODE POUR autres ref
  // initInteraction() {
  //   document.addEventListener(
  //     "click",
  //     // "mousemoove" "mouseup" "mousedown" "mousedrag" autre mouse option

  //     (evenement) => {
  //       this.letter.x = evenement.x;
  //       this.letter.y = evenement.y;
  //     }
  //   );
  // }
  //   this.letter.x += 1;
  //   this.letter.y += 1;
  //   // transformer le canevas en flip book
  //   requestAnimationFrame(this.draw.bind(this));
  // }

  draw() {
    // Enlèvement du clear -> il effaçait les anciennes images
    // this.ctx.clearRect(0, 0, this.width, this.height);

    // dessiner cercle
    this.letter.dessine(this.ctx);
    // CALCULER distance entre la position actuelle et la cible
    const dx = this.targetX - this.letter.x;
    const dy = this.targetY - this.letter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // DEPLACEMENT à LA CIBLE ( c'est en pixel) ( 1-3 fait tremnler le cercle )
    if (distance > 5) {
      // Normaliser le vecteur de direction
      // (direction et distance )
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;

      // Mettre à jour la position de la lettre + vitesse
      this.letter.x += normalizedDx * this.speed;
      this.letter.y += normalizedDy * this.speed;
    }

    // Transformer le canevas en flipbook (image)
    requestAnimationFrame(this.draw.bind(this));
  }
}

export default class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // VITESSE DE LA PARTICULE
    this.vitesseX = (Math.random() - 0.5) * 2; // Vitesse initiale aléatoire
    this.vitesseY = (Math.random() - 0.5) * 2; // Vitesse initiale aléatoire

    // ACCELERATION
    this.accelerationX = (Math.random() - 0.5) * 0.05;
    this.accelerationY = (Math.random() - 0.5) * 0.05;

    this.vitesseMax = 5;
  }

  // Mettre à jour la position et la vitesse de la particule
  update() {
    this.vitesseX += this.accelerationX;
    this.vitesseY += this.accelerationY;

    // Mettre à jour la position
    this.x += this.vitesseX;
    this.y += this.vitesseY;

    // Vérifier les bords de l'écran pour rebondir
    this.gererBordsEcran();
  }

  // Faire rebondir la particule lorsqu'elle touche un bord de l'écran
  gererBordsEcran() {
    if (this.x > window.innerWidth) {
      this.x = window.innerWidth; // Repositionner sur le bord
      this.vitesseX = -this.vitesseX; // Inverser la vitesse
    }
    if (this.x < 0) {
      this.x = 0; // Repositionner sur le bord
      this.vitesseX = -this.vitesseX; // Inverser la vitesse
    }
    if (this.y > window.innerHeight) {
      this.y = window.innerHeight; // Repositionner sur le bord
      this.vitesseY = -this.vitesseY; // Inverser la vitesse
    }
    if (this.y < 0) {
      this.y = 0; // Repositionner sur le bord
      this.vitesseY = -this.vitesseY; // Inverser la vitesse
    }
  }

  // Limiter la vitesse de la particule (optionnel, à implémenter si besoin)
  limiterVitesse() {
    this.vitesseX = Math.min(
      Math.max(this.vitesseX, -this.vitesseMax),
      this.vitesseMax
    );

    this.vitesseY = Math.min(
      Math.max(this.vitesseY, -this.vitesseMax),
      this.vitesseMax
    );
  }

  // Dessiner la particule
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    // orientation
    ctx.rotate(Math.PI / 4);
    ctx.font = "200px fourmi";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("💋", 0, 0);
    ctx.restore();
  }
}

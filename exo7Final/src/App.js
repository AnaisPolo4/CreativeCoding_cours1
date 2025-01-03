import Letter from "./Letter.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    this.video;
    this.trail = [];
    this.maxTrailLength = 50; // Limite du tracé visible
    this.currentChar = "a"; // Lettre par défaut
    this.createCanvas();
    this.setupCamera();
    const initialX = this.width / 2;
    const initialY = this.height / 2;
    this.letter = new Letter(initialX, initialY, 0, this.currentChar); // Ajout de la lettre
    this.targetX = this.letter.x;
    this.targetY = this.letter.y;
    this.speed = 10;
    this.isFollowing = true;
    this.initInteraction();
    this.initKeyboardInteraction(); // Initialisation des touches
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
  }

  setupCamera() {
    this.video = document.createElement("video");
    this.video.autoplay = true;
    this.video.playsInline = true;
    this.video.style.display = "none"; // Cache la vidéo
    document.body.appendChild(this.video);

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Erreur cam :", err);
      });
  }

  initInteraction() {
    document.addEventListener("mousemove", (event) => {
      if (this.isFollowing) {
        this.targetX = event.x;
        this.targetY = event.y;
      }
    });

    document.addEventListener("click", (event) => {
      this.isFollowing = !this.isFollowing;
      if (this.isFollowing) {
        this.targetX = event.x;
        this.targetY = event.y;
      }
    });
  }

  initKeyboardInteraction() {
    document.addEventListener("keydown", (event) => {
      const newChar = event.key.toLowerCase();
      if (/^[a-z]$/.test(newChar)) {
        this.currentChar = newChar;
        this.letter.character = newChar;
      }
    });
  }

  draw() {
    // Effacer l'écran
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Dessiner le masque
    this.ctx.save();
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Révéler la caméra uniquement à travers le tracé
    this.ctx.globalCompositeOperation = "destination-out";

    // Dessiner le tracé
    this.trail.forEach((trailLetter) => {
      trailLetter.dessine(this.ctx);
    });

    if (
      this.trail.length === 0 || // Si aucun élément dans le tracé
      Math.hypot(
        this.letter.x - this.trail[this.trail.length - 1].x,
        this.letter.y - this.trail[this.trail.length - 1].y
      ) > 50 // Distance minimum entre les lettres
    ) {
      this.trail.push(
        new Letter(
          this.letter.x,
          this.letter.y,
          this.letter.radius,
          this.currentChar
        )
      );
    }

    // Limiter la longueur du tracé
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift(); // Supprime le plus ancien élément
    }

    // Dessiner la caméra
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height);

    this.ctx.restore();

    // Suivre la souris
    const dx = this.targetX - this.letter.x;
    const dy = this.targetY - this.letter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 50) {
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      this.letter.x += normalizedDx * this.speed;
      this.letter.y += normalizedDy * this.speed;
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}

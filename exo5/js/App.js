import BaseApp from "./BaseApp.js";
import Letter from "./Letter.js";
import Webcam from "./Webcam.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.ctx.willReadFrequently = true;
    this.ctx.font = "60px monospace";
    this.letters = [];
    this.revealAlpha = 0;
    this.pixelThreshold = 0.8; // Seuil de luminance pour détecter le blanc
    this.whitePixelCountThreshold = 20; // Nombre minimum de pixels blancs pour révéler la caméra
    this.revealCenterX = null;
    this.revealCenterY = null;
    this.revealRadius = 1; // Rayon de la zone circulaire
    this.init();
  }

  loadVideo() {
    return new Promise((resolve) => {
      this.webcam = new Webcam();
      this.webcam.video.addEventListener("loadeddata", resolve);
    });
  }

  async init() {
    await this.loadVideo();

    // Initialiser les lettres
    for (let i = 0; i < 80; i++) {
      for (let j = 0; j < 80; j++) {
        this.letters.push(new Letter(this.ctx, "A", i * 10, j * 10));
      }
    }

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dessiner l'image de la webcam en arrière-plan
    this.ctx.drawImage(this.webcam.video, 0, 0, 800, 800);

    // Obtenir les pixels de l'image actuelle
    const pixels = this.ctx.getImageData(0, 0, 800, 800).data;
    let whitePixelCount = 0;
    let centerX = 0;
    let centerY = 0;
    let brightPixelCount = 0;

    // Détecter les pixels lumineux et calculer le centre de masse de ces pixels
    for (let y = 0; y < 800; y++) {
      for (let x = 0; x < 800; x++) {
        const i = (y * 800 + x) * 4;
        const luminance = this.getLuminence([
          pixels[i],
          pixels[i + 1],
          pixels[i + 2],
        ]);

        if (luminance > this.pixelThreshold) {
          centerX += x;
          centerY += y;
          brightPixelCount++;
        }
      }
    }

    // Calculer le centre de masse des pixels lumineux
    if (brightPixelCount > 0) {
      centerX /= brightPixelCount;
      centerY /= brightPixelCount;
    } else {
      centerX = null;
      centerY = null;
    }

    // Dessiner les lettres par-dessus
    this.letters.forEach((letter) => {
      const i = (letter.y * 800 + letter.x) * 4;

      // Calculer la luminance
      const luminance = this.getLuminence([
        pixels[i],
        pixels[i + 1],
        pixels[i + 2],
      ]);

      // Détecter les pixels blancs
      if (luminance > this.pixelThreshold) {
        whitePixelCount++;
      }

      if (luminance > 0.9) {
        letter.color = "yellow";
        if (Math.random() > 0.95) {
          letter.letter = this.getRandomLetter();
        }
      } else {
        letter.color = "white";
      }

      letter.scale = luminance;
      letter.draw();
    });

    // Si suffisamment de pixels blancs, révéler la caméra
    if (
      whitePixelCount > this.whitePixelCountThreshold &&
      centerX !== null &&
      centerY !== null
    ) {
      this.revealCenterX = this.revealCenterX
        ? this.revealCenterX * 0.9 + centerX * 0.1
        : centerX;
      this.revealCenterY = this.revealCenterY
        ? this.revealCenterY * 0.9 + centerY * 0.1
        : centerY;
      this.revealRadius = Math.min(
        this.revealRadius * 0.9 + (whitePixelCount / 2) * 0.1,
        200
      );
      this.revealAlpha = Math.min(this.revealAlpha + 0.1, 1); // Transition fluide vers la caméra visible
    } else {
      this.revealAlpha = Math.max(this.revealAlpha - 0.1, 0); // Retour progressif vers les lettres
      this.revealRadius = Math.max(this.revealRadius - 10, 0); // Réduire le rayon si aucun flash détecté
    }

    // Appliquer un effet de révélation avec une opacité
    if (this.revealAlpha > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = this.revealAlpha;

      // Dessiner la zone circulaire de la webcam révélée
      if (this.revealRadius > 0) {
        this.ctx.beginPath();
        this.ctx.arc(
          this.revealCenterX,
          this.revealCenterY,
          this.revealRadius,
          0,
          Math.PI * 2
        );
        this.ctx.clip();
        this.ctx.drawImage(this.webcam.video, 0, 0, 800, 800);
      }

      this.ctx.restore();
    }

    requestAnimationFrame(() => this.draw());
  }

  getLuminence(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  getRandomLetter() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomLetter =
      characters[Math.floor(Math.random() * characters.length)];
    console.log(randomLetter); // Affiche la lettre choisie
    return randomLetter;
  }
}

import DrawingTool from "./DrawingTool.js";

// Fonction pour charger le SVG et obtenir le chemin du "G"
async function loadSVG() {
  const response = await fetch("G.svg");
  const svgText = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");

  const path = doc.querySelector("#g-path");
  const pathLength = path.getTotalLength(); // Calculer la longueur du chemin pour l'animation
  return { path, pathLength };
}

// Classe APP
export default class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);

    // Charger le SVG et démarrer l'animation
    loadSVG().then(({ path, pathLength }) => {
      this.path = path;
      this.pathLength = pathLength;
      this.circlePosition = 1;
      this.drawingTool = new DrawingTool(this.ctx, 100); // Initialise DrawingTool
      this.pathData = new Path2D(path.getAttribute("d")); // Créer le chemin avec Path2D

      // Récupérer la largeur et la hauteur de la vue pour le centrage
      const viewBox = this.path.getBBox();
      const scaleFactor = 7; // Agrandir le G

      // Calculer le décalage pour centrer le SVG agrandi
      const offsetX =
        (this.canvas.width - viewBox.width * scaleFactor) / 3 -
        viewBox.x * scaleFactor;
      const offsetY =
        (this.canvas.height - viewBox.height * scaleFactor) / 6 -
        viewBox.y * scaleFactor;

      this.ctx.translate(offsetX, offsetY);
      this.ctx.scale(scaleFactor, scaleFactor);

      this.angle = 0; // Angle de départ pour l'oscillation
      this.animate();
    });
  }

  // Méthode d'animation
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Appliquer le masque de découpage pour ne dessiner que dans les limites du "G"
    this.ctx.save();
    this.ctx.clip(this.pathData);

    // Dessine le contour du G (chemin)
    this.ctx.strokeStyle = "#ff6600";
    this.ctx.lineWidth = 1;
    this.ctx.stroke(this.pathData);

    // Boule oscillant avec une onde sinusoïdale autour de G
    if (this.circlePosition < this.pathLength) {
      const point = this.path.getPointAtLength(this.circlePosition);

      // Décalage vertical sinusoïdal
      const yOffset = Math.sin(this.angle) * 5; // Taille boule orange
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y + yOffset, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = "#ff6600";
      this.ctx.fill();

      this.circlePosition += 2;
      this.angle += 0.4; // Fréquence de l'onde
    }

    this.ctx.restore();

    // Continuer l'animation
    if (
      this.fillProgress < this.canvas.width * 6 ||
      this.circlePosition < this.pathLength
    ) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }
}

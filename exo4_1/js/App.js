// --------INUTILE
import BaseApp from "./BaseApp";
import Particle from "./Particle";

export default class App extends BaseApp {
  constructor() {
    super();
    this.particles = []; // TABLEAU

    // Écouteur d'événement pour le clic
    document.addEventListener("click", (event) => {
      // Obtenir la position du clic
      const x = event.clientX; // Position X du clic
      const y = event.clientY; // Position Y du clic

      // Créer 50 particules à la position du clic
      for (let i = 0; i < 1; i++) {
        // Ajouter des variations aléatoires à la vitesse pour chaque particule
        const particule = new Particle(x, y);
        this.particles.push(particule); // Ajouter la particule au tableau
      }
    });

    this.draw();
  }

  draw() {
    // Effacer le canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      particle.update();
      particle.limiterVitesse();
      particle.gererBordsEcran();
      particle.draw(this.ctx);
    });

    // Continuer l'animation
    requestAnimationFrame(() => this.draw());
  }
}

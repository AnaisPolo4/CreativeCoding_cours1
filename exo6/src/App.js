import BaseApp from "./BaseApp.js";

export default class App extends BaseApp {
  constructor() {
    super();
    // Initialisation du canvas
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.width = this.canvas.width = window.innerWidth * 1;
    this.height = this.canvas.height = window.innerHeight * 1;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0px";

    // audio
    this.audioFile = "./crismj.mp3";
    this.audio = new Audio(this.audioFile);
    this.audio.controls = true;
    document.body.appendChild(this.audio);
    this.isPlaying = false;

    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      if (!this.audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.setup();
      }

      const position_souris_x = e.clientX;
      const pourcentage = position_souris_x / window.innerWidth;
      if (!isNaN(this.audio.duration)) {
        this.audio.currentTime = this.audio.duration * pourcentage;
      }

      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    });
  }

  setup() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.analyser = this.audioContext.createAnalyser();
    this.destination = this.audioContext.destination;
    this.source.connect(this.analyser);
    this.analyser.connect(this.destination);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.trail = [];
    this.direction = 1;
    this.hue = 0; // Couleur arc-en-ciel
    this.draw();
  }

  analyseFrequencies() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  draw() {
    this.analyseFrequencies();

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Calculer une valeur moyenne des graves et des aigus
    const bass =
      this.dataArray
        .slice(0, this.dataArray.length / 3)
        .reduce((a, b) => a + b, 0) /
      (this.dataArray.length / 3);
    const treble =
      this.dataArray
        .slice((2 * this.dataArray.length) / 3)
        .reduce((a, b) => a + b, 0) /
      (this.dataArray.length / 3);

    // Ajouter un point au tracé
    const midY = this.height / 2;
    const offsetY = (bass - treble) / 0.6; // Influence fréquence
    const newPoint = {
      x: this.trail.length
        ? this.trail[this.trail.length - 1].x + 7 * this.direction
        : 0, // Augmentation vitesse
      y: midY - offsetY,
    };

    // si touche bord,  changer de direction
    if (newPoint.x >= this.width || newPoint.x <= 0) {
      this.direction *= -1; // Inverse la direction
    }

    this.trail.push(newPoint);

    // Garder seulement les points visibles
    this.trail = this.trail.filter(
      (point) => point.x >= 0 && point.x <= this.width
    );

    // Redessiner le tracé
    this.ctx.beginPath();
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      if (i === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    }
    this.ctx.strokeStyle = `hsl(${this.hue}, 100%, 60%)`; // Arc-en-ciel dynamique
    this.ctx.lineWidth = 15; // Tracé plus épais
    this.ctx.stroke();

    // Augmenter la teinte pour l'effet arc-en-ciel
    this.hue = (this.hue + 1) % 360;

    requestAnimationFrame(this.draw.bind(this));
  }
}

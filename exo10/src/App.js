import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
// // traits verts et points rouge
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

import BaseApp from "../src/BaseApp.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.setupElement();
    this.init();
  }

  setupElement() {
    this.video = document.createElement("video");
    this.video.autoplay = true;
    // afficher la video ou non ici
    document.body.appendChild(this.video);
  }

  async init() {
    const vision = await FilesetResolver.forVisionTasks("./wasm");

    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        mpdelAssetPath: "./hand_landmarker.task",
        delegate: "GPU",
      },

      runningMode: "VIDEO",

      numHands: 2,
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080 },
    });

    this.video.srcObject = stream;

    this.video.addEventListener("loadeddata", () => {
      [this.canvas, this.video].forEach((el) => {
        el.width = el.style.width = 1920;
        el.height = el.style.height = 1080;
      });
      this.draw();
    });

  draw() {
    // this.detect();
    requestAnimationFrame(this.draw.bind(this));
  }

  detect() {
    const results = this.handLandmarker.detectForVideo(
      this.video,
      performance.now()
    );

    this.ctx.clearRect(0, 0, this.canvas.width, this.createCanvas.height);

    if ((results, landmarks)) {
      results.landmarks.forEach((landmarks, index) => {
        drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
          color: "#FF0000",
          lineWidth: 31,
        });
        drawLandmarks(this.ctx, landmarks, {
          color: "#00FF00",
          lineWidth: 1,
        });
      });
    }
  }
}

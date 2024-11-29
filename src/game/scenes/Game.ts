import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  backgroundLayer1: Phaser.GameObjects.Image;

  gameText: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;

    this.backgroundLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0, 0);
    this.backgroundLayer1.setDisplaySize(
      this.camera.width,
      this.camera.height
    );

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}

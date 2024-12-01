import { type GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { gameConfig } from "../main";

export class MainMenu extends Scene {
  backgroundLayer1: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  logoTween: Phaser.Tweens.Tween | null;

  constructor() {
    super("MainMenu");
  }

  create() {
    document
      .getElementById("playerName")
      ?.closest(".name-input")
      ?.classList.add("hidden");

    document.querySelector(".main-menu-buttons")?.classList.remove("hidden");
    document.querySelector(".game-over-menu-buttons")?.classList.add("hidden");

    const width = Number(gameConfig.width);
    const height = Number(gameConfig.height);

    // Add our background image
    this.backgroundLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0, 0);
    this.backgroundLayer1.setDisplaySize(width, height);

    this.title = this.add
      .text(width / 2, height / 2 - 100, "Cloud Chaser", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    if (this.logoTween) {
      this.logoTween.stop();
      this.logoTween = null;
    }

    this.scene.start("Game", this.input);
  }
}

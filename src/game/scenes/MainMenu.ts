import { type GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { gameConfig } from "../main";

export class MainMenu extends Scene {
  backgroundLayer1: GameObjects.Image;
  logo: GameObjects.Image; // This will be the logo image
  logoTween: Phaser.Tweens.Tween | null;

  constructor() {
    super("MainMenu");
  }

  preload() {
    // Preload the logo image
    this.load.image("LogoCloud", "assets/LogoCloud.png"); // Update the path if needed
    this.load.image("bg_layer1", "assets/bg_layer1.png"); // Same for the background image
  }

  create() {
    document
      .getElementById("playerName")
      ?.closest(".name-input")
      ?.classList.add("hidden");

    document.querySelector(".main-menu-buttons")?.classList.remove("hidden");
    document.querySelector(".game-over-menu-buttons")?.classList.add("hidden");
    document
      .querySelector(".leaderboard-menu-buttons")
      ?.classList.add("hidden");
    document.getElementById("leaderboard")?.classList.add("hidden");
    document.querySelector(".hud")?.classList.add("hidden");

    const width = Number(gameConfig.width);
    const height = Number(gameConfig.height);

    // Add the background image
    this.backgroundLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0, 0);
    this.backgroundLayer1.setDisplaySize(width, height);

    // Add the logo image in the center
    this.logo = this.add
      .image(width / 2, height / 2 - 100, "LogoCloud") // Position the logo at the center
      .setOrigin(0.5) // Center it
      .setDepth(100) // Make sure it's above other elements
      .setAlpha(0); // Start the logo as invisible

    // Resize the logo (example: 40% scale)
    this.logo.setScale(0.8); // Scales down the logo to 40%

    // Add a fade-in effect to the logo (from alpha 0 to alpha 1)
    this.tweens.add({
      targets: this.logo,
      alpha: 1, // End alpha value
      duration: 1000, // Time for the fade (in milliseconds)
      ease: "Power2", // Easing for smooth transition
    });

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

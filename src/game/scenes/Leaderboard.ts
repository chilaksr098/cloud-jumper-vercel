import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Leaderboard extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  backgroundLayer1: Phaser.GameObjects.Image;
  LeaderboardText: Phaser.GameObjects.Text;
  nameInput: HTMLInputElement;

  constructor() {
    super("Leaderboard");
  }

  create() {
    this.camera = this.cameras.main;

    // Show leaderboard
    document.getElementById("leaderboard")?.classList.remove("hidden");

    // Add our background image
    this.backgroundLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0, 0);
    this.backgroundLayer1.setDisplaySize(this.camera.width, this.camera.height);
    this.physics.world.setBounds(0, 0, this.camera.width, this.camera.height);

    document.querySelector(".main-menu-buttons")?.classList.add("hidden");
    document.querySelector(".game-over-menu-buttons")?.classList.add("hidden");
    document.querySelector(".leaderboard-menu-buttons")?.classList.remove("hidden");

    this.LeaderboardText = this.add
      .text(this.camera.width / 2, this.camera.height / 2 - 100, "Top Scores", {
        fontFamily: "Arial Black",
        fontSize: 32,
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
    const playerName = this.nameInput.value.trim();
    console.log("Player Name Entered:", playerName);
    this.scene.start("MainMenu", this.input);
  }
}

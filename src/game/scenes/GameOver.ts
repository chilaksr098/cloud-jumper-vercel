import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { getPlayerName, getScore } from "../PhaserGame.svelte";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  backgroundLayer1: Phaser.GameObjects.Image;
  gameOverText: Phaser.GameObjects.Text;
  nameInput: HTMLInputElement;

  constructor() {
    super("GameOver");
  }

  create() {
    this.camera = this.cameras.main;

    // Add our background image
    this.backgroundLayer1 = this.add.image(0, 0, "bg_layer1").setOrigin(0, 0);
    this.backgroundLayer1.setDisplaySize(this.camera.width, this.camera.height);
    this.physics.world.setBounds(0, 0, this.camera.width, this.camera.height);

    this.gameOverText = this.add
      .text(this.camera.width / 2, this.camera.height / 2 - 100, "Game over!", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    // Add a field to enter your name
    this.add
      .text(
        this.camera.width / 2 - 100,
        this.camera.height / 2 + 50,
        "Your name:",
        {
          fontFamily: "Arial Black",
          fontSize: 24,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 6,
          align: "center",
        }
      )
      .setOrigin(0.5);

    const playerNameInput = document.getElementById("playerName");
    playerNameInput?.closest(".name-input")?.classList.remove("hidden");
    const menuButtons = document.querySelector(".game-over-menu-buttons");
    menuButtons?.classList.remove("hidden");

    this.add
      .text(
        this.camera.width / 2,
        this.camera.height / 2 + 65,
        getScore() + "",
        {
          fontFamily: "Arial Black",
          fontSize: 24,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          align: "center",
        }
      )
      .setOrigin(0);

    this.add
      .text(
        this.camera.width / 2 - 100,
        this.camera.height / 2 + 80,
        "Your score:",
        {
          fontFamily: "Arial Black",
          fontSize: 24,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 6,
          align: "center",
        }
      )
      .setOrigin(0.5);

    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("MainMenu", this.input);
  }

  postScore() {
    const playerName = getPlayerName();
    const score = getScore();
    // Send post request to our backend
    fetch("/api/scores/" + playerName, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
      }),
    });
  }
}

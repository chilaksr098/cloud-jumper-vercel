import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
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
    this.physics.world.setBounds(
      0,
      0,
      this.camera.width,
      this.camera.height,
      true,
      true,
      false,
      true
    );

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
    const menuButtons = document.querySelector(".menu-buttons");
    menuButtons?.classList.remove("hidden");

    this.add
      .text(this.camera.width / 2, this.camera.height / 2 + 65, "12345", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      })
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
    const playerName = this.nameInput.value.trim();
    console.log("Player Name Entered:", playerName);
    this.scene.start("MainMenu", this.input);
  }
}

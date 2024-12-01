import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // Create the outline of the progress bar
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    // Create the progress bar itself
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    // Update the progress bar based on the loading progress
    this.load.on("progress", (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // Set the base path for assets
    this.load.setPath("assets");

    this.load.image("bg_layer1", "bg_layer1.png");
    this.load.image("bg_layer2", "bg_layer2.png");
    this.load.image("bg_layer3", "bg_layer3.png");
    this.load.image("bg_layer4", "bg_layer4.png");

    // Load the texture atlas using the XML file
    this.load.atlasXML("sprites", "spritesheet.png", "spritesheet.xml");
  }

  create() {
    const coins = ["gold", "silver", "bronze"];

    coins.forEach((coin) => {
      this.anims.create({
        key: `spin_${coin}`,
        frames: [
          { key: "sprites", frame: `${coin}_1` },
          { key: "sprites", frame: `${coin}_2` },
          { key: "sprites", frame: `${coin}_3` },
          { key: "sprites", frame: `${coin}_4` },
        ],
        frameRate: 8,
        repeat: -1, // Loop indefinitely
      });
    });

    // Start the MainMenu scene once loading is complete
    this.scene.start("MainMenu", this.input);
  }
}

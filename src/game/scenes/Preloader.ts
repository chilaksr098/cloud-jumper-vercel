import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // Display the background image
    this.add.image(512, 384, "background");

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

    // Load individual images
    this.load.image("logo", "logo.png");
    this.load.image("star", "star.png");

    // Load the texture atlas using the XML file
    this.load.atlasXML("sprites", "spritesheet.png", "spritesheet.xml");
  }

  create() {
    // Optional: Log all loaded textures to the console for debugging
    console.log(this.textures.list);

    // Start the MainMenu scene once loading is complete
    this.scene.start("MainMenu");
  }
}

import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { CollisionCategories } from "../../lib/CollisionCategories";
import { getScore, setScore } from "../PhaserGame.svelte";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  backgroundLayer1: Phaser.GameObjects.Image;
  character: Phaser.Physics.Arcade.Sprite;
  platforms: Phaser.Physics.Arcade.Group;
  enemies: Phaser.Physics.Arcade.Group;  // Group for enemies

  gameText: Phaser.GameObjects.Text;

  totalJumps: number = 0;
  curJump: number = 0;
  maxJumps: number = 2;
  score: number = 0;

  lastPlatformY: number = 0;
  lastEnemyY: number = 0; // Track the last enemy's Y position

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;

    document
      .getElementById("playerName")
      ?.closest(".name-input")
      ?.classList.add("hidden");

    document.querySelector(".main-menu-buttons")?.classList.add("hidden");
    document.querySelector(".game-over-menu-buttons")?.classList.add("hidden");
    document
      .querySelector(".leaderboard-menu-buttons")
      ?.classList.add("hidden");
    document.getElementById("leaderboard")?.classList.add("hidden");
    document.querySelector(".hud")?.classList.remove("hidden");

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

    // Create a static group for platforms
    this.platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      collideWorldBounds: true,
    });

    // Create a group for enemies
    this.enemies = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    for (let i = 0; i < 6; i++) {
      this.addPlatform(
        Phaser.Math.Between(150, this.camera.width - 150),
        this.camera.height - i * 150,
        this.getRandomPlatformMovement()
      );
    }

    this.addEnemies();  // Initial enemy spawn
    this.addCharacter();
    this.addInputListeners();

    // Enable collision between the player and the platforms
    this.physics.add.collider(this.character, this.platforms);

    // Enable collision between the player and the enemies
    this.physics.add.collider(this.character, this.enemies, this.hitEnemy, null, this);

    this.lastPlatformY = 0;
    EventBus.emit("current-scene-ready", this);
  }

  addCharacter() {
    // Create the character sprite
    this.character = this.physics.add.sprite(0, 0, "sprites", "bunny1_stand");

    // Center the character horizontally and position it at the bottom
    this.character.setOrigin(0.5, 1);

    // Get the position of the first platform
    const firstPlatform = this.platforms.getFirstAlive();

    this.character.setPosition(
      firstPlatform.x,
      firstPlatform.y - firstPlatform.height
    );

    this.character.setScale(0.66);
    this.character.setBounceX(1);

    // Add gravity to the character
    this.character.setGravityY(500);

    // Prevent the character from falling off the screen
    this.character.setCollideWorldBounds(true);
  }

  addPlatform(x: number, y: number, movement: number = 0) {
    // Create a platform and add it to the group
    const platform = this.platforms.create(x, y, "sprites", "ground_grass");

    platform.setScale(0.33).refreshBody();

    // Enable one-way collision
    platform.body.checkCollision.up = true;
    platform.body.checkCollision.down = false;
    platform.body.checkCollision.left = false;
    platform.body.checkCollision.right = false;

    // Set horizontal movement
    platform.setVelocityX(movement);

    platform.setBounce(1);
    platform.setCollisionCategory(CollisionCategories.PLATFORM);
  }

  addEnemies() {
    // Add enemies above the camera view to spawn randomly
    const numEnemies = Phaser.Math.Between(1, 3);  // Random number of enemies to spawn
    for (let i = 0; i < numEnemies; i++) {
      const x = Phaser.Math.Between(100, this.camera.width - 100);
      const y = Phaser.Math.Between(this.camera.scrollY - 200, this.camera.scrollY - 100);
      
      const enemy = this.enemies.create(x, y, "sprites", "flyMan_stand");  // Assuming "enemy_idle" is the idle frame of an enemy sprite
      enemy.setOrigin(0.5, 1);
      enemy.setScale(0.5);

      // Set the random movement for the enemy
      const movement = Phaser.Math.Between(-50, 50);
      enemy.setVelocityX(movement);

      // Track the last Y position of the enemies
      this.lastEnemyY = y;
    }
  }

  hitEnemy() {
    console.log("Player hit an enemy!");
    this.gameOver();  // End the game if the player hits an enemy
  }

  addInputListeners() {
    this.input.keyboard!.on("keydown-SPACE", this.jump, this);
    this.input.keyboard!.on("keydown-LEFT", this.left, this);
    this.input.keyboard!.on("keyup-LEFT", this.stopX, this);
    this.input.keyboard!.on("keydown-RIGHT", this.right, this);
    this.input.keyboard!.on("keyup-RIGHT", this.stopX, this);

    this.input.on("pointerdown", this.jump, this);
  }

  jump() {
    console.log({
      totalJumps: this.totalJumps,
      curJump: this.curJump,
      maxJumps: this.maxJumps,
    });
    this.curJump++;
    this.totalJumps++;
    this.character.setCollideWorldBounds(false);

    if (this.curJump <= this.maxJumps) {
      this.character.setVelocityY(-500); // Set the jump velocity
    }
  }

  left() {
    this.character.setVelocityX(-200);
    if (this.character.x < 0) {
      this.character.x = this.camera.width;
    }
  }

  right() {
    this.character.setVelocityX(200);
    if (this.character.x > this.camera.width) {
      this.character.x = 0;
    }
  }

  stopX() {
    this.character.setVelocityX(0);
  }

  changeScene() {
    // this.scene.start("GameOver", this.input);
  }

  gameOver() {
    this.scene.start("GameOver", this.input);
  }

  getRandomPlatformMovement() {
    // TODO - get harder as they get higher
    // 20% chance of moving left or right
    const moves = Phaser.Math.Between(0, 100);
    if (moves < 20) {
      return Phaser.Math.Between(-100, 100);
    } else {
      return 0;
    }
  }

  update(time: number, delta: number): void {
    this.backgroundLayer1.setPosition(0, this.camera.scrollY);

    if (this.character.body && this.character.body.touching.down) {
      this.curJump = 0;
      this.jump();
    }

    // Scroll the camera vertically to follow the player
    setScore(
      Math.max(
        Math.floor(((this.character.y - this.camera.height) / 3) * -1 - 32),
        getScore()
      )
    );

    if (this.character.y < this.camera.scrollY + this.camera.height / 2) {
      this.camera.scrollY = this.character.y - this.camera.height / 2;
    }

    // Spawn new platforms and enemies as the player climbs
    if (this.character.y < this.lastPlatformY + 500 + this.camera.height) {
      const x = Phaser.Math.Between(50, this.camera.width - 50);
      const y = this.lastPlatformY - 150;

      this.addPlatform(x, y, this.getRandomPlatformMovement());
      this.lastPlatformY = y;

      // Add new enemies as the player progresses
      if (this.character.y < this.lastEnemyY - this.camera.height) {
        this.addEnemies();
      }
    }

    // Remove platforms and enemies below the camera view
    this.platforms.children.iterate((platform) => {
      if (
        platform instanceof Phaser.Physics.Arcade.Sprite &&
        platform.y > this.camera.scrollY + this.camera.height
      ) {
        platform.destroy();
      }
      return null;
    });

    this.enemies.children.iterate((enemy) => {
      if (enemy instanceof Phaser.Physics.Arcade.Sprite && enemy.y > this.camera.scrollY + this.camera.height) {
        enemy.destroy();
      }
    });

    // Game over if the player falls too far
    if (this.character.y > this.camera.scrollY + this.camera.height) {
      this.gameOver();
    }
  }
}

import { Scene } from "phaser";
// import { setCurrentScene } from "../util/scene.svelte";

export class Enemy {
    x: number; // Horizontal position
    y: number; // Vertical position
    width: number; // Enemy width
    height: number; // Enemy height
    speed: number; // Movement speed
    gameWidth: number; // The width of the game screen
    gameHeight: number; // The height of the game screen
  
    constructor(gameWidth: number, gameHeight: number) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 30; // Enemy size
      this.height = 30;
      this.x = Math.random() * (gameWidth - this.width); // Random horizontal position
      this.y = Math.random() * -gameHeight; // Spawn randomly above the visible screen
      this.speed = 2; // Downward movement speed
    }
  
    // Update enemy's position
    update() {
      this.y += this.speed; // Move downward
      if (this.y > this.gameHeight) {
        // Respawn the enemy above the screen at a random position
        this.x = Math.random() * (this.gameWidth - this.width);
        this.y = Math.random() * -this.gameHeight;
      }
    }
  
    // Check for collision with the player
    checkCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
      return (
        playerX < this.x + this.width &&
        playerX + playerWidth > this.x &&
        playerY < this.y + this.height &&
        playerY + playerHeight > this.y
      );
    }
  
    // Draw the enemy on the canvas
    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "red"; // Enemy color
      ctx.fillRect(this.x, this.y, this.width, this.height); // Enemy shape
    }
  }
  
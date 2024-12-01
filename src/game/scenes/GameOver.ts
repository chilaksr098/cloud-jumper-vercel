import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { getPlayerName, getScore } from "../PhaserGame.svelte";
import { signInWith } from "$lib/auth/client";
import { supabase } from "$lib/supabaseClient";

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

    document.querySelector(".hud")?.classList.add("hidden");

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

    this.postScore();
    EventBus.emit("current-scene-ready", this);
  }

  changeScene() {
    this.scene.start("MainMenu", this.input);
  }

  async postScore() {
    // Check if the user is already signed in
    let {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return;
    }

    // Sign in the user anonymously if no session exists
    if (!session) {
      const data = await signInWith();
      session = data?.session;

      if (!session) {
        console.error("Failed to sign in anonymously.");
        return;
      }
    }

    const accessToken = session.access_token;
    const playerName = getPlayerName() || "Player"; // Fallback to "Player" if name is null/undefined
    const score = getScore();

    try {
      const response = await fetch(`/api/scores/${playerName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error posting score:", errorData);
        return;
      }

      const result = await response.json();
      console.log("Score submitted successfully:", result);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  }
}

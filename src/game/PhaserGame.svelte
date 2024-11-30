<script module lang="ts">
  import type { Game, Scene } from "phaser";

  export type TPhaserRef = {
    game: Game | null;
    scene: Scene | null;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import StartGame from "./main";
  import { EventBus } from "./EventBus";

  interface Props {
    phaserRef?: TPhaserRef;
    currentActiveScene: (scene: Scene) => void | undefined;
  }

  let {
    phaserRef = $bindable({
      game: null,
      scene: null,
    }),
    currentActiveScene,
  }: Props = $props();

  let playerName = $state(localStorage.getItem("playerName")?.trim() || "");

  onMount(() => {
    phaserRef.game = StartGame("game-container");

    EventBus.on("current-scene-ready", (scene_instance: Scene) => {
      phaserRef.scene = scene_instance;

      if (currentActiveScene) {
        currentActiveScene(scene_instance);
        const name = window.localStorage.getItem("playerName");
        if (name?.trim()) {
          playerName = name;
        }
      }
    });
  });

  function playAgain() {
  window.localStorage.setItem("playerName", playerName);
  if (phaserRef.scene) {
    phaserRef.scene.scene.stop(); // Stops the current scene
    phaserRef.scene.scene.start("Game"); // Starts the new scene
  }
}

function mainMenu() {
  window.localStorage.setItem("playerName", playerName);
  if (phaserRef.scene) {
    phaserRef.scene.scene.stop(); // Stops the current scene
    phaserRef.scene.scene.start("MainMenu"); // Starts the main menu scene
  }
}

</script>

<div id="game-container">
  <div class="menu-buttons hidden">
    <button class="btn" onclick={playAgain}>Play Again?</button>
    <button class="btn" onclick={mainMenu}>Main Menu</button>
  </div>
  <div class="name-input hidden">
    <input
      id="playerName"
      type="text"
      placeholder="Player"
      bind:value={playerName}
    />
  </div>
</div>

<style>
  .name-input {
    position: absolute;
    top: calc(50% + 50px);
    left: calc(50% + 200px);
    transform: translate(-50%, -50%);
  }

  .name-input input {
    width: 400px;
    height: 25px;
    font-size: 24px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: transparent;
    color: #ffffff;
    --stroke-size: 2px;
    text-shadow:
      calc(-1 * var(--stroke-size)) calc(-1 * var(--stroke-size)) 0 #000,
      var(--stroke-size) calc(-1 * var(--stroke-size)) 0 #000,
      calc(-1 * var(--stroke-size)) var(--stroke-size) 0 #000,
      var(--stroke-size) var(--stroke-size) 0 #000;
    appearance: none;
    outline: none;
    max-width: 200px;
    padding-right: 200px;
  }

  .name-input input::placeholder {
    color: #ffffff;
    opacity: 0.5;
  }

  .menu-buttons {
    position: absolute;
    top: calc(50% + 200px);
    left: calc(50%);
    transform: translate(-50%, -50%);
  }

  .hidden {
    display: none;
  }

  .btn {
    min-width: 200px;
    font-size: 1.5em;
    padding: 10px;
    background-color: #000000;
    color: rgba(255, 255, 255, 0.87);
    border: 1px solid rgba(255, 255, 255, 0.87);
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border: 1px solid #0ec3c9;
      color: #0ec3c9;
    }
  }
</style>

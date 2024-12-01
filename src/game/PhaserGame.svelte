<script module lang="ts">
  import type { Game, Scene } from "phaser";

  export type TPhaserRef = {
    game: Game | null;
    scene: Scene | null;
  };

  let score = $state(0);

  export const setScore = (newScore: number) => {
    score = newScore;
  };

  export const getScore = () => {
    return score;
  };

  let playerName = $state(localStorage.getItem("playerName")?.trim() || "");

  export const setPlayerName = (newPlayerName: string) => {
    playerName = newPlayerName;
  };

  export const getPlayerName = () => {
    return playerName;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import StartGame from "./main";
  import { EventBus } from "./EventBus";

  interface Props {
    phaserRef?: TPhaserRef;
  }

  let {
    phaserRef = $bindable({
      game: null,
      scene: null,
    }),
  }: Props = $props();

  onMount(() => {
    phaserRef.game = StartGame("game-container");

    EventBus.on("current-scene-ready", (scene_instance: Scene) => {
      phaserRef.scene = scene_instance;

      const name = window.localStorage.getItem("playerName");
      if (name?.trim()) {
        playerName = name;
      }
    });
  });

  function switchToScene(scene: string) {
    window.localStorage.setItem("playerName", playerName);
    if (phaserRef.scene) {
      phaserRef.scene.scene.stop(); // Stops the current scene
      phaserRef.scene.scene.start(scene); // Starts the new scene
      score = 0;
    }
    return null;
  }
</script>

<div id="game-container" class="relative">
  <div class="hud hidden">
    <div class="score">
      <span class="score-value">{score}</span>
      <span class="score-label">Score</span>
    </div>
  </div>
  <div class="main-menu-buttons menu-buttons hidden">
    <button class="btn" onclick={() => switchToScene("Game")}>Start</button>
    <button class="btn" onclick={() => switchToScene("Leaderboard")}
      >Leaderboard</button
    >
  </div>
  <div class="game-over-menu-buttons menu-buttons hidden">
    <button class="btn" onclick={() => switchToScene("Game")}
      >Play Again?</button
    >
    <button class="btn" onclick={() => switchToScene("MainMenu")}
      >Main Menu</button
    >
  </div>
  <div class="leaderboard-menu-buttons menu-buttons hidden">
    <button class="btn" onclick={() => switchToScene("MainMenu")}
      >Main Menu</button
    >
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
    font-family: "Arial Black", sans-serif;
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

  .hud {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    font-family: "Arial Black";
  }

  :global(.hidden) {
    display: none;
  }
  :global(.relative) {
    position: relative;
  }

  .menu-buttons:not(.hidden) {
    display: flex;
    justify-content: center;
  }

  :global(*) {
    user-select: none; /* Prevent text selection */
  }
</style>

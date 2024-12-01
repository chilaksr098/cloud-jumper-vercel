<script lang="ts">
  import type { Scene } from "phaser";
  import type { MainMenu } from "../game/scenes/MainMenu";
  import PhaserGame, { type TPhaserRef } from "../game/PhaserGame.svelte";
  import { page } from "$app/stores";

  let { topScores } = $page.data;

  console.log("Top Scores:", topScores);

  // The sprite can only be moved in the MainMenu Scene
  let canMoveSprite = $state(false);

  //  References to the PhaserGame component (game and scene are exposed)
  let phaserRef: TPhaserRef = $state({ game: null, scene: null });
  const spritePosition = $state({ x: 0, y: 0 });

  const changeScene = () => {
    const scene = phaserRef.scene as MainMenu;

    if (scene) {
      // Call the changeScene method defined in the `MainMenu`, `Game` and `GameOver` Scenes
      scene.changeScene();
    }
  };

  const moveSprite = () => {
    const scene = phaserRef.scene as MainMenu;

    if (scene) {
      // Get the update logo position
      (scene as MainMenu).moveLogo(({ x, y }: { x: number; y: number }) => {
        spritePosition.x = x;
        spritePosition.y = y;
      });
    }
  };

  const addSprite = () => {
    const scene = phaserRef.scene as Scene;

    if (scene) {
      // Add more coins
      const x = Phaser.Math.Between(64, scene.scale.width - 64);
      const y = Phaser.Math.Between(64, scene.scale.height - 64);

      //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance

      const type = ["gold", "silver", "bronze"][Math.floor(Math.random() * 3)];
      const coin = scene.add.sprite(x, y, "sprites", `${type}_1`);
      coin.play(`spin_${type}`);

      //  ... which you can then act upon. Here we create a Phaser Tween to fade the coin sprite in and out.
      //  You could, of course, do this from within the Phaser Scene code, but this is just an example
      //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
      //   scene.add.tween({
      //     targets: coin,
      //     duration: 500 + Math.random() * 1000,
      //     alpha: 0,
      //     yoyo: true,
      //     repeat: -1,
      //   });
    }
  };

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Scene) => {
    canMoveSprite = scene.scene.key !== "MainMenu";
  };
</script>

<div id="app">
  <PhaserGame bind:phaserRef currentActiveScene={currentScene} />
  <div id="leaderboard" class="hidden">
    <ul>
      {#each topScores as score}
        <li>{score.name}: {score.score}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  #app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #leaderboard {
    position: absolute;
    top: calc(50% + 50px);
    left: calc(50%);
    transform: translate(-50%, -50%);
    width: 400px;
    height: 200px;
    overflow-y: scroll;
  }

  #leaderboard ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #leaderboard li {
    padding: 4px;
    font-size: 32px;
  }
</style>

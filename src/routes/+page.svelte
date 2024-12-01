<script lang="ts">
  import PhaserGame, { type TPhaserRef } from "../game/PhaserGame.svelte";
  import { page } from "$app/stores";
  import { getLeaderboard, setLeaderboard } from "$lib/leaderboard.svelte";

  setLeaderboard($page.data.topScores);
  //  References to the PhaserGame component (game and scene are exposed)
  let phaserRef: TPhaserRef = $state({ game: null, scene: null });
</script>

<div id="app">
  <PhaserGame bind:phaserRef />
  <div id="leaderboard" class="hidden">
    <ul>
      {#each getLeaderboard() as score}
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

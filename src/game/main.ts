import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { Leaderboard } from "./scenes/Leaderboard";
import { Enemy } from "./scenes/Enemy";

//i cant take this class. some students are good but the others are misbehaved. the class before was nice, but their language was vuguar. this class has the most amount of students in the class and that might be troublesome
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 600,
  height: 800,
  parent: "game-container",
  backgroundColor: "#028af8",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver, Leaderboard],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;

export const gameConfig = config;

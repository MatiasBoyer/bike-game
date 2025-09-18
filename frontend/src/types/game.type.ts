import { IPlayer } from "./player.type";

interface IGameInit {
  scene: IGameScene;
}

interface IGameState {
  state: number;
  scene: IGameScene;
  players: IPlayer[];
}

interface IGameScene {
  scene_width: number;
  scene_height: number;
  lineWidth: number;
}

export type { IGameState, IGameInit, IGameScene };

import { IPlayer } from "./player.type";
import { IScene } from "./scene.type";

interface IGameState {
    state: number;
    scene: IScene;
    players: IPlayer[];
}

export type { IGameState };

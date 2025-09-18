import { IGameScene } from "./game.type";

interface IRoomCreate {
  id: string;
  password: string;
}

interface IRoomJoin {
  sceneInfo: IGameScene;
}

export type { IRoomCreate, IRoomJoin };

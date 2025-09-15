import { Player, PlayerState } from "interfaces/player.interface";
import { Socket } from "socket.io";

function CreatePlayer(socket: Socket) {
  const player: Player = {
    socket: socket,
    state: PlayerState.NOT_READY,

    prevPoints: [],

    currentPoint: [500 * 0.25, 500 * 0.25],
    currentDirection: [0, 0],
  };

  return player;
}

export default { CreatePlayer };

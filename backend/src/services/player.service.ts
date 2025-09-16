import { Player, PlayerState } from "../interfaces/player.interface";
import { Socket } from "socket.io";
import exception from "../exceptions/player.exception";

let players: Player[] = [];

function CreatePlayer(socket: Socket): Player {
  const player: Player = {
    socket: socket,
    state: PlayerState.NOT_READY,

    prevPoints: [],

    currentPoint: [500 * 0.25, 500 * 0.25],
    currentDirection: [0, 0],
  };

  players.push(player);
  return player;
}

function FindPlayer(socket: Socket): Player {
  const id = GetIDFromSocket(socket);
  for (let i = 0; i < players.length; i++) {
    if (GetIDFromSocket(players[i].socket) === id) return players[i];
  }

  throw exception.PlayerNotFound;
}

function GetIDFromSocket(socket: Socket): string {
  return socket.handshake.auth.uuid ?? socket.data.uuid ?? socket.id;
}

export default { CreatePlayer, GetIDFromSocket, FindPlayer };

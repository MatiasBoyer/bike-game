import { Room, RoomState } from "../interfaces/room.interface";
import exceptions from "../exceptions/room.exception";
import { Player } from "../interfaces/player.interface";
import PlayerService from "./player.service";
import { Socket } from "socket.io";
import { generate_string } from "../utils/string_gen";
import { GameLoop } from "./game.service";

let rooms: Room[] = [];

function GetRoom_byId(room_id: string): Room {
  const room: Room | undefined = rooms.find((x) => x.room_id === room_id);

  if (!room) throw exceptions.RoomNotFound;

  return room;
}

function GetRoom_byPlayer(player: Player): Room {
  for (let i = 0; i < rooms.length; i++) {
    const player: Player | undefined = rooms[i].players.find(
      (p) => p === player
    );

    if (player) return rooms[i];
  }

  throw exceptions.RoomNotFound;
}

function CreateRoom(room_password: string): Room {
  // room data
  const newRoom: Room = {
    room_id: generate_string(8),
    room_password: room_password,

    state: RoomState.WAITING_FOR_PLAYERS,

    players: [],

    loopfn: setInterval(() => GameLoop(newRoom), 10),
  };

  rooms.push(newRoom);
  return newRoom;
}

function DeleteRoom(room: Room) {
  room.players.forEach((p: Player) => {
    p.socket.disconnect(true);
  });

  const idx = rooms.findIndex((elem) => elem === room);
  rooms.splice(idx);
}

function JoinRoom(room: Room, socket: Socket): Player {
  const player = PlayerService.CreatePlayer(socket);
  room.players.push(player);
  return player;
}

function LeaveRoom(room: Room, socket: Socket) {
  const idx = room.players.findIndex((elem) => elem.socket === socket);

  if (idx === -1) throw new exceptions.PlayerNotFound();

  room.players.splice(idx);
}

type IterateCB = (room: Room) => Promise<void>;
async function Iterate(callback: IterateCB) {
  for (let i = 0; i < rooms.length; i++) {
    await callback(rooms[i]);
  }
}

export default {
  GetRoom_byId,
  GetRoom_byPlayer,
  CreateRoom,
  DeleteRoom,
  JoinRoom,
  LeaveRoom,
  Iterate,
};

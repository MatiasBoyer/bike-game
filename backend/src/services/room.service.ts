import { Room, RoomState } from "../interfaces/room.interface";
import exceptions from "../exceptions/room.exception";
import { Player } from "../interfaces/player.interface";
import PlayerService from "./player.service";
import { Server, Socket } from "socket.io";
import { generate_string } from "../utils/string_gen";
import { StartLoop } from "./game.service";
import gameConfig from "../config/game.config";

let rooms: Room[] = [];

const room_id_length = 6;

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

function CreateRoom(io: Server, room_password: string): Room {
  // room data
  const newRoom: Room = {
    room_id: generate_string(room_id_length),
    room_password: room_password,

    state: RoomState.WAITING_FOR_PLAYERS,

    players: [],

    loopfn: null!,
    scene: {
      lineWidth: 2,
      scene_width: 500,
      scene_height: 500,
    },
  };

  newRoom.loopfn = StartLoop(io, newRoom);
  rooms.push(newRoom);
  console.log(`[roomService] room created: ${newRoom.room_id}`);
  return newRoom;
}

function DeleteRoom(room: Room) {
  room.players.forEach((p: Player) => {
    p.socket.disconnect(true);
  });
  room?.loopfn?.();

  const idx = rooms.findIndex((elem) => elem === room);
  if (idx !== -1) rooms.splice(idx);

  console.log(`[roomService] room deleted: ${room.room_id}`);
}

function JoinRoom(room: Room, socket: Socket): Player {
  const player = PlayerService.CreatePlayer(socket);
  socket.join(room.room_id);
  socket.data.room = room;
  room.players.push(player);

  console.log(
    `[roomService] player ${player.socket.id} joined room: ${room.room_id}`
  );
  return player;
}

function LeaveRoom(room: Room, socket: Socket) {
  if (!room) return;

  const idx = room.players.findIndex((elem) => elem.socket === socket);

  if (idx === -1) throw new exceptions.PlayerNotFound();

  socket.data.room = null;

  room.players.splice(idx);

  if (room.players.length === 0) {
    DeleteRoom(room);
  }
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

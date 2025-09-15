import { Room, RoomState } from "interfaces/room.interface";
import exceptions from "../exceptions/room.exception";
import { Player, PlayerState } from "interfaces/player.interface";
import PlayerService from "./player.service";
import { Socket } from "socket.io";

let rooms: Room[] = [];

function GetRoom_byId(room_id: string): Room | undefined {
  return rooms.find((x) => x.room_id === room_id);
}

function GetRoom_byPlayer(player: Player): Room | undefined {
  const room: Room | undefined = undefined;

  for (let i = 0; i < rooms.length; i++) {
    const player: Player | undefined = rooms[i].players.find(
      (p) => p === player
    );

    if (player) return rooms[i];
  }

  return undefined;
}

function CreateRoom(room_id: string, room_password: string) {
  // room data
  const newRoom: Room = {
    room_id: "TEST",
    room_password: "1234",

    state: RoomState.WAITING_FOR_PLAYERS,

    players: [],
  };

  // if room exists, do not create one
  const existingRoom: Room | undefined = GetRoom_byId(newRoom.room_id);
  if (existingRoom) {
    return undefined;
  }

  // if room does not exist, create one
  rooms.push(newRoom);
  return rooms[rooms.length - 1];
}

function DeleteRoom(room: Room) {
  room.players.forEach((p: Player) => {
    p.socket.disconnect(true);
  });

  const idx = rooms.findIndex((elem) => elem === room);
  rooms.splice(idx);
}

function JoinRoom(room: Room, socket: Socket): Player {
  room.players.push(PlayerService.CreatePlayer(socket));
  return room.players[room.players.length - 1];
}

function LeaveRoom(room: Room, socket: Socket) {
  const idx = room.players.findIndex((elem) => elem.socket === socket);

  if (idx === -1) throw exceptions.PlayerNotFound;

  room.players.splice(idx);
}

export default {
  GetRoom_byId,
  GetRoom_byPlayer,
  CreateRoom,
  DeleteRoom,
  JoinRoom,
  LeaveRoom,
};

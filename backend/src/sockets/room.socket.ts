import { Server, Socket } from "socket.io";
import roomService from "../services/room.service";
import schemas from "../schemas/room.schemas";
import { Room } from "../interfaces/room.interface";
import { Player } from "../interfaces/player.interface";

export default (io: Server, socket: Socket) => {
  const createRoom = (payload: any, callback: Function) => {
    const { error, value } = schemas.createRoom.validate(payload);
    if (error) {
      return;
    }

    try {
      const room: Room = roomService.CreateRoom(value.password);
      const player: Player = roomService.JoinRoom(room, socket);

      callback({ success: true });
    } catch {
      callback({ success: false });
    }
  };

  const joinRoom = (payload: any, callback: Function) => {
    const { error, value } = schemas.joinRoom.validate(payload);
    if (error) {
      return;
    }

    try {
      const room: Room = roomService.GetRoom_byId(value.id);
      const player: Player = roomService.JoinRoom(room, socket);
      callback({ success: true });
    } catch {
      callback({ success: false });
    }
  };

  const leaveRoom = (payload: any, callback: Function) => {
    const { error, value } = schemas.leaveRoom.validate(payload);
    if (error) {
      return;
    }

    try {
      const room: Room = roomService.GetRoom_byId(value.id);
      roomService.LeaveRoom(room, socket);
      callback({ success: true });
    } catch {
      callback({ success: false });
    }
  };

  socket.on("room:create", createRoom);
  socket.on("room:join", joinRoom);
  socket.on("room:leave", leaveRoom);
};

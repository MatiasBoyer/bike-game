import { Server, Socket } from "socket.io";
import roomService from "../services/room.service";
import schemas from "../schemas/room.schemas";
import { Room } from "../interfaces/room.interface";
import { Player } from "../interfaces/player.interface";
import playerException from "../exceptions/player.exception";

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
    } catch (err) {
      callback({ success: false, err });
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
      socket.join(room.room_id);
      callback({ success: true });
    } catch (err) {
      callback({ success: false, err });
    }
  };

  const leaveRoom = (payload: any, callback: Function) => {
    /*const { error, value } = schemas.leaveRoom.validate(payload);
    if (error) {
      return;
    }*/

    try {
      if (!socket.data.room) throw new playerException.NotInARoom();
      roomService.LeaveRoom(socket.data.room, socket);
      socket.leave(socket.data.room.room_id);
      callback({ success: true });
    } catch (err) {
      callback({ success: false, err });
    }
  };

  socket.on("room:create", createRoom);
  socket.on("room:join", joinRoom);
  socket.on("room:leave", leaveRoom);
};

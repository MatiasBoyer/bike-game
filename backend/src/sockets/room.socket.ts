import { Server, Socket } from "socket.io";
import roomService from "../services/room.service";
import schemas from "../schemas/room.schemas";
import { Room } from "../interfaces/room.interface";
import { Player } from "../interfaces/player.interface";
import playerException from "../exceptions/player.exception";
import schemaValidation from "../utils/socket/schemavalidation.util";

export default (io: Server, socket: Socket) => {
  const createRoom = schemaValidation(schemas.createRoom, (value: any) => {
    const room: Room = roomService.CreateRoom(io, value.password);
    const player: Player = roomService.JoinRoom(room, socket);

    return {
      id: room.room_id,
      password: room.room_password,
    };
  });

  const joinRoom = schemaValidation(schemas.joinRoom, (value: any) => {
    const room: Room = roomService.GetRoom_byId(value.id);
    const player: Player = roomService.JoinRoom(room, socket);
    socket.join(room.room_id);
    return {
      sceneInfo: room.scene,
    };
  });

  const leaveRoom = schemaValidation(undefined, (value: any) => {
    if (!socket.data.room) throw new playerException.NotInARoom();
    socket.leave(socket.data.room.room_id);
    roomService.LeaveRoom(socket.data.room, socket);
  });

  socket.on("room:create", createRoom);
  socket.on("room:join", joinRoom);
  socket.on("room:leave", leaveRoom);
};

import { Server, Socket } from "socket.io";
import RegisterPlayerHandlers from "./sockets/player.socket";
import RegisterRoomHandlers from "./sockets/room.socket";
import { v4 } from "uuid";
import roomService from "./services/room.service";

export default function init_socket(io: Server) {
  const onConnection = (socket: Socket) => {
    console.info(`[CONNECT] ${socket.id}`);

    socket.data.uuid = v4();
    RegisterPlayerHandlers(io, socket);
    RegisterRoomHandlers(io, socket);

    socket.on("disconnect", () => {
      console.info(`[DISCONNECT] ${socket.id}`);
      try {
        roomService.LeaveRoom(socket.data.room, socket);
      } catch (err) {
        console.error("error leaving room", err);
      }
    });
  };

  io.on("connection", onConnection);
}

import { Server, Socket } from "socket.io";
import RegisterPlayerHandlers from "./sockets/player.socket";
import RegisterRoomHandlers from "./sockets/room.socket";
import { v4 } from "uuid";

export default function init_socket(io: Server) {
  const onConnection = (socket: Socket) => {
    console.info(`[CONNECT] ${socket.id}`);

    socket.data.uuid = v4();
    RegisterPlayerHandlers(io, socket);
    RegisterRoomHandlers(io, socket);

    socket.on("disconnect", () => {
      console.info(`[DISCONNECT] ${socket.id}`);
    });
  };

  io.on("connection", onConnection);
}

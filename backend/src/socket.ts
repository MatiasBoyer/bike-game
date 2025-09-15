import { Server, Socket } from "socket.io";
import RegisterPlayerHandlers from "./sockets/player.socket";
import RegisterRoomHandlers from "./sockets/room.socket";

export default function init_socket(io: Server) {
  const onConnection = (socket: Socket) => {
    RegisterPlayerHandlers(io, socket);
    RegisterRoomHandlers(io, socket);
  };

  io.on("connection", onConnection);
}

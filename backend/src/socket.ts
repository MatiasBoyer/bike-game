import { Server, Socket } from "socket.io";
import RegisterPlayerHandlers from "./sockets/player.socket";
import RegisterRoomHandlers from "./sockets/room.socket";
import { v4 } from "uuid";

export default function init_socket(io: Server) {
  const onConnection = (socket: Socket) => {
    socket.data.uuid = v4();
    RegisterPlayerHandlers(io, socket);
    RegisterRoomHandlers(io, socket);
  };

  io.on("connection", onConnection);
}

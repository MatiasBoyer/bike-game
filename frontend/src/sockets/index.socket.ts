import { socketURI, socketOptions } from "@/constants/socket.constant";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(socketURI, socketOptions);

function get_socket(): Socket {
  if (!socket) throw new Error("No socket initialized");
  return socket;
}

export { get_socket };

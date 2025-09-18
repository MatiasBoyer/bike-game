import { socketURI, socketOptions } from "@/constants/socket.constant";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function get_socket(): Socket {
  if (!socket) {
    socket = io(socketURI, socketOptions);
  }
  return socket;
}

const g = globalThis as unknown as { _socket?: Socket };
if (!g._socket) {
  g._socket = get_socket();
}
export const global_socket = g._socket!;

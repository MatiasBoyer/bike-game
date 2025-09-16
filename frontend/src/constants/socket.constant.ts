import type { SocketOptions } from "socket.io-client";
import { GetAPI } from "@/utils/getapi.util";

const socketURI: string = GetAPI() + '/ws';

const socketOptions: SocketOptions = {};

export { socketURI, socketOptions };

import type { ManagerOptions, SocketOptions } from "socket.io-client";
import { GetAPI } from "@/utils/getapi.util";
import config from "../utils/config.util";

const socketURI: string = config.api_endpoint;

const socketOptions: Partial<ManagerOptions & SocketOptions> | undefined = {
  path: config.project_path + "/ws",
  transports: ['websocket']
};

export { socketURI, socketOptions };

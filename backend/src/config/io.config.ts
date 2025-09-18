import dotenv from "dotenv";
import { ServerOptions } from "socket.io";
import cf_general from "./general.config";
dotenv.config();

const config: Partial<ServerOptions> = {
  path: cf_general.proj_path + "/ws",
  cors: {
    origin: cf_general.cors,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
};

export default config;

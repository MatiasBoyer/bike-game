import dotenv from "dotenv";
import { ServerOptions } from "socket.io";
import cf_general from "./general.config";
dotenv.config();

const config: any = {
  path: cf_general.proj_path + "/ws",
};

export default config;

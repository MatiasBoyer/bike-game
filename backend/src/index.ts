import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";

import logUtil from "./utils/db/log.util";
import cf_general from "./config/general.config";
import cf_io from "./config/io.config";
import cf_cors from "./config/cors.config";
import rt_index from "./routes/index.route";
import cors from "cors";
import mw_errorhandler from "./middlewares/errorhandler.middleware";
import init_socket from "./socket";

const app = express();
const server = createServer(app);
const io = new Server(server, cf_io);

// Override console to log everything into DB
logUtil.overrideConsole();

// Middleware(s)
app.use(cors(cf_cors));
app.use(express.json()); // Parse body json
app.use(cf_general.proj_path, rt_index); // Project routes
app.use(mw_errorhandler); // Error handler

// Socket.io connection
init_socket(io);

// Start server
server.listen(cf_general.node_port, () => {
  console.info(`Server running at http://localhost:${cf_general.node_port}`);
  console.info(`Branch: ${cf_general.branch}`);
  console.info(`Build: ${cf_general.build}`);
});

import dotenv from "dotenv";
dotenv.config();

interface CFG_General {
  node_port: number;
  branch: string;
  proj_path: string;
  build: number;
  cors: string[];
}

const config: CFG_General = {
  node_port: Number(process.env.NODE_PORT ?? 3000),
  proj_path: process.env.PROJ_PATH ?? "/bike",
  branch: process.env.BRANCH ?? "dev",
  build: Number(process.env.BUILD ?? 0),
  cors: process.env.CORS?.split('|') ?? ['*'],
};

export default config;

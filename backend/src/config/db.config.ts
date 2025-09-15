import dotenv from "dotenv";
dotenv.config();

interface CFG_DB {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const config: CFG_DB = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || "default",
  password: process.env.DB_PASS || "default",
  database: process.env.DB_NAME || "default",
};

export default config;

import { Request } from "express";
import execute from "./executedb.service";

async function get(req: Request) {
  const result = await execute("health/GetDBHealth.sql");

  const status: any = {
    server: {
      uptime: process.uptime(),
      timestamp: Date.now(),
    },
    database: result.status == 200 ? result.data[0] : "failure",
    message: "OK!",
  };

  return status;
}

export default {
  get,
};

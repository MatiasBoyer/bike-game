import cf_general from "./general.config";
import cors from "cors";

const config: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (cf_general.cors.includes(origin)) cb(null, true);
    else if (cf_general.cors.length === 1 && cf_general.cors[0] === "*")
      cb(null, true);
    else cb(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST"],
  credentials: true,
};

export default config;

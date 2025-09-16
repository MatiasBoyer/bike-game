import dotenv from "dotenv";
dotenv.config();

interface CFG_GAME {
  loopinterval: number;
  speed: number;
}

const config: CFG_GAME = {
  loopinterval: 10,
  speed: 0.25,
};

export default config;

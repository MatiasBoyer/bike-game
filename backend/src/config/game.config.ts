import dotenv from "dotenv";
dotenv.config();

interface CFG_GAME {
  loopinterval: number;
}

const config: CFG_GAME = {
  loopinterval: 100,
};

export default config;

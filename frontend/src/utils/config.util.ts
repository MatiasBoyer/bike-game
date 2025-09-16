import dotenv from "dotenv";
dotenv.config();

interface IConfig {
  branch: string;
  build: number;
  api_endpoint: string;
  project_path: string;
}

const config: IConfig = {
  api_endpoint: process.env.REACT_APP_API_ENDPOINT ?? "http://localhost:3000",
  project_path: process.env.REACT_APP_PROJ_PATH ?? "/bike",
  branch: process.env.REACT_APP_BRANCH ?? "dev-noenv",
  build: Number(process.env.REACT_APP_BUILD ?? "0"),
};

export default config;

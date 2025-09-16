import type { NextConfig } from "next";
import dotenv from "dotenv";
dotenv.config();

const nextConfig: NextConfig = {
  env: {
    api_endpoint: process.env.REACT_APP_API_ENDPOINT,
    project_path: process.env.REACT_APP_PROJ_PATH,
    branch: process.env.REACT_APP_BRANCH,
    build: process.env.REACT_APP_BUILD,
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import dotenv from "dotenv";
dotenv.config();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    api_endpoint: process.env.API_ENDPOINT,
    project_path: process.env.PROJ_PATH,
    branch: process.env.BRANCH,
    build: process.env.BUILD,
  },
};

export default nextConfig;

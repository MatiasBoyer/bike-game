interface IConfig {
  branch: string;
  build: number;
  api_endpoint: string;
  project_path: string;
}

const config: IConfig = {
  api_endpoint: process.env.api_endpoint ?? "http://localhost:3000",
  project_path: process.env.project_path ?? "/bike",
  branch: process.env.branch ?? "dev-noenv",
  build: Number(process.env.build ?? "0"),
};

export default config;

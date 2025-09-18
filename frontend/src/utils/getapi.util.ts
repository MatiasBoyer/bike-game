import config from "../utils/config.util";

function GetAPI() {
  return config.api_endpoint + config.project_path;
}

export { GetAPI };

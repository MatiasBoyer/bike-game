import { Socket } from "socket.io-client";
import { emit } from "../utils/socket.util";
import playerExceptions from "../exceptions/player.exceptions";

async function UpdateDirection(arrow_key: string) {
  const ev = "player:update_direction";

  let x = 0;
  let y = 0;

  switch (arrow_key) {
    case "ArrowUp":
      x = 0;
      y = 1;
      break;
    case "ArrowDown":
      x = 0;
      y = -1;
      break;
    case "ArrowLeft":
      x = -1;
      y = 0;
      break;
    case "ArrowRight":
      x = 1;
      y = 0;
      break;
    default:
      throw new playerExceptions.FailedToUpdateDirection();
  }

  const payload = { x, y };

  const result: any = await emit(ev, payload);

  if (result.success === true) return true;
  else throw new playerExceptions.FailedToUpdateDirection();
}

export { UpdateDirection };

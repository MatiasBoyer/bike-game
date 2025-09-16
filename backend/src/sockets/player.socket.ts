import { Player, update_direction } from "../interfaces/player.interface";
import { Server, Socket } from "socket.io";
import schemas from "../schemas/player.schemas";
import playerService from "../services/player.service";

export default (io: Server, socket: Socket) => {
  const update_direction = (payload: update_direction, callback: Function) => {
    const { error, value } = schemas.update_direction.validate(payload);
    if (error) {
      return;
    }

    try {
      const player: Player = playerService.FindPlayer(socket);
      player.currentDirection = [value.x, value.y];
      callback({ success: true });
    } catch {
      callback({ success: false });
    }
  };

  socket.on("player:update_direction", update_direction);
};

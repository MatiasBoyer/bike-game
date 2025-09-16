import { Player, update_direction } from "../interfaces/player.interface";
import { Server, Socket } from "socket.io";
import schemas from "../schemas/player.schemas";
import playerService from "../services/player.service";
import playerException from "../exceptions/player.exception";

export default (io: Server, socket: Socket) => {
  const update_direction = (payload: update_direction, callback: Function) => {
    const { error, value } = schemas.update_direction.validate(payload);
    if (error) {
      return;
    }

    try {
      const player: Player = playerService.FindPlayer(socket);

      const newDirection: [number, number] = [value.x, value.y];

      if (player.currentDirection === newDirection) {
        throw new playerException.CannotChangeDir();
      }

      if (
        player.currentDirection[0] === -newDirection[0] ||
        player.currentDirection[1] === -newDirection[1]
      ) {
        throw new playerException.CannotChangeDir();
      }

      player.prevPoints = [...player.prevPoints, ...player.currentPoint];
      player.currentDirection = newDirection;
      callback({ success: true });
    } catch (err) {
      callback({ success: false });
    }
  };

  socket.on("player:update_direction", update_direction);
};

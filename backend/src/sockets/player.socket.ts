import {
  Player,
  PlayerState,
  update_direction,
} from "../interfaces/player.interface";
import { Server, Socket } from "socket.io";
import schemas from "../schemas/player.schemas";
import playerService from "../services/player.service";
import playerException from "../exceptions/player.exception";
import schemaValidation from "../utils/socket/schemavalidation.util";

export default (io: Server, socket: Socket) => {
  const update_direction = schemaValidation(
    schemas.update_direction,
    (value: any) => {
      const player: Player = playerService.FindPlayer(socket);

      if (player.state != PlayerState.IN_GAME) {
        throw new playerException.PlayerIsDead();
      }

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
    }
  );

  const set_readyness = schemaValidation(undefined, (value: any) => {
    const player: Player = playerService.FindPlayer(socket);
    if (player.state === PlayerState.NOT_READY)
      player.state = PlayerState.READY;
    else throw new playerException.IncorrectState();
  });

  socket.on("player:update_direction", update_direction);
  socket.on("player:set_readyness", set_readyness);
};

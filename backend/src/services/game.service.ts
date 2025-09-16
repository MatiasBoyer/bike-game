import { Server } from "socket.io";
import gameConfig from "../config/game.config";
import { Room, RoomState } from "../interfaces/room.interface";
import { Player, PlayerState } from "../interfaces/player.interface";
import { sleep } from "../utils/sleep.util";

function spawn_players(players: Player[]) {
  const center = [0, 0];
  const radius = 250;
  const startAngle = (3 * Math.PI) / 4;
  const step = (2 * Math.PI) / players.length;

  for (let i = 0; i < players.length; i++) {
    const angle = startAngle - i * step;
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);

    const point: [number, number] = [x, y];

    const player: Player = players[i];
    player.currentPoint = point;
    player.prevPoints = [];

    if (x >= center[0] && y <= center[1]) player.currentDirection = [-1, 0];
    else if (x < center[0] && y <= center[1]) player.currentDirection = [0, -1];
    else if (x >= center[0] && y > center[1]) player.currentDirection = [0, 1];
    else player.currentDirection = [1, 0];

    player.state = PlayerState.READY;
  }
}

async function GameLoop(io: Server, room: Room) {
  switch (room.state) {
    case RoomState.WAITING_FOR_PLAYERS:
      console.info("waiting for players, moving in 5s");
      await sleep(5000);
      room.state = RoomState.PREV_GAME;
      break;
    case RoomState.PREV_GAME:
      spawn_players(room.players);
      room.state = RoomState.IN_GAME;
      break;
    case RoomState.IN_GAME:
      room.players.forEach((p) => {
        p.currentPoint[0] += p.currentDirection[0] * gameConfig.speed;
        p.currentPoint[1] += p.currentDirection[1] * gameConfig.speed;
      });

      io.to(room.room_id).emit("game:update", {
        players: room.players.map((p: Player) => {
          return {
            id: p.socket.id,
            points: [...p.prevPoints, ...p.currentPoint],
            stroke: "green",
          };
        }),
      });
      break;
    case RoomState.AFTER_GAME:
      break;
  }
}

function StartLoop(io: Server, room: Room) {
  let running = true;

  async function loop() {
    while (running) {
      await GameLoop(io, room);
      await sleep(gameConfig.loopinterval);
    }
  }

  loop();

  return () => {
    running = false;
  };
}

export { StartLoop };

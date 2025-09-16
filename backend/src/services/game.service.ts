import { Server } from "socket.io";
import gameConfig from "../config/game.config";
import { Room, RoomState } from "../interfaces/room.interface";
import { Player, PlayerState } from "../interfaces/player.interface";
import { sleep } from "../utils/sleep.util";
import collisionsUtil from "../utils/game/collisions.util";

// 0 to y/2 -> top
// y/2 to y-max -> bottom
function spawn_players(players: Player[]) {
  const center = [250, 250];
  const radius = 200;
  const startAngle = (5 * Math.PI) / 4;
  const step = (2 * Math.PI) / players.length;

  for (let i = 0; i < players.length; i++) {
    const angle = startAngle - i * step;
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);

    const point: [number, number] = [x, y];

    const player: Player = players[i];
    player.currentPoint = point;
    player.prevPoints = [...point];

    // [0, 1] -> hacia abajo
    // [0, -1] -> hacia arriba
    // [1, 0] -> derecha
    // [-1, 0] -> izquierda

    if (x <= center[0]) {
      // left
      // top
      if (y <= center[1]) player.currentDirection = [0, 1];
      // bottom
      else player.currentDirection = [1, 0];
    } else {
      // rigth
      // top
      if (y <= center[1]) player.currentDirection = [-1, 0];
      // bottom
      else player.currentDirection = [0, -1];
    }

    player.state = PlayerState.IN_GAME;
  }
}

function check_collisions(lineWidth: number, players: Player[]) {
  const radius = lineWidth / 2;

  players.forEach((p) => {
    if (p.state === PlayerState.DEAD) return;

    // Build the full segments array for this player
    const points = [...p.prevPoints, ...p.currentPoint];
    const segments: [number, number, number, number][] = [];
    for (let i = 0; i < points.length - 2; i += 2) {
      const seg: [number, number, number, number] = [
        points[i],
        points[i + 1],
        points[i + 2],
        points[i + 3],
      ];
      // skip zero-length segments
      if (seg[0] === seg[2] && seg[1] === seg[3]) continue;
      segments.push(seg);
    }

    // Compare every segment with all previous segments except adjacent
    for (let i = 0; i < segments.length; i++) {
      const [x1, y1, x2, y2] = segments[i];
      for (let j = 0; j < i - 1; j++) {
        // skip previous adjacent segment
        const [a1, b1, a2, b2] = segments[j];
        if (
          collisionsUtil.segmentsCollideWithWidth(
            [x1, y1],
            [x2, y2],
            [a1, b1],
            [a2, b2],
            radius
          )
        ) {
          p.state = PlayerState.DEAD;
          return;
        }
      }
    }
  });
}

function move_players(players: Player[]) {
  players.forEach((p) => {
    if (p.state === PlayerState.DEAD) return;

    p.currentPoint[0] += p.currentDirection[0] * gameConfig.speed;
    p.currentPoint[1] += p.currentDirection[1] * gameConfig.speed;
  });
}

async function GameLoop(io: Server, room: Room) {
  switch (room.state) {
    case RoomState.WAITING_FOR_PLAYERS:
      console.info("waiting for players, moving in 1s");
      await sleep(1000);
      room.state = RoomState.PREV_GAME;
      break;
    case RoomState.PREV_GAME:
      io.to(room.room_id).emit("game:init", {
        scene: room.scene,
      });
      spawn_players(room.players);
      room.state = RoomState.IN_GAME;
      break;
    case RoomState.IN_GAME:
      check_collisions(room.scene.lineWidth, room.players);

      move_players(room.players);

      io.to(room.room_id).emit("game:update", {
        players: room.players.map((p: Player) => {
          return {
            id: p.socket.id,
            points: [...p.prevPoints, ...p.currentPoint].map((v) =>
              Number(v.toFixed(2))
            ),
            stroke: "green",
            state: p.state,
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

import { Server } from "socket.io";
import gameConfig from "../config/game.config";
import { Room, RoomState } from "../interfaces/room.interface";
import { Player, PlayerState } from "../interfaces/player.interface";
import { sleep } from "../utils/sleep.util";

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

function doLinesIntersect(
  p0: [number, number],
  p1: [number, number],
  q0: [number, number],
  q1: [number, number]
) {
  const [x1, y1] = p0;
  const [x2, y2] = p1;
  const [x3, y3] = q0;
  const [x4, y4] = q1;

  // Bounding box check first (quick reject)
  if (
    Math.max(x1, x2) < Math.min(x3, x4) ||
    Math.min(x1, x2) > Math.max(x3, x4) ||
    Math.max(y1, y2) < Math.min(y3, y4) ||
    Math.min(y1, y2) > Math.max(y3, y4)
  ) {
    return false;
  }

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) return false; // parallel or collinear

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  return ua > 0 && ua < 1 && ub > 0 && ub < 1;
}

function check_collisions(players: Player[]) {
  for (let i = 0; i < players.length; i++) {
    const p: Player = players[i];
    if (p.state === PlayerState.DEAD) continue;

    for (let x = 0; x < players.length; x++) {
      const player_points = [
        ...players[x].prevPoints,
        ...players[x].currentPoint,
      ];

      const segments: [number, number, number, number][] = [];

      for (let i = 0; i < player_points.length - 2; i += 2) {
        const p0: [number, number] = [player_points[i], player_points[i + 1]];
        const p1: [number, number] = [
          player_points[i + 2],
          player_points[i + 3],
        ];

        for (const [x1, y1, x2, y2] of segments) {
          if (doLinesIntersect(p0, p1, [x1, y1], [x2, y2])) {
            p.state = PlayerState.DEAD;
            break;
          }
        }

        segments.push([p0[0], p0[1], p1[0], p1[1]]);
      }
    }
  }
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
      spawn_players(room.players);
      room.state = RoomState.IN_GAME;
      break;
    case RoomState.IN_GAME:
      check_collisions(room.players);

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

import { Server } from "socket.io";
import gameConfig from "../config/game.config";
import { Room, RoomState, RoomScene } from "../interfaces/room.interface";
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

function check_collisions(
  lineWidth: number,
  scene: RoomScene,
  players: Player[]
) {
  const radius = lineWidth / 2;

  players.forEach((p) => {
    if (p.state !== PlayerState.IN_GAME) return;

    const die = () => {
      p.state = PlayerState.DEAD;
    };

    if (
      p.currentPoint[0] <= 0 ||
      p.currentPoint[0] >= scene.scene_width ||
      p.currentPoint[1] <= 0 ||
      p.currentPoint[1] >= scene.scene_height
    ) {
      die();
      return;
    }

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
          die();
          return;
        }
      }
    }
  });
}

function move_players(players: Player[]) {
  players.forEach((p) => {
    if (p.state !== PlayerState.IN_GAME) return;

    p.currentPoint[0] += p.currentDirection[0] * gameConfig.speed;
    p.currentPoint[1] += p.currentDirection[1] * gameConfig.speed;
  });
}

async function GameLoop(io: Server, room: Room) {
  switch (room.state) {
    case RoomState.WAITING_FOR_PLAYERS:
      // sleep 1000 and check if all players are ready
      await sleep(1000);
      if (
        room.players.filter((p) => p.state === PlayerState.READY).length ===
        room.players.length
      ) {
        // once ready, then we can start
        room.state = RoomState.PREV_GAME;
      }
      break;
    case RoomState.PREV_GAME:
      // send the scene and spawn all players
      io.to(room.room_id).emit("game:init", {
        scene: room.scene,
      });
      spawn_players(room.players);

      // wait 1s to start
      await sleep(1000);
      room.state = RoomState.IN_GAME;
      break;
    case RoomState.IN_GAME:
      check_collisions(room.scene.lineWidth, room.scene, room.players);

      move_players(room.players);

      // once there is no players in game, we finished!
      if (
        room.players.filter((p) => p.state === PlayerState.IN_GAME).length === 0
      ) {
        room.state = RoomState.AFTER_GAME;
      }
      break;
    case RoomState.AFTER_GAME:
      // wait for 3s (cooldown)
      await sleep(3000);

      // start a new game
      room.state = RoomState.PREV_GAME;
      break;
  }
}

async function StateLoop(io: Server, room: Room) {
  // send game state to everyone
  io.to(room.room_id).emit("game:update", {
    state: room.state,
    scene: room.scene,
    players: room.players
      .filter(
        (p1: Player) =>
          p1.state === PlayerState.IN_GAME || p1.state === PlayerState.DEAD
      )
      .map((p: Player) => {
        return {
          id: p.socket.id,
          points: [...p.prevPoints, ...(p.currentPoint ?? [])].map((v) =>
            Number(v.toFixed(2))
          ),
          stroke: "green",
          state: p.state,
        };
      }),
  });
}

function StartLoop(io: Server, room: Room) {
  let running = true;

  async function loop(fn: any) {
    while (running) {
      await fn(io, room);
      await sleep(gameConfig.loopinterval);
    }
  }

  loop(GameLoop);
  loop(StateLoop);

  return () => {
    running = false;
  };
}

export { StartLoop };

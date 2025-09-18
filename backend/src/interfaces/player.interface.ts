import { Socket } from "socket.io";

enum PlayerState {
    NOT_READY = 0,
    READY = 1,
    IN_GAME = 2,
    DEAD = 3,
}

interface Player {
    socket: Socket;

    state: PlayerState;

    color: string;

    // points related
    prevPoints: number[];
    currentPoint: [number, number];

    // direction related (WASD / arrow keys)
    currentDirection: [number, number];
}

interface update_direction {
    direction: [number, number];
}

export { Player, PlayerState, update_direction };
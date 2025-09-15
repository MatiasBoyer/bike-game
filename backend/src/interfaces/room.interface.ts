import { Player } from "./player.interface";

enum RoomState {
  WAITING_FOR_PLAYERS = 0,
  PREV_GAME = 1,
  IN_GAME = 2,
  AFTER_GAME = 3,
}

interface Room {
  room_id: string;
  room_password: string;

  state: RoomState;

  players: Player[];
}

export { Room, RoomState };

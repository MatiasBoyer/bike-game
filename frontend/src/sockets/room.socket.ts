import { Socket } from "socket.io-client";
import { emit } from "../utils/socket.util";
import roomExceptions from "../exceptions/room.exceptions";

async function CreateRoom(room_password: string) {
  const ev = "room:create";
  const payload = {
    password: room_password,
  };

  const result: any = await emit(ev, { password: room_password });

  if (result.success === true) return true;
  else throw new roomExceptions.CreateRoomFailed();
}

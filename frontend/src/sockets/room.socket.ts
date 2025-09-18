import { emit } from "../utils/socket.util";
import roomExceptions from "../exceptions/room.exceptions";
import { IResponse } from "@/types/ioresponse.type";

async function CreateRoom(room_password: string) {
  const ev = "room:create";
  const payload = {
    password: room_password,
  };

  const result = (await emit(ev, payload)) as IResponse<unknown>;

  if (result.success === true) return true;
  else throw new roomExceptions.CreateRoomFailed();
}

async function JoinRoom(id: string, password: string) {
  const ev = "room:join";
  const payload = {
    id,
    password,
  };

  const result = (await emit(ev, payload)) as IResponse<unknown>;
  if (result.success === true) return true;
  else throw new roomExceptions.JoinRoomFailed();
}

async function LeaveRoom() {
  const ev = "room:leave";
  const payload = null;

  const result = (await emit(ev, payload)) as IResponse<unknown>;
  if (result.success === true) return true;
  else throw new roomExceptions.LeaveRoomFailed();
}

export { CreateRoom, JoinRoom, LeaveRoom };

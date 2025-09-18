import BaseError from "./base.exceptions";

class CreateRoomFailed extends BaseError {}
class LeaveRoomFailed extends BaseError {}
class JoinRoomFailed extends BaseError {}

const roomExceptions = { CreateRoomFailed, LeaveRoomFailed, JoinRoomFailed }

export default roomExceptions;

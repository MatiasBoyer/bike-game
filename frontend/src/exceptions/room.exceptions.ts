import BaseError from "./base.exceptions";

class CreateRoomFailed extends BaseError {}
class LeaveRoomFailed extends BaseError {}

export default { CreateRoomFailed, LeaveRoomFailed };

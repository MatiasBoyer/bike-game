import BaseError from "./base.exception";

class RoomNotFound extends BaseError {}
class PlayerNotFound extends BaseError {}

export default { RoomNotFound, PlayerNotFound };

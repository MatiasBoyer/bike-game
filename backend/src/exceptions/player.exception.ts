import BaseError from "./base.exception";

class PlayerNotFound extends BaseError {}
class NotInARoom extends BaseError {}
class CannotChangeDir extends BaseError {}

export default { PlayerNotFound, NotInARoom, CannotChangeDir };

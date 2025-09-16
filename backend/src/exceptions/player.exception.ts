import BaseError from "./base.exception";

class PlayerNotFound extends BaseError {}
class NotInARoom extends BaseError {}

export default { PlayerNotFound, NotInARoom };

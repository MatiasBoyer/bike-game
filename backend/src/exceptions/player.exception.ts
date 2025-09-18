import BaseError from "./base.exception";

class PlayerNotFound extends BaseError {}
class NotInARoom extends BaseError {}
class CannotChangeDir extends BaseError {}
class PlayerIsDead extends BaseError {}

export default { PlayerNotFound, NotInARoom, CannotChangeDir, PlayerIsDead };

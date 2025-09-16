import Joi from "joi";

const createRoom = Joi.object({
  password: Joi.string().alphanum().min(3).max(20).required(),
});

const joinRoom = Joi.object({
  id: Joi.string().alphanum().min(6).max(6).required(),
  password: Joi.string().alphanum().min(3).max(20).required(),
});

const leaveRoom = Joi.object({
  id: Joi.string().alphanum().min(6).max(6).required(),
});

export default { createRoom, joinRoom, leaveRoom };

import Joi from "joi";

const update_direction = Joi.object({
  x: Joi.number().required(),
  y: Joi.number().required(),
});

export default { update_direction };

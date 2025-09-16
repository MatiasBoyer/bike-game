import Joi from "joi";

const update_direction = Joi.object({
  direction: Joi.required(),
});

export default { update_direction };

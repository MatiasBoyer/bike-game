import Joi from "joi";

/**
 * Validates schemas and handles errors.
 *
 * @param {Joi.Schema} schema schema to validate. May be undefined.
 * @param handler Action to perform
 */
function schemaValidation<TPayload, TReturn>(
  schema: Joi.Schema | undefined,
  handler: (
    payload: TPayload | undefined,
    callback: (response: any) => void
  ) => TReturn
) {
  return (payload: any, callback: (response: any) => void) => {
    try {
      let data
      if (schema) {
        const { error, value } = schema.validate(payload);
        if (error) {
          callback?.({
            success: false,
            err: error.details.map((d: any) => d.message),
          });
          return;
        }
        data = handler(value, callback);
      } else {
        data = handler(undefined, callback);
      }
      callback?.({ success: true, data });
    } catch (err: any) {
      callback?.({ success: false, err: [err.message || err.name] });
    }
  };
}

export default schemaValidation;

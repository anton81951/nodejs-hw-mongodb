import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });

    next();
  } catch ({ message, details }) {
    console.log({ message });
    console.log({ details });

    next(
      createHttpError(
        400,
        details.map((err) => err.message).join(', '),
      ),
    );
  }
};

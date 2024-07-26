import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  console.log('Received ID:', id);

  if (isValidObjectId(id) === false) {
    return next(createHttpError(400, 'ID is not valid'));
  }

  next();
}

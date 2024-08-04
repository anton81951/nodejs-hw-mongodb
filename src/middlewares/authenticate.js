import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      return next(createHttpError(401, 'Authorization header is required'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Authorization header must be of type Bearer and include a token'));
    }

    const session = await SessionsCollection.findOne({ accessToken: token });

    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
      return next(createHttpError(401, 'Access token expired'));
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(createHttpError(500, 'Internal Server Error'));
  }
};

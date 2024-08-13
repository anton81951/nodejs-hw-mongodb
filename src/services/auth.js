import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { FIFTEEN_MINUTES, ONE_DAY, ONE_MONTH } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

import { SMTP, TEMPLATE_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';

export const registerUser = async (payload) => {
  try {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
      ...payload,
      password: encryptedPassword,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (payload) => {
  try {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) throw createHttpError(404, 'User not found');

    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) throw createHttpError(401, 'Unauthorized');

    await SessionsCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionsCollection.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const logoutUser = async (sessionId) => {
  try {
    await SessionsCollection.deleteOne({ _id: sessionId });
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
}

const createSession = () => {
  return {
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  try {
    const session = await SessionsCollection.findOne({
      _id: sessionId,
      refreshToken: refreshToken,
    });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isRefreshTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isRefreshTokenExpired) {
      throw createHttpError(401, 'Refresh token expired');
    }

    const newSession = createSession();

    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

    return await SessionsCollection.create({
      userId: session.userId,
      ...newSession,
    });
  } catch (error) {
    console.error('Error refreshing user session:', error);
    throw error;
  }
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

console.log('Reset link:', resetLink);


  const templateFile = path.join(TEMPLATE_DIR, 'reset-password-email.html');

  const templateSource = await fs.readFile(templateFile, { encoding: 'utf-8' });

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${process.env.APP_DOMAIN}/reset-pwd?token=${resetToken}`,
  });

  await sendEmail({
    from: SMTP.FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  try {
    const decoded = jwt.verify(payload.token, process.env.JWT_SECRET);

    const user = await UsersCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    await UsersCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword }
    );

    await SessionsCollection.deleteMany({ userId: user._id });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

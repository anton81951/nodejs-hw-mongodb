import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { refreshUserSession } from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';

import { ONE_MONTH } from '../constants/index.js';

export const registerUserController = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_MONTH),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_MONTH),
    });

    res.json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Error logging in user',
      error: error.message,
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error logging out user',
      error: error.message,
    });
  }
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
};

export const refreshUserSessionController = async (req, res) => {
  try {
    const session = await refreshUserSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: 'Error refreshing session',
      error: error.message,
    });
  }
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

export const resetPasswordController = async (req, res, next) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

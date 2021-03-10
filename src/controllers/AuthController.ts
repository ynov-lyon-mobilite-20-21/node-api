/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type */
import { Request, Response } from 'express';
import moment from 'moment';
import { deleteOnyBy, findOneBy, updateOneBy } from '../services/MongooseService';
import { RefreshToken, RefreshTokenModel } from '../models/RefreshTokenModel';
import { User, UserModel } from '../models/UserModel';
import {
  comparePassword,
  createActivationKey,
  createRefreshTokenForUser,
  createTokenForUser,
} from '../services/AuthService';
import { sendInactiveUserAccountExistMail } from '../services/MailService';

// [POST]
export const login = async (req: Request, res: Response) => {
  const { mail, password } = req.body;

  const user = await findOneBy<User>({ model: UserModel, condition: { mail }, hiddenPropertiesToSelect: ['password'] });
  if (!user) {
    res.status(400).json({
      error: {
        code: 'UNKNOWN_USER',
        message: 'User not found for these logins.',
      },
      data: null,
    });

    return;
  }

  if (!user.isActive) {
    const newActivationKey = createActivationKey();

    const updatedUser = await updateOneBy<User>({ model: UserModel, condition: { mail: user.mail }, update: { activationKey: newActivationKey } });

    if (!updatedUser) {
      res.status(500).json({
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An error has occurred while update user activationKey in database',
        },
        data: null,
      });

      return;
    }

    const isEmailSentSuccessfully = await sendInactiveUserAccountExistMail(updatedUser.mail, newActivationKey);

    if (!isEmailSentSuccessfully) {
      res.status(500).json({
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An error has occurred while send validation email to user.',
        },
        data: null,
      });

      return;
    }

    res.status(403).json({
      error: {
        code: 'USER_INACTIVE',
        message: 'Activation link resent.',
      },
      data: null,
    });

    return;
  }

  const userPassword = user.password || '';
  const isCorrectPassword = await comparePassword({ password, storedPassword: userPassword });
  if (!isCorrectPassword) {
    res.status(401).json({
      error: {
        code: 'BAD_CREDENTIALS',
        message: 'The password is incorrect.',
      },
      data: null,
    });

    return;
  }

  const newToken = await createTokenForUser(user);
  const newRefreshToken = await createRefreshTokenForUser(user);

  if (!newRefreshToken) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while saving the refresh token.',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: { token: newToken, refreshToken: newRefreshToken!.token },
  });
};

// [POST]
export const refreshUserToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      error: {
        code: 'REFRESH_TOKEN_REQUIRED',
        message: 'Please fill refreshToken field, this field is required.',
      },
      data: null,
    });
    return;
  }

  const refreshTokenObj = await findOneBy<RefreshToken>({ model: RefreshTokenModel, condition: { token: refreshToken } });

  if (!refreshTokenObj
    || (!refreshTokenObj.isActive || refreshTokenObj.expirationDate < moment().unix())
  ) {
    res.status(400).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Your refresh token is invalid or has expired.',
      },
      data: null,
    });

    return;
  }

  const user = await findOneBy<User>({ model: UserModel, condition: { _id: refreshTokenObj.userId } });

  if (!user) {
    res.status(404).json({
      error: {
        code: 'USER_NOT_FOUND',
        message: 'We did not foud any user attach to this refresh token.',
      },
      data: null,
    });

    return;
  }

  const newToken = await createTokenForUser(user);
  const newRefreshToken = await createRefreshTokenForUser(user);

  if (!newRefreshToken) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while saving the refresh token.',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: {
      token: newToken,
      refreshToken: newRefreshToken.token,
    },
  });
};

// [POST]
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      error: {
        code: 'REFRESH_TOKEN_REQUIRED',
        message: 'Please fill refreshToken field, this field is required.',
      },
      data: null,
    });
    return;
  }

  await deleteOnyBy<RefreshToken>({ model: RefreshTokenModel, condition: { token: refreshToken } });

  res.status(204).json();
};

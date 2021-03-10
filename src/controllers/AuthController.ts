/* eslint-disable @typescript-eslint/explicit-module-boundary-types,no-console */
/*  eslint-disable @typescript-eslint/explicit-function-return-type */

import { Request, Response } from 'express';
import moment from 'moment';
import Crypto from 'crypto';
import { deleteOnyBy, findOneBy, updateOneBy } from '../services/MongooseService';
import { RefreshToken, RefreshTokenModel } from '../models/RefreshTokenModel';
import { User, UserModel } from '../models/UserModel';
import { comparePassword, createRefreshTokenForUser, createTokenForUser } from '../services/AuthService';
import { sendRegistrationMail } from '../services/MailService';

const { CLIENT_HOSTNAME } = process.env;

export const login = async (req: Request, res: Response) => {
  const { mail, password } = req.body;

  const user = await findOneBy<User>({ model: UserModel, condition: { mail }, hiddenPropertiesToSelect: ['password'] });
  if (!user) {
    return res.status(400).json({
      error: { code: 'NO_USER', message: '' },
      data: null,
    });
  }

  if (!user.isActive) {
    res.status(403).json({
      error: { code: 'USER_INACTIVE', message: 'Activation link resent, check your email' },
      data: null,
    });

    const newActivationKey = Crypto.randomBytes(50).toString('hex');
    await updateOneBy<User>({ model: UserModel, condition: { mail: user.mail }, update: { activationKey: newActivationKey } });
    const activationLink = `${CLIENT_HOSTNAME}/users/activation?u=${user._id}&k=${user.activationKey}`;
    await sendRegistrationMail(user.mail, activationLink);

    return;
  }

  const passwordIsCorrect = await comparePassword({ password, storedPassword: user.password! });
  if (!passwordIsCorrect) {
    return res.status(401).json({
      error: { code: 'BAD_CREDENTIALS', message: '' },
      data: null,
    });
  }

  const newToken = await createTokenForUser(user);
  const newRefreshToken = await createRefreshTokenForUser(user);

  res.status(200).json({
    error: null,
    data: { token: newToken, refreshToken: newRefreshToken!.token },
  });
};

export const refreshUserToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const refreshTokenObj = await findOneBy<RefreshToken>({ model: RefreshTokenModel, condition: { token: refreshToken } });

  if (
    !refreshTokenObj
        || !refreshTokenObj!.isActive
        || refreshTokenObj!.expirationDate < moment().unix()
  ) {
    return res.status(400).json({
      error: { code: 'INVALID_TOKEN', message: '' },
      data: null,
    });
  }

  const user = await findOneBy<User>({ model: UserModel, condition: { _id: refreshTokenObj.userId } });

  if (!user) {
    return res.status(404).json({
      error: { code: 'USER_DOESNT_EXIST', message: '' },
      data: null,
    });
  }

  const newToken = await createTokenForUser(user);
  const newRefreshToken = await createRefreshTokenForUser(user);

  res.status(200).json({
    error: null,
    data: { token: newToken, refreshToken: newRefreshToken!.token },
  });
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const deletionResult = await deleteOnyBy<RefreshToken>({ model: RefreshTokenModel, condition: { token: refreshToken } });

  if (!deletionResult) {
    res.status(200).json({
      error: null,
      data: {
        message: 'You can close your browser',
      },
    });
  } else {
    console.log('[ERROR] impossible to delete refresh token');
    console.log(deletionResult);
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'impossible to delete refresh token',
      },
      data: null,
    });
  }
};

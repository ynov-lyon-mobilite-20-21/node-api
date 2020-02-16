/*  eslint-disable @typescript-eslint/explicit-function-return-type */

import { Request, Response } from 'express';
import { findOneBy } from '../Services/MongooseService';
import { RefreshToken, RefreshTokenModel } from '../Models/RefreshTokenModel';
import { User, UserModel } from '../Models/UserModel';
import { createRefreshToken, createToken } from '../Services/UserService';

export const userAuthentication = async (req: Request, res: Response) => {
  const { mail, password } = req.body;

  const user = await findOneBy<User>({ model: UserModel, condition: { mail }, hiddenPropertiesToSelect: ['password'] });

  if (!user || !user.active || user.password !== password) {
    return res.status(404).json({ code: 'UNDEFINED_USER' });
  }

  const newToken = await createToken(user);
  const newRefreshToken = await createRefreshToken(user);

  res.status(200).json({ token: newToken, refreshToken: newRefreshToken.token });
};

export const refreshUserToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const refreshTokenObj = await findOneBy<RefreshToken>({ model: RefreshTokenModel, condition: { token: refreshToken } });

  if (
    !refreshTokenObj
        || !refreshTokenObj!.active
        || refreshTokenObj!.expirationDate < Date.now()
  ) {
    return res.status(401).json({ code: 'CANT_REFRESH_TOKEN' });
  }

  const user = await findOneBy<User>({ model: UserModel, condition: { _id: refreshTokenObj.userId } });

  if (!user) {
    return res.status(404).json({ code: 'USER_DOESNT_EXIST' });
  }

  const newToken = await createToken(user);
  const newRefreshToken = await createRefreshToken(user);

  res.status(200).json({ token: newToken, refreshToken: newRefreshToken.token });
};

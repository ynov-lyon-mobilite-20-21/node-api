import jwt from 'jsonwebtoken';
import bCrypt from 'bcrypt';
import cryptoJs from 'crypto-js';
import moment from 'moment';
import { Response, Request, NextFunction } from 'express';
import { User, UserModel } from '../models/UserModel';
import { RefreshToken, RefreshTokenModel } from '../models/RefreshTokenModel';
import { findOneBy, saveData } from './MongooseService';

const { SECRET_KEY, JWT_TOKEN_EXPIRATION_TIME } = process.env;

export const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 15;
  return bCrypt.hash(password, saltRounds);
};

export const comparePassword = async ({ password, storagePassword }: { password: string; storagePassword: string }): Promise<boolean> =>
  bCrypt.compare(password, storagePassword);

export const createToken = ({ _id }: User): string =>
  jwt.sign({ _id }, SECRET_KEY!, { expiresIn: Number(JWT_TOKEN_EXPIRATION_TIME) });

export const createRefreshToken = async ({ _id }: User): Promise<RefreshToken> => {
  const expirationDate = moment().add(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME, 'seconds').unix();
  const token = cryptoJs.SHA256(`${_id}.${moment().unix()}.${expirationDate}`).toString();

  return saveData<RefreshToken>({
    model: RefreshTokenModel,
    params: {
      token,
      expirationDate,
      userId: _id,
    },
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send();
    return;
  }

  const bearer = authorization.replace(/^Bearer\s/, '');
  jwt.verify(bearer, SECRET_KEY!!, async (err, decoded) => {
    if (err || !decoded) {
      res.status(401).json({ code: 'INVALID_TOKEN' });
      return;
    }

    // @ts-ignore
    const { _id } = decoded;

    const user = await findOneBy<User>({
      model: UserModel,
      condition: { _id },
      hiddenPropertiesToSelect: ['stripeId'],
    });

    if (!user) {
      res.status(401).json({ code: 'INVALID_TOKEN' });
      return;
    }

    // @ts-ignore
    req.user = user;
    next();
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const { _id } = req.user as User;
  const user = await findOneBy<User>({ model: UserModel, condition: { _id } });

  if (!user?.isAdmin) {
    return res.status(401).json({ code: 'UNAUTHORIZED_ACTION' });
  }

  next();
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const userInParamsIsCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  // @ts-ignore
  const { _id, isAdmin: userIsAdmin } = req.user as User;

  if (userIsAdmin) {
    next();
    return;
  }

  if (String(userId) !== String(_id)) {
    return res.status(401).json({ code: 'UNAUTHORIZED_ACTION' });
  }

  next();
};

export const userMiddlewares = {
  isAuthenticated,
  isAdmin,
  userInParamsIsCurrentUser,
};

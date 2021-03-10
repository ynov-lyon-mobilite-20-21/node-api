/* eslint-disable @typescript-eslint/explicit-function-return-type */
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import bCrypt from 'bcrypt';
import moment from 'moment';
import cryptoJs from 'crypto-js';
import Crypto from 'crypto';
import { User, UserModel } from '../models/UserModel';
import { findOneBy, saveData } from './MongooseService';
import { JWTToken } from '../Interfaces/Token';
import { APIRequest } from '../Interfaces/APIRequest';
import { RefreshToken, RefreshTokenModel } from '../models/RefreshTokenModel';

const { SECRET_KEY, JWT_TOKEN_EXPIRATION_TIME } = process.env;
const saltRounds = 15;

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const request = req as APIRequest;
  const { authorization } = request.headers;

  if (!authorization) {
    res.status(401).send({
      error: {
        code: 'MISSING_AUTHORIZATION_HEADER',
        message: 'If you are trying to access a protected route, you must be authenticated to access it.'
      + 'The authorization header is missing.',
      },
      data: null,
    });
    return;
  }

  const userToken = authorization.replace(/^Bearer\s/, '');

  if (!userToken) {
    res.status(401).send({
      error: {
        code: 'MISSING_TOKEN',
        message:
      'If you are trying to access a protected route, you must be authenticated to access it.'
      + 'The token is missing in authorization header.',
      },
      data: null,
    });
    return;
  }

  // TODO: check JWT implementation (SECRET KEY. A logged out user can use his token for a long time)
  const { _id } = await jwt.verify(userToken, SECRET_KEY!) as JWTToken;

  if (!_id) {
    res.status(401).send({
      error: {
        code: 'INVALID_TOKEN',
        message:
      'If you are trying to access a protected route, you must be authenticated to access it.'
      + "We couldn't validate your token. Maybe is expired.",
      },
      data: null,
    });
    return;
  }

  const user = await findOneBy<User>({
    model: UserModel,
    condition: { _id },
    hiddenPropertiesToSelect: ['stripeId', 'stripeSourceId'],
  });

  if (!user) {
    res.status(401).send({
      error: {
        code: 'INVALID_TOKEN',
        message:
      'If you are trying to access to a protected route, you must be authenticated to access it.'
      + "We couldn't find a currentUser attach to this token. Maybe this token isn't valid anymore.",
      },
      data: null,
    });
    return;
  }

  request.currentUserId = _id;
  request.currentUser = user;

  next();
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const request = req as APIRequest;
  if (!request.currentUser.isAdmin) {
    res.status(403).json({
      error: {
        code: 'UNAUTHORIZED_ACTION',
        message:
      "You're trying to access to a protected route without enough permissions. Please contact administrator.",
      },
      data: null,
    });
    return;
  }

  next();
};

export const authMiddlewares = {
  isAuthenticated,
  isAdmin,
};

export async function encryptPassword(password: string): Promise<string> {
  return bCrypt.hash(password, saltRounds);
}

export async function comparePassword({ password, storedPassword }: { password: string; storedPassword: string }): Promise<boolean> {
  return bCrypt.compare(password, storedPassword);
}

export async function createTokenForUser({ _id }: User): Promise<string> {
  return jwt.sign({ _id }, SECRET_KEY!, { expiresIn: Number(JWT_TOKEN_EXPIRATION_TIME) });
}

export async function createRefreshTokenForUser({ _id }: User): Promise<RefreshToken | null> {
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
}

export function createActivationKey(): string {
  return Crypto.randomBytes(50).toString('hex');
}

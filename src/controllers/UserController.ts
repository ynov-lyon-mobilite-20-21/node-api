/*  eslint-disable @typescript-eslint/explicit-function-return-type */

import { Response, Request } from 'express';
import Crypto from 'crypto';
import moment from 'moment';
import {
  findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { User, UserModel } from '../models/UserModel';
import { sendRegistrationMail } from '../services/MailService';
import { encryptPassword } from '../services/UserService';

const { CLIENT_HOSTNAME } = process.env;

export const postUser = async (req: Request, res: Response) => {
  const { mail } = req.body;

  if (!mail) {
    return res.status(400).json({
      data: {},
      error: { code: 'EMAIL_REQUIRED' },
    });
  }

  const userInDb = await findOneBy<User>({ model: UserModel, condition: { mail } });

  if (userInDb && userInDb.active) {
    return res.status(400).json({
      data: {},
      error: { code: 'MAIL_ALREADY_USED' },
    });
  } if (userInDb) {
    const activationLink = `${CLIENT_HOSTNAME}/users/activation?u=${userInDb._id}&k=${userInDb.activationKey}`;

    const mailIsSent = await sendRegistrationMail(userInDb.mail, activationLink);

    return res.status(200).json({
      data: { mailIsSent, userExist: true },
      error: {},
    });
  }

  const activationKey = Crypto.randomBytes(50).toString('hex');

  const user = await saveData<User>({ model: UserModel, params: { activationKey, mail, active: false } });

  if (!user) {
    return res.status(400).json({
      data: {},
      error: { code: 'UNKNOWN_ERROR' },
    });
  }

  res.status(200).json({
    data: user,
    error: {},
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await findManyBy<User>({ model: UserModel, condition: {} });

  res.status(200).json({
    data: users,
    error: {},
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await findOneBy<User>({ model: UserModel, condition: { _id: id } });

  if (!user) {
    return res.status(200).json({
      data: {},
      error: { code: 'CANNOT_GET_USER' },
    });
  }

  res.status(200).json({
    data: user,
    error: {},
  });
};

export const getMe = async (req: Request, res: Response) => {
  // @ts-ignore
  const { _id } = req.user as User;
  const user = await findOneBy<User>({ model: UserModel, condition: { _id } });

  res.status(200).json({
    data: user,
    error: {},
  });
};

export const userActivation = async (req: Request, res: Response) => {
  const { userId, activationKey, password } = req.body;

  const user = await findOneBy<User>({ model: UserModel, condition: { _id: userId } });

  if (!user || user.active || user.activationKey !== activationKey) {
    return res.status(400).json({
      data: {},
      error: { code: 'UNKNOWN_ERROR' },
    });
  }

  // const { id: stripeId } = await stripe.customers.create({ email: user.mail })

  const encryptedPassword = await encryptPassword(password);
  updateOneBy<User>({
    model: UserModel,
    condition: { _id: userId },
    set: {
      password: encryptedPassword,
      active: true,
      activationKey: null,
      registrationDate: moment().unix(),
    // stripeId,
    },
  });

  res.status(204).send();
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const userUpdate = await updateOneBy<User>({
    model: UserModel,
    condition: { _id: userId },
    set: {
      ...req.body,
    },
  });

  if (!userUpdate) {
    return res.status(400).json({
      data: {},
      error: { code: 'CANNOT_UPDATE_USER' },
    });
  }

  res.status(204).send();
};
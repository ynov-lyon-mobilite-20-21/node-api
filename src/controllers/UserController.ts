/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import Crypto from 'crypto';
import moment from 'moment';
import {
  deleteOnyBy,
  findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { User, UserModel } from '../models/UserModel';
import { sendRegistrationMail } from '../services/MailService';
import { encryptPassword } from '../services/UserService';
import { createStripeCustomer } from '../services/StripeService';

const { CLIENT_HOSTNAME } = process.env;

export const postUser = async (req: Request, res: Response): Promise<void> => {
  const { mail } = req.body;

  if (!mail) {
    res.status(400).json({
      data: {},
      error: { code: 'EMAIL_REQUIRED' },
    });

    return;
  }

  let user = await findOneBy<User>({ model: UserModel, condition: { mail } });

  if (user && user.active) {
    res.status(400).json({
      data: {},
      error: { code: 'USER_EXISTS' },
    });

    return;
  }

  if (!user) {
    const activationKey = Crypto.randomBytes(50).toString('hex');

    user = await saveData<User>({ model: UserModel, params: { activationKey, mail, active: false } });
  }

  const activationLink = `${CLIENT_HOSTNAME}/users/activation?u=${user._id}&k=${user.activationKey}`;
  await sendRegistrationMail(user.mail, activationLink);

  if (!user) {
    res.status(400).json({
      data: {},
      error: { code: 'UNKNOWN_ERROR' },
    });

    return;
  }

  res.status(204).json();
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await findManyBy<User>({ model: UserModel, condition: {} });

  res.status(200).json({
    data: users,
    error: {},
  });
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await findOneBy<User>({ model: UserModel, condition: { _id: id } });

  if (!user) {
    res.status(200).json({
      data: {},
      error: { code: 'CANNOT_GET_USER' },
    });

    return;
  }

  res.status(200).json({
    data: user,
    error: {},
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { _id } = req.user as User;
  const user = await findOneBy<User>({ model: UserModel, condition: { _id } });

  res.status(200).json({
    data: user,
    error: {},
  });
};

export const userActivation = async (req: Request, res: Response): Promise<void> => {
  const { userId, activationKey, password } = req.body;

  const user = await findOneBy<User>({ model: UserModel, condition: { _id: userId } });

  if (!user || user.active || user.activationKey !== activationKey) {
    res.status(400).json({
      data: {},
      error: { code: 'UNKNOWN_ERROR' },
    });

    return;
  }

  // const customer = await createStripeCustomer(user);
  //
  // if (!customer) {
  //   // TODO GERER L'ERREUR
  //   return;
  // }

  // @ts-ignore
  // const { id } = customer;
  // const stripeId = id;
  const stripeId = null;

  const encryptedPassword = await encryptPassword(password);

  await updateOneBy<User>({
    model: UserModel,
    condition: { _id: userId },
    set: {
      password: encryptedPassword,
      active: true,
      activationKey: null,
      registrationDate: moment().unix(),
      stripeId,
    },
  });

  res.status(204).send();
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const userUpdate = await updateOneBy<User>({
    model: UserModel,
    condition: { _id: userId },
    set: {
      ...req.body,
    },
  });

  if (!userUpdate) {
    res.status(400).json({
      data: {},
      error: { code: 'CANNOT_UPDATE_USER' },
    });

    return;
  }

  res.status(204).send();
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const deletion = await deleteOnyBy({ model: UserModel, condition: { _id: userId } });

  if (!deletion) {
    res.status(400).json({
      data: {},
      errors: { code: 'CANT_DELETE_USER' },
    });
  }

  res.status(204).send();
};

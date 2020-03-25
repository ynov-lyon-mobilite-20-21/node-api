import { Request, Response } from 'express';
import Crypto from 'crypto';
import moment from 'moment';
import {
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

  const userInDb = await findOneBy<User>({ model: UserModel, condition: { mail } });

  if (userInDb && userInDb.active) {
    res.status(400).json({
      data: {},
      error: { code: 'MAIL_ALREADY_USED' },
    });

    return;
  } if (userInDb) {
    const activationLink = `${CLIENT_HOSTNAME}/users/activation?u=${userInDb._id}&k=${userInDb.activationKey}`;

    const mailIsSent = await sendRegistrationMail(userInDb.mail, activationLink);

    res.status(200).json({
      data: { mailIsSent, userExist: true },
      error: {},
    });

    return;
  }

  const activationKey = Crypto.randomBytes(50).toString('hex');

  const user = await saveData<User>({ model: UserModel, params: { activationKey, mail, active: false } });

  if (!user) {
    res.status(400).json({
      data: {},
      error: { code: 'UNKNOWN_ERROR' },
    });

    return;
  }

  res.status(200).json({
    data: user,
    error: {},
  });
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

  const customer = createStripeCustomer(user);

  if (!customer) {
    // TODO GERER L'ERREUR
    return;
  }

  // @ts-ignore
  const { id } = customer;
  const stripeId = id;

  const encryptedPassword = await encryptPassword(password);

  updateOneBy<User>({
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

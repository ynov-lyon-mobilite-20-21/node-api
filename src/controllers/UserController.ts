/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import moment from 'moment';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { User, UserModel } from '../models/UserModel';
import { sendInactiveUserAccountExistMail, sendRegistrationMail } from '../services/MailService';
import { createActivationKey, encryptPassword } from '../services/AuthService';
import { createStripeCustomer } from '../services/StripeService';
import { APIRequest } from '../Interfaces/APIRequest';

export const postUser = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line guard-for-in
  for (const jsonParamKey in req.body) {
    switch (jsonParamKey) {
      case 'mail':
      case 'password':
      case 'firstName':
      case 'lastName':
      case 'promotion':
      case 'formation':
        // eslint-disable-next-line no-continue
        continue;

      default:
        res.status(400).json({
          data: {},
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'mail, password, firstName, lastName, promotion, formation',
          },
        });
        return;
    }
  }

  const {
    mail, password, firstName, lastName, promotion, formation,
  } = req.body;

  if (!mail) {
    res.status(400).json({
      data: {},
      error: {
        code: 'EMAIL_REQUIRED',
        message: 'Please fill email field, this field is required.',
      },
    });
    return;
  }

  if (!password) {
    res.status(400).json({
      data: {},
      error: {
        code: 'PASSWORD_REQUIRED',
        message: 'Please fill password field, this field is required.',
      },
    });

    return;
  }

  if (!firstName) {
    res.status(400).json({
      data: {},
      error: {
        code: 'FIRSTNAME_REQUIRED',
        message: 'Please fill firstname field, this field is required.',
      },
    });

    return;
  }

  if (!lastName) {
    res.status(400).json({
      data: {},
      error: {
        code: 'LASTNAME_REQUIRED',
        message: 'Please fill lastname field, this field is required.',
      },
    });

    return;
  }

  if (!promotion) {
    res.status(400).json({
      data: {},
      error: {
        code: 'PROMOTION_REQUIRED',
        message: 'Please fill promotion field, this field is required.',
      },
    });

    return;
  }

  if (!formation) {
    res.status(400).json({
      data: {},
      error: {
        code: 'FORMATION_REQUIRED',
        message: 'Please fill formation field, this field is required.',
      },
    });

    return;
  }

  let user = await findOneBy<User>({ model: UserModel, condition: { mail } });

  if (user && !user.isActive) {
    const newActivationKey = createActivationKey();

    await updateOneBy<User>({
      model: UserModel,
      condition: {
        mail: user.mail,
      },
      set: {
        activationKey: newActivationKey,
      },
    });

    const isEmailSentSuccessfully = await sendInactiveUserAccountExistMail(user.mail, newActivationKey);

    if (!isEmailSentSuccessfully) {
      console.log(isEmailSentSuccessfully);
      res.status(500).json({
        data: {},
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An error has occurred while send validation email to user.',
        },
      });

      return;
    }

    res.status(400).json({
      data: {},
      error: {
        code: 'USER_INACTIVE',
        message: 'Your account already exist but as inactive. A new activation link is send again to you, check your email.',
      },
    });
    return;
  }

  if (user && user.isActive) {
    res.status(400).json({
      data: {},
      error: {
        code: 'USER_ALREADY_EXISTS',
        message: 'Your account is already exist and activated. Please login.',
      },
    });

    return;
  }

  if (user) {
    res.status(400).json({
      data: {},
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Your account seems to already exist but not activated or inactive. Your account is possibly corrupted or banned Please contact the administrator.',
      },
    });

    return;
  }

  const activationKey = createActivationKey();
  const encryptedPassword = await encryptPassword(password);

  const isEmailSentSuccessfully = await sendRegistrationMail(mail, activationKey);

  if (!isEmailSentSuccessfully) {
    res.status(500).json({
      data: {},
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while send validation email to user.',
      },
    });

    return;
  }

  user = await saveData<User>({
    model: UserModel,
    params: {
      mail,
      password: encryptedPassword,
      firstName,
      lastName,
      promotion,
      formation,
      activationKey,
    },
  });

  if (!user) {
    res.status(500).json({
      data: {},
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while user creation in database',
      },
    });

    return;
  }

  res.status(200).json({
    data: user,
  });
};

export const userActivation = async (req: Request, res: Response): Promise<void> => {
  const { activationKey } = req.params;

  if (!activationKey) {
    res.status(400).json({
      data: {},
      error: {
        code: 'ACTIVATION_KEY_REQUIRED',
        message: 'The activation key is missing. Please check your link.',
      },
    });

    return;
  }

  const user = await findOneBy<User>({ model: UserModel, condition: { activationKey } });

  if (!user) {
    res.status(400).json({
      data: {},
      error: {
        code: 'INVALID_ACTIVATION_KEY',
        message: 'No user found with this activation key.',
      },
    });

    return;
  }

  if (user.stripeId) {
    res.status(400).json({
      data: {},
      error: {
        code: 'ACCOUNT_ALREADY_ACTIVATED',
        message: 'Your user is already active.',
      },
    });

    return;
  }

  const stripeCustomer = await createStripeCustomer(user);

  if (!stripeCustomer) {
    res.status(500).json({
      data: {},
      error: {
        code: 'UNKNOWN_STRIPE_ERROR',
        message: 'An error has occurs while creating your account on stripe.',
      },
    });

    return;
  }

  const { id: stripeId } = stripeCustomer;

  await updateOneBy<User>({
    model: UserModel,
    condition: { _id: user._id },
    set: {
      isActive: true,
      activationKey: null,
      registrationDate: moment().unix(),
      stripeId,
    },
  });

  res.redirect('https://via.placeholder.com/414x736?text=Application+redirection'); // TODO: update redirection
};

// Protected : isAuthenticated
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;

  const user = await findOneBy<User>({ model: UserModel, condition: { _id: request.userId } });

  res.status(200).json({
    data: user,
    error: {},
  });
};

// Protected : isAuthenticated + isAdmin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await findManyBy<User>({ model: UserModel, condition: {} });

  res.status(200).json({
    data: users,
    error: {},
  });
};

// Protected : isAuthenticated + isAdmin
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await findOneBy<User>({ model: UserModel, condition: { _id: id } });

  if (!user) {
    res.status(400).json({
      data: {},
      error: {
        code: 'UNKNOWN_USER',
        message: 'We did not find a user for this ID.',
      },
    });
    return;
  }

  res.status(200).json({
    data: user,
    error: {},
  });
};

// Protected : isAuthenticated
export const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;

  // eslint-disable-next-line guard-for-in
  for (const jsonParamKey in req.body) {
    switch (jsonParamKey) {
      case 'mail':
      case 'password':
      case 'firstName':
      case 'lastName':
      case 'promotion':
      case 'formation':
        // eslint-disable-next-line no-continue
        continue;

      default:
        res.status(400).json({
          data: {},
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'mail, password, firstName, lastName, promotion, formation',
          },
        });
        return;
    }
  }

  const updatedUser = await updateOneBy<User>({
    model: UserModel,
    condition: { _id: request.userId },
    set: {
      ...req.body,
    },
  });

  if (!updatedUser) {
    res.status(500).json({
      data: {},
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error has occurs while updating the user.',
      },
    });
    return;
  }

  res.status(200).json({
    data: updatedUser,
    error: {},
  });
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

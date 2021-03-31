/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import {
  deleteManyBy, deleteOnyBy, findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { User, UserModel } from '../models/UserModel';
import { sendInactiveUserAccountExistMail, sendRegistrationMail } from '../services/MailService';
import { createActivationKey, encryptPassword } from '../services/AuthService';
import { createStripeCustomer } from '../services/StripeService';
import { APIRequest } from '../Interfaces/APIRequest';
import { RefreshTokenModel } from '../models/RefreshTokenModel';

const { NODE_ENV } = process.env;

// [POST]
export const createNewUser = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
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
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'mail, password, firstName, lastName, promotion, formation',
          },
          data: null,
        });
        return;
    }
  }

  const {
    mail, password, firstName, lastName, promotion, formation,
  } = req.body;

  if (!mail) {
    res.status(400).json({
      error: {
        code: 'EMAIL_REQUIRED',
        message: 'Please fill email field, this field is required.',
      },
      data: null,
    });
    return;
  }
  // TODO: add email domain validation

  if (!password) {
    res.status(400).json({
      error: {
        code: 'PASSWORD_REQUIRED',
        message: 'Please fill password field, this field is required.',
      },
      data: null,
    });

    return;
  }
  // TODO: add password strength validation

  if (!firstName) {
    res.status(400).json({
      error: {
        code: 'FIRSTNAME_REQUIRED',
        message: 'Please fill firstname field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!lastName) {
    res.status(400).json({
      error: {
        code: 'LASTNAME_REQUIRED',
        message: 'Please fill lastname field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!promotion) {
    res.status(400).json({
      error: {
        code: 'PROMOTION_REQUIRED',
        message: 'Please fill promotion field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!formation) {
    res.status(400).json({
      error: {
        code: 'FORMATION_REQUIRED',
        message: 'Please fill formation field, this field is required.',
      },
      data: null,
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
      update: {
        activationKey: newActivationKey,
      },
    });

    const isEmailSentSuccessfully = await sendInactiveUserAccountExistMail(user.mail, newActivationKey);

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

    res.status(400).json({
      error: {
        code: 'USER_INACTIVE',
        message: 'Your account already exist but as inactive. A new activation link is send again to you, check your email.',
      },
      data: null,
    });
    return;
  }

  if (user && user.isActive) {
    res.status(400).json({
      error: {
        code: 'USER_ALREADY_EXISTS',
        message: 'Your account is already exist and activated. Please login.',
      },
      data: null,
    });

    return;
  }

  if (user) {
    res.status(400).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Your account seems to already exist but not activated or inactive. Your account is possibly corrupted or banned Please contact the administrator.',
      },
      data: null,
    });

    return;
  }

  const activationKey = createActivationKey();

  const isEmailSentSuccessfully = await sendRegistrationMail(mail, activationKey);

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

  const encryptedPassword = await encryptPassword(password);

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
      isActive: NODE_ENV === 'DEV',
    },
  });

  if (!user) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while user creation in database',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: user,
  });
};

// [GET]
// TODO: replace errors by request params to pass to applications
export const activateUser = async (req: Request, res: Response): Promise<void> => {
  const { activationKey } = req.params;

  if (!activationKey) {
    res.status(400).json({
      error: {
        code: 'ACTIVATION_KEY_REQUIRED',
        message: 'The activation key is missing. Please check your link.',
      },
      data: null,
    });

    return;
  }

  const user = await findOneBy<User>({ model: UserModel, condition: { activationKey } });

  if (!user) {
    res.status(400).json({
      error: {
        code: 'INVALID_ACTIVATION_KEY',
        message: 'No user found with this activation key.',
      },
      data: null,
    });

    return;
  }

  if (user.stripeId) {
    res.status(400).json({
      error: {
        code: 'ACCOUNT_ALREADY_ACTIVATED',
        message: 'Your user is already active.',
      },
      data: null,
    });

    return;
  }

  const stripeCustomer = await createStripeCustomer(user);

  if (!stripeCustomer) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_STRIPE_ERROR',
        message: 'An error has occurs while creating your account on stripe.',
      },
      data: null,
    });

    return;
  }

  const { id: stripeId } = stripeCustomer;

  const currentDate = new Date();

  const updatedUser = await updateOneBy<User>({
    model: UserModel,
    condition: { _id: user._id },
    update: {
      isActive: true,
      activationKey: null,
      validationDate: currentDate,
      stripeId,
    },
  });

  if (!updatedUser) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurs while updating your account to save user stripe id.',
      },
      data: null,
    });

    return;
  }

  res.redirect(`${process.env.ENDPOINT_APP}`); // TODO: update redirection
};

// [GET] Protected : isAuthenticated
export const getCurrentUserInfos = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;

  const user = await findOneBy<User>({ model: UserModel, condition: { _id: request.currentUserId } });

  res.status(200).json({
    error: null,
    data: user,
  });
};

// [GET] Protected : isAuthenticated + isAdmin
export const getUsersInfos = async (req: Request, res: Response): Promise<void> => {
  const users = await findManyBy<User>({
    model: UserModel,
    condition: {},
    hiddenPropertiesToSelect: ['registrationDate', 'validationDate'],
  });

  res.status(200).json({
    error: null,
    data: users,
  });
};

// [GET] Protected : isAuthenticated + isAdmin
export const getUserInfosById = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = req.params;

  if (!userId) {
    res.status(404).json({
      error: {
        code: 'USER_ID_REQUIRED',
        message: 'Please give the userId in URL parameters. This is required.',
      },
      data: null,
    });

    return;
  }

  const user = await findOneBy<User>({
    model: UserModel,
    condition: { _id: userId },
    hiddenPropertiesToSelect: ['registrationDate', 'validationDate'],
  });

  if (!user) {
    res.status(404).json({
      error: {
        code: 'UNKNOWN_USER',
        message: 'We did not find a user for this ID.',
      },
      data: null,
    });
    return;
  }

  res.status(200).json({
    error: null,
    data: user,
  });
};

// [PUT] Protected : isAuthenticated
export const updateCurrentUserInfos = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
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
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'mail, password, firstName, lastName, promotion, formation',
          },
          data: null,
        });
        return;
    }
  }

  // TODO: add check to unchanged properties
  // TODO: add email validation on update

  if (req.body.password) {
    // TODO: add password strength validation
    req.body.password = await encryptPassword(req.body.password);
  }

  const updatedUser = await updateOneBy<User>({
    model: UserModel,
    condition: { _id: request.currentUserId },
    update: {
      ...req.body,
    },
  });

  if (!updatedUser) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error has occurs while updating the user.',
      },
      data: null,
    });
    return;
  }

  res.status(200).json({
    error: null,
    data: updatedUser,
  });
};

// [PUT] Protected : isAuthenticated + isAdmin
export const updateUserInfosById = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
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
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'mail, password, firstName, lastName, promotion, formation',
          },
          data: null,
        });
        return;
    }
  }

  // TODO: add check to unchanged properties
  // TODO: add email validation on update

  const updatedUser = await updateOneBy<User>({
    model: UserModel,
    condition: { _id: userId },
    update: {
      ...req.body,
    },
  });

  if (!updatedUser) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error has occurs while updating the user.',
      },
      data: null,
    });
    return;
  }

  res.status(200).json({
    error: null,
    data: updatedUser,
  });
};

// [DELETE] Protected: isAuthenticated
export const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;

  const deletedUser = await deleteOnyBy({ model: UserModel, condition: { _id: request.currentUserId } });

  if (!deletedUser) {
    res.status(500).json({
      data: null,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error has occurs while deleting the user.',
      },
    });
    return;
  }

  await deleteManyBy({ model: RefreshTokenModel, condition: { userId: request.currentUserId } });

  // TODO: delete also user tickets

  res.status(204).send();
};

// [DELETE] Protected: isAuthenticated + isAdmin
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const deletedUser = await deleteOnyBy({ model: UserModel, condition: { _id: userId } });

  if (!deletedUser) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error has occurs while deleting the user.',
      },
      data: null,
    });
    return;
  }

  await deleteManyBy({ model: RefreshTokenModel, condition: { userId } });

  // TODO: delete also user tickets

  res.status(204).send();
};

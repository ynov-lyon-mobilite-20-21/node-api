import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { linkCardToCustomer } from '../services/StripeService';

export const linkUserCard = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { stripeId } = req.user as User;
  const { stripeToken } = req.body;

  if (!stripeId) {
    // eslint-disable-next-line no-throw-literal
    throw 'UNKNOWN_STRIPE_ID';
  }

  const linkingCardRequest = await linkCardToCustomer(stripeId, stripeToken);

  if (!linkingCardRequest) {
    res.status(400).send({
      errors: { code: 'UNKNOWN_ERROR' },
      data: {},
    });

    return;
  }

  res.status(204).send();
};

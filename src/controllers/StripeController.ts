import { Request, Response } from 'express';
import Stripe from 'stripe';
import { User } from '../models/UserModel';


const { STRIPE_API_KEY } = process.env;
const stripe = new Stripe(STRIPE_API_KEY!, { apiVersion: '2020-03-02' });


export const linkUserCard = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { stripeId } = req.user as User;

  try {
    if (!stripeId) {
      // eslint-disable-next-line no-throw-literal
      throw 'UNKNOWN_STRIPE_ID';
    }

    await stripe.customers.createSource(stripeId, {
      source: req.body.stripeToken,
    });

    res.status(204).send();
  } catch (e) {
    res.status(400).send({
      errors: {},
      data: {},
    });
  }
};

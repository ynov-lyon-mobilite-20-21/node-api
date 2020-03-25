import { Request, Response } from 'express';
import Stripe from 'stripe';
import { User } from '../models/UserModel';


const { STRIPE_API_KEY } = process.env;
const stripe = new Stripe(STRIPE_API_KEY!, { apiVersion: '2020-03-02' });


export const linkUserCard = async (req: Request, res: Response): Promise<boolean> => {

  console.log(req.body);
  // @ts-ignore
  const { stripeId } = req.user as User;
  if (!stripeId) {
    // eslint-disable-next-line no-console
    console.log('UNKNOWN_STRIPE_ID');
  }
  try {
    await stripe.customers.createSource(stripeId, {
      source: req.body.stripeToken,
    });
    res.status(204).send();
  } catch (e) {
    return false;
  }
};

import Stripe from 'stripe';
import { User } from '../models/UserModel';

const { STRIPE_API_KEY } = process.env;
const stripe = new Stripe(STRIPE_API_KEY!, { apiVersion: '2020-03-02' });

export const createStripeCustomer = async (user: User): Promise<Stripe.Customer | null> => {
  try {
    return await stripe.customers.create({
      email: user.mail,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

export const linkCardToCustomer = async (stripeCustomerId: string, stripeToken: string): Promise<boolean | null> => {
  try {
    await stripe.customers.createSource(stripeCustomerId, {
      source: stripeToken,
    });
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

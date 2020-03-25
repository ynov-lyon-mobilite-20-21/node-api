/*  eslint-disable @typescript-eslint/camelcase   */

import Stripe from 'stripe';
import { User, UserModel } from '../models/UserModel';
import { saveData, updateOneBy } from './MongooseService';
import {BasketItem, Payment, PaymentModel} from '../models/PaymentModel';

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

export const linkCardToCustomer = async (stripeCustomerId: string, stripeToken: string): Promise<boolean> => {
  try {
    const { id: sourceId } = await stripe.customers.createSource(stripeCustomerId, {
      source: stripeToken,
    });

    await updateOneBy<User>({
      condition: { stripeId: stripeCustomerId },
      set: { stripeSourceId: sourceId },
      model: UserModel,
    });

    return true;
  } catch (e) {
    console.log(e);
    // eslint-disable-next-line no-console
    return false;
  }
};

export const createPaymentIntent = async (stripeCustomerId: string, stripeSourceId: string, basket: BasketItem[], amount: number): Promise<Stripe.PaymentIntent | null> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      customer: stripeCustomerId,
      currency: 'eur',
      use_stripe_sdk: true,
    });

    await saveData<Payment>({
      model: PaymentModel,
      params: {
        stripeId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        basket,
      },
    });

    return paymentIntent;
  } catch (e) {
    console.log(e);
    return null;
  }
};

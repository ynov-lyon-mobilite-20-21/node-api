/*  eslint-disable @typescript-eslint/camelcase   */

import Stripe from 'stripe';


import { User } from '../models/UserModel';
import { findManyBy, saveData } from './MongooseService';
import { BasketItem, Payment, PaymentModel } from '../models/PaymentModel';
import { Card, CardModel } from '../models/CardtModel';

const { STRIPE_API_KEY, CLIENT_HOSTNAME } = process.env;
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

export const linkCardToCustomer = async (user: User, stripeToken: string): Promise<object | boolean> => {
  try {
    const cards = await findManyBy<Card>({ model: CardModel, condition: { userId: user._id } });

    const {
      id: sourceId, exp_month: expMonth, exp_year: expYear, last4, name, brand,
    } = await stripe.customers.createSource(user.stripeId, {
      source: stripeToken,
    }) as Stripe.Card;

    const card = await saveData<Card>({
      model: CardModel,
      params: {
        stripeId: sourceId,
        userId: user._id,
        isDefaultCard: cards.length < 1,
        expMonth,
        expYear,
        last4,
        name,
        brand,
      },
    });

    return {
      _id: card._id,
      userId: user._id,
      isDefaultCard: cards.length < 1,
      expMonth,
      expYear,
      last4,
      name,
      brand,
    };
  } catch (e) {
    console.log(e);
    // eslint-disable-next-line no-console
    return false;
  }
};

export const createPaymentIntent = async (user: User, card: Card, basket: BasketItem[], amount: number): Promise<Stripe.PaymentIntent | null> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      customer: user.stripeId,
      payment_method: card.stripeId,
      currency: 'eur',
      // confirm: true,
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

export const confirmPaymentIntent = (paymentIntent: Stripe.PaymentIntent): Promise<Stripe.PaymentIntent> => stripe.paymentIntents.confirm(paymentIntent.id, {
  return_url: `${CLIENT_HOSTNAME}/payment/stripe/return`,
});

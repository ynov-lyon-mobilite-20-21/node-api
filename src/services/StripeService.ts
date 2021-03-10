/* eslint-disable @typescript-eslint/camelcase */
import Stripe from 'stripe';

import { User } from '../models/UserModel';
import { findManyBy, saveData } from './MongooseService';
import { BasketItem, Payment, PaymentModel } from '../models/PaymentModel';
import { Card, CardModel } from '../models/CardModel';

const { STRIPE_API_KEY, CLIENT_HOSTNAME } = process.env;

// @ts-ignore
const stripe = new Stripe(STRIPE_API_KEY!, { apiVersion: '2020-03-02' });

// TODO: createStripeProduct
// export async function createStripeProduct(product: Product): Promise<Stripe.Product | null> {}

export async function createStripeCustomer(user: User): Promise<Stripe.Customer | null> {
  try {
    return await stripe.customers.create({
      email: user.mail,
    });
  } catch (e) {
    return null;
  }
}

export async function linkCardToCustomer(user: User, stripeCardId: string): Promise<Card | null | boolean> {
  try {
    const userCards = await findManyBy<Card>({ model: CardModel, condition: { userId: user._id } });

    if (!userCards) {
      return null;
    }

    const {
      id: stripeSourceCardId, exp_month: expMonth, exp_year: expYear, last4, name, brand,
    } = await stripe.customers.createSource(user.stripeId, {
      source: stripeCardId,
    }) as Stripe.Card;

    return await saveData<Card>({
      model: CardModel,
      params: {
        stripeId: stripeSourceCardId,
        userId: user._id,
        isDefaultCard: userCards.length < 1,
        expMonth,
        expYear,
        last4,
        name,
        brand,
      },
    });
  } catch (e) {
    return false;
  }
}

// TODO: createStripeInvoice cf. https://stripe.com/docs/api/invoices?lang=node
// export async function createStripeInvoice(items: BasketItem): Promise<Stripe.Invoice | null> {
//   try{
//     const invoice = stripe.invoices.create({});
//
//     return await saveData<Invoice>({
//       model: InvoiceModel,,
//       params: {
//       },
//     });
//   } catch (e) {
//     return null;
//   }
// }

// TODO: createStripeCoupon cf. https://stripe.com/docs/api/coupons?lang=node
// export async function createStripeCoupon(coupon: Coupon): Promise<Stripe.Coupon | null> {}

// TODO: createStripeSubscription cf. https://stripe.com/docs/api/subscriptions?lang=node
// export async function createStripeCoupon(coupon: Coupon): Promise<Stripe.Coupon | null> {}

// Maybe need https://stripe.com/docs/api/customer_tax_ids?lang=node or https://stripe.com/docs/api/tax_rates?lang=node

// TODO: implement invoice support
export async function createStripePaymentIntent(user: User, card: Card, basket: BasketItem[], amount: number): Promise<Stripe.PaymentIntent | null> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      customer: user.stripeId,
      amount,
      currency: 'eur',
      // confirm: true,

      payment_method: card.stripeId,
      use_stripe_sdk: true,
    });

    await saveData<Payment>({
      model: PaymentModel,
      params: {
        stripeId: paymentIntent.id,
        userId: user._id,
        createdAt: paymentIntent.created,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        basket,
      },
    });

    return paymentIntent;
  } catch (e) {
    return null;
  }
}

export function confirmStripePaymentIntent(paymentIntent: Stripe.PaymentIntent): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.confirm(paymentIntent.id, {
    return_url: `${CLIENT_HOSTNAME}/payment/stripe/return`, // TODO: update this
  });
}

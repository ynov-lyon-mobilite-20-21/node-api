/* eslint-disable @typescript-eslint/camelcase */
import Stripe from 'stripe';

import { User } from '../models/UserModel';
import { findManyBy, findOneBy, saveData } from './MongooseService';
import { Card, CardModel } from '../models/CardModel';

const { STRIPE_API_KEY, ENDPOINT_APP } = process.env;

// @ts-ignore
const stripe = new Stripe(STRIPE_API_KEY!, { apiVersion: '2020-08-27' });

// TODO: createStripeProduct
// export async function createStripeProduct(product: Product): Promise<Stripe.Product | null> {}

export async function createStripeCustomer(user: User): Promise<Stripe.Customer | null> {
  try {
    // TODO: implement commented params to user
    return await stripe.customers.create({
      // address: user.address
      email: user.mail,
      name: `${user.lastName} ${user.firstName}`,
      // payment_method: '', // NTA
      // phone: user.phone,
      preferred_locales: ['fr-FR'],
    });
  } catch (e) {
    return null;
  }
}

export async function linkCardToCustomer(user: User, stripeId: string): Promise<Card | null | boolean> {
  const userCards = await findManyBy<Card>({ model: CardModel, condition: { userId: user._id } });

  const card = await findOneBy<Card>({ model: CardModel, condition: { stripeId } });

  if (card) { // If there is already a card saved with this stripe id
    throw new Error('This card has already been linked to a user.');
  }

  if (!user.stripeId) {
    throw new Error('User stripeId is null.');
  }

  const {
    id: stripeSourceCardId, exp_month: expMonth, exp_year: expYear, last4, name, brand,
  } = await stripe.customers.createSource(user.stripeId, { source: stripeId }) as Stripe.Card;

  return saveData<Card>({
    model: CardModel,
    params: {
      stripeId: stripeSourceCardId,
      userId: user._id,
      name,
      last4,
      expMonth,
      expYear,
      brand,
      isDefaultCard: !!(userCards && userCards.length < 1), // userCards ? true : false
    },
  });
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
export async function createStripePaymentIntent(user: User, stripeCardId: string, amount: number): Promise<Stripe.PaymentIntent | null> {
  try {
    return await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      customer: user.stripeId,
      // description: '' // NTA
      payment_method: stripeCardId,
      receipt_email: user.mail,
      use_stripe_sdk: true, // Set to true only when using manual confirmation and the iOS or Android SDKs to handle additional authentication steps.
    });
  } catch (e) {
    return null;
  }
}

export function confirmStripePaymentIntent(paymentIntent: Stripe.PaymentIntent): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.confirm(paymentIntent.id, {
    return_url: `${ENDPOINT_APP}`, // TODO: update the env var
  });
}

export async function updatePaymentIntent(webhookEvent: Stripe.Event): Promise<boolean> {
  const payementIntent = webhookEvent.data.object as Stripe.PaymentIntent;

  console.log('#### WEBHOOK HANDLED - START ####');
  console.log(webhookEvent.type);

  console.log(payementIntent);

  if (webhookEvent.type === 'payment_intent.payment_failed') {

  }

  if (webhookEvent.type === 'payment_intent.succeeded') {

  }

  console.log('#### WEBHOOK HANDLED - END ####');

  // payment_intent.attached
  // payment_intent.processing
  // payment_intent.amount_capturable_updated

  return true;
}

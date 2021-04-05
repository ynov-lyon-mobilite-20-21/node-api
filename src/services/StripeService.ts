/* eslint-disable @typescript-eslint/camelcase */
import Stripe from 'stripe';

import { Promise } from 'mongoose';
import { User } from '../models/UserModel';
import { StripePayment, StripePaymentModel } from '../models/StripePaymentModel';
import {
  findManyBy, findOneBy, saveData, updateOneBy,
} from './MongooseService';
import { Card, CardModel } from '../models/CardModel';
import { Ticket, TicketModel } from '../models/TicketModel';
import { StripeProductPrices } from '../models/EventModel';

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

export async function updatePaymentIntent(eventPaymentIntent: Stripe.PaymentIntent): Promise<void> {
  const payment = await updateOneBy<StripePayment>({
    model: StripePaymentModel,
    condition: {
      intentId: eventPaymentIntent.id,
    },
    update: {
      status: eventPaymentIntent.status,
    },
  });

  if (!payment) {
    return;
  }

  await updateOneBy<Ticket>({
    model: TicketModel,
    condition: { paymentId: payment._id },
    update: {
      isValid: eventPaymentIntent.status === 'succeeded',
    },
  });
}

function statementDescriptorSanitizer(value: string): string {
  return value.replace(new RegExp('/<*|>*|\\\\*|"*|’*/gm'), ' ').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export async function createProduct(name: string, description: string, price: number, images?: string[] | undefined, statement_descriptor?: string | undefined, url?: string | undefined): Promise<{ productId: string; priceId: string }> {
  const sanitizedStatementDescriptor = !statement_descriptor ? statementDescriptorSanitizer(name) : statementDescriptorSanitizer(statement_descriptor);

  const stripeProduct = await stripe.products.create({
    name,
    description,
    images,
    statement_descriptor: sanitizedStatementDescriptor,
    url,
  });

  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    currency: 'eur',
    unit_amount: price,
  });

  return {
    productId: stripeProduct.id,
    priceId: stripePrice.id,
  };
}

export async function updateProduct(id: string, name: string, description: string, priceId?: string | undefined, price?: number | undefined, images?: string[] | undefined, statement_descriptor?: string | undefined, url?: string | undefined): Promise<{ productId: string; priceId: string | null }> {
  const sanitizedStatementDescriptor = !statement_descriptor ? statementDescriptorSanitizer(name) : statementDescriptorSanitizer(statement_descriptor);

  const stripeProduct = await stripe.products.update(
    id,
    {
      name,
      description,
      images,
      statement_descriptor: sanitizedStatementDescriptor,
      url,
    },
  );

  if (priceId) {
    // It's impossible to change the amount with stripe API. The only solution was to archive the old price and create a new one.
    await stripe.prices.update(
      priceId,
      { active: false },
    );

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      currency: 'eur',
      unit_amount: price,
    });

    return {
      productId: stripeProduct.id,
      priceId: stripePrice.id,
    };
  }

  return {
    productId: stripeProduct.id,
    priceId: null,
  };
}

export async function deleteProduct(productId: string, pricesProductIds?: StripeProductPrices[] | undefined): Promise<void> {
  if (pricesProductIds && pricesProductIds.length > 0) {
    const promises = [];

    for (let index = 0; index < pricesProductIds.length; index += 1) {
      promises.push(stripe.prices.update(
        pricesProductIds[index].id,
        { active: false },
      ));
    }

    await Promise.all(promises);

    await stripe.products.update(productId, { active: false });

    const error = new Error('Impossible to delete the product because of api limitation. It has been archived instead.');
    error.name = 'PAYMENT_SERVICE_LIMITATION';

    throw error;
  }

  await stripe.products.del(productId);
}

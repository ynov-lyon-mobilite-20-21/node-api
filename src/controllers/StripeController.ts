import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { createPaymentIntent, linkCardToCustomer } from '../services/StripeService';
import { BasketItem } from '../models/PaymentModel';
import { getBasketAmount } from '../services/ProductsService';

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

export const pay = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { stripeId, stripeSourceId } = req.user as User;

  if (!req.body.products) {
    res.status(400).json({
      data: {},
      errors: {
        code: 'REQUIRED_PRODUCTS_PARAMETER',
        message: 'No required parameter named “products“ which is an array of object. These objects contain productId and quantity',
      },
    });

    return;
  }

  const basket = req.body.products as BasketItem[];

  if (basket.length < 1) {
    res.status(400).json({
      data: {},
      errors: {
        code: 'NO_PRODUCTS',
      },
    });

    return;
  }

  if (!stripeSourceId) {
    res.status(400).json({
      data: {},
      errors: { code: 'NO_CREDIT_CARD' },
    });

    return;
  }

  const amount = await getBasketAmount(basket);
  const paymentIntent = await createPaymentIntent(stripeId, stripeSourceId, basket, amount);

  if (!paymentIntent) {
    res.status(400).json({
      data: {},
      errors: { code: 'UNKNOWN_ERROR' },
    });

    return;
  }

  const { id: paymentIntentId, client_secret: clientSecret } = paymentIntent;

  res.status(200).json({
    data: {
      paymentIntentId,
      clientSecret,
    },
    errors: {},
  });
};

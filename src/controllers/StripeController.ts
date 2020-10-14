/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { confirmPaymentIntent, createPaymentIntent, linkCardToCustomer } from '../services/StripeService';
import { BasketItem } from '../models/PaymentModel';
import { getBasketAmount } from '../services/ProductsService';
import {
  deleteOnyBy, findManyBy, findOneBy, updateManyBy, updateOneBy,
} from '../services/MongooseService';
import { Card, CardModel } from '../models/CardtModel';

export const linkUserCard = async (req: Request, res: Response): Promise<void> => {
  const { stripeToken } = req.body;

  // @ts-ignore
  const linkingCardRequest = await linkCardToCustomer(req.user, stripeToken);

  if (!linkingCardRequest) {
    res.status(400).send({
      errors: { code: 'UNKNOWN_ERROR' },
      data: {},
    });

    return;
  }

  res.status(200).json({
    data: linkingCardRequest,
    errors: {},
  });
};

export const pay = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { user } = req;

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

  let card;

  if (!req.body.cardId) {
    card = await findOneBy<Card>({
      model: CardModel,
      condition: { userId: user._id, isDefaultCard: true },
      hiddenPropertiesToSelect: ['stripeId'],
    });
  } else {
    card = await findOneBy<Card>({
      model: CardModel,
      condition: { _id: req.body.cardId, userId: user._id },
      hiddenPropertiesToSelect: ['stripeId'],
    });
  }

  if (!card) {
    res.status(400).json({
      data: {},
      errors: {
        code: 'NO_AVAILABLE_CARDS',
      },
    });

    return;
  }

  const amount = await getBasketAmount(basket);
  const paymentIntent = await createPaymentIntent(user, card, basket, amount);

  if (!paymentIntent) {
    res.status(400).json({
      data: {},
      errors: { code: 'UNKNOWN_ERROR' },
    });

    return;
  }

  try {
    const confirmation = await confirmPaymentIntent(paymentIntent);
    // eslint-disable-next-line no-console
    console.log(confirmation);
  } finally {
    const { id: paymentIntentId, client_secret: clientSecret } = paymentIntent;

    res.status(200).json({
      data: {
        paymentIntentId,
        clientSecret,
      },
      errors: {},
    });
  }
};

export const getUserCards = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { _id } = req.user as User;

  const cards = await findManyBy<Card>({ model: CardModel, condition: { userId: _id } });

  res.status(200).json({
    data: cards,
    errors: {},
  });
};

export const removeCard = async (req: Request, res: Response): Promise<void> => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(400).json({ data: {}, errors: { code: 'REQUIRED_CARD_ID_PARAMETER' } });
    return;
  }

  const deletion = await deleteOnyBy<Card>({ model: CardModel, condition: { _id: cardId } });

  if (!deletion) {
    res.status(400).json({ data: {}, errors: { code: 'UNKNOWN_ERROR' } });
  }

  res.status(204).send();
};

export const setDefaultCard = async (req: Request, res: Response): Promise<void> => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(400).json({ data: {}, errors: { code: 'REQUIRED_CARD_ID_PARAMETER' } });
    return;
  }

  await updateManyBy<Card>({ model: CardModel, condition: {}, set: { isDefaultCard: false } });
  const update = await updateOneBy<Card>({ model: CardModel, condition: { _id: cardId }, set: { isDefaultCard: true } });

  if (!update) {
    res.status(400).json({ data: {}, errors: { code: 'UNKNOWN_ERROR' } });
  }

  res.status(204).send();
};

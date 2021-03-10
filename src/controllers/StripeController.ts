/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { confirmStripePaymentIntent, createStripePaymentIntent, linkCardToCustomer } from '../services/StripeService';
import { BasketItem } from '../models/StripePaymentModel';
import {
  deleteOnyBy, findManyBy, findOneBy, updateManyBy, updateOneBy,
} from '../services/MongooseService';
import { Card, CardModel } from '../models/CardModel';
import { APIRequest } from '../Interfaces/APIRequest';

export const linkCardToCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const { stripeId } = req.body;
  const request = req as APIRequest;

  if (!stripeId) {
    res.status(400).json({
      error: {
        code: 'CARD_STRIPE_ID_REQUIRED',
        message: 'Please fill the card id field, this field is required.',
      },
      data: null,
    });

    return;
  }

  const linkedCard = await linkCardToCustomer(request.currentUser, stripeId);

  if (linkedCard === null) {
    res.status(400).send({
      error: {
        code: 'CARD_ALREADY_LINKED',
        message: 'A card with the same id is already linked.',
      },
      data: null,
    });

    return;
  }

  if (!linkedCard) {
    res.status(400).send({
      error: {
        code: 'UNKNOWN_ERROR',
        message: '',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: linkedCard,
  });
};

// export const pay = async (req: Request, res: Response): Promise<void> => {
//   const request = req as APIRequest;
//   const user = request.currentUser as User;
//   const { currentUserId } = request;
//
//   if (!req.body.products) {
//     res.status(400).json({
//       error: {
//         code: 'REQUIRED_PRODUCTS_PARAMETER',
//         message: 'No required parameter named “products“ which is an array of object. These objects contain productId and quantity',
//       },
//       data: null,
//     });
//
//     return;
//   }
//
//   const basket = req.body.products as BasketItem[];
//
//   if (basket.length < 1) {
//     res.status(400).json({
//       error: {
//         code: 'NO_PRODUCTS',
//         message: '',
//       },
//       data: null,
//     });
//
//     return;
//   }
//
//   // TODO: implement product declaration on stripe (à faire dans la route de création d'évènement.)
//   // https://stripe.com/docs/api/products?lang=node
//
//   let card;
//
//   if (!req.body.cardId) {
//     card = await findOneBy<Card>({
//       model: CardModel,
//       condition: { currentUserId, isDefaultCard: true },
//       hiddenPropertiesToSelect: ['stripeId'],
//     });
//   } else {
//     card = await findOneBy<Card>({
//       model: CardModel,
//       condition: { _id: req.body.cardId, currentUserId },
//       hiddenPropertiesToSelect: ['stripeId'],
//     });
//   }
//
//   if (!card) {
//     res.status(400).json({
//       error: {
//         code: 'NO_AVAILABLE_CARDS',
//         message: '',
//       },
//       data: null,
//     });
//
//     return;
//   }
//
//   const amount = 0;
//   const paymentIntent = await createStripePaymentIntent(user, card, basket, amount); // https://stripe.com/docs/api/prices/create?lang=node -> https://stripe.com/docs/api/invoiceitems/create?lang=node
//
//   if (!paymentIntent) {
//     res.status(400).json({
//       error: { code: 'UNKNOWN_ERROR', message: '' },
//       data: null,
//     });
//
//     return;
//   }
//
//   try {
//     const confirmation = await confirmStripePaymentIntent(paymentIntent);
//     // eslint-disable-next-line no-console
//     console.log(confirmation);
//   } finally {
//     const { id: paymentIntentId, client_secret: clientSecret } = paymentIntent;
//
//     // TODO: Create ticket with paymentIntentId
//
//     // TODO: Implement the webhook to the update ticket : https://stripe.com/docs/payments/handling-payment-events
//
//     res.status(200).json({
//       error: null,
//       data: {
//         paymentIntentId,
//         clientSecret,
//       },
//     });
//   }
// };

export const getCurrentUserCards = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const { _id } = req.user as User;

  const cards = await findManyBy<Card>({ model: CardModel, condition: { userId: _id } });

  res.status(200).json({
    error: null,
    data: cards,
  });
};

export const removeCardForCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(400).json({
      error: { code: 'REQUIRED_CARD_ID_PARAMETER', message: '' },
      data: null,
    });
    return;
  }

  const deletion = await deleteOnyBy<Card>({ model: CardModel, condition: { _id: cardId } });

  if (!deletion) {
    res.status(400).json({
      error: { code: 'UNKNOWN_ERROR', message: '' },
      data: null,
    });
  }

  res.status(204).send();
};

export const setDefaultCardForCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(400).json({
      error: { code: 'REQUIRED_CARD_ID_PARAMETER', message: '' },
      data: null,
    });
    return;
  }

  await updateManyBy<Card>({ model: CardModel, condition: {}, update: { isDefaultCard: false } });
  const update = await updateOneBy<Card>({ model: CardModel, condition: { _id: cardId }, update: { isDefaultCard: true } });

  if (!update) {
    res.status(400).json({
      error: { code: 'UNKNOWN_ERROR', message: '' },
      data: null,
    });
  }

  res.status(204).send();
};

export const paySuccess = async (req: Request, res: Response): Promise<void> => {
  console.log(req);

  res.status(200);
  // TODO: setup redirection to universal link
};

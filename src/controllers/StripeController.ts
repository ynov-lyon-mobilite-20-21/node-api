/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { linkCardToCustomer } from '../services/StripeService';
import {
  deleteOnyBy, findManyBy, updateManyBy, updateOneBy,
} from '../services/MongooseService';
import { Card, CardModel } from '../models/CardModel';
import { APIRequest } from '../Interfaces/APIRequest';

export const webhookPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const event = req.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log(event);

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

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

  let linkedCard;
  try {
    linkedCard = await linkCardToCustomer(request.currentUser, stripeId);
  } catch (e) {
    res.status(400).send({
      error: {
        code: 'CARD_LINKING_ERROR',
        message: e.message,
      },
      data: null,
    });

    return;
  }

  if (!linkedCard) {
    res.status(500).send({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error has occurred while link the card to the customer.',
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
  const { currentUserId } = req as APIRequest;

  const cards = await findManyBy<Card>({ model: CardModel, condition: { userId: currentUserId } });

  res.status(200).json({
    error: null,
    data: cards,
  });
};

export const removeCardForCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(400).json({
      error: { code: 'REQUIRED_CARD_ID_PARAMETER', message: 'Please fill the field cardId, this is required.' },
      data: null,
    });
    return;
  }

  const deletion = await deleteOnyBy<Card>({ model: CardModel, condition: { _id: cardId } });

  if (!deletion) {
    res.status(400).json({
      error: { code: 'UNKNOWN_ERROR', message: 'An error has occurred while deleting the card. It is possible that the card does not exist.' },
      data: null,
    });
  }

  res.status(204).send();
};

export const setDefaultCardForCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(400).json({
      error: { code: 'REQUIRED_CARD_ID_PARAMETER', message: 'Please fill the field cardId, this is required.' },
      data: null,
    });
    return;
  }

  await updateManyBy<Card>({ model: CardModel, condition: {}, update: { isDefaultCard: false } });
  const update = await updateOneBy<Card>({ model: CardModel, condition: { _id: cardId }, update: { isDefaultCard: true } });

  if (!update) {
    res.status(500).json({
      error: { code: 'UNKNOWN_ERROR', message: 'An error occurred while updating the card' },
      data: null,
    });
  }

  res.status(204).send();
};

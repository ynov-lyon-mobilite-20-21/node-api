/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/camelcase */
import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { Event, EventModel } from '../models/EventModel';
import { APIRequest } from '../Interfaces/APIRequest';
import { Card, CardModel } from '../models/CardModel';
import {
  confirmStripePaymentIntent,
  createProduct,
  createStripePaymentIntent,
  deleteProduct,
  updateProduct,
} from '../services/StripeService';
import { StripePayment, StripePaymentModel } from '../models/StripePaymentModel';
import { Ticket, TicketModel } from '../models/TicketModel';

// [POST] Protected : isAuthenticated + isAdmin
export const createNewEvent = async (req: Request, res: Response): Promise<void> => {
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const jsonParamKey in req.body) {
    switch (jsonParamKey) {
      case 'name':
      case 'type':
      case 'imgType':
      case 'date':
      case 'address':
      case 'description':
      case 'price':
        // eslint-disable-next-line no-continue
        continue;

      default:
        res.status(400).json({
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'name, type, imgType, date, address, description, price',
          },
          data: null,
        });
        return;
    }
  }

  const {
    name, type, imgType, date, address, description, price,
  } = req.body;

  if (!name) {
    res.status(400).json({
      error: {
        code: 'NAME_REQUIRED',
        message: 'Please fill name field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!type) {
    res.status(400).json({
      error: {
        code: 'TYPE_REQUIRED',
        message: 'Please fill type field, this field is required.',
      },
      data: null,
    });

    return;
  }
  // TODO: add type enum check

  if (!imgType) {
    res.status(400).json({
      error: {
        code: 'IMG_TYPE_REQUIRED',
        message: 'Please fill imgType field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!date) {
    res.status(400).json({
      error: {
        code: 'DATE_REQUIRED',
        message: 'Please fill date field, this field is required.',
      },
      data: null,
    });

    return;
  }
  // TODO: add check on date format

  if (!address) {
    res.status(400).json({
      error: {
        code: 'ADDRESS_REQUIRED',
        message: 'Please fill address field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!description) {
    res.status(400).json({
      error: {
        code: 'DESCRIPTION_REQUIRED',
        message: 'Please fill description field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!price && price < 0) { // 0 is falsy and it's not possible to have negative price
    res.status(400).json({
      error: {
        code: 'PRICE_REQUIRED',
        message: 'Please fill price field, this field is required.',
      },
      data: null,
    });

    return;
  }
  // TODO: add a check to price (must be in cents)

  const event = await findOneBy<Event>({ model: EventModel, condition: { name } });

  if (event) {
    res.status(400).json({
      error: {
        code: 'EVENT_ALREADY_EXISTS',
        message: 'An event with the same name already exists. It is not possible to have multiple event with the same name.',
      },
      data: null,
    });

    return;
  }

  const typedDate = new Date(date);

  let newEvent = null;
  try {
    const stripeIds = await createProduct(name, description, price, ['https://via.placeholder.com/50']);

    newEvent = await saveData<Event>({
      model: EventModel,
      params: {
        name,
        type,
        imgType,
        date: typedDate,
        address,
        description,
        price,
        stripeProductId: stripeIds.productId,
        stripePriceIds: [{
          id: stripeIds.priceId,
          isActive: true,
        }],
      },
    });
  } catch (e) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while saving event.',
      },
      data: null,
    });

    return;
  }

  // TODO: implement product declaration on stripe
  // https://stripe.com/docs/api/products?lang=node

  if (!newEvent) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while saving event in database.',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: newEvent,
  });
};

// [GET]
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  const events = await findManyBy<Event>({ model: EventModel, condition: {} });

  res.status(200).json({
    error: null,
    data: events,
  });
};

// [GET]
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const { id: eventId } = req.params;

  if (!eventId) {
    res.status(400).json({
      error: {
        code: 'EVENT_ID_REQUIRED',
        message: 'Please give the event ID in URL, this is required.',
      },
      data: null,
    });

    return;
  }

  const event = await findOneBy<Event>({ model: EventModel, condition: { _id: eventId } });

  if (!event) {
    res.status(404).json({
      error: {
        code: 'EVENT_NOT_FOUND',
        message: 'No event found for this id.',
      },
      data: null,
    });
    return;
  }

  res.status(200).json({
    error: null,
    data: event,
  });
};

// [PUT] Protected : isAuthenticated + isAdmin
export const updateEventById = async (req: Request, res: Response): Promise<void> => {
  const { id: eventId } = req.params;

  if (!eventId) {
    res.status(400).json({
      error: {
        code: 'EVENTID_REQUIRED',
        message: 'Please give the event ID in URL, this is required.',
      },
      data: null,
    });

    return;
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const jsonParamKey in req.body) {
    switch (jsonParamKey) {
      case 'name':
      case 'type':
      case 'imgType':
      case 'date':
      case 'address':
      case 'description':
      case 'price':
        // eslint-disable-next-line no-continue
        continue;

      default:
        res.status(400).json({
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'name, type, imgType, date, address, description, price',
          },
          data: null,
        });
        return;
    }
  }

  const event = req.body;

  const storedEvent = await findOneBy<Event>({
    model: EventModel,
    condition: { _id: eventId },
    hiddenPropertiesToSelect: ['stripeProductId', 'stripePriceIds'],
  });

  if (!storedEvent) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred getting the event in database.',
      },
      data: null,
    });

    return;
  }

  const activePriceId = storedEvent.stripePriceIds.filter((price) => price.isActive)[0];

  if (event.price && activePriceId && storedEvent.price !== event.price) {
    const updateStripeProduct = await updateProduct(storedEvent.stripeProductId, event.name, event.description, activePriceId.id, event.price);

    if (updateStripeProduct.priceId) {
      event.stripePriceIds = storedEvent.stripePriceIds;

      for (let index = 0; index < event.stripePriceIds.length; index += 1) {
        storedEvent.stripePriceIds[index].isActive = false;
      }

      event.stripePriceIds.push({
        id: updateStripeProduct.priceId,
        isActive: true,
      });
    }
  } else {
    await updateProduct(storedEvent.stripeProductId, event.name, event.description);
  }

  const updatedEvent = await updateOneBy<Event>({
    model: EventModel,
    condition: { _id: eventId },
    update: event,
  });

  if (!updatedEvent) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while updating the event',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: updatedEvent,
  });
};

// [DELETE] Protected : isAuthenticated + isAdmin
export const deleteEventById = async (req: Request, res: Response): Promise<void> => {
  const { id: eventId } = req.params;

  if (!eventId) {
    res.status(400).json({
      error: {
        code: 'EVENTID_REQUIRED',
        message: 'Please give the event ID in URL, this is required.',
      },
      data: null,
    });

    return;
  }

  const event = await findOneBy<Event>({
    model: EventModel,
    condition: { _id: eventId },
    hiddenPropertiesToSelect: ['stripeProductId', 'stripePriceIds'],
  });

  if (!event) {
    res.status(404).json({
      error: {
        code: 'EVENT_NOT_FOUND',
        message: 'An unknown error has occurs while deleting the event. It seems that your event does not exist.',
      },
      data: null,
    });

    return;
  }

  if (event.isArchived) {
    res.status(400).json({
      error: {
        code: 'EVENT_ARCHIVED',
        message: 'This event couldn\'t be deleted and already archived.',
      },
      data: null,
    });

    return;
  }

  if (event && event.stripeProductId) {
    try {
      await deleteProduct(event.stripeProductId, event.stripePriceIds);
    } catch (e) {
      if (e.name === 'PAYMENT_SERVICE_LIMITATION') {
        for (let index = 0; index < event.stripePriceIds.length; index += 1) {
          event.stripePriceIds[index].isActive = false;
        }

        event.isArchived = true;

        await updateOneBy<Event>({
          model: EventModel,
          condition: { _id: eventId },
          update: event,
        });

        res.status(200).json({
          error: {
            code: e.name,
            message: `${e.message} This isn't really a problem, just a warning.`,
          },
          data: null,
        });

        return;
      }

      res.status(500).json({
        error: {
          code: 'PAYMENT_SERVICE_ERROR',
          message: 'Impossible to delete this product in payment service.',
        },
        data: null,
      });

      return;
    }
  }

  const deleteEvent = await deleteOnyBy<Event>({ model: EventModel, condition: { _id: eventId } });

  if (!deleteEvent) {
    res.status(404).json({
      error: {
        code: 'EVENT_NOT_FOUND',
        message: 'An unknown error has occurs while deleting the event. It seems that your event does not exist.',
      },
      data: null,
    });

    return;
  }

  res.status(204).send();
};

// [POST] Protected : isAuthenticated
export const pay = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;
  const { currentUser, currentUserId } = request;
  const { id: eventId } = request.params;

  if (!eventId) {
    res.status(400).json({
      error: {
        code: 'EVENT_ID_REQUIRED',
        message: 'Please fill the event field, this field is required.',
      },
      data: null,
    });

    return;
  }

  const event = await findOneBy<Event>({ model: EventModel, condition: { _id: eventId } });

  if (!event) {
    res.status(404).json({
      error: {
        code: 'EVENT_NOT_FOUND',
        message: 'No event found with the given id.',
      },
      data: null,
    });

    return;
  }

  let card;

  // eslint-disable-next-line no-prototype-builtins
  if (!request.body.hasOwnProperty('cardId')) {
    card = await findOneBy<Card>({
      model: CardModel,
      condition: { userId: currentUserId, isDefaultCard: true },
    });
  } else {
    const { cardId } = request.body;
    card = await findOneBy<Card>({
      model: CardModel,
      condition: { _id: cardId, userId: currentUserId },
    });

    if (!card) {
      res.status(400).json({
        error: {
          code: 'CARD_NOT_FOUND',
          message: 'No card found for the user with this card id.',
        },
        data: null,
      });

      return;
    }
  }

  if (!card) {
    res.status(400).json({
      error: {
        code: 'NO_CARDS_AVAILABLE',
        message: 'It seems that the current user has no default card. Please try to add one or specify a card id.',
      },
      data: null,
    });

    return;
  }

  // TODO: Implement stripe invoice generation with event stripe product

  const paymentIntent = await createStripePaymentIntent(currentUser, card.stripeId, event.price); // https://stripe.com/docs/api/prices/create?lang=node -> https://stripe.com/docs/api/invoiceitems/create?lang=node

  if (!paymentIntent) {
    res.status(400).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An an error occurred while ',
      },
      data: null,
    });

    return;
  }

  const payment = await saveData<StripePayment>({
    model: StripePaymentModel,
    params: {
      intentId: paymentIntent.id,
      userId: currentUserId,
      createdAt: new Date(paymentIntent.created),
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    },
  });

  if (!payment) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while saving the payment in our database.',
      },
      data: null,
    });
    return;
  }

  try {
    await confirmStripePaymentIntent(paymentIntent);
  } catch (e) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while confirm the payment intent.',
      },
      data: null,
    });

    return;
  }

  const ticket = await saveData<Ticket>({
    model: TicketModel,
    params: {
      userId: currentUserId,
      eventId: event._id,
      paymentId: payment.id,
      currency: paymentIntent.currency,
    },
  });

  if (!ticket) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while saving the ticket in our database.',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    },
  });
};

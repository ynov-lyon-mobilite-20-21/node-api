/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/camelcase */
import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { Event, EventModel } from '../models/EventModel';

// Protected : isAuthenticated + isAdmin
export const createNewEvent_post = async (req: Request, res: Response): Promise<void> => {
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

  if (!price) {
    res.status(400).json({
      error: {
        code: 'PRICE_REQUIRED',
        message: 'Please fill price field, this field is required.',
      },
      data: null,
    });

    return;
  }

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
    newEvent = await saveData<Event>({
      model: EventModel,
      params: {
        name, type, imgType, date: typedDate, address, description, price,
      },
    });
  } catch (e) {
    res.status(500).json({
      error: {
        code: 'MALFORMED_JSON',
        message: 'An error has occurred while saving event in database. A field does not appear to have an acceptable value or type.',
      },
      data: null,
    });

    return;
  }

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

export const getAllEvents_get = async (req: Request, res: Response): Promise<void> => {
  const events = await findManyBy<Event>({ model: EventModel, condition: {} });

  res.status(200).json({
    error: null,
    data: events,
  });
};

export const getEventById_get = async (req: Request, res: Response): Promise<void> => {
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

// Protected : isAuthenticated + isAdmin
export const updateEventById_put = async (req: Request, res: Response): Promise<void> => {
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

  const updatedEvent = await updateOneBy<Event>({ model: EventModel, condition: { _id: eventId }, update: event });

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

// Protected : isAuthenticated + isAdmin
export const deleteEventById_delete = async (req: Request, res: Response): Promise<void> => {
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

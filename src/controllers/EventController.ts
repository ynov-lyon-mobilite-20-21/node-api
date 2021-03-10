/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import {
  deleteOnyBy,
  findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { Event, EventModel } from '../models/EventModel';

export const createNewEvent_post = async (req: Request, res: Response): Promise<void> => {
  const {
    name, type, date, address, description, price, qrcode,
  } = req.body;

  if (!name) {
    res.status(400).json({
      error: { code: 'NAME_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!type) {
    res.status(400).json({
      error: { code: 'TYPE_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!date) {
    res.status(400).json({
      error: { code: 'DATE_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!address) {
    res.status(400).json({
      error: { code: 'ADDRESS_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!description) {
    res.status(400).json({
      error: { code: 'DESCRIPTION_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!price) {
    res.status(400).json({
      error: { code: 'PRICE_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!qrcode) {
    res.status(400).json({
      error: { code: 'QRCODE_REQUIRED', message: '' },
      data: null,
    });

    return;
  }

  let event = await findOneBy<Event>({ model: EventModel, condition: { name } });

  if (event) {
    res.status(400).json({
      error: { code: 'EVENT_ALREADY_EXISTS', message: '' },
      data: null,
    });

    return;
  }

  const typedDate = new Date(date);

  event = await saveData<Event>({
    model: EventModel,
    params: {
      name, type, dateFormated: typedDate, address, description, price, qrcode,
    },
  });

  if (!event) {
    res.status(500).json({
      error: { code: 'UNKNOWN_ERROR', message: 'An error has occured while event creation in database' },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: event,
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
  const { id } = req.params;

  const event = await findOneBy<Event>({ model: EventModel, condition: { _id: id } });

  res.status(200).json({
    error: null,
    data: event,
  });
};

export const updateEventById_put = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const event = req.body;

  const updatedEvent = await updateOneBy<Event>({ model: EventModel, condition: { _id: id }, update: event });

  if (!updatedEvent) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Impossible to update the event',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: {
      message: 'Event updated successfully !',
    },
  });
};

export const deleteEventById_delete = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const event = await deleteOnyBy<Event>({ model: EventModel, condition: { _id: id } });

  if (!event) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Impossible to delete event',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: {
      message: 'Event deleted successfully !',
    },
  });
};

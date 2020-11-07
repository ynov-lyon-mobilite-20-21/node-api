/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import Crypto from 'crypto';
import moment from 'moment';
import { Schema } from 'mongoose';
import {
  deleteOnyBy,
  findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { Event, EventModel } from '../models/EventModel';

const { CLIENT_HOSTNAME } = process.env;

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const {
    name, type, date, address, description, price, qrcode,
  } = req.body;

  if (!name) {
    res.status(400).json({
      data: {},
      error: { code: 'NAME_REQUIRED' },
    });

    return;
  }
  if (!type) {
    res.status(400).json({
      data: {},
      error: { code: 'TYPE_REQUIRED' },
    });

    return;
  }
  if (!date) {
    res.status(400).json({
      data: {},
      error: { code: 'DATE_REQUIRED' },
    });

    return;
  }
  if (!address) {
    res.status(400).json({
      data: {},
      error: { code: 'ADDRESS_REQUIRED' },
    });

    return;
  }
  if (!description) {
    res.status(400).json({
      data: {},
      error: { code: 'DESCRIPTION_REQUIRED' },
    });

    return;
  }
  if (!price) {
    res.status(400).json({
      data: {},
      error: { code: 'PRICE_REQUIRED' },
    });

    return;
  }
  if (!qrcode) {
    res.status(400).json({
      data: {},
      error: { code: 'QRCODE_REQUIRED' },
    });

    return;
  }

  let event = await findOneBy<Event>({ model: EventModel, condition: { name } });

  if (event) {
    res.status(400).json({
      data: {},
      error: { code: 'EVENT_ALREADY_EXISTS' },
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
    res.status(400).json({
      data: {},
      error: { code: 'UNKNOWN_ERROR', message: 'An error has occured while event creation in database' },
    });

    return;
  }

  res.status(200).json({
    data: {
      code: 'OK',
      message: 'Event created successfully',
    },
  });
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const events = await findManyBy<Event>({ model: EventModel, condition: {} });

  res.status(200).json({
    data: events,
  });
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const event = await findOneBy<Event>({ model: EventModel, condition: { _id: id } });

  res.status(200).json({
    data: event,
  });
};

export const updateEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const event = req.body;

  const updatedEvent = await updateOneBy<Event>({ model: EventModel, condition: { _id: id }, set: event });

  if (!updatedEvent) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Impossible to update the event',
      },
    });

    return;
  }

  res.status(200).json({
    data: {
      message: 'Event updated successfully !',
    },
  });
};

export const deleteEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const event = await deleteOnyBy<Event>({ model: EventModel, condition: { _id: id } });

  if (!event) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Impossible to delete event',
      },
    });

    return;
  }

  res.status(200).json({
    data: {
      message: 'Event deleted successfully !',
    },
  });
};

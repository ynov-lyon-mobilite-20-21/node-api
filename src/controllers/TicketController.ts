/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { Ticket, TicketModel } from '../models/TicketModel';
import { APIRequest } from '../Interfaces/APIRequest';

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId, paymentId } = req.body;

  if (!userId) {
    res.status(400).json({
      error: { code: 'USERID_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!eventId) {
    res.status(400).json({
      error: { code: 'EVENTID_REQUIRED', message: '' },
      data: null,
    });

    return;
  }
  if (!paymentId) {
    res.status(400).json({
      error: { code: 'PAYMENTID_REQUIRED', message: '' },
      data: null,
    });

    return;
  }

  let ticket = await findOneBy<Ticket>({ model: TicketModel, condition: { userId, eventId, paymentId } });

  if (ticket) {
    res.status(400).json({
      error: { code: 'TICKET_ALREADY_EXISTS', message: '' },
      data: null,
    });

    return;
  }

  ticket = await saveData<Ticket>({
    model: TicketModel,
    params: { userId, eventId, paymentId },
  });

  if (!ticket) {
    res.status(400).json({
      error: { code: 'UNKNOWN_ERROR', message: 'An error has occured while ticket creation in database' },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: {
      code: 'OK',
      message: 'Ticket created successfully',
    },
  });
};

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;
  const { currentUserId } = request;
  const tickets = await findManyBy<Ticket>({ model: TicketModel, condition: { currentUserId } });

  res.status(200).json({
    error: null,
    data: tickets,
  });
};

export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;
  const { id } = req.params;

  const { currentUserId } = request;

  const ticket = await findOneBy<Ticket>({ model: TicketModel, condition: { _id: id, currentUserId } });

  res.status(200).json({
    error: null,
    data: ticket,
  });
};

export const updateTicketById = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;
  const { id } = req.params;
  const ticket = req.body;

  const { currentUserId } = request;

  const updatedTicket = await updateOneBy<Ticket>({ model: TicketModel, condition: { _id: id, currentUserId }, update: ticket });

  if (!updatedTicket) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Impossible to update the ticket',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: {
      message: 'Ticket updated successfully !',
    },
  });
};

export const deleteTicketById = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;
  const { id } = req.params;

  const { currentUserId } = request;

  const ticket = await deleteOnyBy<Ticket>({ model: TicketModel, condition: { _id: id, currentUserId } });

  if (!ticket) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Impossible to delete ticket',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: {
      message: 'Ticket deleted successfully !',
    },
  });
};

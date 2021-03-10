/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData, updateOneBy,
} from '../services/MongooseService';
import { Ticket, TicketModel } from '../models/TicketModel';
import { APIRequest } from '../Interfaces/APIRequest';

// [POST] Shields : isAuthenticated + isAdmin
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId, paymentId } = req.body;

  if (!userId) {
    res.status(400).json({
      error: {
        code: 'USER_ID_REQUIRED',
        message: 'Please fill userId field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!eventId) {
    res.status(400).json({
      error: {
        code: 'EVENT_ID_REQUIRED',
        message: 'Please fill eventId field, this field is required.',
      },
      data: null,
    });

    return;
  }

  if (!paymentId && paymentId !== null) {
    res.status(400).json({
      error: {
        code: 'PAYMENT_ID_REQUIRED',
        message: 'Please fill paymentId field, this field is required.',
      },
      data: null,
    });

    return;
  }

  let ticket = null;
  if (paymentId !== null) {
    ticket = await findOneBy<Ticket>({ model: TicketModel, condition: { userId, eventId, paymentId } });

    if (ticket) {
      res.status(400).json({
        error: {
          code: 'TICKET_ALREADY_EXISTS',
          message: 'A ticket with same data is already registered. It is impossible to have multiple ticket for the same paymentId.',
        },
        data: null,
      });

      return;
    }
  }

  ticket = await saveData<Ticket>({
    model: TicketModel,
    params: { userId, eventId, paymentId },
  });

  if (!ticket) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while saving the ticket in database',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: ticket,
  });
};

// [GET] Shields : isAuthenticated
export const getCurrentUserTickets = async (req: Request, res: Response): Promise<void> => {
  const request = req as APIRequest;
  const { currentUserId } = request;

  const tickets = await findManyBy<Ticket>({ model: TicketModel, condition: { userId: currentUserId } });

  res.status(200).json({
    error: null,
    data: tickets,
  });
};

// [GET] Shields : isAuthenticated + isAdmin
export const getTickets = async (req: Request, res: Response): Promise<void> => {
  const tickets = await findManyBy<Ticket>({ model: TicketModel, condition: {} });

  res.status(200).json({
    error: null,
    data: tickets,
  });
};

// [GET] Shields : isAuthenticated
export const getCurrentUserTicketById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      error: {
        code: 'TICKET_ID_REQUIRED',
        message: 'Please fill the ticket id in URL. This is required',
      },
      data: null,
    });

    return;
  }

  const request = req as APIRequest;
  const { currentUserId } = request;

  const ticket = await findOneBy<Ticket>({ model: TicketModel, condition: { _id: id, userId: currentUserId } });

  res.status(200).json({
    error: null,
    data: ticket,
  });
};

// [GET] Shields : isAuthenticated + isAdmin
export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      error: {
        code: 'TICKET_ID_REQUIRED',
        message: 'Please fill the ticket id in URL. This is required',
      },
      data: null,
    });

    return;
  }

  const ticket = await findOneBy<Ticket>({ model: TicketModel, condition: { _id: id } });

  res.status(200).json({
    error: null,
    data: ticket,
  });
};

// [PUT] Shields : isAuthenticated + isAdmin
export const updateTicketById = async (req: Request, res: Response): Promise<void> => {
  const { id: ticketId } = req.params;

  if (!ticketId) {
    res.status(400).json({
      error: {
        code: 'TICKET_ID_REQUIRED',
        message: 'Please fill the ticket id in URL. This is required',
      },
      data: null,
    });

    return;
  }

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const jsonParamKey in req.body) {
    switch (jsonParamKey) {
      case 'userId':
      case 'eventId':
      case 'paymentId':
      case 'validationCount':
        // eslint-disable-next-line no-continue
        continue;

      default:
        res.status(400).json({
          error: {
            code: 'MALFORMED_JSON',
            message: 'Your body contain other fields than those expected.',
            acceptedFields: 'mail, password, firstName, lastName, promotion, formation',
          },
          data: null,
        });
        return;
    }
  }

  const ticket = req.body;

  if (!ticket) {
    res.status(400).json({
      error: {
        code: 'NO_DATA',
        message: 'No data received from your request. Please give data to update the ticket.',
      },
      data: null,
    });
  }

  const updatedTicket = await updateOneBy<Ticket>({ model: TicketModel, condition: { _id: ticketId }, update: ticket });

  if (!updatedTicket) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error occurred while updating the ticket.',
      },
      data: null,
    });

    return;
  }

  res.status(200).json({
    error: null,
    data: updatedTicket,
  });
};

// [DELETE] Shields : isAuthenticated + isAdmin
export const deleteTicketById = async (req: Request, res: Response): Promise<void> => {
  const { id: ticketId } = req.params;

  if (!ticketId) {
    res.status(400).json({
      error: {
        code: 'TICKET_ID_REQUIRED',
        message: 'Please fill the ticket id in URL. This is required',
      },
      data: null,
    });

    return;
  }

  const ticket = await deleteOnyBy<Ticket>({ model: TicketModel, condition: { _id: ticketId } });

  if (!ticket) {
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An error has occurred while deleting the ticket.',
      },
      data: null,
    });

    return;
  }

  res.status(204).send();
};

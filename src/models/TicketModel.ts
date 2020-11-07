import {
  Document, Model, model, Schema,
} from 'mongoose';

const TicketSchema = new Schema({
  userId: { type: 'string' },
  eventId: { type: 'string' },
  paymentId: { type: 'string' },
  validationCount: { type: 'number', default: 0 },
  __v: { type: Number, select: false },
});

export interface Ticket extends Document {
  _id: string;
  userId: string;
  eventId: string;
  paymentId: string;
  validation_count: number;
}

export const TicketModel: Model<Ticket> = model<Ticket>('Ticket', TicketSchema);
import {
  Document, Model, model, MongooseDocument, Schema,
} from 'mongoose';

const TicketSchema = new Schema({
  userId: { type: 'string', required: true },
  eventId: { type: 'string', required: true },
  paymentId: { type: 'string' },
  isValid: { type: 'boolean', required: true, default: false },
  validationCount: { type: 'number', default: 0 },
  __v: { type: Number, select: false },
});

export interface Ticket extends Document {
  _doc: any; // The document data on destructuring
  _id: string;
  userId: string;
  eventId: string;
  paymentId: string;
  isValid: boolean;
  validation_count: number;
  qrCodeString?: string;
}

export const TicketModel: Model<Ticket> = model<Ticket>('Ticket', TicketSchema);

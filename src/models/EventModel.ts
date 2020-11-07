import {
  Document, Model, model, Schema,
} from 'mongoose';

const EventSchema = new Schema({
  name: { type: 'string' },
  type: { type: 'string' },
  date: { type: 'Date' },
  address: { type: 'string' },
  description: { type: 'string' },
  price: { type: 'number' },
  qrcode: { type: 'string' },
  __v: { type: Number, select: false },
});

export interface Event extends Document {
  _id: string;
  name: string;
  type: string;
  date: Date;
  address: string;
  description: string;
  price: number;
  qrcode: string;
}

export const EventModel: Model<Event> = model<Event>('Event', EventSchema);

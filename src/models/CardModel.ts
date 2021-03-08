import {
  Schema, Document, Model, model,
} from 'mongoose';

const CardSchema = new Schema({
  userId: { type: 'string', require: true },
  name: { type: 'string', require: true },
  last4: { type: 'string', require: true },
  expMonth: { type: 'number', require: true },
  expYear: { type: 'number', require: true },
  isDefaultCard: { type: 'boolean', require: true, default: false },
  stripeId: { type: 'string', select: false, unique: true },
  brand: { type: 'string' },
  __v: { type: Number, select: false },
});

export interface Card extends Document {
  _id: string;
  userId: string;
  name: string;
  last4: string;
  expMonth: number;
  expYear: number;
  stripeId?: string;
  isDefaultCard: boolean;
  brand: string;
}

export const CardModel: Model<Card> = model<Card>('Card', CardSchema);

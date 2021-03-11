import {
  Schema, Document, Model, model,
} from 'mongoose';

const CardSchema = new Schema({
  stripeId: { type: 'string', unique: true },
  userId: { type: 'string', require: true },
  name: { type: 'string', require: true },
  last4: { type: 'string', require: true },
  expMonth: { type: 'number', require: true },
  expYear: { type: 'number', require: true },
  brand: { type: 'string' },
  isDefaultCard: { type: 'boolean', require: true, default: false },
  __v: { type: Number, select: false },
});

CardSchema.index('stripeId');

export interface Card extends Document {
  _id: string;
  stripeId: string;
  userId: string;
  name: string;
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
  isDefaultCard: boolean;
}

export const CardModel: Model<Card> = model<Card>('Card', CardSchema);

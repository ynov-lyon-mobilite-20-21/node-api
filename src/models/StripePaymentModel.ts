import {
  Document, Model, model, Schema,
} from 'mongoose';

const StripePaymentSchema = new Schema({
  intentId: { type: 'string', required: true }, // TODO: fix unique: true parameter
  userId: { type: 'string', required: true },
  createdAt: { type: 'Date', required: true },
  amount: { type: 'number', required: true },
  currency: { type: 'string', required: true },
  status: { type: 'string', required: true },
  __v: { type: Number, select: false },
});

StripePaymentSchema.index('stripePaymentIntentId');

export interface StripePayment extends Document {
  _id: string;
  intentId: string;
  userId: string;
  createdAt: Date;
  amount: number;
  currency: string;
  status: string;
}

export const StripePaymentModel: Model<StripePayment> = model<StripePayment>('Payment', StripePaymentSchema);

import {
  Schema, Document, Model, model,
} from 'mongoose';

const PaymentSchema = new Schema({
  stripeId: { type: 'string', required: true },
  amount: { type: 'number', required: true },
  status: { type: 'string', required: true },
  basket: { type: 'object', required: true },
  __v: { type: Number, select: false },
});

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface Payment extends Document {
  _id: string;
  stripeId: string;
  amount: number;
  status: string;
  basket: BasketItem[];
}

export const PaymentModel: Model<Payment> = model<Payment>('Payment', PaymentSchema);

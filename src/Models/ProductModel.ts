import {
  Schema, Document, Model, model,
} from 'mongoose';

const productSchema = new Schema({
  name: { type: 'string', required: true },
  price: { type: 'number', required: true },
  description: { type: 'string' },
  category: { type: 'string' },
  images: { type: 'array' },
  stripeId: { type: 'string', select: false },
  __v: { type: Number, select: false },
});

export interface Product extends Document {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    images: Array<string>;
    stripeId?: string;
}

export const ProductModel: Model<Product> = model<Product>('Product', productSchema);

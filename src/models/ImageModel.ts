import {
  Schema, Document, Model, model,
} from 'mongoose';

const imageSchema = new Schema({
  url: { type: 'string', required: true },
  __v: { type: Number, select: false },
});

export interface Image extends Document {
  _id: string;
  url: string;
}

export const ImageModel: Model<Image> = model<Image>('Image', imageSchema);

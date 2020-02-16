import {
  Schema, Document, Model, model,
} from 'mongoose';

const refreshTokenSchema = new Schema({
  token: { type: 'string', unique: true, required: true },
  expirationDate: { type: 'number', required: true },
  userId: { type: 'string', required: true },
  active: { type: 'boolean', required: true, default: true },
  __v: { type: Number, select: false },
});

export interface RefreshToken extends Document {
  _id: string;
  token: string;
  expirationDate: number;
  userId: string;
  active: boolean;
}

export const RefreshTokenModel: Model<RefreshToken> = model<RefreshToken>('RefreshToken', refreshTokenSchema);

import {
  Document, Model, model, Schema,
} from 'mongoose';

const UserSchema = new Schema({
  mail: { type: 'string', unique: true, required: true },
  password: { type: 'string', select: false },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  classroom: { type: 'string' },
  pictureUrl: { type: 'string' },
  registrationDate: { type: 'number' },
  active: { type: 'boolean', required: true },
  activationKey: { type: 'string' },
  stripeId: { type: 'string', select: false },
  stripeSourceId: { type: 'string', select: false },
  __v: { type: Number, select: false },
});

export interface User extends Document {
  _id: string;
  mail: string;
  password?: string;
  firstName: string;
  lastName: string;
  classroom: string;
  pictureUrl: string;
  registrationDate?: number;
  active: boolean;
  isAdmin: boolean;
  activationKey?: string;
  stripeId: string;
}

export const UserModel: Model<User> = model<User>('User', UserSchema);

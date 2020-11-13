import {
  Document, Model, model, Schema,
} from 'mongoose';

const UserSchema = new Schema({
  mail: { type: 'string', unique: true, required: true },
  password: { type: 'string', select: false },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  promotion: { type: 'string' },
  formation: { type: 'string' },
  pictureUrl: { type: 'string' },
  registrationDate: { type: 'number' },
  active: { type: 'boolean', required: true, default: false },
  activationKey: { type: 'string' },
  isAdmin: { type: 'boolean', required: true, default: false },
  isAdherent: { type: 'boolean', required: true, default: false },
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
  promotion: string;
  formation: string;
  pictureUrl: string;
  registrationDate?: number;
  active: boolean;
  activationKey?: string;
  isAdmin: boolean;
  isAdherent: boolean;
  stripeId: string;
  stripeSourceId: string;
}

export const UserModel: Model<User> = model<User>('User', UserSchema);

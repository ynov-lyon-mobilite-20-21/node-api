import {
  Document, Model, model, Schema,
} from 'mongoose';

const UserSchema = new Schema({
  mail: { type: 'string', unique: true, required: true },
  password: { type: 'string', required: true, select: false },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  promotion: { type: 'string', required: true },
  formation: { type: 'string', required: true },
  registrationDate: {
    type: Date, required: true, default: Date.now, select: false,
  },
  validationDate: { type: Date, default: null, select: false },
  activationKey: { type: 'string', select: false, default: null },
  isActive: { type: 'boolean', required: true, default: false },
  isAdmin: { type: 'boolean', required: true, default: false },
  isAdherent: { type: 'boolean', required: true, default: false },
  stripeId: { type: 'string', select: false, default: null },
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
  registrationDate?: number;
  activationKey?: string;
  isActive: boolean;
  isAdmin: boolean;
  isAdherent: boolean;
  stripeId: string;
  stripeSourceId: string;
}

export const UserModel: Model<User> = model<User>('User', UserSchema);

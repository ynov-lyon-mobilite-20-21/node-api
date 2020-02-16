import {
  Schema, Document, Model, model,
} from 'mongoose';

const UserSchema = new Schema({
  mail: { type: 'string', unique: true, required: true },
  password: { type: 'string', select: false },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  registrationDate: { type: 'number' },
  active: { type: 'boolean', required: true },
  isAdmin: { type: 'boolean', default: false },
  activationKey: { type: 'string' },
  address: { type: 'string' },
  postalCode: { type: 'string' },
  city: { type: 'string' },
  stripeId: { type: 'string', select: false },
  stripePlanId: { type: 'string', select: false },
  __v: { type: Number, select: false },
});

export interface User extends Document {
    _id: string;
    mail: string;
    password?: string;
    firstName: string;
    lastName: string;
    registrationDate?: number;
    active: boolean;
    isAdmin: boolean;
    activationKey?: string;
    address: string;
    postalCode: string;
    city: string;
    stripeId: string;
    stripePlanId: string;
}

export const UserModel: Model<User> = model<User>('User', UserSchema);

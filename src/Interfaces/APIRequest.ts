import { Request } from 'express';
import { User } from '../models/UserModel';

export interface APIRequest extends Request {
  user: User;
  userId: string;
}

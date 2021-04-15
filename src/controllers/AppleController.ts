/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData,
} from '../services/MongooseService';
import { Image, ImageModel } from '../models/ImageModel';

export const appleSiteAssociation = async (req: Request, res: Response) => {
  res.sendFile('./apple-app-site-association');
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData,
} from '../services/MongooseService';
import { Image, ImageModel } from '../models/ImageModel';

export const appleSiteAssociation = async (req: Request, res: Response) => {
  res.status(200).json({
    applinks: {
      details: [
        {
          appIDs: ['LYON YNOV CAMPUS.com.ynovlyon.bde'],
          components: [
            {
              '/': '/stripe/paymentReturn',
              exclude: true,
              comment: 'Matches any URL whose fragment equals no_universal_links and instructs the system not to open it as a universal link',
            },
          ],
        },
      ],
    },
  });
};

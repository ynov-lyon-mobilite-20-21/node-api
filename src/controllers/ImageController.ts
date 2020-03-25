/*  eslint-disable @typescript-eslint/explicit-function-return-type */

import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData,
} from '../services/MongooseService';
import { Image, ImageModel } from '../models/ImageModel';


export const postImage = async (req: Request, res: Response) => {
  const image = saveData<Image>({ model: ImageModel, params: req.body });

  if (!image) {
    return res.status(400).json({
      data: {},
      error: { code: 'UNKNOWN_ERROR' },
    });
  }

  res.status(200).json({
    data: image,
    error: {},
  });
};

export const getOneImageById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const image = await findOneBy<Image>({ model: ImageModel, condition: { _id } });

  if (!image) {
    return res.status(404).send({
      data: {},
      error: { code: 'INVALID_IMAGE_ID' },
    });
  }

  res.status(200).json({
    data: image,
    error: {},
  });
};

export const deleteImageById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const image = await deleteOnyBy<Image>({ model: ImageModel, condition: { _id } });

  if (!image) {
    return res.status(400).send({
      data: {},
      error: { code: 'UNKNOWN_ERROR' },
    });
  }

  res.status(204).send();
};

export const getAllImages = async (req: Request, res: Response) => {
  const images = await findManyBy<Image>({ model: ImageModel, condition: {} });

  res.status(200).json({
    data: images,
    error: {},
  });
};

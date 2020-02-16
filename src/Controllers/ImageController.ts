/*  eslint-disable @typescript-eslint/explicit-function-return-type */

import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData,
} from '../Services/MongooseService';
import { Image, ImageModel } from '../Models/ImageModel';


export const postImage = async (req: Request, res: Response) => {
  const image = saveData<Image>({ model: ImageModel, params: req.body });

  if (!image) {
    return res.status(400).json({ code: 'UNKNOWN_ERROR' });
  }

  res.status(200).json(image);
};

export const getOneImageById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const image = await findOneBy<Image>({ model: ImageModel, condition: { _id } });

  if (!image) {
    return res.status(404).send({ code: 'INVALID_IMAGE_ID' });
  }

  res.status(200).json(image);
};

export const deleteImageById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const image = await deleteOnyBy<Image>({ model: ImageModel, condition: { _id } });

  if (!image) {
    return res.status(400).send({ code: 'UNKNOWN_ERROR' });
  }

  res.status(204).send();
};

export const getAllImages = async (req: Request, res: Response) => {
  const images = await findManyBy<Image>({ model: ImageModel, condition: {} });

  res.status(200).json(images);
};

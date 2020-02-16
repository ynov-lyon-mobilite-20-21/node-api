/*  eslint-disable @typescript-eslint/explicit-function-return-type */

import { Request, Response } from 'express';
import {
  deleteOnyBy, findManyBy, findOneBy, saveData,
} from '../services/MongooseService';
import { Product, ProductModel } from '../models/ProductModel';


export const postProduct = async (req: Request, res: Response) => {
  const product = saveData<Product>({ model: ProductModel, params: req.body });

  if (!product) {
    return res.status(400).json({ code: 'UNKNOWN_ERROR' });
  }

  res.status(200).json(product);

  // const test = await stripe.plans.create({
  //     amount: price * 100,
  //     product: {
  //         name,
  //     }
  // })
};

export const getOneProductById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const product = await findOneBy<Product>({ model: ProductModel, condition: { _id } });

  if (!product) {
    return res.status(404).send({ code: 'INVALID_PRODUCT_ID' });
  }

  res.status(200).json(product);
};

export const deleteProductById = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const product = await deleteOnyBy<Product>({ model: ProductModel, condition: { _id } });

  if (!product) {
    return res.status(400).send({ code: 'UNKNOWN_ERROR' });
  }

  res.status(204).send();
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await findManyBy<Product>({ model: ProductModel, condition: {} });

  res.status(200).json(products);
};

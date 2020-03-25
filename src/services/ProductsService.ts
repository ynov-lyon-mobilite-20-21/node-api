import { BasketItem } from '../models/PaymentModel';
import { findOneBy } from './MongooseService';
import { Product, ProductModel } from '../models/ProductModel';

export const getBasketAmount = async (basket: BasketItem[]): Promise<number> => {
  let amount = 0;

  // @ts-ignore
  const productRequests = basket.map((productObject) => findOneBy<Product>({ model: ProductModel, condition: { _id: productObject.productId } }));
  const products = await Promise.all(productRequests) as Product[];

  products.forEach((product) => {
    // eslint-disable-next-line eqeqeq
    const { quantity } = basket.find((productObject) => productObject.productId == product._id)!;

    amount += (product.price * quantity * 100);
  });

  return Number(Number(amount).toFixed());
};

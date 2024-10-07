import { Product } from './product';

export class Orders {
  datePlaced: Date;
  shipping: any;
  items: {
    product: Product;
    quantity: string;
    totalPrice: string;
  };
}

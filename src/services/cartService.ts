import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totleAmount: 0 });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, ststus: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

interface AddItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const addItemToCart = async ({ productId, quantity, userId }: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // Dose the item exist in the cart ?
  const existsInCart = cart.items.find((p) => p.product.toString === productId);

  if(existsInCart) {
    return { data: "Item already exists in cart!", statusCode: 400 };
  }

  // Fetch the product
  const product = await productModel.findById(productId);

  if(!product) {
    return { data: "Product not found!", statusCode:400 }
  }

  if(product.stock < quantity) {
    return { data: "Low stock for item", statusCode: 400 };
  }

  cart.items.push({ product: productId, unitPrice: product.price, quantity });

  // Updata the totalAmount for the cart
  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};

interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({productId, quantity, userId}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find((p) => p.product.toString === productId);

  if(!existsInCart) {
    return { data: "Item dose not exist in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: 'Product not found!', statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: 'Low stock for item', statusCode: 400 };
  }

  const otherCartItem = cart.items.filter((p) => p.product.toString() !== productId);

  console.log(otherCartItem)

  let total = otherCartItem.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0)

  existsInCart.quantity = quantity;
  total += existsInCart.quantity * existsInCart.unitPrice;

  cart.totalAmount = total;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
}
import { cartModel, ICart, ICartItem } from '../models/cartModel';
import { IOrderItem, orderModel } from '../models/orderModel';
import productModel from '../models/productModel';

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
  populateProduct?: boolean;
}

export const GetActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart;
  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: 'active' })
      .populate('items.product');
  } else {
    cart = await cartModel.findOne({ userId, status: 'active' });
  }

  if (!cart) {
    cart = await createCartForUser({ userId });
  }
};

interface clearCart {
  userId: string;
}

export const clearCart = async ({ userId }: clearCart) => {
  const cart = await getActiveCartForUser({ userId });

  cart.items = [];
  cart.totalAmount = 0;

  const updatedCart = await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface GetActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, ststus: 'active' });

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

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // Dose the item exist in the cart ?
  const existsInCart = cart.items.find((p) => p.product.toString === productId);

  if (existsInCart) {
    return { data: 'Item already exists in cart!', statusCode: 400 };
  }

  // Fetch the product
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: 'Product not found!', statusCode: 400 };
  }

  if (product.stoke < quantity) {
    return { data: 'Low stock for item', statusCode: 400 };
  }

  cart.items.push({ product: productId, unitPrice: product.price, quantity });

  // Updata the totalAmount for the cart
  cart.totalAmount += product.price * quantity;

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find((p) => p.product.toString === productId);

  if (!existsInCart) {
    return { data: 'Item dose not exist in cart', statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: 'Product not found!', statusCode: 400 };
  }

  if (product.stoke < quantity) {
    return { data: 'Low stock for item', statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItems });

  existsInCart.quantity = quantity;
  total += existsInCart.quantity * existsInCart.unitPrice;

  cart.totalAmount = total;

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface DeleteItemInCart {
  productId: any;
  userId: string;
}

export const deleteItemIncart = async ({
  userId,
  productId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: 'Item does not exist in cart', statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  const total = calculateCartTotalItems({ cartItems: otherCartItems });

  cart.items = otherCartItems;
  cart.totalAmount = total;

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

const calculateCartTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
  const total = cartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  return total;
};

interface Checkout {
  userId: string;
  address: string;
}

export const checkout = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: 'Please add the address', statusCode: 400 };
  }
  const cart = await getActiveCartForUser({ userId });

  const orderItems: IOrderItem[] = [];

  //Loop cartItems and creat orderItems
  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) {
      return { data: 'Product not found', statusCode: 400 };
    }

    const orderItem: IOrderItem = {
      productTitle: product.title,
      productImage: product.image,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    };

    orderItems.push(orderItem);
  }

  const order = await orderModel.create({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });

  await order.save();

  //Update the status to be complrted
  cart.status = 'completed';
  await cart.save();

  return { data: order, statusCode: 200 };
};

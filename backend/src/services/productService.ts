import productModel from "../models/productModel";

export const getAllProduct = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: 'Dell Laptop',
        image: 'https://m.media-amazon.com/images/I/61GfMDJhhhL._AC_SL1500_.jpg',
        price: 15000,
        stoke: 10,
      },
    ];
    
    const existingProducts = await getAllProduct();
  
    if(existingProducts.length === 0) {
      await productModel.insertMany(products)
    }
  } catch (err) {
    console.log("cannot see database", err);
  }
};
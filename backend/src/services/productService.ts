import productModel from "../models/productModel";

export const getAllProduct = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: 'Dell Laptop',
        image:
          'https://m.media-amazon.com/images/I/61GfMDJhhhL._AC_SL1500_.jpg',
        price: 15000,
        stoke: 10,
      },
      {
        title: 'Asus Laptop',
        image:
          'https://eg-en.store.asus.com/media/catalog/product/_/l/_lnhetywof5emix4c.png?width=439&height=439&store=en_EG&image-type=image',
        price: 25000,
        stoke: 20,
      },
      {
        title: 'HP Laptop',
        image:
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTeMdK5bE-k2dYGv88xl1kf0VQ4MMycFtxQSLkkuqzO28r-2EqbK8aqcmjjxt1lbZ8C49Bpn2d_FrvBzSbAkhFLsiomI_DnaGn_6tu4eVwLjijV6dAlneIGTdUJ_cclzsKhSrYEkbFwxBo&usqp=CAc',
        price: 40000,
        stoke: 8,
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
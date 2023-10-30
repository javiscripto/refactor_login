import { cartModel } from "../models/carts.model.js";
import productModel from "../models/product.model.js";

export default class CartManagerDb {
  constructor() {}

  createCart = async (productsArr) => {
    let cart;

    if (productsArr.length > 0) {
      cart = await cartModel.create({ products: [] });

      for (const prod of productsArr) {
        let product = await productModel.findById(prod);

        if (product) {
          cart.products.push({ item: product._id, quantity: product.quantity });
        }
      }
    } else {
      cart = await cartModel.create({ products: [] });
    }

    return cart;
  };

  getAll = async () => {
    try {
      const carts = await cartModel.find().populate("products.item");
      return carts;
    } catch (error) {
      console.error("error: ", error);
    }
  };

  getById = async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId).populate("products.item").lean();
      
      return cart;
    } catch (error) {
      console.error("error: ", error);
    }
  };

  addProduct = async (cartId, productId) => {
    try {
      // busco el carrito por su id en la bd y lo traigo como objeto
      const cart = await cartModel.findById(cartId);
  
      if (!cart) {
      
        throw new Error("El carrito no existe");
      }
  
      //buscar dentro del array product que contiene el objeto cart, si existe el producto que deseo agregar
      const existingProduct = cart.products.find((product) => product.item.equals(productId));
  
      if (existingProduct) {
        existingProduct.quantity++;
        console.log("Se ha agregado cantidad al producto existente");
      } else {
        const newProduct = {
          item: productId,
          quantity: 1,
        };
  
        cart.products.push(newProduct); // pusheo el nuevo producto dentro del array products 
      }
  
      await cart.save(); // lo guardo en la base de datos y lo retorno para actualizar el carrito en mi archivo local carts.json
  
      return cart
    } catch (error) {
      console.error("error :", error);
    }
  };
  
  deleteProductById = async (cid, pid) => {
    try {
      const cart = await cartModel.findById(cid);
  
      if (!cart) {
        throw new Error("El carrito no existe");
      }
  
      const productToDeleteIndex = cart.products.findIndex((prod) => prod.item.toString() === pid);
  
      if (productToDeleteIndex === -1) {
        console.log("Producto no encontrado en el carrito");
      } else {
        // Eliminar el producto del array de productos del carrito
        cart.products.splice(productToDeleteIndex, 1);
        await cart.save();
        console.log("Producto eliminado del carrito");
      }
    } catch (error) {
      console.error("Error en la base de datos:", error);
    }
  };
  
}

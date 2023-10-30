import fs from "fs/promises";

export default class CartManagerFs {
  constructor() {
    this.path = "carts.json";
  }

  ////////////////////////////

  writecart = async (cartData) => {
    try {
      let cartsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
      let currentCarts = [...cartsJson, cartData];
      await fs.writeFile(this.path, JSON.stringify(currentCarts));
      console.log("se ha agregado carrito en ", this.path);
    } catch (error) {
      console.error("error:", error);
    }
  };

  getAll = async () => {
    try {
      let cartsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
      console.log(cartsJson);
      return cartsJson;
    } catch (error) {
      console.error("error de lectura :", error);
    }
  };

  getById = async (cartId) => {
    try {
      let cartsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
      let cartFind = cartsJson.find((cart) => cart._id === cartId);
      if (cartFind) {
        return cartFind;
      } else {
        console.log("no se ha encontrado el carrito");
      }
    } catch (error) {
      console.error("error de lectura:", error);
    }
  };
  //add product on cart
  /*
    integrar la logica para agregar un producto dentro de un carrito a traves de su id, verificando si exisate o no un producto agregado 
    */
  addProduct = async (cid, pid) => {
    try {
      let cartsJson = JSON.parse(await fs.readFile(this.path, "utf-8"));
      let cartFind = cartsJson.find((cart) => cart._id === cid);
      if (!cartFind) {
        return `carrito no encontrado`;
      }

      const existingProduct = cartFind.products.find((p) => p.item === pid);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        const newProduct = {
          item: pid,
          quantity: 1,
        };
        cartFind.products.push(newProduct);
      }

      await fs.writeFile(this.path, JSON.stringify(cartsJson));


    } catch (error) {
      console.error("error de escritura", error);
    }
  };
}

/////////////////////////////////////

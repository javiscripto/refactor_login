// product.route.js

import { Router } from "express";
import ProductManagerFS from "../DAO/managers/productManagerFs.js";
import ProductManagerDb from "../DAO/managers/productManagerDb.js";
import productModel from "../DAO/models/product.model.js";

const route = Router();

// Import managers
const pmFs = new ProductManagerFS();
const pmDb = new ProductManagerDb();

// Get all products // query params
route.get("/api/products/", async (req, res) => {
  //queryParams
  const limit = parseInt(req.query.limit);
  const page = req.query.page;
  try {
    const fsProducts = await pmFs.getAll(limit);
    const dbProducts = await pmDb.getAll(limit);
    //res.json({ result: "success", payload: { fsProducts, dbProducts } });
    res.render("home", { dbProducts });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});

// Get by id
route.get("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params;

    const fsProduct = await pmFs.getById(pid.pid);
    const dbProduct = await pmDb.getById(pid.pid);
    //res.json({ result: "success", payload: {  dbProduct, fsProduct } });
   
    res.render("detail", { dbProduct });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});

// Create product
route.post("/api/products/", async (req, res) => {
  try {
    const product = req.body;

    const createdProduct = await pmDb.createProduct(product);
    await pmFs.writeProduct(createdProduct);
    res.json({ result: "success", payload: createdProduct });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});

// Update product
route.put("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedProductData = req.body;
    const updatedProduct = await pmDb.updateProduct(pid, updatedProductData);
    await pmFs.updateProduct(pid, updatedProduct);
    res.json({ result: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});

// Delete product
route.delete("/api/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const deletedProduct = await pmDb.deleteProduct(pid);
    await pmFs.deleteProduct(pid);
    res.json({ result: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});

// ordenar por precio de manera ascendente o descendente, recibe por params $sort 1 o -1

route.get("/api/products/price/:sort", async (req, res) => {
  let sort = parseInt(req.params.sort);
  try {
    let priceSort = await productModel.aggregate([{ $sort: { price: sort } }]);

    res.json({ result: "success", data: priceSort });
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});

//fitrar por categoria
route.get("/api/products/category/:cat", async( req, res)=>{
  const category=  req.params.cat;
  try {
    let catData = await productModel.aggregate([{$match:{cat:category}}])
    res.status(200).json({result:"success", data: catData})
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
})




route.get('/products/', async (req, res) => {
  
  const page = parseInt(req.query.page) || 1; // Página actual, por defecto la primera.
  const limit = parseInt(req.query.limit) || 10; // Límite de resultados por página, por defecto 10.

  try {
   if(req.session.user){
    const options = {
      page,
      limit,
    };

    const result = await productModel.paginate({}, options);

    const hasPreviousPage = page > 1;
    const hasNextPage = page < result.totalPages;
    const previousPage = hasPreviousPage ? page - 1 : page;
    const nextPage = hasNextPage ? page + 1 : page;

    const dbProducts = result.docs.map((product) => product.toObject()); // Convertir a objetos JSON

    const user= req.session.user//usuario traido desde la ruta /register para usarlo en la vista products
    res.render('products', {
      dbProducts,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      currentPage: page,
      limit,
      user
    });
   }else{
    res.redirect("/login")
   }
  } catch (error) {
    res.status(500).json({ result: 'error', message: error.message });
  }
});






export default route;




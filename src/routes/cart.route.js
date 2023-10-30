import { Router } from "express";
const route=Router();

//import managers
import CartManagerDb from "../DAO/managers/cartManagerDb.js";
import CartManagerFs from "../DAO/managers/cartManagerFs.js";

const cartMfs= new CartManagerFs();
const cartMdb= new CartManagerDb();


//create cart

route.post("/api/carts/",async(req,res)=>{
    const products=req.body;

    try {
        let cart= await cartMdb.createCart(products);
        await cartMfs.writecart(cart)
        res.status(200).json({result:"success", payload:cart})
    } catch (error) {
        console.error("error:",error);
        res.status(500).json({error: error})
    }
});




//get all carts
route.get("/api/carts/", async(req, res)=>{
    try {
        let dbcarts = await cartMdb.getAll();
        
        //let fscarts= await cartMfs.getAll();
        res.status(200).json(
            {
                status: "success",
                 payload: {dbcarts},
                 
                })
    } catch (error) {
        console.error("error:",error);
        res.status(500).json({message:"error al cargar los carritos"})
    }
})

// get cart by id 
route.get("/api/carts/:cid", async(req,res)=>{
    try {
        const cid=req.params.cid;
        const dbCart= await cartMdb.getById(cid);
        const fsCart= await cartMfs.getById(cid);

        
         
        let products=dbCart.products;
        let id= dbCart._id

       
        //res.status(200).json({result: "success", payload:{dbCart,fsCart}})
        res.render("cart", {id, products})
    } catch (error) {
        res.status(500).json({result:"error", message:error.message})
    }
})



//add product to cart
route.post("/api/carts/:cid/products/:pid", async ( req, res)=>{
    try {
        const cid= req.params.cid;
        const pid= req.params.pid;

       let result=  await cartMdb.addProduct(cid,pid);
       //console.log(result)
       await cartMfs.addProduct(cid,pid)
        res.status(200).json({ result: "success", message: "Producto agregado al carrito" });
       
    } catch (error) {
        res.status(500).json({result:"error", message: error.message})
    }
})


//delete productBy ID
route.delete("/api/carts/:cid/products/:pid", async(req, res)=>{
    try {
        const cid= req.params.cid;
        const pid= req.params.pid;
        
        await cartMdb.deleteProductById(cid,pid)
        res.status(200).json({result: "success", message:"producto eliminado"})

    } catch (error) {
        res.status(500).json({result:"error", message: error.message})
    }
})



export default route;

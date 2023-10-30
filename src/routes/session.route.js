import { Router } from "express";
import UserManager from "../DAO/managers/usersManager.js";
import { createHash, isValidPass  } from "../../utils.js";






const route= Router()
const manager = new UserManager()



// register/create new user


route.get("/register", ( req, res)=>{
    res.render("register")
})

route.post("/register", async( req, res)=>{

    const {first_name,last_name,email,age,password}=req.body;
    
    if(!first_name||!last_name||!email||!age)return res.status(400).send("faltan datos");

    const user={
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
    }
    await manager.register(user, req.body.password)
    //si se proporciona un usuario, este será almacenado en la base de datos y se redireccionará al endpoint login
    

    if(user)res.redirect("/login")
    
})

/// login 

route.get("/login", (req, res)=>{
    res.render("login")
})


route.post("/login", async (req, res) => {
    const credentials = req.body;
    //las credenciales necesarias seran email y password, se enviarán al manager para validar si existe un usuario en la BD con dichas credenciales 

    try {
        const [existingUser, user] = await manager.login(credentials);//el manager devolvera un array con true o false como primera posicion; y el objeto usuario encontrado o null como segunda
        
        if (existingUser) {//solo si se encuentra, se registra la sesion y se redirecciona a la vista products
            
            req.session.user = user;
            res.redirect("/products");
        } else {
            res.send(`usuario no registrado <br> <a href="/register">registrarse</a>`);//en caso contrario, se redirecciona al endpoint /register , para registrarse
        }
    } catch (error) {
        
        res.status(500).send("Error de base de datos");
    }
});






route.get("/logout", (req, res)=>{
    req.session.destroy(err=>{
        if(!err)res.redirect("/login")
        else res.send({status:`logout error`, body: err})
    })

})



export default route;

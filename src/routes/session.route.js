import { Router } from "express";
import UserManager from "../DAO/managers/usersManager.js";
import bcrypt from "bcrypt";


//funcion para hashear la contraseña antes de guardarla en mongo 
const hashPassword= async(user)=>{
    try {
        const hash = await bcrypt.hash(user.password,10);
        user.password=hash;
        return user
    } catch (error) {
        throw error
    }
}



const route= Router()
const manager = new UserManager()

//instancia del manager de usuarios


// register/create new user


route.get("/register", ( req, res)=>{
    res.render("register")
})

route.post("/register", async( req, res)=>{
    const user=req.body
    await manager.register(user)
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

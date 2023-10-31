import express,{json}from"express";
import mongoose from "mongoose";
import session from "express-session";
import FileStore  from "session-file-store";
import MongoStore from "connect-mongo";
//seteo trabajo con rutas
import {fileURLToPath} from "url";
import path from "path";

import passport from "passport";

const __filename=fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)





const app= express();
const PORT = 8080;

//const fileStorage = FileStore(session)


//middlewares
app.use(json());
app.use(express.urlencoded({extended:true}));
   

        //set session
app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://javiermecker94:8GQVknO1JuiAQ920@ecomerce.9sqyqwu.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions:{useNewUrlParser: true, useUnifiedTopology:true},
        ttl:120,//si el usuario no presenta actividad durante 120 seg, se redirigira al login
    }),
    secret:"clave",
    resave: false,
    saveUninitialized:true,
    
}))


//set public folder
app.use(express.static(path.join(__dirname,`public`)));

console.log(__dirname,"folder")

//import routes
import productRoute from "./routes/products.route.js"
import cartRoute from "./routes/cart.route.js"
import messagesRoute from "./routes/messages.route.js";
import sessionRoute from "./routes/session.route.js"

app.use("/",sessionRoute)
app.use("/",productRoute)
app.use("/", cartRoute)
app.use("/", messagesRoute)

//handlebars
import { engine } from "express-handlebars";
app.engine("handlebars", engine());
app.set("view engine","handlebars")
app.set("views",__dirname+`/views`);




// route add new product

    //get
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname,`public`,`index.html`))
})
    //post


///////////////////////////////////  set mongoose conection

mongoose.connect("mongodb+srv://javiermecker94:8GQVknO1JuiAQ920@ecomerce.9sqyqwu.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true })
.then(()=>{
    console.log("conectado a la base de datos")
})
.catch(error=>{console.log("error al conectar ")})







app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`)
})




import { Router } from "express";

const route= Router();

import MessageManager from "../DAO/managers/messagesManager.js";
const manager= new MessageManager();






route.get("/messages/", async(req, res)=>{
    try {
        let messages= [await manager.getAllMessages()];
        console.log(messages)
        res.render("chat.handlebars",{messages} )
       
        
    } catch (error) {
        console.error("error:", error)
    }
})






route.post("/messages/", async(req, res)=>{
    try {
        
        let objectMessage= req.body;
        console.log(objectMessage)
        let result = await manager.createMessage(objectMessage);
        console.log(result)

    } catch (error) {
        console.error("error: ", error)
    }
})


export default route;

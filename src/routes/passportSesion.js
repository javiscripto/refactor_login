







route.post("/reg", passport.authenticate("register",{failureRedirect:"/failRegister"}), async(req, res)=>{
    res.send({status: "success", message:"usuario registrado"})
})
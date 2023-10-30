import { isValidPass } from "../../../utils.js";
import userModel from "../models/users.model.js";

export default class UserManager{
    constructor(){};

    register= async(userData,password)=>{
        try {
            let user;
            if(userData.email=="adminCoder@coder.com"&&password=="adminCod3r123"){
                 user = {...userData,role:"admin"}
            }else{
                user={...userData,role:"user"}
            };
            
            const userToSave= new userModel(user);
            const savedUser= await userToSave.save();
            console.log(savedUser)
        } catch (error) {
            console.error("error en DB: ", error)
        }
    }

    login=async( credentials)=>{
        try {
            const { email, password } = credentials;
            const user = await userModel.findOne({ email }).lean();

            if (user&& isValidPass(user,password)) {
                return [true, user]
            } else {
                return [false, null]
            }
        } catch (error) {
            console.error("error en db:", error);
            throw error;
        }
    }



}
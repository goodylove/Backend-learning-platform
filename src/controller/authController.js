import { BadRequestError } from "../errors/customErrors.js";
import { registerUser } from "../services/authServices.js"


export async function register(req,res){
    
      const {name,email,password} = req.body

       if(!name || !email || !password){
        throw new BadRequestError("all field are required")
       }

       const user = await registerUser({name,email,password} )

       res.status(201).json({
        message: 'User registered successfully',
        user,
      });



    
}
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/customErrors.js";
import { registerUser } from "../services/authServices.js"


export async function register(req,res){
    
      const {name,email,password} = req.body

       if(!name || !email || !password){
        throw new BadRequestError("All fields are required")
       }

       const user = await registerUser({name,email,password} )

       res.status(StatusCodes.CREATED).json({
        message: 'User registered successfully',
        user,
      });



    
}
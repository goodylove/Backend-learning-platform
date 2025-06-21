import jwt from 'jsonwebtoken';

import { unAuthenticatedError, unAuthorizedError } from "../errors/customErrors.js"
import { StatusCodes } from 'http-status-codes';

 export function authMiddleWare(req,res,next){
    console.log("Auth Middleware called",req.cookies);
    const {token} = req.cookies

    if(!token){
        throw new unAuthenticatedError("UnAuthorized")
    }
    
    try {
        const verifyToken =  jwt.verify(token,process.env.JWT_SECRETE)
        req.user = verifyToken
        next()
    } catch (error) {
        res.status(StatusCodes.FORBIDDEN).json({message:"InValid Token"})
        
    }

 }


 export const authPermission =(...role)=>{
  return (req,res,next)=>{
   if(!role.includes(req.user.role)){
        throw new unAuthorizedError("You are not authorized to access this resource")
    }
    next()
  }

 }
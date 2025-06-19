import jwt from 'jsonwebtoken';

import { unAuthenticatedError, unAuthorizedError } from "../errors/customErrors"
import { StatusCodes } from 'http-status-codes';

 export function authMiddleWare(req,res,next){
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
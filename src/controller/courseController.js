import { StatusCodes } from "http-status-codes"
import { unAuthenticatedError } from "../errors/customErrors.js"
import { createCourseService } from "../services/courseService.js"




export const createCourseController = async(req,res)=>{
    const {title,description} = req.body
    
    const instructorId = req.user

    if(!instructorId){
        throw new unAuthenticatedError("You can not create a course")
    }

    await createCourseService({title,description,instructorId})

    res.status(StatusCodes.OK).json({message:"Course has been created successfully"})
}


export const getAllCoursesController = async(req,res)=>{
    

}
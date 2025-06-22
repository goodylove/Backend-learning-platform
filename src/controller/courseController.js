import { StatusCodes } from "http-status-codes"
import { unAuthenticatedError } from "../errors/customErrors.js"
import { createCourse,  getAllCourses } from "../services/courseService.js"




export const createCourseController = async(req,res)=>{
    const {title,description} = req.body
    
    const instructorId = req.user.userId
    

    await createCourse({title,description,instructorId})

    res.status(StatusCodes.OK).json({message:"Course has been created successfully"})
}


export const getAllCoursesController = async(req,res)=>{

   const course = await getAllCourses()

    if(!course || course.length === 0){
         return res.status(StatusCodes.NOT_FOUND).json({message:"No course found"})
    }
    

 res.status(StatusCodes.OK).json({message:"All courses fetched successfully",courses:course})


}
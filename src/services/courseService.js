import { BadRequestError } from "../errors/customErrors.js"
import { createCourseModel } from "../models/courseModel.js"


export const createCourseService = async({title,description,instructorId})=>{
    if(!title || !description || instructorId){
        throw new BadRequestError("all fields are required")

    }
 return  await createCourseModel({title,description,instructorId})

}



export const getAllCoursesService = async()=>{
    return await createCourseModel.find({})
}
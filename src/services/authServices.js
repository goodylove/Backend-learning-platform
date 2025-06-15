import { BadRequestError } from "../errors/customErrors.js";
import { createUser, findUserByEmail } from "../models/userModel.js"
import bcrypt from "bcrypt"




export const registerUser = async ({ name, email, password }) => {

    const existingUser = await findUserByEmail(email)

    if (existingUser) {

        throw new BadRequestError("User already exist");

    }

    const hashPassword = await bcrypt.hash(password,10)


    const newUser  =  await createUser({
        name,
        email,
        password:hashPassword
    })

    const {password: _, ...safeUser} = newUser

    return safeUser






}
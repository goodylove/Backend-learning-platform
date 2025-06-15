import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();


export const createUser = async({name,email, password})=>{

    await prisma.user.create({
        data:{
            name,
            email,
            password
        }
    })

}


export const findUserByEmail = async (email)=>{
    await prisma.user.findUnique({
        where : {email}
    })
}

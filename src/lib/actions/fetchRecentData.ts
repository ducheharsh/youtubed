"use server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export default async function(userId:string){
    console.log("Fetching recent data")
    const recentData = await prisma.playlists.findMany({
        where:{
            user:{
                id:userId
            }
        },
        take:5,
        orderBy:{
            createdAt:"desc"
        }
    })

    return recentData;
}
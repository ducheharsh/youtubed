import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()

export async function GET(req: NextRequest){
    const body = await req.json();


  try{
    const recentData = await prisma.playlists.findMany({
        where:{
            user:{
                id:body.userId
            }
        },
        take:5,
        orderBy:{
            createdAt:"desc"
        }
    })

    return NextResponse.json(recentData)
  }catch(err){
    return NextResponse.json({
        error:err
    })
  }
}
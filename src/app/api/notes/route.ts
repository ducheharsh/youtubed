import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



const prisma = new PrismaClient()

export async function POST(req: NextRequest){
    const body = await req.json();
    try{
        const playlist = await prisma.playlists.findUnique({
            where:{
                userId:body.userId,
                pid:body.pid
            }

        })
        const note = await prisma.videos.update({
            where:{
                playlistId:playlist?.id,
                id:body.vid as string
            },
            data:{
                notes:body.notes
            }
        })
        return NextResponse.json({
            msg:"Note added successfully",
        })
    }catch(err){
        return NextResponse.json({
            error:err
        })
    }
}

export async function GET(req: NextRequest){
    const userId = req.nextUrl.searchParams.get("userId") as string
    const pid = req.nextUrl.searchParams.get("pid") as string
    const vid = req.nextUrl.searchParams.get("vid") as string

    try{
        const playlist = await prisma.playlists.findUnique({
            where:{
                userId:userId,
                pid:pid
            }

        })
        const note = await prisma.videos.findUnique({
            where:{
                playlistId:playlist?.id,
                id:vid
            }
        })
        return NextResponse.json({
            notes:note?.notes
        })
    }catch(err){
        return NextResponse.json({
            error:err
        })
    }
}
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()

export async function POST(req: NextRequest){
    const body = await req.json();

    try{
        let playlist = await prisma.playlists.findUnique({
            where: {
              pid: body.pid as string,
            },
          });
        
          // If the playlist does not exist, create it
          if (!playlist) {
            playlist = await prisma.playlists.create({
              data: {
                pid: body.pid as string,
                userId: body.userId,
                // Initially, do not include videos here, create them separately
              },
            });
          }
        
          // Now, create the video and associate it with the playlist
          const video = await prisma.videos.create({
            data: {
              id: body.vid as string,
              notes: {}, // Add actual notes from body if available
              playlistId: playlist.id, // Use the playlist ID from the newly created or found playlist
            },
          });
        
          return NextResponse.json({ playlist, video });
}catch(err){
    return NextResponse.json({
        error:err
    })
}
}
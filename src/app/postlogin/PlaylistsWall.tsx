"use client";
import PlaylistsHolder from "@/components/custom-components/playlists-holder";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

export default function PlaylistsWall(session: any) {
  const router = useRouter();
  console.log("Session", session);
  console.log("Session data", JSON.parse(session?.session.value).accessToken);
  const accessToken = JSON.parse(session?.session.value).accessToken;
  const [data, setData] = useState([]);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  // const [recentData, setRecentData] = useState([])

  useEffect(() => {
    resizeText();
    window.addEventListener("resize", resizeText);
    return () => {
      window.removeEventListener("resize", resizeText);
    };
  }, [session]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=10&mine=true&fields=items&key=${process.env.YOUTUBE_API_KEY}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setData(response.data.items);
      } catch (err) {
        console.log("Error while fetching data", err);
      }
    }
    fetchData();
  }, [session, setData, data]);

  const resizeText = () => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    const containerWidth = (container as any).offsetWidth;
    let min = 1;
    let max = 2500;

    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      (text as any).style.fontSize = mid + "px";

      if ((text as any).offsetWidth <= containerWidth) {
        min = mid + 1;
      } else {
        max = mid - 1;
      }
    }

    (text as any).style.fontSize = max + "px";
  };

  //  useEffect(()=>{
  //   async function fetchRecentData(){
  //     try{
  //     const response = await axios.get('http://localhost:3000/api/user/rps/',{
  //       data:{
  //         userId:(session?.data as any).userId
  //       }
  //     })
  //     setRecentData(response.data)
  //   }catch(err){
  //     console.log("Error while fetching data",err)
  //   }
  //   }
  //   fetchRecentData()
  //   console.log("Fetching recent data" , recentData)
  // },[session])

  return (
    <Suspense>
      <div>
        <div
          className="absolute flex h-screen w-full items-center overflow-y-auto"
          ref={containerRef}
        >
          <span
            className="absolute bottom-12 left-0 mx-auto whitespace-nowrap text-center font-bold uppercase text-white"
            ref={textRef}
          >
            My Youtube Playlists
          </span>
        </div>
        <div>
          {/* <ul className="max-h-screen overflow-y-auto flex flex-wrap w-screen justify-items-center">
        {recentData.map((playlist:any)=>(
  
            <PlaylistsHolder key={playlist.id} title={playlist.snippet.title} channel={playlist.snippet.channelTitle} onClick={()=>{
              localStorage.setItem('playlistId', `https://youtube.com/playlist?list=${playlist.id}`)
              router.push('/dashboard')
            }}/>
            
          ))}
          </ul> */}
        </div>

        <div
          className="absolute mt-8 md:items-start items-center justify-center h-screen w-full  overflow-y-auto"
          ref={containerRef}
        >
          <ul className="max-h-screen overflow-y-auto flex flex-wrap w-screen justify-items-center">
            {data.map((playlist: any) => (
              <div
                onClick={() => {
                  router.push("/dashboard");
                  localStorage.setItem(
                    "playlistId",
                    `https://youtube.com/playlist?list=${playlist.id}`,
                  );
                }}
              >
                <PlaylistsHolder
                  key={playlist.id}
                  thumbnail={playlist.snippet.thumbnails.high.url}
                  title={playlist.snippet.title}
                  channel={playlist.snippet.channelTitle}
                />
              </div>
            ))}
          </ul>
        </div>
      </div>
    </Suspense>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import LeftSidebar from "@/components/custom-components/left-sidebar";
import CustomYouTubePlayer from "@/components/custom-components/custom-vp";

function ClientSideComponent() {
  const searchParams = useSearchParams();
  const session = useSession();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const vid = searchParams.get("vid") || " ";
  const playlistId =
    typeof window !== "undefined" ? localStorage.getItem("playlistId") : null;
  const pid = getPlaylistId(playlistId as string);

  function getPlaylistId(url: string): string | null {
    const regex: RegExp = /(?:list=)([a-z0-9_-]+)/i;
    const match: RegExpMatchArray | null = url.match(regex);
    return match ? (match as RegExpExecArray)[1] : null;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${pid}&prettyPrint=true&key=${process.env.YOUTUBE_API_KEY}`,
          {
            headers: {
              Authorization: `Bearer ${session.data ? (session.data as any).accessToken : ""}`,
            },
          },
        );
        setData(response.data.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 4000);
      }
    }

    fetchData();
  }, [pid, session]);

  useEffect(() => {
    async function addData() {
      try {
        const response = await axios.post("/api/user", {
          userId: (session.data as any).id,
          pid: pid,
          vid: vid,
        });
        return response.data;
      } catch (err) {
        console.log("Error while adding data", err);
      }
    }
    if (session.data && vid && pid) {
      addData();
    }
  }, [session, vid, pid]);

  if (isLoading) {
    return (
      <div className="col-span-6">
        <MultiStepLoader loading={isLoading} duration={900} />
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex md:fixed top-0 border-r-2 md:h-screen" id="sidebar">
        <LeftSidebar
          className="md:h-full md:fixed col-span-4"
          playlistArr={data}
        />
      </div>
      <div className="md:ml-16 md:mt-4 rounded-lg col-span-6 md:col-span-4">
        <CustomYouTubePlayer info={data} videoId={vid} pid={pid} />
      </div>
    </div>
  );
}

export default ClientSideComponent;

"use client";
import axios from "axios";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ChapterTile({ onc }: any) {
  const searchParams = useSearchParams();
  const vid = searchParams.get("vid");
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`https://yt.lemnoslife.com/videos?part=chapters&id=${vid}`)
        .then((response) => {
          // Check if items exists and has at least one element
          if (response.data?.items && response.data.items.length > 0) {
            setChapters(response.data.items[0].chapters?.chapters || []);
          } else {
            // Handle the case where items is empty or undefined
            console.log("No chapters found");
            setChapters([]);
          }
        });
    }
    fetchData();
  }, [vid]);

  return (
    <div className=" overflow-auto h-[52vh] w-[22rem]  shadow-md rounded-lg backdrop-blur-xl  border border-white/20">
      <div className="bg-white/20 p-3 sticky">
        <h1 className="text-lg">Chapters</h1>
      </div>
      <hr className="border border-white/20 " />
      <div className="w-fit py-3 px-1">
        {chapters.map((chapter: any) => (
          <Ytcards
            key={chapter.time}
            // Add a unique key for each child in a list
            title={chapter.title}
            thumbnails={chapter.thumbnails}
            time={chapter.time}
            onc={() => {
              onc(chapter.time);
            }}
          />
        ))}
      </div>
    </div>
  );
}
function convertStoMs(seconds: number) {
  let minutes = ~~(seconds / 60);
  let extraSeconds = seconds % 60;
  return `${minutes}:${extraSeconds}`;
}

function Ytcards({ title, thumbnails, time, onc }: any) {
  return (
    <div
      className="flex flex-row py-2 rounded-md hover:cursor-pointer hover:bg-red-600 active:bg-red-800"
      onClick={onc}
    >
      <div className="min-w-fit">
        <img
          className="rounded-lg ml-1"
          src={thumbnails[0].url}
          alt="thumbnail"
        />
      </div>
      <div className="ml-4 mt-1 text-sm font-semibold flex flex-col">
        {title}
        <span className="mt-2 text-sm bg-blue-700/60 w-fit p-[0.08rem]">
          {convertStoMs(time)}
        </span>
      </div>
    </div>
  );
}

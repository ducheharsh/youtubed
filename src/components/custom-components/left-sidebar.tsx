"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function LeftSidebar(data: any) {
  const router = useRouter();
  return (
    <Sheet>
      <SheetTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 m-3 "
        >
          <path
            fillRule="evenodd"
            d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </SheetTrigger>
      <SheetContent side={"left"} className="overflow-y-auto w-fit">
        <SheetHeader>
          <SheetTitle>Playlist Items</SheetTitle>

          <SheetDescription>
            {data.playlistArr.map((video: any, index: number) => {
              return (
                <Ytcards
                  key={video.snippet.resourceId.videoId}
                  title={video.snippet.title}
                  thumbnails={video.snippet.thumbnails}
                  time={video.snippet.publishedAt}
                  onc={() => {
                    router.push(
                      `/dashboard?vid=${video.snippet.resourceId.videoId}&index=${index}`,
                    );
                  }}
                />
              );
            })}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

const formatTime = (time: any) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return `${hours > 0 ? `${hours}:` : ""}${hours > 0 && minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

function Ytcards({ title, thumbnails, time, onc }: any) {
  return (
    <div
      className="flex flex-row py-2 rounded-md hover:cursor-pointer hover:bg-red-600 active:bg-red-800"
      onClick={onc}
    >
      <div className="min-w-fit">
        <img
          className="rounded-lg ml-1 "
          src={thumbnails["default"].url}
          alt="thumbnail"
        />
      </div>
      <div className=" ml-4 mt-1 text-sm font-semibold flex flex-col">
        {title}
        <div className="mt-2 text-sm bg-blue-700/60 w-fit p-[0.08rem]">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
}

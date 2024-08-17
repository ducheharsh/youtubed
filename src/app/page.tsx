"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FlipLink from "@/components/custom-components/flip-link";
import Appbar from "@/components/custom-components/navbar";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { ChevronDown } from "lucide-react";

import localFont from "@next/font/local";
const myFont = localFont({
  src: "../components/custom-components/fonts/Shockwave.woff",
  variable: "--font-main",
});

export default function Home() {
  const handleScroll = (target: string) => {
    const element = document.getElementById(`${target}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  function getPlaylistId(url: string): string {
    const regex = /(?:list=)([a-z0-9_-]+)/i;
    const match = url.match(regex);
    return match ? match[1] : "null";
  }

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const placeholders = [
    "It can be your academics playlist ",
    "An MIT course that you want to compelete",
    "Your custom playlists (Even a single video is fine)",
    "The music lesson playlist that you left",
    "Just Enter any playlist",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("playlistId", e.target.value);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setTimeout(() => {
      setLoading(true);
    }, 1000);
    router.push("/dashboard");
    console.log("submitted");
  };

  return (
    <>
      <div className="fixed inset-0 z-0">
        <BackgroundGradientAnimation overlayOpacity={0} />
      </div>
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <Appbar />
        <section className=" h-screen w-full flex mt-[20vh] justify-center">
          <div className="flex flex-col w-full xl:mt-0 mt-[10vh] items-center px-4">
            <h2 className="mb-12 group flex  text-center sm:text-7xl drop-shadow-xl ">
              <span
                className={`text-8xl group-hover: text-white drop-shadow-2xl sm:text-9xl ${myFont.variable} font-poppins uppercase lg:text-[300px] `}
              >
                YOUTUBED
              </span>
            </h2>
            <h3></h3>
            <div className="xl:w-3/4 w-[100%] mt-8">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>

            <ChevronDown
              onClick={() => handleScroll("secondsection")}
              className="w-10 h-10 mt-[64vh] absolute  hover:opacity-20 text-red-500 animate-bounce justify-end"
            />
          </div>
        </section>

        <section
          id="secondsection"
          className=" scroll-smooth min-h-screen w-full flex items-center justify-center"
        >
          <div className="flex flex-col items-center px-4">
            <h2 className="mb-10 sm:mb-15 flex ml-4 text-center sm:text-7xl drop-shadow-xl">
              <FlipLink href="#">YOUTUBED</FlipLink>
            </h2>
            <h3></h3>
            <div className="w-3/4 mt-2">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

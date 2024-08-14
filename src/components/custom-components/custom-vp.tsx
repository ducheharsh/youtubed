"use client";
import React, {
  useState,
  useRef,
  useEffect,
  use,
  useReducer,
  useMemo,
} from "react";
import YouTube from "react-youtube";
import { YouTubePlayer } from "react-youtube";
import TailwindEditor from "@/components/custom-components/tailwind-editor";
import { useSearchParams } from "next/navigation";
import ChapterTile from "./chapter-scroll";
import { JSONContent } from "novel";
import { defaultValue } from "@/app/dashboard/default-value";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import uid from "lodash/uniqueId";
import { Progress } from "../ui/progress";
import axios from "axios";
import { useSession } from "next-auth/react";
import ChatBot from "./chatbot";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const CustomYouTubePlayer = ({
  videoId,
  info,
  pid,
}: {
  videoId: string;
  info: any;
  pid: any;
}) => {
  //Driver js for onboarding
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#videoplayer",
        popover: {
          title: "This is your custom video player",
          description:
            "Here is the code example showing animated tour. Let's walk you through it.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "#chapterTile",
        popover: {
          title: "All Chapter of the vidoe",
          description:
            "It works only when the creator has chapterised the video.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#progressBar",
        popover: {
          title: "Progress Bar",
          description:
            "This is where you can get glimpse of notes that you have added",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#customprogbar",
        popover: {
          title: "Create Driver",
          description:
            "Simply call the driver function to create a driver.js instance",
          side: "left",
          align: "start",
        },
      },
      {
        element: "#bot",
        popover: {
          title: "Videobuddy",
          description:
            "This is an your AI sidekick which is fed with the video transcripts",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#addnote",
        popover: {
          title: "Add a note",
          description: "here you can add your note and delete it",
          side: "right",
          align: "start",
        },
      },
      {
        popover: {
          title: "Happy Learning",
          description:
            "And that is all, go ahead and start adding tours to your applications.",
        },
      },
    ],
  });
  if (localStorage.getItem("firstTime") === null) {
    driverObj.drive();
    localStorage.setItem("firstTime", "true");
  }

  // Player States
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Notes States
  const [popupNotes, setPopupNotes] = useState<
    { time: number; note: JSONContent; thumbnail: string }[]
  >([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteInput, setNoteInput] = useState<JSONContent>(defaultValue) || {};
  const [hoveredNote, setHoveredNote] = useState<{
    time: number;
    note: JSONContent;
    thumbnail: string;
  } | null>(null);
  const [Bool, setBool] = useState(false);

  // Progress Tracking States
  const [ProgressState, setProgressState] = useState([0]);
  const [start, setStart] = useState(0);
  const [progressSum, setProgressSum] = useState(0);
  const [onPlay, setOnPlay] = useState(false);

  // Other States
  const [description, setDescription] = useState<JSONContent>() || {};
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const editorRef = useRef(null);
  const searchParams = useSearchParams();
  const index = searchParams.get("index") || 0;
  const session = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Load notes from local storage & set description content
  useMemo(() => {
    try {
      const response = axios
        .get(`/api/notes`, {
          params: {
            pid: pid,
            userId: (session?.data as any).id,
            vid: videoId,
          },
        })
        .then((res) => {
          if (Object.keys(res.data.notes).length !== 0) {
            setPopupNotes(res.data.notes);
          } else {
            setPopupNotes([]);
          }
        });
    } catch (err) {
      console.log(err, "error while fetching notes");
    }

    const descriptionContent: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `${info[index].snippet?.description}`,
            },
          ],
        },
      ],
    };
    setDescription(descriptionContent);
    if (localStorage.getItem(`${pid}_progress`)) {
      const progress = JSON.parse(
        localStorage.getItem(`${videoId}_progress`) || "0",
      );
      setProgressSum(progress);
    }
  }, [videoId, index]);

  // Update current time every second
  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [player]);

  // Add a note to the popup notes
  const addPopupNote = () => {
    if (noteInput) {
      const newNote = {
        time: currentTime,
        note: noteInput,
        thumbnail: getThumbnailUrl(videoId, currentTime),
      };
      setPopupNotes([...popupNotes, newNote]);
      try {
        const response = axios
          .post("/api/notes", {
            userId: (session?.data as any).id,
            vid: videoId,
            notes: [...popupNotes, newNote],
            pid: pid,
          })
          .then((res) => {
            console.log(res, "added");
          });
      } catch (err) {
        console.log(err, "error while adding note");
      }
      setNoteInput({});
      setShowNoteInput(false);
    }
  };

  // On ready, set player & duration
  const onReady = (event: any) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  // Handle progress bar click
  const handleProgressBarClick = (e: any) => {
    const progressBar = progressBarRef.current;
    if (progressBar) {
      const clickPosition =
        (e.clientX - progressBar.getBoundingClientRect().left) /
        progressBar.offsetWidth;
      const newTime = clickPosition * duration;
      player.seekTo(newTime);
    }
  };

  // Handle seeking (Mislleanous function)
  const handleSeek = (time: number) => {
    if (player) {
      console.log("jumping to chapter", time);
      player.seekTo(time); // Seek to 10 seconds
      player.playVideo(); // Play the video
    }
  };

  const formatTime = (time: any) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours > 0 ? `${hours}:` : ""}${hours > 0 && minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getThumbnailUrl = (videoId: string, time: number) => {
    // In a real application, you would make an API call to YouTube Data API here
    // For this example, we'll use a placeholder image
    return `/api/placeholder/120/90`;
  };

  function chapterSeek(time: number) {
    if (player) {
      console.log("jumping to chapter", time);
      player.seekTo(time); // Seek to 10 seconds
      player.playVideo(); // Play the video
    }
  }

  const [uuid] = useState(uid(`${videoId}-`));
  console.log(info, "this is the info");
  return (
    <div className="grid grid-cols-6 mx-auto p-4" id={videoId}>
      <div
        id="videoplayer"
        className="col-span-6 md:col-span-4 relative pb-[56.25%] h-0 overflow-hidden mb-4"
      >
        <YouTube
          videoId={videoId}
          onReady={onReady}
          title="YouTube video player"
          opts={{
            playerVars: { controls: 0 },
            width: "100%",
            height: "100%",
          }}
          onPlay={() => {
            const start = new Date().getTime();
            setStart(start);
            setOnPlay(!onPlay);
            setIsPlaying(true);
          }}
          onPause={() => {
            const end = new Date().getTime();
            let time = end / 1000 - start / 1000;
            console.log(time);
            setProgressState([...ProgressState, time]);
            const sum = ProgressState.reduce(
              (partialSum, a) => partialSum + a,
              0,
            );
            console.log(formatTime(sum));
            const results = Number(sum.toFixed(2));
            console.log(results, "prt");
            setProgressSum(results);
            setOnPlay(!onPlay);
            setIsPlaying(false);
            localStorage.setItem(
              `${pid}_progress`,
              JSON.stringify(progressSum),
            );
          }}
          className="absolute rounded-xl overflow-auto top-0 left-0 w-full h-full"
        />
      </div>

      <div className="col-span-2 flex-col hidden md:flex  md:justify-center items-center">
        <h1 className="text-lg font-semibold text-start mb-2 ">
          My Progress 🧑‍💻
        </h1>
        <Progress id="progressBar" value={progressSum} className="w-3/4 mb-4" />
        <ChapterTile
          id="chapterTile"
          onc={chapterSeek}
          className="hidden md:block"
        />
      </div>

      <div id="customprogbar" className="col-span-6 md:col-span-4">
        <div
          className="relative mb-4 cursor-pointer"
          onClick={handleProgressBarClick}
          ref={progressBarRef}
        >
          <div className="h-4 bg-gray-200/40 rounded">
            <div
              className="h-full bg-purple-500 rounded-md"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>

          {popupNotes.map((note, index) => (
            <div
              key={index}
              id="barmarkers"
              className="absolute top-0  bg-red-500 rounded-full transform -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${(note.time / duration) * 100}%` }}
              onMouseEnter={() => setHoveredNote(note)}
              onMouseLeave={() => setHoveredNote(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 z-10"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
            </div>
          ))}

          {hoveredNote && (
            <div
              className="absolute -top-10 transform text-black -translate-x-1/2 bg-white border border-gray-200 rounded p-2 shadow-md z-20  break-words"
              style={{ left: `${(hoveredNote.time / duration) * 100}%` }}
            >
              <p className="text-sm m-0">
                {(hoveredNote as any).note.content[0].content[0].text}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="col-span-4 h-fit mb-2 font-semibold text-lg">
          {info[index].snippet.title}
        </div>

        <div className="col-span-4 mb-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className=" whitespace-pre-line">
                <TailwindEditor
                  id={uuid}
                  initialValue={description}
                  bool={false}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              isPlaying ? player.pauseVideo() : player.playVideo();
              setIsPlaying(!isPlaying);
            }}
            className="shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
          >
            {isPlaying ? "Pause ∣∣" : "Play ▶️"}
          </button>

          <button
            id="addnote"
            className="shadow-[inset_0_0_0_2px_#616467] text-black px-10 ml-2 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
            onClick={() => setShowNoteInput(!showNoteInput)}
          >
            Add Note +
          </button>
        </div>
        {showNoteInput && (
          <div className="mb-4">
            <TailwindEditor
              saveNote={addPopupNote}
              id={uuid}
              time={formatTime(currentTime)}
              initialValue={noteInput}
              onChange={setNoteInput}
              bool={true}
            />
            <button
              className="shadow-[inset_0_0_0_2px_#616467] text-black px-8 ml-2 py-4 mt-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-green-600 hover:text-white dark:text-neutral-200 transition duration-200"
              onClick={() => {
                addPopupNote();
              }}
            >
              Save Note
            </button>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2">Popup Notes 📝:</h3>

          {popupNotes.map((note, index) => (
            <div key={note.time} className="mt-4">
              <h1 className="flex mb-2">
                Timestamp:
                <a
                  className="hover:cursor-pointer hover:text-blue-700 hover:underline font-bold ml-2"
                  onClick={() => {
                    handleSeek(note.time);
                  }}
                >
                  {" "}
                  {formatTime(note.time)}
                </a>
              </h1>
              <TailwindEditor
                onChange={() => {}}
                ref={editorRef}
                key={videoId}
                id={uuid}
                initialValue={note.note}
                time={formatTime(currentTime)}
                bool={Bool}
              />
              <button
                className="my-3 hover:bg-slate-400 rounded-xl p-2"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this note?")) {
                    console.log("deleting note");
                    const newNotes = popupNotes.filter(
                      (n) => n.time !== note.time,
                    );
                    setPopupNotes(newNotes);
                    try {
                      const deleteNote = axios
                        .post("/api/notes", {
                          userId: (session?.data as any).id,
                          vid: videoId,
                          notes: newNotes,
                          pid: pid,
                        })
                        .then((res) => {
                          console.log(res, "deleted ma boy");
                        });
                    } catch (err) {
                      console.log(err, "error while deleting note");
                    }
                  } else {
                    console.log("cancelled");
                  }
                }}
              >
                Delete 🗑️
              </button>
              <button
                className="hover:bg-slate-400 rounded-xl p-2"
                onClick={() => {}}
              >
                Edit ✏️
              </button>

              <hr />
            </div>
          ))}
        </div>
      </div>
      <div className=" col-span-2 m-4"></div>

      <div className="fixed bottom-0 right-3 ">
        <button
          id="bot"
          onClick={toggleMenu}
          className="w-24 h-24 rounded-full shadow-lg flex items-center justify-center focus:outline-none transition-transform hover:scale-105 active:scale-95"
        >
          <img
            className="md:w-24 w-20"
            src={
              "https://github.com/ducheharsh/VedicVani/blob/main/Unscreen%2059%20PM.gif?raw=true"
            }
            alt="bot"
          />
        </button>
        <div
          className={`
          absolute z-50 bottom-24 right-0 md:w-[60vh] w-[40vh] rounded-lg shadow-xl
          transform transition-all duration-500 ease-out
          ${
            isOpen
              ? "scale-100 z-50  opacity-100 animate-bounce-in"
              : "scale-95 opacity-0 pointer-events-none"
          }
        `}
        >
          <ChatBot key={videoId} videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default CustomYouTubePlayer;

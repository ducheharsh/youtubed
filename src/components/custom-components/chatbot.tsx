import axios from "axios";
import React, { useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function ChatBot({ videoId }: { videoId: string }) {
  const placeholders = [
    "Summarize this video",
    "What are the key points in this video?",
    "Is this video share about this/that?",
    "Who are the people featured in this podcast?",
    "Create an assignment from this video !!",
  ];

  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!videoId.trim() || !message.trim()) return;

    setChat((prevChat) => [...prevChat, { role: "user", content: message }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        videoId,
        message,
      });

      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      setChat((prevChat) => [
        ...prevChat,
        { role: "bot", content: data.reply },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setChat((prevChat) => [
        ...prevChat,
        { role: "bot", content: "Sorry, an error occurred." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:max-w-2xl  mx-auto p-2">
      <div className="md:h-[600px] h-[400px] overflow-y-auto z-50  bg-stone-900 p-4 mb-4 rounded-xl">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"} text-white`}
          >
            <div className="font-bold  mb-2 ml-2 mr-2">
              {msg.role === "user" ? (
                "User"
              ) : (
                <div className="flex">
                  {" "}
                  <img
                    src="https://cdn.hashnode.com/res/hashnode/image/upload/v1719466107244/fad13963-ba76-47f1-af51-200e1c0fca9d.png"
                    className="h-6"
                  />
                  <p className="ml-3"> VideoBuddy</p>
                </div>
              )}
            </div>
            <MarkdownPreview
              source={msg.content}
              style={{ padding: "12px" }}
              className="bg-slate-600  rounded-xl shadow-xl"
            />
          </div>
        ))}
      </div>
      <div className="flex">
        <PlaceholdersAndVanishInput
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
          onSubmit={sendMessage}
          placeholders={placeholders}
        />
      </div>
    </div>
  );
}

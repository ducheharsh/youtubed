"use client";
import axios from "axios";
import React, { useState } from "react";

export default function Suggester() {
  const [topic, setTopic] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");

  const sendRequest = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("/api/suggester", { topic });

      if (!response.status) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      setOutput(data.output);
    } catch (error) {
      console.error("Failed to send request:", error);

      setOutput("Sorry, an error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Suggester</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic"
      />
      <button
        className="text-white"
        type="submit"
        onClick={sendRequest}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Submit"}
      </button>
      <p className="text-white">{JSON.stringify(output)}</p>
    </div>
  );
}

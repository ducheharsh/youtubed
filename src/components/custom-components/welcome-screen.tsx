"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WelcomeScreen = ({ message = "Welcome!", timeout = 2000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  useEffect(() => {
    // Add the custom font to the document
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black text-white z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
      >
        <motion.h1
          className="text-9xl font-extrabold tracking-tight"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: 0.5,
          }}
        >
          {message}
        </motion.h1>
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl -z-10 blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;

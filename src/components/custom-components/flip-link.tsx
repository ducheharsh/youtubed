import React from "react";
import { motion } from "framer-motion";
import localFont from "@next/font/local";
const myFont = localFont({
  src: "./fonts/Shockwave.woff",
  variable: "--font-main",
});
const DURATION = 0.25;
const STAGGER = 0.025;

export default function FlipLink({ href, children }: any) {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className={`relative drop-shadow-2xl uppercase text-8xl text-white block overflow-hidden whitespace-preline sm:text-9xl ${myFont.variable} font-poppins  uppercase  lg:text-[300px] `}
      style={{
        lineHeight: 1.2,
      }}
    >
      <div>
        {children.split("").map((l: any, i: any) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              hovered: {
                y: "-100%",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block "
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l: any, i: any) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
              },
              hovered: {
                y: 0,
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
}

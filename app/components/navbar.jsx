"use client";
import { motion } from "framer-motion";
export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay:0.2, ease: "easeOut" }}
      className="flex fixed top-8 left-1/2 transform -translate-x-1/2 z-40 backdrop-blur-md bg-gradient-to-t from-neutral-600/10 via-neutral-400/10 to-neutral-300/10 border border-white/20 rounded-full justify-around items-center p-1 px-10 text-white shadow-lg bg-opacity-100 "
    >
      <ul className=" flex items-center gap-12">
        {[
          { text: "Home", color: "#05a8aa", brightColor: "#acfeff" },
          { text: "Features", color: "#fc7a57", brightColor: "#ffe5dc" },
          { text: "Explore", color: "#CB5DB1", brightColor: "#ffdcf6" },
          { text: "Contact", color: "#E1EE56", brightColor: "#ffffc2" },
        ].map(({ text, color, brightColor }) => (
          <li key={text} className="p-3 cursor-pointer relative group">
            <span
              style={{
                "--hover-color": color,
                "--bright-color": brightColor,
              }}
              className="transition-all duration-300 group-hover:[text-shadow:0_0_8px_var(--hover-color)] group-hover:[color:var(--bright-color)]"
            >
              {text}
            </span>
            <span
              className="absolute bottom-2 left-1/2 w-0 h-[1px] transition-all duration-300 group-hover:w-full group-hover:left-0"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          </li>
        ))}
      </ul>
    </motion.header>
  );
}

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedScreen = ({ children, screenKey, direction = "right" }) => {
  const variants = {
    enter: (direction) => ({
      x: direction === "right" ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction === "right" ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
    scale: { type: "spring", stiffness: 400, damping: 25 },
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={screenKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
        style={{ height: "100%", overflowY: "auto" }} // именно здесь задаём прокрутку
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedScreen;
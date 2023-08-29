"use client";

import { FC, PropsWithChildren } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const PageTransition: FC<PropsWithChildren> = ({ children }) => {
  const variants = {
    out: {
      opacity: 0,
      x: 40,
      transition: {
        duration: 0.25,
      },
    },
    in: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        delay: 0.1,
      },
    },
  };

  const { pathname } = useRouter();

  return (
    <div className="effect-1">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={pathname}
          variants={variants}
          animate="in"
          initial="out"
          exit="out"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;

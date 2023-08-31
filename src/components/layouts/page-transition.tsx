import React, { useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropsWithChildren, useRef } from "react";
import { usePathname } from "next/navigation"; // Import your pathname utility

import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context";

function FrozenRouter(props: PropsWithChildren<{}>) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

export default function Layout(props: PropsWithChildren<{}>) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, type: "tween" }}
      >
        <FrozenRouter>{props.children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}

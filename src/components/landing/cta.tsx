import React from "react";
import { Icon } from "../ui/icons";
import { DarkModeSwitch } from "../ui/dark-mode-switch";
import { GridBackground } from "./grid-background";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const Cta = () => {
  return (
    <div id="cta" className="pt-24">
      <div className="relative isolate px-6 py-32 sm:py-40 lg:px-8">
        <GridBackground></GridBackground>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold -tracking-wide text-4xl leading-10">
            {/*Migliora l'esperienza dei tuoi clienti, inizia a usare la nostra app oggi */}
            Improve your customer experience
            <br />
            start using our app today
          </h2>
          <p className="my-2">
            {/* Non perdere tempo, inizia a usare gratuitamente i nostri chatbot per il tuo sito web. */}
            Don&apos;t waste time, start using our chatbots for your website for
            free.
          </p>
          <div className="mt-4">
            <Link
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-4 py-6 px-10",
              )}
              href="/app"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </div>
      <footer aria-labelledby="footer-heading" className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
          <div className="border-t border-black border-opacity-10 dark:border-white dark:border-opacity-10 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex items-center gap-4 md:order-2">
              <a href="#" className="text-gray-500 hover:opacity-50">
                <Icon icon="mdi:twitter" className="w-7 h-7" />
              </a>
              <a href="#" className="text-gray-500 hover:opacity-50">
                <Icon icon="mdi:github" className="w-7 h-7" />
              </a>
              <a href="#" className="text-gray-500 hover:opacity-50">
                <Icon icon="mdi:instagram" className="w-7 h-7" />
              </a>
              <DarkModeSwitch />
            </div>
            <p className="text-center text-xs leading-5">
              © 2023 KBaseBot, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cta;

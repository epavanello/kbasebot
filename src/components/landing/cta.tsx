import React from "react";
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
    </div>
  );
};

export default Cta;

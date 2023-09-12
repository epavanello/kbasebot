import React from "react";
import { cn } from "@/lib/utils";
import { gradients } from "@/style/gradients";
import { buttonVariants } from "@/components/ui/button";
import HeroAnim from "@/components/landing/hero-anim";
import Link from "next/link";
import { GridBackground } from "./grid-background";

const Hero = () => {
  return (
    <div className="relative w-full h-[90vh] flex flex-col justify-center items-center gap-2">
      <div className="absolute -z-10 -mt-24 w-full h-full rotate-180">
        <GridBackground></GridBackground>
      </div>

      <div className="max-w-5xl flex flex-col items-center gap-2 text-center">
        <HeroAnim />
        <h1 className="text-7xl font-black opacity-90">
          Build{" "}
          <span
            className={cn(gradients.HYPER, "text-transparent bg-clip-text")}
          >
            Powerful Chatbots
          </span>{" "}
          from Documents, Text, and Websites
        </h1>

        <p>
          Transform your content into interactive chatbots that can be shared as
          public links or embedded on your website. Engage your audience,
          provide instant support, and automate conversations with KBaseBot.
        </p>

        <Link
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-4 py-6 px-10",
          )}
          href="/app"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Hero;

import React from "react";
import { cn } from "@/lib/utils";
import { gradients } from "@/style/gradients";
import { Button } from "@/components/ui/button";
import HeroAnim from "@/components/landing/hero-anim";

const Hero = () => {
  return (
    <div className="relative w-full h-[70vh] flex flex-col justify-center items-center gap-2">
      <div
        className={cn("absolute w-full h-full -z-10")}
        style={{
          background:
            "radial-gradient(182.29999999999998% 69% at 50% 8.4%,#ffffff 0%,rgb(255,255,255) 28.345139819430482%,rgba(255,255,255,.88) 46.39900258832971%,hsla(0,0%,100%,0) 99.95393495930529%)",
        }}
      ></div>
      <div
        className={cn("absolute w-full h-full -z-20", gradients.HERO_LIGHT)}
      ></div>

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

        <Button size="lg" variant={"default"} className="mt-4 py-6 px-20">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Hero;

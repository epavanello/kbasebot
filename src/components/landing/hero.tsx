import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import HeroImg from "@/components/svgs/hero-img";
import Image from "next/image";
import { gradients } from "@/style/gradients";

const Hero = () => {
  return (
    <div
      id="hero"
      className="relative w-full flex flex-col justify-center items-center gap-2"
    >
      <div className="max-w-5xl flex flex-col items-center gap-2 text-center mt-8 sm:mt-12 md:mt-16">
        

      <div className="flex flex-row items-center">
        <a
          className="mx-auto"
          href="https://www.producthunt.com/posts/kbasebot?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-kbasebot"
          target="_blank"
        >
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=414946&theme=light&period=daily"
            alt="KBaseBot - From&#0032;files&#0032;&#0038;&#0032;sites&#0032;to&#0032;chatbots&#0058;&#0032;knowledge&#0032;talks | Product Hunt"
            width="200"
            height="40"
          />
        </a>
      </div>

        <h1 aria-label="Upload. Train. Serve." className="mb-6 md:mb-10 flex flex-col md:flex-row text-7xl lg:text-8xl mt-8 sm:mt-12 md:mt-16">
          <span className="animated-gradient-text_background from-green-200 via-green-300 to-blue-600">
            Upload.
          </span>
          <span className="animated-gradient-text_background from-violet-500 via-pink-600 to-red-700">
            Train.
          </span>
          <span className="animated-gradient-text_background from-yellow-500 via-orange-600 to-red-700">
            Serve.
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-6 md:mb-10 font-extralight">
          Transform your content into engaging, interactive chatbots for<br/>
          seamless support and automated conversations
        </p>

        <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-4">
          <p>
            <span className="font-light italic text-sm text-muted-foreground">Powered by</span><span className="font-semibold">&nbsp;&nbsp;GPT-4 ✨</span>
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "py-6 px-10 hover:opacity-90 shine-effect text-black",
              gradients.SEAFOAM,
            )}
            href="/app"
          >
            Get Started
          </Link>
        </div>
      </div>
      <div className="w-full sm:w-[80vw] max-w-5xl mt-4 sm:mt-12">
        <HeroImg />
      </div>
    </div>
  );
};

export default Hero;

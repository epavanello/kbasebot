import React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import HeroImg from "@/components/svgs/hero-img";
import Image from "next/image";
import { gradients } from "@/style/gradients";

const Hero = () => {
  return (
    <div id="hero" className="relative flex w-full flex-col items-center justify-center gap-2">
      <div className="mt-8 flex max-w-5xl flex-col items-center gap-2 text-center sm:mt-16 md:mt-24">
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

        <h1
          aria-label="Upload. Train. Serve."
          className="mb-3 mt-8 flex flex-col text-7xl sm:mt-16 md:mb-6 md:mt-24 md:flex-row lg:text-8xl"
        >
          <span className="animated-gradient-text_background from-green-200 via-green-300 to-blue-600">Crawl.</span>
          <span className="animated-gradient-text_background from-violet-500 via-pink-600 to-red-700">Train.</span>
          <span className="animated-gradient-text_background from-yellow-500 via-orange-600 to-red-700">Embed.</span>
        </h1>

        <p className="mb-12 text-lg font-extralight md:mb-20 md:text-xl">
          Effortlessly transform your content into interactive,
          <br />
          intelligent chatbots for seamless customer support and automated engagement
        </p>

        <div className="flex w-full flex-col-reverse items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Button
              as="a"
              asChild
              href="/app"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "shine-effect px-6 py-6 text-black hover:opacity-90",
                gradients.SEAFOAM,
              )}
              icon="ep:arrow-right"
            >
              Start for free
            </Button>
            <div className="absolute right-full top-0 mr-4 flex h-full flex-col justify-center whitespace-nowrap">
              <p>
                <span className="text-sm font-light italic text-muted-foreground">Powered by</span>
                <span className="font-semibold">&nbsp;&nbsp;GPT-4o ✨</span>
              </p>
            </div>
            <span className="absolute left-0 top-full mt-2 w-full text-xs text-gray-500">No credit card required</span>
          </div>
        </div>
      </div>
      <div className="mt-16 w-full max-w-5xl sm:mt-32 sm:w-[80vw]">
        <HeroImg />
      </div>
    </div>
  );
};

export default Hero;

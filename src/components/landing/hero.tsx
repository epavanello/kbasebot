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
      {/*<div className="absolute left-0 -bottom-[30px] -z-10 -mt-24 w-full h-full opacity-70 flex justify-center items-end">*/}
      {/*  /!*<GridBackground></GridBackground>*!/*/}
      {/*  <div className="max-w-5xl h-full">*/}
      {/*    */}
      {/*  </div>*/}
      {/*</div>*/}
      {/* TODO: Change product hunt link */}
      <div className="max-w-5xl flex flex-col items-center gap-2 text-center mt-16 lg:mt-24">
        <a
          className="mx-auto h-[39px] mb-4"
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

        {/*<a*/}
        {/*  href="https://www.producthunt.com/posts/kbasebot?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-turbosite"*/}
        {/*  target="_blank"*/}
        {/*  className="mx-auto h-[39px] mb-12"*/}
        {/*>*/}
        {/*  <Image*/}
        {/*    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=414946&theme=light"*/}
        {/*    alt="KBaseBot - Your&#0032;landing&#0032;page&#0032;online&#0032;in&#0032;under&#0032;2&#0032;minutes&#0033; | Product Hunt"*/}
        {/*    width="249"*/}
        {/*    height="53"*/}
        {/*  />*/}
        {/*</a>*/}
        <h1 className="text-6xl font-black opacity-90">
          Build Powerful Chatbots from
        </h1>
        <h1
          className={cn(
            "text-5xl font-black opacity-90 text-transparent bg-clip-text",
            gradients.SEAFOAM,
          )}
        >
          Documents, Text, and Websites
        </h1>

        <p>
          Transform your content into interactive chatbots that can be shared as
          public links or embedded on your website. Engage your audience,
          provide instant support, and automate conversations with KBaseBot.
        </p>

        <Link
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-4 py-6 px-10 hover:opacity-90 shine-effect text-black",
            gradients.SEAFOAM,
          )}
          href="/app"
        >
          Get Started
        </Link>
      </div>
      <div className="w-full sm:w-[80vw] max-w-5xl mt-4 sm:mt-12">
        <HeroImg />
      </div>
    </div>
  );
};

export default Hero;

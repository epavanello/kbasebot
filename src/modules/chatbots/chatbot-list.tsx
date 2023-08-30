"use client";

import React from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { cn, truncate } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Icon } from "@/components/ui/icons";
import { getRandomGradient } from "@/style/gradients";

const ChatbotList = ({ chatbots = [] }) => {
  return (
    <div>
      <div className="grid justify-center gap-8 pt-6 mx-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6">
        {!!chatbots.length &&
          chatbots.map((bot, idx) => {
            return (
              <Card key={bot.id} className="overflow-hidden">
                <Link
                  href={`/app/chatbots/${bot.id}`}
                  className="overflow-hidden"
                >
                  <CardHeader className={cn(getRandomGradient(), "p-0")}>
                    <AspectRatio
                      ratio={4 / 3.5}
                      className="p-0 flex justify-center items-center w-full h-full bg-primary/50"
                    >
                      <Icon
                        icon={"fluent:bot-sparkle-24-filled"}
                        className="text-7xl"
                      />
                    </AspectRatio>
                  </CardHeader>
                </Link>
                <CardFooter
                  className="p-2 flex justify-between"
                  title={bot.name}
                >
                  <p className="font-medium">
                    {truncate(bot?.name, 10) || `Untitled ${idx + 1}`}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default ChatbotList;

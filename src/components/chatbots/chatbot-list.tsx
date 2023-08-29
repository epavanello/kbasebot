"use client";

import React from "react";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { truncate } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

const ChatbotList = ({ chatbots = [] }) => {
  return (
    <div>
      <div className="grid justify-center gap-8 pt-6 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
        {!!chatbots.length &&
          chatbots.map((bot, idx) => {
            return (
              <Card key={bot.id}>
                <Link
                  href={`/app/chatbots/${bot.id}`}
                  className="overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <AspectRatio ratio={4 / 3.5}>
                      <p>Hello</p>
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

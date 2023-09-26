"use client";
import React from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icons";
import { integrations } from "@/app/app/chatbots/[chatbot_id]/integrations/constant";
import { Button } from "@/components/ui/button";
import OauthConnect from "@/app/app/chatbots/[chatbot_id]/integrations/oauth-connect";

const Page = () => {
  return (
    <DashboardShell className="container gap-0 mt-10">
      <DashboardHeader
        heading={"Integration"}
        text={"Connect your app with other apps"}
        className="flex-col md:flex-row justify-center my-4 gap-6"
      />

      <div className="grid justify-center gap-8 pt-6 mx-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6">
        {!!integrations.length &&
          integrations.map((item, idx) => {
            return (
              <Card key={item.provider} className="overflow-hidden">
                <CardHeader
                  className={cn(`flex flex-row justify-center items-center`)}
                >
                  <div className="bg-secondary border p-2 rounded-full">
                    <Icon
                      icon={"fluent:bot-sparkle-24-filled"}
                      className="text-4xl"
                    />
                  </div>
                  <Icon
                    icon={"tabler:plug-connected"}
                    className="text-5xl rotate-45"
                  />
                  <div className="bg-secondary border p-2 rounded-full">
                    <Icon icon={item.btnIcon} className="text-4xl" />
                  </div>
                </CardHeader>

                <CardFooter className="p-2 flex justify-center">
                  <OauthConnect {...item} />
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </DashboardShell>
  );
};

export default Page;

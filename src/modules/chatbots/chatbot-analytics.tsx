"use client";

import React from "react";
import useSWR from "swr";
import { cn, fetcher } from "@/lib/utils";
import StatCard from "@/components/ui/stats-card";
import { gradients } from "@/style/gradients";

const ChatbotAnalytics = ({ chatbot_id }) => {
  const { data = {} } = useSWR(
    `/api/chatbots/analytics?chatbot_id=${chatbot_id}`,
    fetcher,
  );

  const {
    pageviews = {},
    // bounce_rate = {},
    visit_duration = {},
    visitors = {},
    conversations = {},
  } = data || {};

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4">
        <StatCard
          title="Chatot View"
          content={pageviews.value || 0}
          icon={"carbon:cube-view"}
          className={cn(gradients.HYPER, "text-gray-800")}
        />{" "}
        <StatCard
          title="Total Visitors"
          content={visitors.value || 0}
          icon={"pepicons-pencil:people"}
          className={cn(gradients.SEAFOAM, "text-gray-800")}
        />{" "}
        <StatCard
          title="Visit Duration"
          content={`${visit_duration.value || 0}s`}
          icon={"game-icons:duration"}
          className={cn(gradients.SIERRA_MIST, "text-gray-800")}
        />
        <StatCard
          title="Total Messages"
          content={`${conversations.value || 0}`}
          icon={"game-icons:duration"}
          className={cn(gradients.PANDORA, "text-gray-800")}
        />
      </div>
    </div>
  );
};

export default ChatbotAnalytics;

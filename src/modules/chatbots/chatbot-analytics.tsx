"use client";

import React from "react";
import useSWR from "swr";
import { bytesToMb, cn, fetcher } from "@/lib/utils";
import StatCard from "@/components/ui/stats-card";
import { gradients } from "@/style/gradients";
import LineChart from "@/components/charts/linechart";

type AnalyticsData = {
  timeseries: {
    results: {
      date: string;
      visitors: number | null;
      visit_duration: number | null;
    }[];
  };
  pageviews?: {
    value?: number;
  };
  visit_duration?: {
    value?: number;
  };
  visitors?: {
    value?: number;
  };
  conversations?: {
    value?: number;
  };
};

const ChatbotAnalytics = ({ chatbot_id }: { chatbot_id: string }) => {
  const { data } = useSWR<AnalyticsData>(`/api/chatbots/analytics?chatbot_id=${chatbot_id}`, fetcher);

  const {
    pageviews = {},
    // bounce_rate = {},
    visit_duration = {},
    visitors = {},
    conversations = {},
    timeseries,
  } = data || {};

  return (
    <div className="w-full">
      <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
      <LineChart
        data={
          timeseries?.results.map((result) => ({
            // format date from yyyy-dd-mm to be more readable
            date: new Date(result.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            visitors: result.visitors || 0,
            visit_duration: result.visit_duration || 0,
          })) || []
        }
        metrics={[
          {
            name: "visitors",
            sum: true,
            unit: "",
          },
          {
            name: "visit_duration",
            sum: false,
            unit: "s",
          },
        ]}
      />
    </div>
  );
};

export default ChatbotAnalytics;

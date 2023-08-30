import React from "react";

import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Link from "next/link";
import { sayGreeting } from "@/lib/utils";
import ChatbotList from "@/components/chatbots/chatbot-list";

// const AddModal = dynamic(() => import("@/components/sites/add.modal"), {
//   loading: () => <p>Loading...</p>,
//   ssr: false,
// });

const NoSitesBox = () => (
  <Card className="bg-transparent">
    <CardContent>
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-3xl  font-bold">Create your first Chatbot</h2>
        <p className="mt-2 text-center text-gray-500">
          You can train your bot with your knowledge base from different sources
        </p>
        {/*<AddModal />*/}
      </div>
    </CardContent>
  </Card>
);

const ChatbotIndex = ({ chatbots = [] }) => {
  // const { subscriptionDetails, refetchData } = useUser();
  //
  // useEffect(() => {
  //   refetchData();
  // }, []);

  return (
    <DashboardShell className="container gap-0 mt-4">
      <DashboardHeader
        heading={sayGreeting()}
        text="Manage your chatbots here"
        className="flex-col md:flex-row"
      >
        {/*<AddModal />*/}
      </DashboardHeader>
      <div className="my-2"></div>

      {chatbots?.length ? (
        <>
          <ChatbotList chatbots={chatbots} />
        </>
      ) : (
        <NoSitesBox />
      )}
    </DashboardShell>
  );
};

export default ChatbotIndex;

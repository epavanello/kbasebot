import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChatbotPublicId } from "@/modules/chatbots/helpers";
import CopyButton from "@/components/ui/copy-button";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";

const CodeBlock = ({ children }) => (
  <pre className="mt-2 min-w-0 overflow-auto w-full rounded-md bg-slate-950 p-4 break-words">
    <code className="text-white text-xs">{children}</code>
  </pre>
);

const Share = ({ params }) => {
  const { chatbot_id } = params;

  const chatbotPublicUrl = getChatbotPublicId(chatbot_id);

  const iframeCode = `<iframe 
   src="${chatbotPublicUrl}" width="100%"
   style="height: 100%; min-height: 700px"
   frameBorder="0">
</iframe>`;

  const scriptTag = `<script src="${process.env.NEXT_PUBLIC_URL}/embed.js?chatbot_id=${chatbot_id}"></script>`;

  return (
    <DashboardShell className="container mx-auto">
      <DashboardHeader
        heading={"Share your chatbot"}
        className="justify-center mt-10"
      />

      <div className="flex flex-col gap-8 px-0 md:px-24 lg:px-36">
        <Card>
          <CardHeader>
            <CardTitle>Add to your website</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className={"mb-4"}>
              Paste this code to the end of the body of your website
            </CardDescription>
            <div className="flex relative w-full justify-start gap-2 items-center">
              <CodeBlock>{scriptTag}</CodeBlock>
              <div className="flex items-center gap-2">
                <CopyButton
                  size="sm"
                  variant="outline"
                  showText
                  text={scriptTag}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share your chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex relative w-full justify-start gap-2 items-center">
              <CodeBlock>{chatbotPublicUrl}</CodeBlock>
              <div className="flex items-center gap-2">
                <CopyButton
                  size="sm"
                  variant="outline"
                  showText
                  text={chatbotPublicUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embed your chatbot as iframe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=" flex relative w-full justify-start gap-2 items-start">
              <CodeBlock>{iframeCode}</CodeBlock>

              <div className="flex items-center gap-2">
                <CopyButton
                  size="sm"
                  variant="outline"
                  showText
                  text={iframeCode}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default Share;

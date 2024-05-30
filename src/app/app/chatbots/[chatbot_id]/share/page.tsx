import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getChatbotPublicId } from "@/modules/chatbots/helpers";
import CopyButton from "@/components/ui/copy-button";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { DashboardHeader } from "@/components/ui/dashboard-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NEXT_PUBLIC_URL } from "@/lib/env";

const CodeBlock = ({ children }) => (
  <pre className="mt-2 w-full min-w-0 overflow-auto break-words rounded-md bg-slate-950 p-4">
    <code className="text-xs text-white">{children}</code>
  </pre>
);

const CardBlock = ({
  title,
  code,
  desc,
  footer,
}: {
  title: string;
  code: string;
  desc?: string;
  footer?: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {!!desc && <CardDescription className={"mb-4"}>{desc}</CardDescription>}

      <div className="relative flex w-full flex-wrap items-start justify-start gap-2">
        <CodeBlock>{code}</CodeBlock>

        <div className="absolute right-2 top-4 z-10">
          <CopyButton className="text-white" size="icon" variant="ghost" text={code} />
        </div>
      </div>
    </CardContent>
    {!!footer && <CardFooter>{footer}</CardFooter>}
  </Card>
);

const Share = ({ params }) => {
  const { chatbot_id } = params;

  const chatbotPublicUrl = getChatbotPublicId(chatbot_id);

  const iframeCode = `<iframe 
   src="${chatbotPublicUrl}" width="100%"
   style="height: 100%; min-height: 700px"
   frameBorder="0">
</iframe>`;

  const scriptTag = `<script async data-chatbot-id="${chatbot_id}"
src="${NEXT_PUBLIC_URL}/embed.js">
</script>`;

  return (
    <DashboardShell className="container max-w-2xl">
      <DashboardHeader heading={"Share"} />

      <div className="flex flex-col gap-8">
        <CardBlock
          title={"Add to your website"}
          desc={"Paste this code to the end of the body of your website"}
          code={scriptTag}
        />
        <CardBlock
          title={"Share your chatbot"}
          code={chatbotPublicUrl}
          footer={
            <Button target={"_blank"} as={"a"} href={chatbotPublicUrl} asChild variant={"outline"}>
              Visit Public Url
            </Button>
          }
        />

        <CardBlock title={"Embed your chatbot as iframe"} code={iframeCode} />
      </div>
    </DashboardShell>
  );
};

export default Share;

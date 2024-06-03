import { formatDistance } from "date-fns";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./codeblock";
import { MemoizedReactMarkdown } from "./markdown";
import Image from "next/image";
import React from "react";
import { MessageAndSources } from "../helpers";
import { Icon } from "@/components/ui/icons";
import { PreviewSources } from "@/modules/datasource/preview-sources";

export interface ChatMessageProps {
  message: MessageAndSources;
  chatbotLogo?: string;
  children?: React.ReactNode;
}

export function ChatMessage({ message, chatbotLogo, children, ...props }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div className={cn("relative flex w-full flex-col items-stretch gap-1")} {...props}>
      <div
        className={cn({
          "self-end": isUser,
        })}
      >
        {isUser ? (
          <span className="text-xs">You</span>
        ) : !!chatbotLogo ? (
          <Image src={chatbotLogo} width={15} height={15} alt={"chatbot logo"} className="rounded-full" />
        ) : (
          <Icon icon="fluent:bot-sparkle-24-filled" className="c_text_primary h-5 w-5" />
        )}
      </div>
      <div
        className={cn("overflow-auto", {
          "text-right": isUser,
        })}
      >
        <div className="relative inline-block">
          {message.sources && <PreviewSources messageWithSources={message} />}
          {children ? (
            <div
              className={cn(
                "prose prose-sm inline-block w-auto min-w-0 max-w-full break-words rounded-xl rounded-tl-none bg-secondary px-4 py-2 text-xs dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                {
                  "c_bg_primary c_text_primary_auto prose-invert rounded-tr-none": isUser,
                  "rounded-tl-none bg-secondary": !isUser,
                },
              )}
            >
              {children}
            </div>
          ) : (
            <MemoizedReactMarkdown
              className={cn(
                "prose prose-sm inline-block w-auto min-w-0 max-w-full break-words rounded-xl px-4 py-2 text-xs dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                {
                  "c_bg_primary c_text_primary_auto prose-invert rounded-tr-none": isUser,
                  "rounded-tl-none bg-secondary": !isUser,
                },
              )}
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                a({ node, children, ...props }) {
                  return (
                    <a
                      className="underline"
                      target="_blank"
                      rel="noreferrer"
                      {...props}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(props.href, "_blank");
                      }}
                    >
                      {children}
                    </a>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] == "▍") {
                      return <span className="mt-1 animate-pulse cursor-default">▍</span>;
                    }

                    children[0] = (children[0] as string).replace("`▍`", "▍");
                  }

                  const match = /language-(\w+)/.exec(className || "");

                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ""}
                      value={String(children).replace(/\n$/, "")}
                      {...props}
                    />
                  );
                },
              }}
            >
              {message.content}
            </MemoizedReactMarkdown>
          )}
        </div>
      </div>
      {!!message.createdAt && (
        <small
          className={cn("text-[10px] opacity-70", {
            "self-end": isUser,
          })}
        >
          {formatDistance(message.createdAt, new Date(), {
            addSuffix: true,
          })}
        </small>
      )}
    </div>
  );
}

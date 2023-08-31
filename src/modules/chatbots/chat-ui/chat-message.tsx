"use-client";

import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { cn } from "@/lib/utils";
import { CodeBlock } from "./codeblock";
import { MemoizedReactMarkdown } from "./markdown";
import { ChatMessageActions } from "./chat-messages-actions";
import { MagicWandIcon, PersonIcon } from "@radix-ui/react-icons";

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn("group relative flex items-start justify-end", {
        "pl-10 flex-row-reverse": isUser,
        "pr-10": !isUser,
      })}
      {...props}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          isUser ? "bg-background" : "bg-secondary",
        )}
      >
        {isUser ? <PersonIcon /> : <MagicWandIcon className="w-4 h-4" />}
      </div>
      <div
        className={cn("flex-1 px-1 space-y-2 overflow-hidden", {
          "text-right mr-4": isUser,
          "ml-4": !isUser,
        })}
      >
        <MemoizedReactMarkdown
          className={cn(
            " text-[15px] prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 px-4 py-2 inline-block rounded-[30px]",
            {
              "rounded-tr bg-secondary": isUser,
              "rounded-tl bg-primary/5": !isUser,
            },
          )}
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  );
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
        <ChatMessageActions isUser={isUser} message={message} />
      </div>
    </div>
  );
}

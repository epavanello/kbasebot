"use-client";

import { type UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import { PromptForm } from "./prompt-form";
import { ButtonScrollToBottom } from "./button-scroll-to-bottom";
import { ReloadIcon, StopIcon } from "@radix-ui/react-icons";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  chatArea,
}: ChatPanelProps) {
  return (
    <div className="my-4 inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <StopIcon className="mr-2" />
              Stop Generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <ReloadIcon className="mr-2" />
                Regenerate Response
              </Button>
            )
          )}
          <ButtonScrollToBottom area={chatArea} />
        </div>
        <div
          className="space-y-4 bg-background px-4 py-2 md:py-4"
          // className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4"
        >
          <PromptForm
            onSubmit={async (value) => {
              await append({
                id,
                content: value,
                role: "user",
              });
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

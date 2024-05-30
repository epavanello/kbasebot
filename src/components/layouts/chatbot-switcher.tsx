"use client";

import { useChatbots } from "@/lib/hooks/use-chatbots";
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { getChatbotGradient } from "@/style/gradients";
import { cn } from "@/lib/utils";
import { Command, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { usePathname, useRouter } from "next/navigation";
import NewChatbotModal from "@/modules/chatbots/new-chatbot.modal";

export default function ChatbotSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const { chatbots, currentChatbot } = useChatbots();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Chatbot"
          className={cn("w-full justify-between", className)}
        >
          {currentChatbot && <Avatar className={cn(getChatbotGradient(currentChatbot.id), "mr-2 h-5 w-5")}></Avatar>}
          {currentChatbot?.name || "Select a Chatbot"}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandList>
            {chatbots.map((chatbot) => (
              <CommandItem
                key={chatbot.id}
                onSelect={() => {
                  router.push(
                    `/app/chatbots/${chatbot.id}/${
                      // split by / and join all the elements from 3rd index to the end
                      pathname.split("/").slice(4).join("/")
                    }`,
                  );
                  setOpen(false);
                }}
                className="text-sm"
              >
                <Avatar className={cn(getChatbotGradient(chatbot.id), "mr-2 h-5 w-5")}></Avatar>
                {chatbot.name}
                <CheckIcon
                  className={cn("ml-auto h-4 w-4", currentChatbot?.id === chatbot.id ? "opacity-100" : "opacity-0")}
                />
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <NewChatbotModal chatbotsCreated={chatbots.length} variant={null} className="w-full justify-start">
              <CommandItem className="w-full">
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                Create Chatbot
              </CommandItem>
            </NewChatbotModal>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

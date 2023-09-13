import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { MAX_TEXT_INPUT } from "./docs-constant";
import { cn } from "@/lib/utils";
import { useDatasourceStore } from "@/lib/store/use-datasource-store";

const TextSource = () => {
  const { text, setText } = useDatasourceStore((state) => ({
    text: state.text,
    setText: state.setText,
  }));

  const isOverLimit = text.content.length >= MAX_TEXT_INPUT;

  return (
    <div className="relative p-1">
      <Textarea
        maxLength={MAX_TEXT_INPUT}
        rows={10}
        placeholder="Type or Paste your text here."
        onChange={(e) => setText({ content: e.target.value, changed: true })}
        value={text.content}
        className={cn({
          "ring-red-500 focus-visible:ring-red-500": isOverLimit,
        })}
      />
      <div className="flex justify-end mt-2 absolute bottom-2 right-3 opacity-90">
        <span
          className={cn("text-xs text-primary transition", {
            "text-red-600": isOverLimit,
          })}
        >
          {text.content.length}/{MAX_TEXT_INPUT}{" "}
          {isOverLimit ? "(Max chars limit reached)" : "Chars"}
        </span>
      </div>
    </div>
  );
};

export default TextSource;

import React from "react";
import { textColorBasedOnBg } from "@/lib/utils";

const ChatbotTheme = ({ primary_color }) => {
  return (
    <style jsx global>{`
      .c_bg_primary {
        background: ${primary_color || "#312e2e"};
      }
      .c_border_primary {
        border-color: ${primary_color || "#312e2e"};
      }
      .c_text_primary_auto {
        color: ${textColorBasedOnBg(primary_color)};
      }
      .c_text_primary {
        color: ${primary_color};
      }
    `}</style>
  );
};

export default ChatbotTheme;

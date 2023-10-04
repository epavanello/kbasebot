import * as React from "react";
import { Chatbot, SupabaseClientTyped } from "../supabase";
import { useSupabaseAuth } from "../store/use-user";
import { usePathname } from "next/navigation";

export interface useChatbotsProps {}

export function useChatbots() {
  const [loading, setLoading] = React.useState(false);
  const [chatbots, setChatbots] = React.useState<Chatbot[]>([]);
  const pathname = usePathname();
  const { supabase, user } = useSupabaseAuth();

  React.useEffect(() => {
    async function getChatbots() {
      setLoading(true);
      try {
        if (chatbots)
          setChatbots(
            (
              await supabase
                .from("chatbots")
                .select()
                .eq("user_id", user?.id!)
                .eq("status", "READY")
                .order("created_at", { ascending: true })
                .throwOnError()
            ).data!,
          );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      getChatbots();
    }
  }, [user?.id]);

  // extract id from url /app/chatbots/[chatbot_id]
  const currentChatbot = React.useMemo(
    () => chatbots.find((chatbot) => chatbot.id === pathname.split("/")[3]),
    [chatbots, pathname],
  );

  return { loading, chatbots, currentChatbot };
}

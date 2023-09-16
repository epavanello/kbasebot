import * as React from "react";
import { Chatbot, SupabaseClientTyped } from "../supabase";
import { useSupabaseAuth } from "../store/use-user";

export interface useChatbotsProps {}

export function useChatbots() {
  const [loading, setLoading] = React.useState(false);
  const [chatbots, setChatbots] = React.useState<Chatbot[]>([]);

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

  return { loading, chatbots };
}

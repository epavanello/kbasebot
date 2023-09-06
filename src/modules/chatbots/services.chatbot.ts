import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const getChatbotSettings = async (chatbotId) => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: chatbotSettings, error } = await supabase
    .from("chatbot_settings")
    .select("*")
    .eq("chatbot_id", chatbotId)
    .eq("user_id", user?.id)
    .maybeSingle();

  if (error) console.error(error);

  return chatbotSettings;
};

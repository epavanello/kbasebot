import { Database } from "@/lib/types/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies as cookiesType } from "next/headers";

export const dynamic = "force-dynamic";

export const getChatbotSettings = async (
  chatbotId: string,
  cookies: () => ReturnType<typeof cookiesType>,
) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: chatbotSettings, error } = await supabase
    .from("chatbot_settings")
    .select("*")
    .eq("chatbot_id", chatbotId)
    .maybeSingle();

  if (error) console.error(error);

  return chatbotSettings;
};

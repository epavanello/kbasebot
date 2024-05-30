import { ChatCompletionRequestMessage } from "openai-edge";
import { convesationLogToMessages } from "./helpers";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { SupabaseClientTyped } from "@/lib/supabase";

class ConversationLog {
  constructor(
    public conversationId: string,
    public chatbotId: string,
    public chatbotOwnerId: string,
    private supabaseAdminClient: SupabaseClientTyped,
  ) {
    this.conversationId = conversationId;
    this.chatbotId = chatbotId;
    this.chatbotOwnerId = chatbotOwnerId;
    this.supabaseAdminClient = supabaseAdminClient;
  }

  public async addEntry({
    entry,
    speaker,
    metadata,
  }: {
    entry: string;
    speaker: IConversationSpeaker;
    metadata?: Record<string, any>;
  }) {
    try {
      await this.supabaseAdminClient
        .from("conversations")
        .insert({
          conversation_id: this.conversationId,
          chatbot_id: this.chatbotId,
          chatbot_owner_id: this.chatbotOwnerId,
          entry,
          speaker,
          metadata,
        })
        .throwOnError();
    } catch (e) {
      console.log(`Error adding entry: `, e);
    }
  }

  public async getConversation({ limit }: { limit: number }): Promise<ChatCompletionRequestMessage[]> {
    const { data: history } = await this.supabaseAdminClient
      .from("conversations")
      .select("entry, speaker, created_at")
      .eq("conversation_id", this.conversationId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .throwOnError();

    const response = history ? convesationLogToMessages(history).reverse() : [];
    return response;
  }
}

export { ConversationLog };

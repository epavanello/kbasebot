import { ChatCompletionRequestMessage } from "openai-edge";
import { convesationLogToMessages } from "./helpers";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { getSupabaseClientAdmin } from "@/lib/supabase.server";

class ConversationLog {
  private supabaseAdminClient: any;
  constructor(
    public chatbotOwnerId: string,
    public sessionId: string,
    public chatbotId: string
  ) {
    this.chatbotOwnerId = chatbotOwnerId;
    this.sessionId = sessionId;
    this.chatbotId = chatbotId;
    this.supabaseAdminClient = getSupabaseClientAdmin();
  }

  public async addEntry({
    entry,
    speaker,
    ip,
    metadata,
  }: {
    entry: string;
    speaker: IConversationSpeaker;
    ip?: string;
    metadata?: object;
  }) {
    try {
      await this.supabaseAdminClient
        .from("conversations")
        .insert({
          chatbot_owner_id: this.chatbotOwnerId,
          session_id: this.sessionId,
          chatbot_id: this.chatbotId,
          entry,
          speaker,
          ip,
          metadata,
        })
        .throwOnError();
    } catch (e) {
      console.log(`Error adding entry: `, e);
    }
  }

  public async getConversation({
    limit,
  }: {
    limit: number;
  }): Promise<ChatCompletionRequestMessage[]> {
    const { data: history } = await this.supabaseAdminClient
      .from("conversations")
      .select("entry, speaker, created_at")
      .eq("session_id", this.sessionId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .throwOnError();

    const response = history ? convesationLogToMessages(history).reverse() : [];
    return response;
  }

  public async clearConversation() {
    await this.supabaseAdminClient
      .from("conversations")
      .delete()
      .eq("session_id", this.sessionId)
      .throwOnError();
  }
}

export { ConversationLog };

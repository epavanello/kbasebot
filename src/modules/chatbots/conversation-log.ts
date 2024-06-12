import { ChatCompletionRequestMessage } from "openai-edge";
import { convesationLogToMessages } from "./helpers";
import { IConversationSpeaker } from "@/lib/types/common.types";
import { Chunk, SupabaseClientTyped } from "@/lib/supabase";

class ConversationLog {
  constructor(
    public conversationId: string,
    public chatbotId: string,
    public chatbotOwnerId: string,
    private supabaseAdminClient: SupabaseClientTyped,
  ) {}

  public async addEntry({
    entry,
    speaker,
    metadata,
    sources,
  }: {
    entry: string;
    speaker: IConversationSpeaker;
    metadata?: Record<string, any>;
    sources?: Chunk[];
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
          sources: sources?.map(
            (source) =>
              ({
                id: source.id,
                similarity: source.similarity,
              }) || [],
          ),
        })
        .throwOnError();
    } catch (e) {
      console.log(`Error adding entry: `, e);
    }
  }

  public async getConversation({
    limit,
    skipFunctions,
  }: {
    limit: number;
    skipFunctions: boolean;
  }): Promise<ChatCompletionRequestMessage[]> {
    const query = this.supabaseAdminClient
      .from("conversations")
      .select("entry, speaker, created_at")
      .eq("conversation_id", this.conversationId)
      .order("created_at", { ascending: false })

      .limit(limit)
      .throwOnError();

    if (skipFunctions) {
      query.neq("speaker", IConversationSpeaker.Function);
    }
    const { data: history } = await query;

    const response = history ? convesationLogToMessages(history).reverse() : [];
    return response;
  }
}

export { ConversationLog };
